// import { useSelector, useDispatch } from 'react-redux';
// import { ModalState } from '../../types/modal';

import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Property } from '../../types/property';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './ModalDetail.scss';

export default function ModalDetail() {
  const [data, setData] = useState<Property | null>(null);
  const params = useParams();
  console.log(params);

  if (!params.id) return;

  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  useEffect(() => {
    console.log(properties);
    const property = properties.find((element) => element.id === params.id);
    if (property) setData(property);
  }, []);

  return (
    <div className='overlay'>
      <NavLink to='/' className='back'></NavLink>
      <div className='modal-wrapper'>
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
              Publicada{' '}
              {formatDistanceToNow(new Date(data.createdAt), {
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
