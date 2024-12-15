import { Link } from 'react-router';
import './PropertyList.scss';

export default function PropertyList() {
  return (
    <div id='propertyList'>
      <div className='container'>
        <div className='header'>
          <h1>Propiedades</h1>
          <form>
            <select name='' id=''>
              <option value='' hidden>
                Filtrar por
              </option>
              <option value=''>Item 1</option>
              <option value=''>Item 1</option>
              <option value=''>Item 1</option>
              <option value=''>Item 1</option>
            </select>
            <button type='button'>+&nbsp;Crear</button>
          </form>
        </div>
        <div className='cards'>
          <Link to='/detail'>
            <div className='card'>
              <figure>
                <img
                  className=''
                  src='https://images.unsplash.com/photo-1733235014433-00116a9ec23d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  alt=''
                />
                <div className='pills'>
                  <span className='status'>En Venta</span>{' '}
                  {/* En venta, en alquiler */}
                  <span className='type'>Tipo 2</span> {/* Tipo de propiedad */}
                  <span className='isActive'>Activo</span>{' '}
                  {/* Activo, inactivo */}
                </div>
              </figure>
              <div className='details'>
                <p className='title'>
                  Compello velit vociferor hic allatus arcus
                </p>
                <p className='address'>99016 Jacobi Ferry Suite 104</p>

                <div className='numbers'>
                  <p className='price'>$376789</p>
                  <p className='area'>948 pie²</p>
                </div>

                <p className='createdAt'>Publicado hace 2 días</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
