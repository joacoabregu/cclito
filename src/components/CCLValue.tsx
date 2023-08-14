import classNames from 'classnames';
import { memo, useRef, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import useSWR from 'swr';
import { fetcher, formatTimestampToDDMMYYY } from '@utils/index';
import type { Ratio, StockName, StockPrice, Stocks } from '@customTypes/index';
import Spinner from './Spinner';

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
      debouncedSearchTerm ? `api/stock?name=${debouncedSearchTerm}` : null,
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

function StockInfo({ stockName }: { stockName: StockName | undefined }) {
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
  return (
    <>
      {stockName && (
        <div className='py-10 max-w-md w-full'>
          <p className='text-3xl'>{stockName.full_name}</p>
          <p className='text-base'>{stockName.description}</p>
        </div>
      )}
      {error && (
        <p className='text-base'>
          Se ha producido un error al buscar la información del CEDEAR.
        </p>
      )}
      {isLoading && <Spinner />}
      {data && (
        <div>
          <p className='text-2xl'>CCL: ${CCL} </p>
          <p className='text-1xl'>Ratio: {ratio} </p>
          <p className='text-base'>Precio: usd$ {stockPrice}</p>
          <p className='text-base'>Precio CEDEAR: ${cedearPrice}</p>
          <p>
            Valor de cierre del:{' '}
            {formatTimestampToDDMMYYY(data.stock.t[data.stock.t.length - 1])}
          </p>
        </div>
      )}
    </>
  );
}
export default function Value() {
  const [stockName, setStockName] = useState<StockName | undefined>();

  return (
    <div className='container mx-auto px-4 flex flex-col items-center justify-center'>
      <div className='py-10 max-w-md w-full'>
        <Autocomplete setStockName={setStockName} />
      </div>
      <StockInfo stockName={stockName} />
    </div>
  );
}
