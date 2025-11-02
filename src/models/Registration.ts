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
  sessionId: { type: String, unique: true, required: true },
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

// Add compound index that only applies uniqueness when teamName exists
registrationSchema.index(
  { teamName: 1 }, 
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { teamName: { $exists: true, $ne: null } }
  }
);

const Registration: Model<RegistrationDocument> =
  mongoose.models.Registration ||
  mongoose.model<RegistrationDocument>("Registration", registrationSchema);

export default Registration;