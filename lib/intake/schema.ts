import { z } from "zod";

export const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const IntakeSchema = z.object({
  // Contact
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  company: z.string().optional(),
  website: z.union([z.string().regex(domainRegex), z.literal("")]).optional(),
  serviceArea: z.string().optional(),

  // Core qualifiers (match the updated form)
  projectType: z.enum(
    ["tuneup", "website", "local-seo", "ads", "maintenance", "integrations"],
    { required_error: "Pick what you need help with" },
  ),

  goal: z.enum(["calls", "seo", "ads", "trust", "other"], {
    required_error: "Pick a primary goal",
  }),

  timeline: z.enum(["asap", "1-2w", "1-2m", "3m+", "exploring"], {
    required_error: "Pick a timeline",
  }),

  budget: z.enum(
    ["planning", "750-950", "150-300mo", "3-5k", "5-10k", "10k+"],
    {
      required_error: "Pick a budget range",
    },
  ),

  notes: z.string().min(10, "Please add a bit more detail"),

  consent: z.boolean().refine(Boolean, { message: "Consent is required" }),

  // Spam / bot stuff
  hp: z.string().max(0).optional(),
  token: z.string().optional(),

  // Tracking / context
  leadType: z.string().optional(), // e.g. "tuneup" | "intake"
  hutk: z.string().optional(),
  pageUrl: z.string().url().optional(),
  pageName: z.string().optional(),

  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),

  marketingOptIn: z.boolean().optional(),
});

export type IntakeData = z.infer<typeof IntakeSchema>;

// Lightweight "Free Lead System Review" modal — the primary homepage conversion path.
export const LeadReviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  business: z.string().min(1, "Business name is required"),
  website: z.union([z.string().regex(domainRegex), z.literal("")]).optional(),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  challenge: z.string().optional(),

  // Spam / bot stuff
  hp: z.string().max(0).optional(),
  token: z.string().optional(),

  // Tracking / context
  leadType: z.string().optional(),
  hutk: z.string().optional(),
  pageUrl: z.string().optional(),
  pageName: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

export type LeadReviewData = z.infer<typeof LeadReviewSchema>;

// Blog newsletter signup — email only.
export const NewsletterSchema = z.object({
  email: z.string().email("Valid email required"),

  hp: z.string().max(0).optional(),
  token: z.string().optional(),
  leadType: z.string().optional(),
  hutk: z.string().optional(),
  pageUrl: z.string().optional(),
  pageName: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

export type NewsletterData = z.infer<typeof NewsletterSchema>;
