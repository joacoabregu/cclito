import Spinner from '@components/Spinner';
import type { StockName, Stocks } from '@customTypes/index';
import { useDebounce } from '@uidotdev/usehooks';
import { fetcher } from '@utils/index';
import { PATHS_API } from '@utils/routes';
import classNames from 'classnames';
import { memo, useRef, useState } from 'react';
import useSWR from 'swr';

type AutcompleteProps = {
  setStockName: React.Dispatch<React.SetStateAction<StockName | undefined>>;
};

//we are using dropdown, input and menu component from daisyui
const Autocomplete = memo(function Autocomplete(props: AutcompleteProps) {
  const { setStockName } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  //Debounce useSwr
  //https://gist.github.com/csandman/cb1b9cae2334415b0b20e04b228c1016
  const { data, error, isLoading } = useSWR<{ stocks: Stocks }>(
    () =>
      debouncedSearchTerm ? `${PATHS_API.stock.url}?name=${debouncedSearchTerm}` : null,
    fetcher
  );

  return (
    <>
      {error && <p>Se ha producido un error. Intente más tarde.</p>}
      {!error && (
        <>
          <div
            // use classnames here to easily toggle dropdown open
            className={classNames({
              'dropdown w-full': true,
              'dropdown-open': open,
            })}
            ref={ref}
          >
            <input
              type='text'
              className='input input-bordered w-full'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Ingresar el nombre de un CEDEAR'
              tabIndex={0}
            />
            {isLoading && <Spinner css='absolute top-4 right-3' />}
            <div className='dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md'>
              <ul
                className='menu menu-compact '
                // use ref to calculate the width of parent
                style={{ width: ref.current?.clientWidth }}
              >
                {data?.stocks &&
                  data?.stocks?.length > 0 &&
                  data?.stocks.map((item, index) => {
                    return (
                      <li
                        key={index}
                        tabIndex={index + 1}
                        onClick={() => {
                          setStockName({
                            full_name: item.full_name,
                            description: item.description,
                          });
                          setOpen(false);
                        }}
                        className='border-b border-b-base-content/10 w-full'
                      >
                        <button>
                          {item.full_name} <span> ({item.description})</span>{' '}
                        </button>
                      </li>
                    );
                  })}
                {data?.stocks && data?.stocks.length === 0 && (
                  <li
                    tabIndex={1}
                    onClick={() => {
                      setOpen(false);
                    }}
                    className='border-b border-b-base-content/10 w-full'
                  >
                    <button>No se han encontrado resultados.</button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default Autocomplete;
