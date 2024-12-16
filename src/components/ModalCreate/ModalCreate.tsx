import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchProperties } from '../../redux/propertiesSlice';
import { AppDispatch } from '../../redux/store';
import './ModalCreate.scss';

interface FormValues {
  title: string;
  address: string;
  price: number;
  description: string;
  image: string[];
  type: string;
  status: string;
  area: string;
  ownerName: string;
  contact: string;
  isActive: boolean;
  location: {
    lat: string;
    lng: string;
  };
}

export default function ModalCreate() {
  const dispatch = useDispatch<AppDispatch>();
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

  const onSubmit = async (data: FormValues) => {
    console.log('Datos de la nueva propiedad:', data);
    try {
      const response = await fetch(
        'https://api-red-atlas-livid.vercel.app/api/properties',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success('Propiedad creada exitosamente');
        dispatch(fetchProperties());
        handleClose();
      } else {
        toast.error('Error al crear la propiedad');
      }
    } catch (error) {
      toast.error('Error al crear la propiedad');
    }
  };

  return (
    <div className='modal-create' onClick={handleClose}>
      <div className='modal-wrapper' onClick={handleModalClick}>
        <h2>Nueva propiedad</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register('image', {
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
              <label htmlFor='type-apartment'>
                <input
                  id='type-apartment'
                  type='radio'
                  value='apartment'
                  {...register('type', {
                    required: 'El tipo de propiedad es obligatorio',
                  })}
                />
                Apartamento
              </label>
              <label htmlFor='type-house'>
                <input
                  id='type-house'
                  type='radio'
                  value='house'
                  {...register('type', {
                    required: 'El tipo de propiedad es obligatorio',
                  })}
                />
                Casa
              </label>
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

          <div className='actions'>
            <button type='submit'>Crear propiedad</button>
            <button type='button' className='cancel' onClick={handleClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
