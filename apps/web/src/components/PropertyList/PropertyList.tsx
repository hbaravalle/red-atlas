import { NavLink } from 'react-router';
import {
  DEFAULT_PAGE_SIZE,
  type Property,
  type SortOption,
} from '@red-atlas/shared';
import { useGetPropertiesQuery } from '../../redux/propertiesApi';
import { setPage, setSort } from '../../redux/propertiesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import defaultImage from '../../assets/property-default.jpg';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import './PropertyList.scss';
import { formatTimeAgo } from '../../lib/format';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';

const NO_PROPERTIES: Property[] = [];

export default function PropertyList() {
  const dispatch = useAppDispatch();
  const listParams = useAppSelector((state) => state.properties);
  const { page, sort } = listParams;
  // isFetching is also true while a cached page refreshes, e.g. after a
  // property is created, so the skeleton shows whenever the list may change
  const { data, isFetching, isError, refetch } =
    useGetPropertiesQuery(listParams);
  const properties = data?.properties ?? NO_PROPERTIES;
  const totalPages = data?.totalPages ?? 1;

  // Cambiar el filtro
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSort(event.target.value as SortOption));
  };

  // Cambiar la página
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
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
              value={sort}
            >
              <option value='date'>Fecha de publicación</option>
              <option value='price_asc'>Precio, de menor a mayor</option>
              <option value='price_desc'>Precio, de mayor a menor</option>
            </select>
          </form>
        </div>
        <div className='cards' aria-busy={isFetching}>
          {isFetching ? (
            <>
              <p className='visually-hidden' role='status'>
                Cargando propiedades...
              </p>
              {Array.from({ length: DEFAULT_PAGE_SIZE }, (_, index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </>
          ) : isError ? (
            <div className='list-error' role='alert'>
              <p>No pudimos cargar las propiedades.</p>
              <button type='button' onClick={refetch}>
                Reintentar
              </button>
            </div>
          ) : (
            properties.map((property: Property) => (
              <NavLink
                className='card'
                to={`/detail/${property._id}`}
                key={property._id}
              >
                <figure>
                  <img src={property.images[0] || defaultImage} alt='' />
                  <div className='pills'>
                    <span className='status'>
                      {PROPERTY_STATUS_LABELS[property.status]}
                    </span>
                    <span className='type'>
                      {PROPERTY_TYPE_LABELS[property.type]}
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
                    {property.createdAt && formatTimeAgo(property.createdAt)}
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
