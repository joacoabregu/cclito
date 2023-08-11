import type { APIRoute } from 'astro';
import pino from 'pino';
import { fetcher } from '@utils/index';
const logger = pino();

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const stock = searchParams.get('name');

  if (!stock) {
    return new Response(
      JSON.stringify({
        message: 'Missing required fields',
      }),
      { status: 400 }
    );
  }

  logger.info(stock);
  //exchange BCBA is for Argentina. Others: NASDAQ, NYSE, INDEX
  const stocksResponse = await fetcher(
    `https://analisistecnico.com.ar/services/datafeed/search?limit=30&query=${stock}&type=&exchange=BCBA`
  );
  const stocksNames = stocksResponse
    .map((stock) => ({ name: stock.full_name, description: stock.description }))
    .map((stock) => ({ ...stock, name: stock.name.split(':')[0] }));
  console.log(stocksNames);

  return new Response(
    JSON.stringify({
      stocks: stocksNames,
    }),
    { status: 200 }
  );
};
