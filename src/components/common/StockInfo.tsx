import Spinner from '@components/Spinner';
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
        {!isFav && (
          <img
            className='hover:scale-125 cursor-pointer'
            onClick={saveStock}
            src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4='
          />
        )}
        {isFav && (
          <img
            className='hover:scale-125 cursor-pointer'
            onClick={saveStock}
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC40MTljLTIuODI2LTUuNjk1LTExLjk5OS00LjA2NC0xMS45OTkgMy4yNyAwIDcuMjcgOS45MDMgMTAuOTM4IDExLjk5OSAxNS4zMTEgMi4wOTYtNC4zNzMgMTItOC4wNDEgMTItMTUuMzExIDAtNy4zMjctOS4xNy04Ljk3Mi0xMi0zLjI3eiIvPjwvc3ZnPg=='
          ></img>
        )}
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
        {!isFav && (
          <img
            onClick={saveStock}
            src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4='
          />
        )}
        {isFav && (
          <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC40MTljLTIuODI2LTUuNjk1LTExLjk5OS00LjA2NC0xMS45OTkgMy4yNyAwIDcuMjcgOS45MDMgMTAuOTM4IDExLjk5OSAxNS4zMTEgMi4wOTYtNC4zNzMgMTItOC4wNDEgMTItMTUuMzExIDAtNy4zMjctOS4xNy04Ljk3Mi0xMi0zLjI3eiIvPjwvc3ZnPg=='></img>
        )}
      </div>
    </>
  );
}
