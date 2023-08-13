import classNames from 'classnames';
import { memo, useRef, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import useSWR from 'swr';
import { fetcher } from '@utils/index';
import type { Stocks } from '@customTypes/index';

type AutcompleteProps = {};

//we are using dropdown, input and menu component from daisyui
const Autocomplete = memo(function Autocomplete(props: AutcompleteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  //Debounce useSwr
  //https://gist.github.com/csandman/cb1b9cae2334415b0b20e04b228c1016
  const { data, error, isLoading } = useSWR<{ stocks: Stocks }>(
    () =>
      debouncedSearchTerm ? `api/stock?name=${debouncedSearchTerm}` : null,
    fetcher
  );
  const items = data?.stocks || [];
  return (
    <>
      {error && <p>Se ha producido un error. Intente más tarde.</p>}

      {!error && (
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
          <div className='dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md'>
            <ul
              className='menu menu-compact '
              // use ref to calculate the width of parent
              style={{ width: ref.current?.clientWidth }}
            >
              {items.map((item, index) => {
                return (
                  <li
                    key={index}
                    tabIndex={index + 1}
                    onClick={() => {
                      setSearchTerm(item.full_name);
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
            </ul>
          </div>
        </div>
      )}
    </>
  );
});
export default function Value() {
  return (
    <div className='container mx-auto px-4 flex justify-center'>
      <div className='py-10 max-w-md w-full'>
        <Autocomplete />
      </div>
    </div>
  );
}
