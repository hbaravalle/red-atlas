import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Property } from '../../types/property';
import { useState } from 'react';
import './PropertyList.scss';

export default function PropertyList() {
  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );
  const [sortedBy, setSortedBy] = useState('date');

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortedBy(event?.target.value);
  };

  console.log(properties);

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortedBy === 'date')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortedBy === 'priceAsc') return a.price - b.price; // Menor a mayor
    if (sortedBy === 'priceDesc') return b.price - a.price; // Mayor a menor
    return 0;
  });

  return (
    <div id='propertyList'>
      <div className='container'>
        <div className='header'>
          <h1>Propiedades</h1>
          <form>
            Filtrar por
            <select name='filter' id='filter' onChange={handleSortChange}>
              <option value='date'>Fecha de publicación</option>
              <option value='priceDesc'>Precio, de menor a mayor</option>
              <option value='priceAsc'>Precio, de mayor a menor</option>
            </select>
          </form>
        </div>
        <div className='cards'>
          {sortedProperties.map((property: Property) => (
            <NavLink
              className='card'
              to={`/detail/${property.id}`}
              key={property.id}
            >
              <figure>
                <img className='' src={property.images[0]} alt='' />
                <div className='pills'>
                  <span className='status'>
                    {property.status === 'sale' ? 'Venta' : 'Alquiler'}
                  </span>{' '}
                  <span className='type'>
                    {property.type === 'apartment' ? 'Apartamento' : 'Casa'}
                  </span>
                  <span className='isActive'>
                    {property.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </figure>
              <div className='details'>
                <p className='title'>{property.title}</p>
                <p className='address'>{property.address}</p>
                <div className='numbers'>
                  <p className='price'>${property.price}</p>
                  <p className='area'>{property.area} pie²</p>
                </div>
                <p className='createdAt'>
                  Publicada{' '}
                  {property.createdAt &&
                    formatDistanceToNow(new Date(property.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <div className='actions'>
        <div className='pagination'>
          <button>Anterior</button>
          <button>Siguiente</button>
        </div>
        <NavLink to='/create' className='create'>
          + Crear
        </NavLink>
      </div>
    </div>
  );
}
