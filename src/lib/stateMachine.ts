import { Registration } from "@/types/registration";

type StateConfig = {
  prompt: string;
  next?: string;
  validate?: (input: string) => boolean;
  save?: (reg: Registration, input: string) => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indexRegex = /^[0-9]{2}[0-9]{4}[A-Z]$/;
const batchRegex = /^(23|24)$/;

export const MEMBER_COUNT = 4;

export const states: Record<string, StateConfig> = {
  HACKERRANK: {
    prompt:
      "Please type your Hackerrank username (must end with _CR). Example: TeamName_CR",
    next: "BATCH_SELECTION",
  },

  BATCH_SELECTION: {
    prompt: "Select your team's batch (all members must be from the same batch):",
    next: "MEMBER_DETAILS",
  },

  MEMBER_DETAILS: {
    // handled dynamically by the API loop (see route.ts). prompts change depending on which field is next.
    prompt: "",
  },

  CONFIRMATION: {
    prompt: "Here is your summary. Confirm submission? (yes/no)",
    validate: (input) => ["yes", "no"].includes(input.toLowerCase()),
    next: "DONE",
  },

  DONE: {
    prompt: "🎉 Done! Your team is registered. You will receive a confirmation email shortly.",
  },
};

// Export validators to use in route handler
export const validators = {
  email: (v: string) => emailRegex.test(v),
  index: (v: string) => indexRegex.test(v),
  batch: (v: string) => batchRegex.test(v),
};