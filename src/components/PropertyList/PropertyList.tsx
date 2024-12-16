import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Property } from '../../types/property';
import { setProperties } from '../../redux/propertiesSlice';
import './PropertyList.scss';

export default function PropertyList() {
  const dispatch = useDispatch();
  // const [properties, setPropertiesLocal] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortedBy, setSortedBy] = useState('date');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-red-atlas-livid.vercel.app/api/properties?page=${page}&limit=10${
          sortedBy !== 'date' ? '&sort=' + sortedBy : ''
        }`
      );
      const data = await response.json();
      console.log(data);
      // setPropertiesLocal(data.properties);
      setTotalPages(data.totalPages);
      dispatch(setProperties(data.properties));
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [sortedBy, page]);

  // Cambiar el filtro
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortedBy(event.target.value);
    setPage(1);
  };

  // Cambiar la página
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div id='propertyList'>
      <div className='container'>
        <div className='header'>
          <h1>Propiedades</h1>
          <form>
            Filtrar por
            <select
              name='filter'
              id='filter'
              onChange={handleSortChange}
              value={sortedBy}
            >
              <option value='date'>Fecha de publicación</option>
              <option value='price_asc'>Precio, de menor a mayor</option>
              <option value='price_desc'>Precio, de mayor a menor</option>
            </select>
          </form>
        </div>
        <div className='cards'>
          {loading ? (
            <p>Cargando propiedades...</p>
          ) : (
            properties.map((property: Property) => (
              <NavLink
                className='card'
                to={`/detail/${property._id}`}
                key={property._id}
              >
                <figure>
                  <img src={property.images[0]} alt='' />
                  <div className='pills'>
                    <span className='status'>
                      {property.status === 'sale' ? 'Venta' : 'Alquiler'}
                    </span>
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
            ))
          )}
        </div>
      </div>
      <div className='actions'>
        <div className='pagination'>
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Siguiente
          </button>
        </div>
        <NavLink to='/create' className='create'>
          + Crear
        </NavLink>
      </div>
    </div>
  );
}
