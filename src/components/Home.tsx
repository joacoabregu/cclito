import { useState } from 'react';
import ButtonsModal from '@components/ButtonsModal';
import type { Tab } from '@customTypes/index';
import CCLValue from '@components/CCLValue';

export default function Index() {
  const [tab, setTab] = useState<Tab>('Cedear');

  return (
    <>
      <main className='text-center'>
        <label htmlFor='my-modal' className='btn'>
          open modal
        </label>
        {tab === 'CCL' && <CCLValue />}
      </main>
      <ButtonsModal tabState={[tab, setTab]} />
    </>
  );
}
