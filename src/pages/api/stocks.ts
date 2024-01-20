import {
  StocksSheetsSchema
} from '@customTypes/index';
import { getStocks } from '@utils/getStocks';
import type { APIRoute } from 'astro';
import pino from 'pino';
import { z } from 'zod';
const logger = pino();



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

    const responseRatios = await getStocks();
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
