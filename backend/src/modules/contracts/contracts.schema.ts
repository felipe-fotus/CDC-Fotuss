import { z } from 'zod';

export const listContractsQuerySchema = z.object({
  search: z.string().optional(),
  delayRanges: z.string().optional(), // comma-separated: "D+30,D+60"
  sortField: z.string().optional().default('diasAtraso'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type ListContractsQuery = z.infer<typeof listContractsQuerySchema>;

export const contractParamsSchema = z.object({
  id: z.string(),
});

export type ContractParams = z.infer<typeof contractParamsSchema>;

// Delay range mapping
export const delayRangeMap: Record<string, { min: number; max: number }> = {
  'D+30': { min: 1, max: 30 },
  'D+60': { min: 31, max: 60 },
  'D+90': { min: 61, max: 90 },
  'D+120': { min: 91, max: 120 },
  'D+150': { min: 121, max: 150 },
  'D+180': { min: 151, max: 180 },
  'D+360': { min: 181, max: 360 },
  'D+540': { min: 361, max: 540 },
  'D+720': { min: 541, max: 720 },
  'D+900': { min: 721, max: 900 },
  'D+1080': { min: 901, max: 1080 },
};
