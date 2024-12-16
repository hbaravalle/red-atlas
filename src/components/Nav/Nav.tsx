import { Link, NavLink } from 'react-router';
import { Search } from 'react-feather';
import PropertyImageDefault from '../../assets/property-default.jpg';
import './Nav.scss';

export default function Nav() {
  return (
    <header>
      <nav>
        <NavLink to='/' className='logo'>
          <img src='./logo.svg' alt='Logo Red Atlas' />
        </NavLink>
        <div className='search'>
          <form action=''>
            <Search />
            <input
              type='text'
              name='search'
              id='search'
              autoComplete='off'
              placeholder='Buscar propiedades por titulo o dirección'
            />
          </form>
        </div>
        <div className='search-results'>
          <Link to='/detail/f2718c54-c978-4dfa-8bbf-189371860c1c'>
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
          </Link>
        </div>
      </nav>
    </header>
  );
}
