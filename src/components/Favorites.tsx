import Spinner from '@components/Spinner';
import type { StockName, StocksSheets } from '@customTypes/index';
import { useMediaQuery } from '@uidotdev/usehooks';
import { fetcher, getCCL, mediaQuery } from '@utils/index';
import useLocalStorage from '@utils/useStorage';
import useSWR from 'swr';

export default function Favorites() {
  const [favs, setFavs] = useLocalStorage<StockName[]>('favorites', []);
  const isDesktop = useMediaQuery(mediaQuery.sm);
  const favsQuery = favs?.map((fav) => fav.full_name).join(',');
  const { data, error, isLoading } = useSWR<{
    stocks: StocksSheets;
  }>(() => (favsQuery ? `api/stocks?name=${favsQuery}` : null), fetcher);
  return (
    <div className='container mx-auto max-w-4xl p-4'>
      {error && <Alert />}
      {isLoading && (
        <div className='h-screen grid place-items-center'>
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
  favs: StockName[];
  data:
    | {
        stocks: StocksSheets;
      }
    | undefined;
  setFavs: (value: StockName[]) => void;
}
function FavoritesTable({ favs, setFavs, data }: Favorites) {
  return (
    <div className='overflow-x-auto'>
      <table className='table table-zebra w-full'>
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cedear</th>
            <th>CCL</th>
            <th>Ratio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!data &&
            favs.map((fav, idx) => (
              <FavoritesTableRow
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
}

function FavoritesTableRow({
  name,
  ticker,
  id,
  ratio,
  USD,
  CEDEAR,
  onClick,
}: Favorite) {
  const _ratio = ratio?.split(':')[0];
  return (
    <tr>
      <th>{id + 1} </th>
      <th>
        {name} ({ticker})
      </th>
      <td>{USD && `usd$ ${USD}`}</td>
      <td>{CEDEAR && `$${CEDEAR}`}</td>
      <td>
        {_ratio &&
          CEDEAR &&
          USD &&
          getCCL(Number(_ratio), parseFloat(CEDEAR), parseFloat(USD))}{' '}
      </td>
      <td>{_ratio}</td>
      <td>
        <img
          onClick={onClick}
          className='hover:scale-125 cursor-pointer'
          src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNSAxMGMtMi40ODMgMC00LjUgMi4wMTUtNC41IDQuNXMyLjAxNyA0LjUgNC41IDQuNSA0LjUtMi4wMTUgNC41LTQuNS0yLjAxNy00LjUtNC41LTQuNXptMi41IDVoLTV2LTFoNXYxem0tNi41MjcgNC41OTNjLTEuMTA4IDEuMDg2LTIuMjc1IDIuMjE5LTMuNDczIDMuNDA3LTYuNDMtNi4zODEtMTItMTEuMTQ3LTEyLTE1LjgwOCAwLTQuMDA1IDMuMDk4LTYuMTkyIDYuMjgxLTYuMTkyIDIuMTk3IDAgNC40MzQgMS4wNDIgNS43MTkgMy4yNDggMS4yNzktMi4xOTUgMy41MjEtMy4yMzggNS43MjYtMy4yMzggMy4xNzcgMCA2LjI3NCAyLjE3MSA2LjI3NCA2LjE4MiAwIC43NDYtLjE1NiAxLjQ5Ni0uNDIzIDIuMjUzLS41MjctLjQyNy0xLjEyNC0uNzY4LTEuNzY5LTEuMDE0LjEyMi0uNDI1LjE5Mi0uODM5LjE5Mi0xLjIzOSAwLTIuODczLTIuMjE2LTQuMTgyLTQuMjc0LTQuMTgyLTMuMjU3IDAtNC45NzYgMy40NzUtNS43MjYgNS4wMjEtLjc0Ny0xLjU0LTIuNDg0LTUuMDMtNS43Mi01LjAzMS0yLjMxNS0uMDAxLTQuMjggMS41MTYtNC4yOCA0LjE5MiAwIDMuNDQyIDQuNzQyIDcuODUgMTAgMTNsMi4xMDktMi4wNjRjLjM3Ni41NTcuODM5IDEuMDQ4IDEuMzY0IDEuNDY1eiIvPjwvc3ZnPg=='
        />
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
        <img
          onClick={onClick}
          className='hover:scale-125 cursor-pointer'
          src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNSAxMGMtMi40ODMgMC00LjUgMi4wMTUtNC41IDQuNXMyLjAxNyA0LjUgNC41IDQuNSA0LjUtMi4wMTUgNC41LTQuNS0yLjAxNy00LjUtNC41LTQuNXptMi41IDVoLTV2LTFoNXYxem0tNi41MjcgNC41OTNjLTEuMTA4IDEuMDg2LTIuMjc1IDIuMjE5LTMuNDczIDMuNDA3LTYuNDMtNi4zODEtMTItMTEuMTQ3LTEyLTE1LjgwOCAwLTQuMDA1IDMuMDk4LTYuMTkyIDYuMjgxLTYuMTkyIDIuMTk3IDAgNC40MzQgMS4wNDIgNS43MTkgMy4yNDggMS4yNzktMi4xOTUgMy41MjEtMy4yMzggNS43MjYtMy4yMzggMy4xNzcgMCA2LjI3NCAyLjE3MSA2LjI3NCA2LjE4MiAwIC43NDYtLjE1NiAxLjQ5Ni0uNDIzIDIuMjUzLS41MjctLjQyNy0xLjEyNC0uNzY4LTEuNzY5LTEuMDE0LjEyMi0uNDI1LjE5Mi0uODM5LjE5Mi0xLjIzOSAwLTIuODczLTIuMjE2LTQuMTgyLTQuMjc0LTQuMTgyLTMuMjU3IDAtNC45NzYgMy40NzUtNS43MjYgNS4wMjEtLjc0Ny0xLjU0LTIuNDg0LTUuMDMtNS43Mi01LjAzMS0yLjMxNS0uMDAxLTQuMjggMS41MTYtNC4yOCA0LjE5MiAwIDMuNDQyIDQuNzQyIDcuODUgMTAgMTNsMi4xMDktMi4wNjRjLjM3Ni41NTcuODM5IDEuMDQ4IDEuMzY0IDEuNDY1eiIvPjwvc3ZnPg=='
        />
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
