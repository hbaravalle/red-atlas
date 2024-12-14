import './Nav.scss';
import PropertyImageDefault from '../../assets/property-default.jpg';

export default function Nav() {
  return (
    <header>
      <nav>
        <a href=''>
          Logo
          {/* <img src='' alt='' /> */}
        </a>
        <div className='search'>
          <form action=''>
            Search
            <input type='text' name='search' id='search' autoComplete='off' />
          </form>
        </div>
        <div className='search-results'>
          <div className='result'>
            <img src={PropertyImageDefault} alt='' />
            <div className='info'>
              <p className='title'>
                Compello velit vociferor hic allatus arcus
              </p>
              <div className='pills'>
                <span className='status'>En Venta</span>
                <span className='type'>Tipo 2</span>
                <span className='isActive'>Activo</span>{' '}
              </div>
              <div className='numbers'>
                <p className='price'>$376789</p>
                <p className='area'>948 pie²</p>
              </div>
            </div>
          </div>
          <div className='result'>
            <img src={PropertyImageDefault} alt='' />
            <div className='info'>
              <p className='title'>
                Compello velit vociferor hic allatus arcus
              </p>
              <div className='pills'>
                <span className='status'>En Venta</span>
                <span className='type'>Tipo 2</span>
                <span className='isActive'>Activo</span>
              </div>
              <div className='numbers'>
                <p className='price'>$376789</p>
                <p className='area'>948 pie²</p>
              </div>
            </div>
          </div>
          <div className='result'>
            <img src={PropertyImageDefault} alt='' />
            <div className='info'>
              <p className='title'>
                Compello velit vociferor hic allatus arcus
              </p>
              <div className='pills'>
                <span className='status'>En Venta</span>

                <span className='type'>Tipo 2</span>
                <span className='isActive'>Activo</span>
              </div>
              <div className='numbers'>
                <p className='price'>$376789</p>
                <p className='area'>948 pie²</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
