import { z } from 'zod';
import { config } from 'dotenv';
import { join } from 'path';

// Load .env files
config({ path: join(process.cwd(), '.env.local') });
config({ path: join(process.cwd(), '.env') });

export const GhostConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ADMIN_EMAIL: z.string().email().default('highlife4real1989@gmail.com'),
  PC_HOST: z.string().default('monolith'),
  SYNC_EXCLUDES: z.array(z.string()).default(['node_modules', '.next', '.git', '__pycache__']),
  
  // Database / Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // AI Keys
  OPENROUTER_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

export type GhostConfig = z.infer<typeof GhostConfigSchema>;

export function loadConfig(): GhostConfig {
  const result = GhostConfigSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ [Ghost] Invalid Configuration:', result.error.format());
    process.exit(1);
  }

  return result.data;
}
