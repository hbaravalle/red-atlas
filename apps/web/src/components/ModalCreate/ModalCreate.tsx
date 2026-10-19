import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { X } from 'react-feather';
import toast from 'react-hot-toast';
import {
  useCreatePropertyMutation,
  type QueryError,
} from '../../redux/propertiesApi';
import './ModalCreate.scss';
import {
  PROPERTY_TYPES,
  type PropertyStatus,
  type PropertyType,
} from '@red-atlas/shared';
import { PROPERTY_TYPE_LABELS } from '../../lib/labels';

interface FormValues {
  title: string;
  address: string;
  price: number;
  description: string;
  images: string[];
  type: PropertyType;
  status: PropertyStatus;
  area: string;
  ownerName: string;
  contact: string;
  isActive: boolean;
  location: {
    lat: string;
    lng: string;
  };
}

const isQueryError = (error: unknown): error is QueryError =>
  typeof error === 'object' &&
  error !== null &&
  'status' in error &&
  'message' in error;

export default function ModalCreate() {
  const [createProperty, { isLoading: isSaving }] =
    useCreatePropertyMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Detiene la propagación del clic al overlay
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      // The mutation invalidates the cached lists, so the page and sort on
      // screen reload on their own
      await createProperty(data).unwrap();
      toast.success('Propiedad creada exitosamente');
      handleClose();
    } catch (error) {
      // A 400 carries the API's reason, e.g. a missing required field
      const reason =
        isQueryError(error) && error.status === 400 ? `: ${error.message}` : '';
      toast.error(`Error al crear la propiedad${reason}`);
    }
  };

  return (
    <div className='modal-create' onClick={handleClose}>
      <div
        className='modal-wrapper'
        role='dialog'
        aria-modal='true'
        aria-labelledby='create-title'
        onClick={handleModalClick}
      >
        <header className='topbar'>
          <h2 id='create-title'>Nueva propiedad</h2>
          <button
            type='button'
            className='close'
            onClick={handleClose}
            aria-label='Cerrar'
          >
            <X />
          </button>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Only the fields scroll; the actions below stay in view */}
          <div className='fields'>
            <div className='form-group'>
              <label htmlFor='title'>Título</label>
              <input
                id='title'
                type='text'
                {...register('title', { required: 'El título es obligatorio' })}
              />
              {errors.title && (
                <span className='error'>{errors.title.message}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='address'>Dirección</label>
              <input
                id='address'
                type='text'
                {...register('address', {
                  required: 'La dirección es obligatoria',
                })}
              />
              {errors.address && (
                <span className='error'>{errors.address.message}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='price'>Precio</label>
              <input
                id='price'
                type='number'
                {...register('price', {
                  required: 'El precio es obligatorio',
                })}
              />
              {errors.price && (
                <span className='error'>{errors.price.message}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='description'>Descripción</label>
              <textarea id='description' {...register('description')}></textarea>
              {errors.description && (
                <span className='error'>{errors.description.message}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <div className='form-group'>
                <label htmlFor='latitude'>Latitud</label>
                <input
                  id='latitude'
                  type='number'
                  step='any' // Permite números decimales
                  {...register('location.lat', {})}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='longitude'>Longitud</label>
                <input
                  id='longitude'
                  type='number'
                  step='any' // Permite números decimales
                  {...register('location.lng', {})}
                />
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='image'>Link de la imagen</label>
              <input
                id='image'
                type='text'
                {...register('images', {
                  setValueAs: (value: string) => (value ? [value] : []), // Convierte el valor en un array si no está vacío
                })}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='area'>Área</label>
              <input id='area' type='text' {...register('area')} />
            </div>

            {/* Tipo de propiedad con Radio buttons */}
            <div className='form-group'>
              <label>Tipo de propiedad</label>
              <div className='radiobtn-group'>
                {/* One option per shared type: a new type shows up here on its own */}
                {PROPERTY_TYPES.map((type) => (
                  <label htmlFor={`type-${type}`} key={type}>
                    <input
                      id={`type-${type}`}
                      type='radio'
                      value={type}
                      {...register('type', {
                        required: 'El tipo de propiedad es obligatorio',
                      })}
                    />
                    {PROPERTY_TYPE_LABELS[type]}
                  </label>
                ))}
              </div>
              {errors.type && (
                <span className='error'>{errors.type.message}</span>
              )}
            </div>

            {/* Estado con Radio buttons */}
            <div className='form-group'>
              <label>Estado</label>
              <div className='radiobtn-group'>
                <label htmlFor='status-rent'>
                  <input
                    id='status-rent'
                    type='radio'
                    value='rent'
                    {...register('status', {
                      required: 'El estado es obligatorio',
                    })}
                  />
                  Rentar
                </label>
                <label htmlFor='status-sale'>
                  <input
                    id='status-sale'
                    type='radio'
                    value='sale'
                    {...register('status', {
                      required: 'El estado es obligatorio',
                    })}
                  />
                  Vender
                </label>
              </div>
            </div>

          </div>

          <footer className='actions'>
            <button type='button' className='cancel' onClick={handleClose}>
              Cancelar
            </button>
            {/* Disabled while saving, so a double click does not create two */}
            <button type='submit' disabled={isSaving}>
              {isSaving ? 'Creando...' : 'Crear propiedad'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
