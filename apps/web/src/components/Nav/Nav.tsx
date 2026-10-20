import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Search, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import type { Property } from '@red-atlas/shared';
import defaultImage from '../../assets/property-default.jpg';
import './Nav.scss';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';
import { useSearchPropertiesQuery } from '../../redux/propertiesApi';

interface SearchFormValues {
  query: string;
}

export default function Nav() {
  const { register, watch, setValue, setFocus } = useForm<SearchFormValues>();
  // Hiding the results keeps the text, so refocusing brings them back
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();

  // Opening a modal closes the list
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // So does clicking outside the nav
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const query = watch('query', '');

  // Each query is cached; while a new one loads, the previous results stay
  const { data } = useSearchPropertiesQuery(query, {
    skip: query.length < 3,
  });
  const results = query.length >= 3 ? (data?.properties ?? []) : [];

  // Keep the focus, ready for the next search
  const clearSearch = () => {
    setValue('query', '');
    setFocus('query');
  };

  return (
    <header>
      <nav ref={navRef}>
        <NavLink to='/' className='logo'>
          {/* Absolute path, so it also loads on /detail/:id */}
          <img src='/logo.svg' alt='Red Atlas logo' />
        </NavLink>
        <div className='search'>
          {/* Results update while typing; Enter must not reload the page */}
          <form onSubmit={(event) => event.preventDefault()}>
            <Search aria-hidden='true' />
            <input
              type='text'
              {...register('query')}
              id='search'
              autoComplete='off'
              placeholder='Search properties by title or address'
              aria-label='Search properties'
              onFocus={() => setIsOpen(true)}
              onInput={() => setIsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') clearSearch();
              }}
            />
            {query.length > 0 && (
              <button
                type='button'
                className='clear'
                onClick={clearSearch}
                aria-label='Clear search'
              >
                <X />
              </button>
            )}
          </form>
        </div>
        <div className='search-results' hidden={!isOpen}>
          {query.length === 0 && ''}
          {query.length > 0 && query.length < 3 ? (
            <div className='result'>Type at least 3 characters</div>
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
                      {property.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className='numbers'>
                    <p className='price'>${property.price}</p>
                    <p className='area'>{property.area} sq ft</p>
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
