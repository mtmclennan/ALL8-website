export type LeadType = 'intake' | 'tuneup';

export type LeadPayload = {
  leadType: LeadType;

  name: string;
  email: string;
  website?: string;
  company?: string;

  // “primary reason” differs by form (projectType vs issue)
  primary?: string;

  // long-form message/notes
  notes?: string;

  // optional extra structured fields (intake has these)
  goal?: string;
  timeline?: string;
  budget?: string;

  // anti-spam / tracking
  hp?: string;
  token?: string;
  hutk?: string;
  pageUrl?: string;
  pageName?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;

  marketingOptIn?: boolean;
};
