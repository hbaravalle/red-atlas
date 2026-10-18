import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { Search } from 'react-feather';
import { useForm } from 'react-hook-form';
import type { Property } from '@red-atlas/shared';
import defaultImage from '../../assets/property-default.jpg';
import './Nav.scss';
import { API_URL } from '../../lib/api';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';

interface SearchFormValues {
  query: string;
}

export default function Nav() {
  const { register, watch } = useForm<SearchFormValues>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const watchedQuery = watch('query', '');

  useEffect(() => {
    setQuery(watchedQuery);
  }, [watchedQuery]);

  useEffect(() => {
    if (query.length >= 3) {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(
            `${API_URL}/properties/search?query=${query}`
          );
          const result = await response.json();
          setResults(result.properties || []);
        } catch (error) {
          console.error('Error al realizar la búsqueda:', error);
        }
      };

      fetchSearchResults();
    } else {
      setResults([]);
    }
  }, [query]);

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
              {...register('query')} // Se usa react-hook-form para registrar el campo
              id='search'
              autoComplete='off'
              placeholder='Buscar propiedades por título o dirección'
            />
          </form>
        </div>
        <div className='search-results'>
          {query.length === 0 && ''}
          {query.length > 0 && query.length < 3 ? (
            <div className='result'>Ingrese al menos 3 caracteres</div>
          ) : (
            results.map((property: Property) => (
              <NavLink to={`/detail/${property._id}`} className='result'>
                <img src={property.images[0] || defaultImage} alt='' />
                <div className='info'>
                  <p className='title'>{property.title}</p>
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
                  <div className='numbers'>
                    <p className='price'>${property.price}</p>
                    <p className='area'>{property.area} pie²</p>
                  </div>
                </div>
              </NavLink>
            ))
          )}
        </div>
      </nav>
    </header>
  );
}
