import './ModalDetail.scss';

export default function ModalDetail() {
  return (
    <div className='overlay'>
      <button className='back'></button>
      <div className='modal-wrapper'>
        <h2 className='title'>Compello velit vociferor hic allatus arcus.</h2>
        <p className='address'>99016 Jacobi Ferry Suite 104</p>

        <div className='pills'>
          <span className='status'>En Venta</span> {/* En venta, en alquiler */}
          <span className='type'>Tipo 2</span> {/* Tipo de propiedad */}
          <span className='isActive'>Activo</span> {/* Activo, inactivo */}
        </div>

        <p className='price'>$376789</p>
        <p className='area'>948 pie²</p>

        <p className='createdAt'>Publicado hace 2 días</p>
        <p>Contacto: John Doe - johndoe@example.com</p>
      </div>
    </div>
  );
}
