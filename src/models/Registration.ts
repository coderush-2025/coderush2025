import mongoose, { Schema, Document, Model } from "mongoose";
import { Member, Registration as RegistrationType } from "@/types/registration";

interface RegistrationDocument extends RegistrationType, Document {}

const memberSchema = new Schema<Member>({
  fullName: { type: String, required: true },
  indexNumber: { type: String, required: true },
  batch: { type: String, required: true },
  email: { type: String, required: true },
});

const registrationSchema = new Schema<RegistrationDocument>({
  sessionId: { type: String, required: true },
  teamName: { type: String, required: false },
  teamBatch: { type: String, required: false },
  members: { type: [memberSchema], default: [] },
  state: { type: String, default: "WELCOME" },
  consent: { type: Boolean, required: false },
  createdAt: { type: Date, default: Date.now },
  tempMember: {
    type: {
      fullName: { type: String, required: false },
      indexNumber: { type: String, required: false },
      batch: { type: String, required: false },
      email: { type: String, required: false }
    },
    required: false
  },
  currentMember: { type: Number, required: false },
  conversationHistory: {
    type: [{
      role: { type: String, required: true },
      content: { type: String, required: true },
      state: { type: String, required: true }
    }],
    default: []
  },
});

// ============================================
// INDEXES FOR CONCURRENCY SAFETY & PERFORMANCE
// ============================================

// 1. Unique team name index (case-insensitive) - only for completed registrations
registrationSchema.index(
  { teamName: 1, state: 1 },
  {
    unique: true,
    partialFilterExpression: {
      state: "DONE",
      teamName: { $exists: true, $ne: null }
    },
    collation: { locale: 'en', strength: 2 } // Case-insensitive
  }
);

// 2. Unique index numbers - only for completed registrations
registrationSchema.index(
  { 'members.indexNumber': 1 },
  {
    unique: true,
    partialFilterExpression: { state: "DONE" }
  }
);

// 3. Unique emails (case-insensitive) - only for completed registrations
registrationSchema.index(
  { 'members.email': 1 },
  {
    unique: true,
    partialFilterExpression: { state: "DONE" },
    collation: { locale: 'en', strength: 2 } // Case-insensitive
  }
);

// 4. Index for faster session lookups
registrationSchema.index({ sessionId: 1 }, { unique: true });

// 5. Index for counting completed teams efficiently
registrationSchema.index({ state: 1, createdAt: -1 });

// 6. Compound index for faster queries
registrationSchema.index({ state: 1, teamName: 1 });

// ============================================
// ADD VERSION FIELD FOR OPTIMISTIC LOCKING
// ============================================
registrationSchema.set('versionKey', '__v');

const Registration: Model<RegistrationDocument> =
  mongoose.models.Registration ||
  mongoose.model<RegistrationDocument>("Registration", registrationSchema);

export default Registration;