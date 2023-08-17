import Autocomplete from '@components/common/AutoComplete';
import {
  CCLInfoDetails,
  CedearInfoDetails,
  StockInfo,
  StockInfoDetailsProps,
} from '@components/common/StockInfo';
import type { StockName } from '@customTypes/index';
import { useState } from 'react';


export function Value({
  detailsComponent,
}: {
  detailsComponent: (details: StockInfoDetailsProps) => JSX.Element;
}) {
  const [stockName, setStockName] = useState<StockName | undefined>();

  return (
    <div className='container mx-auto px-4 flex flex-col items-center justify-center'>
      <div className='py-10 max-w-md w-full'>
        <Autocomplete setStockName={setStockName} />
      </div>
      <StockInfo stockName={stockName} detailsComponent={detailsComponent} />
    </div>
  );
}

export function CCLValue() {
  return (
    <Value
      detailsComponent={(details: StockInfoDetailsProps) => (
        <CCLInfoDetails details={details} />
      )}
    />
  );
}

export function CedearValue() {
  return (
    <Value
      detailsComponent={(details: StockInfoDetailsProps) => (
        <CedearInfoDetails details={details} />
      )}
    />
  );
}
