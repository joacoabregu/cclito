import { CedearInfoDetails } from './common/StockInfo';

export default function Stock({
  ticker,
  details,
}: {
  ticker: string;
  details: {
    ratio: number;
    stockPrice: number;
    cedearPrice: number;
    CCL: string;
    date: string;
  };
}) {
  return (
    <div className='container mx-auto max-w-3xl px-4 h-screen grid place-items-center text-center'>
      <div className='flex flex-col items-center'>
        <p className='text-3xl mb-4'>{ticker}</p>
        <CedearInfoDetails details={details} />
      </div>
    </div>
  );
}
