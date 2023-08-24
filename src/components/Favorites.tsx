import { CedearValue } from '@components/CCLValue';
import Spinner from '@components/Spinner';
import { EditIcon, HeartRemove } from '@components/common/FavoriteHeart';
import type { StockClient, StocksSheets } from '@customTypes/index';
import { useMediaQuery } from '@uidotdev/usehooks';
import { fetcher, getCCL, mediaQuery } from '@utils/index';
import useLocalStorage from '@utils/useStorage';
import { useRef, useState } from 'react';
import useSWR from 'swr';

export default function Favorites() {
  const [favs, setFavs] = useLocalStorage<StockClient[]>('favorites', []);
  const isDesktop = useMediaQuery(mediaQuery.sm);
  const favsQuery = favs?.map((fav) => fav.full_name).join(',');
  const { data, error, isLoading } = useSWR<{
    stocks: StocksSheets;
  }>(() => (favsQuery ? `api/stocks?name=${favsQuery}` : null), fetcher);
  return (
    <div>
      {error && <Alert />}
      {isLoading && (
        <div className='grid place-items-center'>
          <Spinner />
        </div>
      )}
      {isDesktop && (
        <FavoritesTable data={data} favs={favs} setFavs={setFavs} />
      )}
      {!isDesktop && (
        <FavoritesCards data={data} favs={favs} setFavs={setFavs} />
      )}
    </div>
  );
}

interface Favorites {
  favs: StockClient[];
  data:
    | {
        stocks: StocksSheets;
      }
    | undefined;
  setFavs: (value: StockClient[]) => void;
}
function FavoritesTable({ favs, setFavs, data }: Favorites) {
  return (
    <div className='overflow-x-auto'>
      <table className='table table-zebra w-full  '>
        <thead>
          <tr className='[&>th]:px-1'>
            <th></th>
            <th>Nombre</th>
            <th>Precio USD</th>
            <th>Cedear</th>
            <th>CCL</th>
            <th>Ratio</th>
            <th>Compra</th>
            <th>Ganancia</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!data &&
            favs.map((fav, idx) => (
              <FavoritesTableRow
                {...fav}
                key={fav.full_name}
                id={idx}
                name={fav.description}
                ticker={fav.full_name}
                onClick={() =>
                  setFavs(
                    favs.filter(
                      (favorite) => favorite.full_name !== fav.full_name
                    )
                  )
                }
              />
            ))}
          {data &&
            data.stocks.map((stock, index) => (
              <FavoritesTableRow
                key={stock.id}
                name={stock.cedear}
                price={
                  favs.find((fav) => fav.full_name === stock.ticker)
                    ?.cedearPrice?.price || ''
                }
                {...stock}
                id={index}
                onClick={() =>
                  setFavs(favs.filter((fav) => fav.full_name !== stock.ticker))
                }
              />
            ))}
        </tbody>
      </table>
      {favs && favs.length === 0 && (
        <p className='mt-8 text-center'>
          Agregue un CEDEAR a su listado de favoritos.
        </p>
      )}
    </div>
  );
}

interface Favorite {
  name: string;
  ticker: string;
  id: number;
  onClick: () => void;
  ratio?: string;
  USD?: string;
  CEDEAR?: string;
  price?: string;
}

