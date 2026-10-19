import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Search, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import type { Property } from '@red-atlas/shared';
import defaultImage from '../../assets/property-default.jpg';
import './Nav.scss';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';
import { searchProperties } from '../../services/properties';

interface SearchFormValues {
  query: string;
}

export default function Nav() {
  const { register, watch, setValue, setFocus } = useForm<SearchFormValues>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Property[]>([]);
  // The results list hides when the user moves on, but the text stays, so
  // focusing the field again brings the same results back
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();

  // Opening a modal (a result, or "Crear") closes the list
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // So does clicking anywhere outside the search bar
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const watchedQuery = watch('query', '');

  useEffect(() => {
    setQuery(watchedQuery);
  }, [watchedQuery]);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    searchProperties(query, { signal: controller.signal })
      .then((result) => setResults(result.properties))
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error('Error al realizar la búsqueda:', error);
      });

    // Typing again cancels this search, so a slow response for an older
    // query can never replace the results of the newer one
    return () => controller.abort();
  }, [query]);

  // Empty the field and keep the cursor in it, ready for a new search
  const clearSearch = () => {
    setValue('query', '');
    setFocus('query');
  };

  return (
    <header>
      <nav ref={navRef}>
        <NavLink to='/' className='logo'>
          <img src='./logo.svg' alt='Logo Red Atlas' />
        </NavLink>
        <div className='search'>
          {/* Results update while typing, so Enter must not reload the page */}
          <form onSubmit={(event) => event.preventDefault()}>
            <Search aria-hidden='true' />
            <input
              type='text'
              {...register('query')} // Se usa react-hook-form para registrar el campo
              id='search'
              autoComplete='off'
              placeholder='Buscar propiedades por título o dirección'
              aria-label='Buscar propiedades'
              onFocus={() => setIsOpen(true)}
              onInput={() => setIsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') clearSearch();
              }}
            />
            {watchedQuery.length > 0 && (
              <button
                type='button'
                className='clear'
                onClick={clearSearch}
                aria-label='Borrar búsqueda'
              >
                <X />
              </button>
            )}
          </form>
        </div>
        <div className='search-results' hidden={!isOpen}>
          {query.length === 0 && ''}
          {query.length > 0 && query.length < 3 ? (
            <div className='result'>Ingrese al menos 3 caracteres</div>
          ) : (
            results.map((property: Property) => (
              <NavLink
                to={`/detail/${property._id}`}
                className='result'
                key={property._id}
              >
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
