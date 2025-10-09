export interface Member {
  fullName: string;
  indexNumber: string;
  batch: string;
  email: string;
}

export interface Registration {
  sessionId: string;
  teamName?: string;
  hackerrankUsername?: string;
  teamBatch?: string;
  track?: string;
  members: Member[];
  state: string;
  consent?: boolean;
  createdAt?: Date;
  tempMember?: Partial<Member>;
  currentMember?: number;
  conversationHistory?: { role: string; content: string; state: string }[];
}