import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, MapPin, X } from 'react-feather';
import type { Property } from '@red-atlas/shared';
import {
  formatArea,
  formatPrice,
  formatPricePerArea,
  formatTimeAgo,
} from '../../lib/format';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';
import { getProperty } from '../../services/properties';
import defaultImage from '../../assets/property-default.jpg';
import LocationMap from './LocationMap';
import './ModalDetail.scss';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; property: Property }
  | { status: 'not-found' }
  | { status: 'error' };

// Result of fetching one id, so a stale result never shows for another id
type FetchResult = LoadState & { id: string };

// Longer descriptions start collapsed behind "Leer más"
const DESCRIPTION_PREVIEW_LENGTH = 280;

export default function ModalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );
  const [fetched, setFetched] = useState<FetchResult | null>(null);

  // Properties from the current page are already in the store: show them on
  // the first render instead of flashing a loading state
  const listed = properties.find((property) => property._id === id);

  useEffect(() => {
    if (listed || !id) return;

    const controller = new AbortController();

    getProperty(id, { signal: controller.signal })
      .then((property) =>
        setFetched(
          property
            ? { id, status: 'ready', property }
            : { id, status: 'not-found' }
        )
      )
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error('Error al cargar la propiedad:', error);
        setFetched({ id, status: 'error' });
      });

    // A newer id or closing the modal cancels the pending request
    return () => controller.abort();
  }, [id, listed]);

  const state: LoadState = listed
    ? { status: 'ready', property: listed }
    : fetched && fetched.id === id
      ? fetched
      : { status: 'loading' };

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
          <span>Ficha de la propiedad</span>
          <button
            type='button'
            className='close'
            onClick={handleClose}
            aria-label='Cerrar'
          >
            <X />
          </button>
        </header>

        {state.status === 'loading' && <DetailSkeleton />}
        {state.status === 'not-found' && (
          <Feedback message='Esta propiedad no existe o fue eliminada.' />
        )}
        {state.status === 'error' && (
          <Feedback message='No pudimos cargar la propiedad. Probá de nuevo en unos segundos.' />
        )}
        {state.status === 'ready' && (
          // The key resets the gallery and "Leer más" when the property changes
          <PropertyDetail key={state.property._id} property={state.property} />
        )}
      </article>
    </div>
  );
}

// Same blocks and heights as PropertyDetail, so the modal does not resize
// when the property arrives
function DetailSkeleton() {
  return (
    <>
      <p className='visually-hidden' role='status'>
        Cargando propiedad...
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
      <NavLink to='/'>Volver al listado</NavLink>
    </div>
  );
}

function PropertyDetail({ property }: { property: Property }) {
  const { title, address, location, price, area, owner } = property;

  const stats = [
    { label: 'Precio', value: formatPrice(price) },
    { label: 'Superficie', value: area ? formatArea(area) : '—' },
    {
      label: 'Precio por pie²',
      value: area ? formatPricePerArea(price, area) : '—',
    },
    { label: 'Tipo', value: PROPERTY_TYPE_LABELS[property.type] },
    { label: 'Operación', value: PROPERTY_STATUS_LABELS[property.status] },
    {
      label: 'Publicada',
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
            {property.isActive ? 'Activa' : 'Inactiva'}
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
          <h3>Contacto</h3>
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
      <img src={photos[index]} alt={`Foto ${index + 1} de ${title}`} />
      {hasMany && (
        <>
          <button
            type='button'
            className='prev'
            onClick={() => move(-1)}
            aria-label='Foto anterior'
          >
            <ChevronLeft />
          </button>
          <button
            type='button'
            className='next'
            onClick={() => move(1)}
            aria-label='Foto siguiente'
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
        <h3>Descripción</h3>
        <span>
          Actualizada el{' '}
          {format(new Date(updatedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </span>
      </div>
      <p>{visible}</p>
      {isLong && (
        <button
          type='button'
          className='link'
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Leer menos' : 'Leer más'}
        </button>
      )}
    </section>
  );
}
