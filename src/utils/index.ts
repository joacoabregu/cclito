import type { Ratio, StockPrice } from '@customTypes/index';

export const fetcher: (url: string, options?: RequestInit) => Promise<any> = (
  url,
  options
) => fetch(url, options).then((res) => res.json());

export function formatTimestampToDDMMYYY(timestamp: number) {
  const date = new Date(timestamp * 1000); // Multiplicamos por 1000 para convertir de segundos a milisegundos
  const day = String(date.getDate()).padStart(2, '0'); // Día (2 dígitos, cero a la izquierda)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (0-11, sumamos 1, 2 dígitos, cero a la izquierda)
  const year = date.getFullYear(); // Año
  return `${day}/${month}/${year}`;
}

export function getStockDetails(data: {
  stock: StockPrice;
  cedear: StockPrice;
  ratio: Ratio;
} | undefined) {
  const ratio = Number(data?.ratio.split(':')[0]);
  const stockPrice = parseFloat(
    data?.stock.c[data.stock.c.length - 1].toFixed(2)
  );
  const cedearPrice = parseFloat(
    data?.cedear.c[data.cedear.c.length - 1].toFixed(2)
  );
  const CCL = ((ratio * cedearPrice) / stockPrice).toFixed(2);
  const date = formatTimestampToDDMMYYY(
    data?.stock.t[data?.stock.t.length - 1]!
  );
  return { ratio, stockPrice, cedearPrice, CCL, date };
}
