import { z } from 'zod';
export type Tab = 'CCL' | 'Cedear' | 'SL/TP' | 'Free';

export const StockSchema = z.object({
  symbol: z.string(),
  full_name: z.string(),
  description: z.string(),
  exchange: z.string(),
  type: z.string(),
});

export const StocksSchema = StockSchema.array();

export type Stock = z.infer<typeof StockSchema>;
export type Stocks = z.infer<typeof StocksSchema>;
export type StockName = Pick<Stock, 'full_name' | 'description'>;

export const StockPriceSchema = z.object({
  t: z.number().array().nonempty(),
  o: z.number().array(),
  h: z.number().array(),
  l: z.number().array(),
  c: z.number().array().nonempty(),
  v: z.number().array(),
  s: z.string(),
});

export type StockPrice = z.infer<typeof StockPriceSchema>;
