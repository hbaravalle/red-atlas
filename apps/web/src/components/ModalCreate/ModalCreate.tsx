import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'react-feather';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import { useAnimatedClose } from '../../hooks/useAnimatedClose';
import {
  useCreatePropertyMutation,
  type QueryError,
} from '../../redux/propertiesApi';
import './ModalCreate.scss';
import { PROPERTY_STATUSES, PROPERTY_TYPES } from '@red-atlas/shared';
import { newProperty } from '@red-atlas/shared/schemas';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';

// Same schema as the API
type FormInput = z.input<typeof newProperty>;
type FormOutput = z.output<typeof newProperty>;

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
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(newProperty),
  });
  const { isClosing, close: handleClose, onAnimationEnd } = useAnimatedClose();

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onSubmit = async (data: FormOutput) => {
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
    <div
      className={isClosing ? 'modal-create closing' : 'modal-create'}
      onClick={handleClose}
      onAnimationEnd={onAnimationEnd}
    >
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
                {...register('title')}
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
                {...register('address')}
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
                step='any'
                {...register('price')}
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
                  {...register('location.lat')}
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
                  {...register('location.lng')}
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
              {errors.images && (
                <span className='error'>
                  {errors.images[0]?.message ?? errors.images.message}
                </span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='area'>Area (sq ft)</label>
              <input id='area' type='number' step='any' {...register('area')} />
              {errors.area && (
                <span className='error'>{errors.area.message}</span>
              )}
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
                      {...register('type')}
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
                      {...register('status')}
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
