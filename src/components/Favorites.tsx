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
    <div className='container mx-auto max-w-4xl mx-auto px-4'>
      {isDesktop && (
        <div className='overflow-x-auto'>
          <table className='table table-zebra w-full'>
            {/* head */}
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
                      setFavs(
                        favs.filter((fav) => fav.full_name !== stock.ticker)
                      )
                    }
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
      {!isDesktop && (
        <div className='flex flex-col items-center gap-4'>
          {favs.map((fav) => {
            return (
              <div
                key={fav.full_name}
                className='card w-96 bg-base-100 shadow-xl text-center'
              >
                <div className='card-body'>
                  <h2 className='text-3xl'>{fav.description} </h2>
                  <p className='text-base'>{fav.full_name}</p>
                </div>
                <figure className='py-4'>
                  <img
                    onClick={() =>
                      setFavs(
                        favs.filter((fav) => fav.full_name !== fav?.full_name)
                      )
                    }
                    className='hover:scale-125 cursor-pointer'
                    src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNSAxMGMtMi40ODMgMC00LjUgMi4wMTUtNC41IDQuNXMyLjAxNyA0LjUgNC41IDQuNSA0LjUtMi4wMTUgNC41LTQuNS0yLjAxNy00LjUtNC41LTQuNXptMi41IDVoLTV2LTFoNXYxem0tNi41MjcgNC41OTNjLTEuMTA4IDEuMDg2LTIuMjc1IDIuMjE5LTMuNDczIDMuNDA3LTYuNDMtNi4zODEtMTItMTEuMTQ3LTEyLTE1LjgwOCAwLTQuMDA1IDMuMDk4LTYuMTkyIDYuMjgxLTYuMTkyIDIuMTk3IDAgNC40MzQgMS4wNDIgNS43MTkgMy4yNDggMS4yNzktMi4xOTUgMy41MjEtMy4yMzggNS43MjYtMy4yMzggMy4xNzcgMCA2LjI3NCAyLjE3MSA2LjI3NCA2LjE4MiAwIC43NDYtLjE1NiAxLjQ5Ni0uNDIzIDIuMjUzLS41MjctLjQyNy0xLjEyNC0uNzY4LTEuNzY5LTEuMDE0LjEyMi0uNDI1LjE5Mi0uODM5LjE5Mi0xLjIzOSAwLTIuODczLTIuMjE2LTQuMTgyLTQuMjc0LTQuMTgyLTMuMjU3IDAtNC45NzYgMy40NzUtNS43MjYgNS4wMjEtLjc0Ny0xLjU0LTIuNDg0LTUuMDMtNS43Mi01LjAzMS0yLjMxNS0uMDAxLTQuMjggMS41MTYtNC4yOCA0LjE5MiAwIDMuNDQyIDQuNzQyIDcuODUgMTAgMTNsMi4xMDktMi4wNjRjLjM3Ni41NTcuODM5IDEuMDQ4IDEuMzY0IDEuNDY1eiIvPjwvc3ZnPg=='
                  />
                </figure>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FavoritesTableRow({
  name,
  ticker,
  id,
  ratio,
  USD,
  CEDEAR,
  onClick,
}: {
  name: string;
  ticker: string;
  id: number;
  onClick: () => void;
  ratio?: string;
  USD?: string;
  CEDEAR?: string;
}) {
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
