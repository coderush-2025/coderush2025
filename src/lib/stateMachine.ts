import { Registration } from "@/types/registration";

type StateConfig = {
  prompt: string;
  next?: string;
  validate?: (input: string) => boolean;
  save?: (reg: Registration, input: string) => void;
};

const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const indexRegex = /^[0-9]{2}[0-9]{4}[A-Z]$/;
const batchRegex = /^(23|24)$/;

export const MEMBER_COUNT = 4;

export const states: Record<string, StateConfig> = {
  BATCH_SELECTION: {
    prompt: "Select your team's batch (all members must be from the same batch):",
    next: "MEMBER_DETAILS",
  },

  MEMBER_DETAILS: {
    // handled dynamically by the API loop (see route.ts). prompts change depending on which field is next.
    prompt: "",
  },

  CONFIRMATION: {
    prompt: "✨ Does everything look correct?\n\nReview your details carefully! You can update them later if needed (just don't click Reset!).\n\nReady to submit? (yes/no)",
    validate: (input) => ["yes", "no"].includes(input.toLowerCase()),
    next: "DONE",
  },

  DONE: {
    prompt: "🎊 Congratulations! Your team is officially registered for CodeRush 2025! 🎉\n\n✅ Confirmation email sent to your team leader\n📅 Event Date: November 15, 2025\n⏰ Time: 8 AM - 6 PM\n\nSee you there! Get ready to build something amazing! 🚀",
  },
};

// Export validators to use in route handler
export const validators = {
  email: (v: string) => emailRegex.test(v),
  index: (v: string) => indexRegex.test(v),
  batch: (v: string) => batchRegex.test(v),
};