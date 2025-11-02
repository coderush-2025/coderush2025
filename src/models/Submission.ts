import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  teamName: string;
  githubLink: string;
  googleDriveLink: string;
  submittedAt: Date;
  registrationId?: mongoose.Types.ObjectId;
}

const submissionSchema = new Schema<ISubmission>({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  githubLink: {
    type: String,
    required: true,
  },
  googleDriveLink: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  registrationId: {
    type: Schema.Types.ObjectId,
    ref: "Registration",
  },
});

const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", submissionSchema);

export default Submission;