function FavoritesTableRow({
  name,
  ticker,
  id,
  ratio,
  USD,
  CEDEAR,
  onClick,
  price,
}: Favorite) {
  const _ratio = ratio?.split(':')[0];
  const labelRef = useRef<HTMLLabelElement | null>(null);

  const [favs, setFavs] = useLocalStorage<StockClient[]>('favorites', []);
  const [cedearPrice, setPrice] = useState({ price: '', CCL: '' });
  return (
    <tr className='[&>td]:px-1 [&>td:first-of-type]:pl-4 [&>td:last-of-type]:pr-4'>
      <td>{id + 1} </td>
      <td>
        {name} ({ticker})
      </td>
      <td>{USD && `$${USD}`}</td>
      <td>{CEDEAR && `$${CEDEAR}`}</td>
      <td>
        {_ratio &&
          CEDEAR &&
          USD &&
          `$${getCCL(Number(_ratio), parseFloat(CEDEAR), parseFloat(USD))}`}
      </td>
      <td>{_ratio}</td>
      <td>{price} </td>
      <td></td>
      <td>
        <div className='flex justify-between items-center'>
          <label htmlFor='edit-stock-modal' className='btn btn-active'>
            <EditIcon onClick={() => {}} />
          </label>
          <input
            type='checkbox'
            id='edit-stock-modal'
            className='modal-toggle'
          />
          <div className='modal'>
            <div className='modal-box text-center'>
              <div className='modal-action justify-end mb-4'>
                <button className='btn btn-sm btn-square btn-outline'>
                  <label htmlFor='edit-stock-modal' ref={labelRef}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </label>
                </button>
              </div>
              <div className='form-control gap-1 w-full max-w-sm'>
                <label className='label'>
                  <span className='label-text'>
                    Valor de compra del cedear en pesos argentinos
                  </span>
                </label>
                <input
                  type='text'
                  value={cedearPrice.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    //check that value is a valid number
                    if (isNaN(parseFloat(value))) return;
                    setPrice({ ...cedearPrice, price: value });
                  }}
                  className='input input-bordered w-full max-w-xs'
                />
              </div>
              <div className='form-control gap-1 w-full max-w-sm'>
                <label className='label'>
                  <span className='label-text'>
                    Valor del CCL al momento de la compra
                  </span>
                </label>
                <input
                  type='text'
                  value={cedearPrice.CCL}
                  onChange={(e) => {
                    const value = e.target.value;
                    //check that value is a valid number
                    if (isNaN(parseFloat(value))) return;
                    setPrice({ ...cedearPrice, CCL: value });
                  }}
                  className='input input-bordered w-full max-w-xs'
                />
              </div>
              <button
                className='btn btn-active'
                disabled={!cedearPrice}
                onClick={() => {
                  const updatedFavs = favs.map((fav) => {
                    if (fav.full_name === ticker) {
                      return { ...fav, price: cedearPrice };
                    }
                    return fav;
                  });
                  setFavs(updatedFavs);
                  labelRef.current?.click();
                }}
              >
                Agregar precio de compra
              </button>
            </div>
          </div>

          <HeartRemove onClick={onClick} />
        </div>
      </td>
    </tr>
  );
}

function FavoritesCards({ favs, setFavs, data }: Favorites) {
  return (
    <div className='flex flex-col items-center gap-4'>
      {!data &&
        favs.map((fav, index) => (
          <FavoritesCard
            key={fav.full_name}
            id={index}
            name={fav.description}
            ticker={fav.full_name}
            onClick={() =>
              setFavs(
                favs.filter((favorite) => favorite.full_name !== fav.full_name)
              )
            }
          />
        ))}
      {data &&
        data.stocks.map((stock, index) => (
          <FavoritesCard
            key={stock.id}
            name={stock.cedear}
            {...stock}
            id={index}
            onClick={() =>
              setFavs(
                favs.filter((favorite) => favorite.full_name !== stock.ticker)
              )
            }
          />
        ))}
    </div>
  );
}

function FavoritesCard({
  name,
  ticker,
  ratio,
  USD,
  CEDEAR,
  onClick,
}: Favorite) {
  const _ratio = ratio?.split(':')[0];

  return (
    <div className='card w-full max-w-[325px] bg-base-100 shadow-xl text-center'>
      <div className='card-body pb-0'>
        <h2 className='text-3xl'>{name} </h2>
        <p className='text-base'>{ticker}</p>
        <p className='text-base'>{USD && `usd$ ${USD}`}</p>
        <p className='text-base'>{CEDEAR && `$${CEDEAR}`}</p>
        <p className='text-base'>
          {_ratio &&
            CEDEAR &&
            USD &&
            getCCL(Number(_ratio), parseFloat(CEDEAR), parseFloat(USD))}
        </p>
      </div>
      <figure className='py-4'>
        <HeartRemove onClick={onClick} />
      </figure>
    </div>
  );
}

function Alert() {
  return (
    <div
      id='toast-danger'
      className='flex items-center w-full z-10 max-w-sm p-4 mb-4 text-gray-400 bg-gray-800 rounded-lg shadow fixed top-5 right-5 '
      role='alert'
    >
      <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200'>
        <svg
          className='w-5 h-5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z' />
        </svg>
        <span className='sr-only'>Error icon</span>
      </div>
      <div className='ml-3 text-sm font-normal'>
        Se ha producido un error. La información de las acciones puede ser
        errónea.
      </div>
    </div>
  );
}

export function AddModal() {
  return (
    <div className='self-end'>
      <label htmlFor='my-modal' className='btn btn-active'>
        Agregar
      </label>
      <input type='checkbox' id='my-modal' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box text-center'>
          <div className='modal-action justify-end mb-4'>
            <button className='btn btn-sm btn-square btn-outline'>
              <label htmlFor='my-modal'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </label>
            </button>
          </div>
          <CedearValue />
        </div>
      </div>
    </div>
  );
}
