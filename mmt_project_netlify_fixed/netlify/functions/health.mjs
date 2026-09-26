import { healthPayload } from '../lib/analysis.mjs';
export default async () => Response.json(healthPayload());
export const config = { path: '/api/health' };
