import {
  StockPriceSchema,
  StockRatio,
  StocksRatio,
  StocksRatioSchema,
} from '@customTypes/index';
import type { APIRoute } from 'astro';
import pino from 'pino';
import { z } from 'zod';
import Papa from 'papaparse';
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
    const api_url =
      `https://analisistecnico.com.ar/services/datafeed/history?symbol=${stock}&resolution=D` +
      fromTimeStamp;
    const cedear_url =
      `https://analisistecnico.com.ar/services/datafeed/history?symbol=${stock}%3ACEDEAR&resolution=D` +
      fromTimeStamp;

    const [responseStockData, responseStockCedearData, responseRatios] =
      await Promise.all([
        fetch(api_url).then((resp) => resp.json()),
        fetch(cedear_url).then((resp) => resp.json()),
        getRatios(),
      ]);

    const stockData = StockPriceSchema.parse(responseStockData);
    const stockCedearData = StockPriceSchema.parse(responseStockCedearData);
    const ratios = StocksRatioSchema.parse(responseRatios);
    const stockRatio = ratios.find(
      (ratio) => ratio.ticker === stock.toUpperCase()
    );
    return new Response(
      JSON.stringify({
        stock: stockData,
        cedear: stockCedearData,
        ratio: stockRatio?.ratio,
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
