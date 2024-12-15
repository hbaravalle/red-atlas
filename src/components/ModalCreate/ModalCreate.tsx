import './ModalCreate.scss';

export default function ModalCreate() {
  return (
    <div className='overlay'>
      <button className='back'></button>
      <div className='modal-wrapper'>
        <h2>Nueva propiedad</h2>
        <form action=''>
          <div className='form-group'>
            <label htmlFor=''>Título</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Dirección</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Descripción</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Imágen</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Tipo</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Estado</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Area</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Owner name</label>
            <input type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Contacto</label>
            <input type='text' />
          </div>
        </form>
      </div>
    </div>
  );
}
