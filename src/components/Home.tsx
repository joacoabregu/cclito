import { useState } from 'react';
import ButtonsModal from '@components/ButtonsModal';
import type { Tab } from '@customTypes/index';
import {CCLValue, CedearValue} from '@components/CCLValue';

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
      </main>
      <ButtonsModal tabState={[tab, setTab]} />
    </>
  );
}
