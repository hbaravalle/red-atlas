import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { Property } from '../../types/property';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './ModalDetail.scss';

export default function ModalDetail() {
  const [data, setData] = useState<Property | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  useEffect(() => {
    console.log(properties);
    const property = properties.find((element) => element.id === params.id);
    if (property) setData(property);
  }, [properties, params.id]);

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
        {!data ? (
          <p>Cargando...</p>
        ) : (
          <>
            <h2 className='title'>{data.title}</h2>
            <p className='address'>99016 Jacobi Ferry Suite 104</p>

            <div className='pills'>
              <span className='status'>{data.status}</span>{' '}
              <span className='type'>{data.type}</span>{' '}
              <span className='isActive'>{data.isActive}</span>
            </div>

            <p className='price'>{data.price}</p>
            <p className='area'>{data.area} pie²</p>

            <p className='createdAt'>
              {data.createdAt &&
                formatDistanceToNow(new Date(data.createdAt), {
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
