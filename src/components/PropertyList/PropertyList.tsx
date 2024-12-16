import { useEffect } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { setProperties } from '../../redux/propertiesSlice';
import { Property } from '../../types/property';
import './PropertyList.scss';

export default function PropertyList() {
  const dispatch = useDispatch();
  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  useEffect(() => {
    const getProperties = async () => {
      const response = await fetch(
        'https://fake-api-listings.vercel.app/properties'
      );
      const data = await response.json();
      dispatch(setProperties(data));
    };

    getProperties();
  }, []);

  return (
    <div id='propertyList'>
      <div className='container'>
        <div className='header'>
          <h1>Propiedades</h1>
          <form>
            Filtrar por{' '}
            <select name='' id=''>
              <option value='' hidden></option>
              <option value=''>Item 1</option>
              <option value=''>Item 1</option>
              <option value=''>Item 1</option>
              <option value=''>Item 1</option>
            </select>
            <button type='button'>+&nbsp;Crear</button>
          </form>
        </div>
        <div className='cards'>
          {properties.map((property: Property) => (
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
                  <span className='type'>{property.type}</span>
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
    </div>
  );
}
