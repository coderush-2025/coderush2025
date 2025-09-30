import { Registration } from "@/types/registration";

type StateConfig = {
  prompt: string;
  next?: string;
  validate?: (input: string) => boolean;
  save?: (reg: Registration, input: string) => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indexRegex = /^[A-Za-z0-9\/-]+$/;
const batchRegex = /^[0-9]{2}$/;

export const MEMBER_COUNT = 4;

export const states: Record<string, StateConfig> = {
  HACKERRANK: {
    prompt:
      "Please type your Hackerrank username (must end with _CR). Example: TeamName_CR",
    next: "MEMBER_DETAILS",
  },

  MEMBER_DETAILS: {
    // handled dynamically by the API loop (see route.ts). prompts change depending on which field is next.
    prompt: "",
  },

  CONSENT: {
    prompt: "Do you agree to the hackathon rules and code of conduct? (yes/no)",
    validate: (input) => ["yes", "no"].includes(input.toLowerCase()),
    save: (reg, input) => (reg.consent = input.toLowerCase() === "yes"),
    next: "CONFIRMATION",
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