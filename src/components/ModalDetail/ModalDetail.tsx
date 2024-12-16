import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate, NavLink } from 'react-router';
import { Property } from '../../types/property';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './ModalDetail.scss';
import { useSelector } from 'react-redux';

export default function ModalDetail() {
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );
  const params = useParams();
  const navigate = useNavigate();

  const fetchPropertyData = async () => {
    try {
      const response = await fetch(
        `https://api-red-atlas-livid.vercel.app/api/properties/${params.id}`
      );
      if (!response.ok) {
        throw new Error('Error al cargar la propiedad');
      }
      const property = await response.json();
      setData(property);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existingProperty = properties.find(
      (property) => property._id === params.id
    );

    if (existingProperty) {
      // Si la propiedad ya existe en el estado global, la usa directamente
      setData(existingProperty);
      setLoading(false); // Se marca como cargada
    } else {
      // Si no, realiza el fetch para obtenerla
      fetchPropertyData();
    }
  }, [params.id, properties]);

  const handleClose = () => {
    navigate('/');
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Detiene la propagación del clic al overlay
  };

  return (
    <div className='modal-detail' onClick={handleClose}>
      <NavLink to='/' className='back'></NavLink>
      <div className='modal-wrapper' onClick={handleModalClick}>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <h2 className='title'>{data?.title}</h2>
            <p className='address'>{data?.address}</p>
            <div className='pills'>
              <span className='status'>{data?.status}</span>{' '}
              <span className='type'>{data?.type}</span>{' '}
              <span className='isActive'>{data?.isActive}</span>
            </div>

            <p className='price'>{data?.price}</p>
            <p className='area'>{data?.area} pie²</p>

            <p className='createdAt'>
              {data?.createdAt &&
                formatDistanceToNow(new Date(data?.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
            </p>
            <p>Contacto: John Doe - johndoe@example.com</p>
          </>
        )}
      </div>
    </div>
  );
}
