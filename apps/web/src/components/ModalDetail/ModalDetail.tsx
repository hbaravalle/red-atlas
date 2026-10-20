import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin, X } from 'react-feather';
import type { Property } from '@red-atlas/shared';
import {
  formatArea,
  formatPrice,
  formatPricePerArea,
  formatTimeAgo,
} from '../../lib/format';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';
import {
  useGetPropertiesQuery,
  useGetPropertyQuery,
} from '../../redux/propertiesApi';
import { useAppSelector } from '../../redux/store';
import defaultImage from '../../assets/property-default.jpg';
import LocationMap from './LocationMap';
import './ModalDetail.scss';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; property: Property }
  | { status: 'not-found' }
  | { status: 'error' };

// Longer descriptions start collapsed behind "Read more"
const DESCRIPTION_PREVIEW_LENGTH = 280;

export default function ModalDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  // Properties on the current page are cached, so they show without loading
  const listParams = useAppSelector((state) => state.properties);
  const { listed } = useGetPropertiesQuery(listParams, {
    selectFromResult: ({ data }) => ({
      listed: data?.properties.find((property) => property._id === id),
    }),
  });

  // Others (a search result, a reload) are fetched and cached by id
  const { currentData, isError } = useGetPropertyQuery(id, {
    skip: Boolean(listed) || !id,
  });

  // currentData, unlike data, never shows the previous property
  const state: LoadState = listed
    ? { status: 'ready', property: listed }
    : isError
      ? { status: 'error' }
      : currentData === undefined
        ? { status: 'loading' }
        : currentData === null
          ? { status: 'not-found' }
          : { status: 'ready', property: currentData };

  const handleClose = () => navigate('/');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className='modal-detail' onClick={handleClose}>
      <article
        className='modal-wrapper'
        role='dialog'
        aria-modal='true'
        aria-labelledby='property-title'
        onClick={(event) => event.stopPropagation()}
      >
        <header className='topbar'>
          <span>Property details</span>
          <button
            type='button'
            className='close'
            onClick={handleClose}
            aria-label='Close'
          >
            <X />
          </button>
        </header>

        {state.status === 'loading' && <DetailSkeleton />}
        {state.status === 'not-found' && (
          <Feedback message="This property doesn't exist or was deleted." />
        )}
        {state.status === 'error' && (
          <Feedback message="We couldn't load the property. Try again in a few seconds." />
        )}
        {state.status === 'ready' && (
          // The key resets the gallery and "Read more"
          <PropertyDetail key={state.property._id} property={state.property} />
        )}
      </article>
    </div>
  );
}

// Same layout as PropertyDetail, so the modal doesn't resize when it loads
function DetailSkeleton() {
  return (
    <>
      <p className='visually-hidden' role='status'>
        Loading property...
      </p>
      <div className='content skeleton' aria-hidden='true'>
        <section className='heading'>
          <div className='pills'>
            <span className='bone pill' />
            <span className='bone pill' />
            <span className='bone pill' />
          </div>
          <h2>
            <span className='bone' style={{ width: '70%' }} />
          </h2>
          <p className='address'>
            <span className='bone' style={{ width: '40%' }} />
          </p>
        </section>
        <div className='media'>
          <div className='bone block' />
          <div className='bone block' />
        </div>
        <div className='stats'>
          {Array.from({ length: 6 }, (_, index) => (
            <div className='stat' key={index}>
              <span className='bone' style={{ width: '70%' }} />
              <span className='bone' style={{ width: '45%' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Feedback({ message }: { message: string }) {
  return (
    <div className='feedback'>
      <p>{message}</p>
      <NavLink to='/'>Back to the list</NavLink>
    </div>
  );
}

function PropertyDetail({ property }: { property: Property }) {
  const { title, address, location, price, area, owner } = property;

  const stats = [
    { label: 'Price', value: formatPrice(price) },
    { label: 'Area', value: area ? formatArea(area) : '—' },
    {
      label: 'Price per sq ft',
      value: area ? formatPricePerArea(price, area) : '—',
    },
    { label: 'Type', value: PROPERTY_TYPE_LABELS[property.type] },
    { label: 'Listing', value: PROPERTY_STATUS_LABELS[property.status] },
    {
      label: 'Listed',
      value: formatTimeAgo(property.createdAt),
    },
  ];

  return (
    <div className='content'>
      <section className='heading'>
        <div className='pills'>
          <span>{PROPERTY_STATUS_LABELS[property.status]}</span>
          <span>{PROPERTY_TYPE_LABELS[property.type]}</span>
          <span className={property.isActive ? '' : 'inactive'}>
            {property.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <h2 id='property-title'>{title}</h2>
        {address && (
          <p className='address'>
            <MapPin aria-hidden='true' />
            {address}
          </p>
        )}
      </section>

      <div className='media'>
        <Gallery images={property.images} title={title} />
        <LocationMap lat={location.lat} lng={location.lng} />
      </div>

      <dl className='stats'>
        {stats.map(({ label, value }) => (
          <div className='stat' key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {property.description && (
        <Description
          text={property.description}
          updatedAt={property.updatedAt}
        />
      )}

      {(owner?.name || owner?.contact) && (
        <section className='card contact'>
          <h3>Contact</h3>
          {owner.name && <p className='name'>{owner.name}</p>}
          {owner.contact &&
            (owner.contact.includes('@') ? (
              <a href={`mailto:${owner.contact}`}>{owner.contact}</a>
            ) : (
              <p>{owner.contact}</p>
            ))}
        </section>
      )}
    </div>
  );
}

function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const photos = images.length > 0 ? images : [defaultImage];
  const hasMany = photos.length > 1;

  const move = (step: number) =>
    setIndex((current) => (current + step + photos.length) % photos.length);

  return (
    <figure className='gallery'>
      <img src={photos[index]} alt={`Photo ${index + 1} of ${title}`} />
      {hasMany && (
        <>
          <button
            type='button'
            className='prev'
            onClick={() => move(-1)}
            aria-label='Previous photo'
          >
            <ChevronLeft />
          </button>
          <button
            type='button'
            className='next'
            onClick={() => move(1)}
            aria-label='Next photo'
          >
            <ChevronRight />
          </button>
          <figcaption>
            {index + 1} / {photos.length}
          </figcaption>
        </>
      )}
    </figure>
  );
}

function Description({ text, updatedAt }: { text: string; updatedAt: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > DESCRIPTION_PREVIEW_LENGTH;
  const visible =
    isLong && !expanded
      ? `${text.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
      : text;

  return (
    <section className='card description'>
      <div className='card-heading'>
        <h3>Description</h3>
        <span>Updated {format(new Date(updatedAt), 'MMMM d, yyyy')}
        </span>
      </div>
      <p>{visible}</p>
      {isLong && (
        <button
          type='button'
          className='link'
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </section>
  );
}
