import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  problemType: {
    type: String,
    required: true,
    enum: ['registration', 'submission', 'other'],
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'resolved'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
  adminNotes: {
    type: String,
  },
});

export default mongoose.models.Issue || mongoose.model('Issue', IssueSchema);
