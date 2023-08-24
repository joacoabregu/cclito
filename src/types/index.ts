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
export type StockClient = StockName & {
  cedearPrice?: {
    price: string,
    CCL: string
  }
}

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

export const StockRatioSchema = z.object({
  id: z.string(),
  cedear: z.string(),
  ticker: z.string(),
  ratio: z.string(),
});
export const StocksRatioSchema = StockRatioSchema.array();
export type StockRatio = z.infer<typeof StockRatioSchema>;
export type Ratio = StockRatio['ratio'];
export type StocksRatio = z.infer<typeof StocksRatioSchema>;

export const StockSheetsSchema = StockRatioSchema.extend({
  USD: z.string(),
  CEDEAR: z.string(),
});
export const StocksSheetsSchema = StockSheetsSchema.array();
export type StocksSheets = z.infer<typeof StocksSheetsSchema>;
