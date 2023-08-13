import { StockPriceSchema } from '@customTypes/index';
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

  try {
    logger.info(stock);
    //TODO update timestamp based on day
    const fromTimeStamp = '&from=1691539200';
    let api_url =
      `https://analisistecnico.com.ar/services/datafeed/history?symbol=${stock}&resolution=D` +
      fromTimeStamp;
    let cedear_url =
      `https://analisistecnico.com.ar/services/datafeed/history?symbol=${stock}%3ACEDEAR&resolution=D` +
      fromTimeStamp;

    const [responseStockData, responseStockCedearData] = await Promise.all([
      fetch(api_url).then((resp) => resp.json()),
      fetch(cedear_url).then((resp) => resp.json()),
    ]);

    const stockData = StockPriceSchema.parse(responseStockData);
    const stockCedearData = StockPriceSchema.parse(responseStockCedearData);

    return new Response(
      JSON.stringify({
        stock: stockData,
        cedear: stockCedearData,
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
