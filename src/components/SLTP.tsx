import Spinner from '@components/Spinner';
import Autocomplete from '@components/common/AutoComplete';
import {
  CedearError,
  StockInfoDetailsProps,
  StockName,
} from '@components/common/StockInfo';
import type {
  StockName as IStockName,
  Ratio,
  StockPrice,
} from '@customTypes/index';
import { useDebounce, useMediaQuery } from '@uidotdev/usehooks';
import { fetcher, getStockDetails, mediaQuery } from '@utils/index';
import { useState } from 'react';
import useSWR from 'swr';

export default function SLTP() {
  const [stockName, setStockName] = useState<IStockName | undefined>();
  const isDesktop = useMediaQuery(mediaQuery.sm);
  const { data, error, isLoading } = useSWR<{
    stock: StockPrice;
    cedear: StockPrice;
    ratio: Ratio;
  }>(
    () => (stockName ? `api/stock/price?name=${stockName.full_name}` : null),
    fetcher
  );
  const details = getStockDetails(data);
  const { CCL, ratio } = details;

  return (
    <div className='container mx-auto max-w-3xl mx-auto px-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 py-10 gap-3 sm:gap-6 items-center'>
        <Autocomplete setStockName={setStockName} />
        <p className='hidden sm:block text-1xl'>{data && `CCL: $${CCL}`}</p>
        {!isDesktop && (
          <Stock
            stockName={stockName}
            error={error}
            isLoading={isLoading}
            data={data}
            details={details}
          />
        )}
        <InputSLTP
          CCL={CCL}
          ratio={ratio}
          isData={Boolean(data)}
          placeholder='Ingresar Take Profit en usd'
        />
        <InputSLTP
          CCL={CCL}
          ratio={ratio}
          isData={Boolean(data)}
          placeholder='Ingresar Stop Loss en usd'
        />
      </div>
      {isDesktop && (
        <Stock
          stockName={stockName}
          error={error}
          isLoading={isLoading}
          data={data}
          details={details}
        />
      )}
    </div>
  );
}

function Stock({
  stockName,
  error,
  isLoading,
  data,
  details,
}: {
  stockName: IStockName | undefined;
  error: any;
  isLoading: boolean;
  data:
    | {
        stock: StockPrice;
        cedear: StockPrice;
        ratio: Ratio;
      }
    | undefined;
  details: {
    ratio: number;
    stockPrice: number;
    cedearPrice: number;
    CCL: string;
    date: string;
  };
}) {
  return (
    <div className='min-h-[220px] flex flex-col items-center'>
      {stockName && <StockName stockName={stockName} />}
      {error && <CedearError />}
      {isLoading && <Spinner />}
      {data && <InfoDetails details={details} />}
    </div>
  );
}

function InfoDetails({ details }: { details: StockInfoDetailsProps }) {
  return (
    <div>
      <p className='sm:hidden text-1xl'>CCL: ${details.CCL}</p>
      <p className='text-1xl'>Precio CEDEAR: ${details.cedearPrice}</p>
      <p className='text-base'>Precio: usd$ {details.stockPrice}</p>
      <p className='text-base'>Ratio: {details.ratio} </p>
      <p>Valor de cierre del: {details.date}</p>
    </div>
  );
}

function InputSLTP({
  CCL,
  ratio,
  isData,
  placeholder,
}: {
  CCL: string;
  ratio: number;
  isData: boolean;
  placeholder: string;
}) {
  const [TPPrice, setTPPrice] = useState<string>('');
  const debouncedTPPrice = useDebounce(TPPrice, 400);
  const isDesktop = useMediaQuery(mediaQuery.sm);

  return (
    <>
      {isDesktop && <div></div>}
      {isDesktop && (
        <p className='text-center'>{isData && 'Valor del Cedear:'}</p>
      )}
      <input
        type='text'
        placeholder={placeholder}
        className='input input-bordered w-full'
        disabled={!isData}
        value={TPPrice}
        onChange={(e) => {
          const value = e.target.value;
          //check that value is a valid number
          if (isNaN(parseFloat(value))) return;
          setTPPrice(e.target.value);
        }}
      />
      {!isDesktop && (
        <p className='text-center'>{isData && 'Valor del Cedear:'}</p>
      )}
      <div>
        {isData &&
          debouncedTPPrice &&
          `$${((Number(CCL) * Number(debouncedTPPrice)) / ratio).toFixed(2)}`}
      </div>
      {isData && <div className='divider' />}
    </>
  );
}
