import Spinner from '@components/Spinner';
import type { Ratio, StockName, StockPrice } from '@customTypes/index';
import { fetcher, formatTimestampToDDMMYYY } from '@utils/index';
import useSWR from 'swr';

export interface StockInfoDetailsProps {
  CCL: string;
  ratio: number;
  stockPrice: number;
  cedearPrice: number;
  date: string;
}

export function StockInfo({
  stockName,
  detailsComponent,
}: {
  stockName: StockName | undefined;
  detailsComponent: (details: StockInfoDetailsProps) => JSX.Element;
}) {
  //Debounce useSwr
  //https://gist.github.com/csandman/cb1b9cae2334415b0b20e04b228c1016
  const { data, error, isLoading } = useSWR<{
    stock: StockPrice;
    cedear: StockPrice;
    ratio: Ratio;
  }>(
    () => (stockName ? `api/stock/price?name=${stockName.full_name}` : null),
    fetcher
  );

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
  const details = {
    CCL,
    ratio,
    stockPrice,
    cedearPrice,
    date,
  };

  return (
    <>
      {stockName && <StockName stockName={stockName} />}
      {error && <CedearError />}
      {isLoading && <Spinner />}
      {data && detailsComponent(details)}
    </>
  );
}

export function StockName({ stockName }: { stockName: StockName }) {
  return (
    <div className='py-10 max-w-md w-full'>
      <p className='text-3xl'>{stockName.full_name}</p>
      <p className='text-base'>{stockName.description}</p>
    </div>
  );
}

export function CedearError() {
  return (
    <p className='text-base'>
      Se ha producido un error al buscar la información del CEDEAR.
    </p>
  );
}

export function CCLInfoDetails({
  details,
}: {
  details: StockInfoDetailsProps;
}) {
  return (
    <div>
      <p className='text-2xl'>CCL: ${details.CCL} </p>
      <p className='text-1xl'>Ratio: {details.ratio} </p>
      <p className='text-base'>Precio: usd$ {details.stockPrice}</p>
      <p className='text-base'>Precio CEDEAR: ${details.cedearPrice}</p>
      <p>Valor de cierre del: {details.date}</p>
    </div>
  );
}
