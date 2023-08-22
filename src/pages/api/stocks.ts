import {
  StockRatio,
  StocksRatio,
  StocksSheetsSchema,
} from '@customTypes/index';
import type { APIRoute } from 'astro';
import Papa from 'papaparse';
import pino from 'pino';
import { z } from 'zod';
const logger = pino();

export async function getRatios() {
  const ratioSheet =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-RtvaCpilenyOw3UY8YuA0cQMj1nS5B8AvHwiy7gKGfLDCe2UtAfB3B52mkWOytr_RA4DWEdGYAED/pub?gid=779469096&single=true&output=csv';
  const ratioData = await fetch(ratioSheet);
  const ratioText = await ratioData.text();

  const ratiosParsed = await new Promise<StocksRatio>((resolve, reject) => {
    Papa.parse<StockRatio>(ratioText, {
      header: true,
      complete: (result) => resolve(result.data),
      error: reject,
    });
  });

  return ratiosParsed;
}

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const stocks = searchParams.get('name');

  if (!stocks) {
    return new Response(
      JSON.stringify({
        message: 'Provide a stock name',
      }),
      { status: 400 }
    );
  }

  try {
    const stocksArray = stocks.split(',');
    logger.info(stocksArray);

    const responseRatios = await getRatios();
    const ratiosArray = responseRatios.filter((ratio) =>
      stocksArray.includes(ratio.ticker)
    );
    const ratios = StocksSheetsSchema.parse(ratiosArray);

    return new Response(
      JSON.stringify({
        stocks: ratios,
      }),
      { status: 200 }
    );
  } catch (error) {
    logger.info(error);

    return new Response(
      JSON.stringify({
        message:
          error instanceof z.ZodError ? error.issues : 'Fetch data error',
      }),
      { status: 400 }
    );
  }
};
