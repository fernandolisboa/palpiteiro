import { z } from "zod";

export const profileRowSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string(),
  invite_code: z.string().nullable(),
  created_at: z.string(),
});

export const inviteRowSchema = z.object({
  code: z.string(),
  email: z.string().email(),
  status: z.enum(["pending", "accepted", "revoked"]),
  invited_at: z.string(),
});

export const quotaRowSchema = z.object({
  user_id: z.string().uuid(),
  managed_credits: z.number(),
  daily_cap: z.number(),
  used_today: z.number(),
  byok_enabled: z.boolean(),
});

export const userProviderKeyRowSchema = z.object({
  user_id: z.string().uuid(),
  provider: z.enum(["claude", "gpt", "gemini", "grok"]),
  encrypted_key: z.string(),
  created_at: z.string(),
});

export const analysisRunRowSchema = z.object({
  id: z.string().uuid(),
  fixture_id: z.string(),
  requested_providers: z.array(z.string()),
  generated_at: z.string(),
  consensus_payload: z.unknown(),
  engine_payload: z.unknown(),
});

export type ProfileRow = z.infer<typeof profileRowSchema>;
export type InviteRow = z.infer<typeof inviteRowSchema>;
export type QuotaRow = z.infer<typeof quotaRowSchema>;
export type UserProviderKeyRow = z.infer<typeof userProviderKeyRowSchema>;
export type AnalysisRunRow = z.infer<typeof analysisRunRowSchema>;

