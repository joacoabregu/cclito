import ButtonsModal from '@components/ButtonsModal';
import { CCLValue, CedearValue } from '@components/CCLValue';
import SLTP from '@components/SLTP';
import type { Tab } from '@customTypes/index';
import { useState } from 'react';

export default function Index() {
  const [tab, setTab] = useState<Tab>('CCL');

  return (
    <>
      <main className='text-center'>
        <label htmlFor='my-modal' className='btn'>
          open modal
        </label>
        {tab === 'CCL' && <CCLValue />}
        {tab === 'Cedear' && <CedearValue />}
        {tab === 'SL/TP' && <SLTP />}
      </main>
      <ButtonsModal tabState={[tab, setTab]} />
    </>
  );
}
