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
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyStatus,
  type PropertyType,
} from '@red-atlas/shared';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';

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
    e.stopPropagation();
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
      // The mutation invalidates the cached lists, so the list reloads itself
      await createProperty(data).unwrap();
      toast.success('Property created');
      handleClose();
    } catch (error) {
      // A 400 carries the API's reason
      const reason =
        isQueryError(error) && error.status === 400 ? `: ${error.message}` : '';
      toast.error(`Couldn't create the property${reason}`);
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
          <h2 id='create-title'>New property</h2>
          <button
            type='button'
            className='close'
            onClick={handleClose}
            aria-label='Close'
          >
            <X />
          </button>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Only the fields scroll */}
          <div className='fields'>
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input
                id='title'
                type='text'
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <span className='error'>{errors.title.message}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='address'>Address</label>
              <input
                id='address'
                type='text'
                {...register('address', {
                  required: 'Address is required',
                })}
              />
              {errors.address && (
                <span className='error'>{errors.address.message}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='price'>Price</label>
              <input
                id='price'
                type='number'
                {...register('price', {
                  required: 'Price is required',
                })}
              />
              {errors.price && (
                <span className='error'>{errors.price.message}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea id='description' {...register('description')}></textarea>
              {errors.description && (
                <span className='error'>{errors.description.message}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <div className='form-group'>
                <label htmlFor='latitude'>Latitude</label>
                <input
                  id='latitude'
                  type='number'
                  step='any'
                  {...register('location.lat', {
                    required: 'Latitude is required',
                  })}
                />
                {errors.location?.lat && (
                  <span className='error'>{errors.location.lat.message}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='longitude'>Longitude</label>
                <input
                  id='longitude'
                  type='number'
                  step='any'
                  {...register('location.lng', {
                    required: 'Longitude is required',
                  })}
                />
                {errors.location?.lng && (
                  <span className='error'>{errors.location.lng.message}</span>
                )}
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='image'>Image URL</label>
              <input
                id='image'
                type='text'
                {...register('images', {
                  setValueAs: (value: string) => (value ? [value] : []),
                })}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='area'>Area (sq ft)</label>
              <input id='area' type='text' {...register('area')} />
            </div>

            <div className='form-group'>
              <label>Property type</label>
              <div className='radiobtn-group'>
                {/* One option per shared type */}
                {PROPERTY_TYPES.map((type) => (
                  <label htmlFor={`type-${type}`} key={type}>
                    <input
                      id={`type-${type}`}
                      type='radio'
                      value={type}
                      {...register('type', {
                        required: 'Property type is required',
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

            <div className='form-group'>
              <label>Listing</label>
              <div className='radiobtn-group'>
                {PROPERTY_STATUSES.map((status) => (
                  <label htmlFor={`status-${status}`} key={status}>
                    <input
                      id={`status-${status}`}
                      type='radio'
                      value={status}
                      {...register('status', {
                        required: 'Listing is required',
                      })}
                    />
                    {PROPERTY_STATUS_LABELS[status]}
                  </label>
                ))}
              </div>
              {errors.status && (
                <span className='error'>{errors.status.message}</span>
              )}
            </div>

          </div>

          <footer className='actions'>
            <button type='button' className='cancel' onClick={handleClose}>
              Cancel
            </button>
            {/* Disabled while saving, so a double click creates only one */}
            <button type='submit' disabled={isSaving}>
              {isSaving ? 'Creating...' : 'Create property'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
