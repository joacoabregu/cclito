import { StocksSchema } from '@customTypes/index';
import type { APIRoute } from 'astro';
import pino from 'pino';
import { z } from 'zod';
const logger = pino();

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const stock = searchParams.get('name');

  if (!stock) {
    return new Response(
      JSON.stringify({
        message: 'Provide a stock name',
      }),
      { status: 400 }
    );
  }

  logger.info(stock);
  //exchange BCBA is for Argentina. Others: NASDAQ, NYSE, INDEX
  const stocksResponse = await fetch(
    `https://analisistecnico.com.ar/services/datafeed/search?limit=30&query=${stock}&type=&exchange=BCBA`
  )
    .then((res) => res.json())
    .catch((err) => {
      return new Response(
        JSON.stringify({
          message: err,
        }),
        { status: 400 }
      );
    });

  try {
    const stocks = StocksSchema.parse(stocksResponse);
    const stocksNames = stocks
      .map((stock) => ({
        full_name: stock.full_name,
        description: stock.description,
      }))
      .map((stock) => ({ ...stock, full_name: stock.full_name.split(':')[0] }));

    return new Response(
      JSON.stringify({
        stocks: stocksNames,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message:
          error instanceof z.ZodError ? error.issues : 'Validation error',
      }),
      { status: 400 }
    );
  }
};
