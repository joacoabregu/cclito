import Autocomplete from '@components/common/AutoComplete';
import {
  CCLInfoDetails,
  CedearError,
  StockName,
} from '@components/common/StockInfo';
import type {
  StockName as IStockName,
  Ratio,
  StockPrice,
} from '@customTypes/index';
import { useDebounce } from '@uidotdev/usehooks';
import { fetcher, getStockDetails } from '@utils/index';
import { useState } from 'react';
import useSWR from 'swr';

export default function SLTP() {
  const [stockName, setStockName] = useState<IStockName | undefined>();
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
      <div className='grid grid-cols-2 py-10 gap-6 items-center'>
        <Autocomplete setStockName={setStockName} />
        <div>{data && `CCL: $${CCL}`}</div>
        <InputSLTP
          CCL={CCL}
          ratio={ratio}
          isData={Boolean(data)}
          placeholder='Ingresar Take Profit'
        />
        <InputSLTP
          CCL={CCL}
          ratio={ratio}
          isData={Boolean(data)}
          placeholder='Ingresar Stop Loss'
        />
      </div>
      <div className='flex flex-col items-center'>
        {stockName && <StockName stockName={stockName} />}
        {error && <CedearError />}
        {data && <CCLInfoDetails details={details} />}
      </div>
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
  return (
    <>
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
      <div>
        {isData &&
          debouncedTPPrice &&
          `$${((Number(CCL) * Number(debouncedTPPrice)) / ratio).toFixed(2)}`}
      </div>
    </>
  );
}
