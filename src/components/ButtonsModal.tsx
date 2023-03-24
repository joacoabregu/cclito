export default function ButtonsModal() {
  return (
    <>
      {/* Put this part before </body> tag */}
      <input type='checkbox' defaultChecked={true} id='my-modal' className='modal-toggle' />
      <div className='modal '>
        <div className='modal-box max-w-xs'>
          <div className='modal-action justify-start mb-4'>
            <button className='btn btn-sm btn-square btn-outline'>
              <label htmlFor='my-modal'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </label>
            </button>
          </div>
          <h2 className='text-3xl mb-6 text-center'>¿Qué queres saber?</h2>
          <div className='flex flex-col py-4 gap-y-4'>
            <button className='btn w-full'>Valor ccl de una acción</button>
            <button className='btn'>Valor de un cedear</button>
            <button className='btn'>Stop Loss / Take Profit</button>
            <button className='btn'>Todas las opciones</button>
          </div>
        </div>
      </div>
    </>
  );
}
