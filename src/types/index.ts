import { z } from 'zod';
export type Tab = 'CCL' | 'Cedear' | 'SL/TP' | 'Free';

export const StockSchema = z
  .object({
    symbol: z.string(),
    full_name: z.string(),
    description: z.string(),
    exchange: z.string(),
    type: z.string(),
  })

  export const StocksSchema = StockSchema.array();

  export type Stock = z.infer<typeof StockSchema>;
  export type Stocks = z.infer<typeof StocksSchema>;
