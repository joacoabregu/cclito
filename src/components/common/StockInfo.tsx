import Spinner from '@components/Spinner';
import { HeartEmpty, HeartFull } from '@components/common/FavoriteHeart';
import type { Ratio, StockName, StockPrice } from '@customTypes/index';
import { fetcher, getStockDetails } from '@utils/index';
import useLocalStorage from '@utils/useStorage';
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
  detailsComponent: (
    details: StockInfoDetailsProps,
    stockName: StockName | undefined
  ) => JSX.Element;
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
  const details = getStockDetails(data);

  return (
    <>
      {stockName && <StockName stockName={stockName} />}
      {error && <CedearError />}
      {isLoading && <Spinner />}
      {data && detailsComponent(details, stockName)}
    </>
  );
}

export function StockName({ stockName }: { stockName: StockName }) {
  return (
    <div className='py-5 sm:py-10 max-w-md w-full'>
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
  stockName,
}: {
  details: StockInfoDetailsProps;
  stockName: StockName | undefined;
}) {
  const [favs, setFavs] = useLocalStorage<StockName[]>('favorites', []);
  const isFav = favs?.some((fav) => fav.full_name === stockName?.full_name);
  const saveStock = () => {
    if (isFav) {
      setFavs(favs.filter((fav) => fav.full_name !== stockName?.full_name));
    } else {
      setFavs([...favs, ...(stockName ? [stockName] : [])]);
    }
  };
  return (
    <>
      <div>
        <p className='text-2xl'>CCL: ${details.CCL} </p>
        <p className='text-1xl'>Ratio: {details.ratio} </p>
        <p className='text-base'>Precio: usd$ {details.stockPrice}</p>
        <p className='text-base'>Precio CEDEAR: ${details.cedearPrice}</p>
        <p>Valor de cierre del: {details.date}</p>
      </div>
      <div>
        {!isFav && <HeartEmpty onClick={saveStock} />}
        {isFav && <HeartFull onClick={saveStock} />}
      </div>
    </>
  );
}

export function CedearInfoDetails({
  details,
  stockName,
}: {
  details: StockInfoDetailsProps;
  stockName: StockName | undefined;
}) {
  const [favs, setFavs] = useLocalStorage<StockName[]>('favorites', []);
  const saveStock = () => {
    const isFav = favs?.some((fav) => fav.full_name === stockName?.full_name);
    if (isFav) {
      setFavs(favs.filter((fav) => fav.full_name === stockName?.full_name));
    } else {
      setFavs([...favs, ...(stockName ? [stockName] : [])]);
    }
  };
  const isFav = favs?.some((fav) => fav.full_name === stockName?.full_name);
  return (
    <>
      <div>
        <p className='text-1xl'>Precio CEDEAR: ${details.cedearPrice}</p>
        <p className='text-base'>Precio: usd$ {details.stockPrice}</p>
        <p className='text-base'>CCL: ${details.CCL} </p>
        <p className='text-base'>Ratio: {details.ratio} </p>
        <p>Valor de cierre del: {details.date}</p>
      </div>
      <div>
        {!isFav && <HeartEmpty onClick={saveStock} />}
        {isFav && <HeartFull onClick={saveStock} />}
      </div>
    </>
  );
}
