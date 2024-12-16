import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProperties } from './redux/propertiesSlice';
import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { Property } from './types/property';
import InteractiveMap from './components/InteractiveMap';
import Nav from './components/Nav';
import PropertyList from './components/PropertyList';

import './App.scss';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getProperties = async () => {
      const response = await fetch(
        'https://fake-api-listings.vercel.app/properties'
      );
      const data = await response.json();
      const sortedData = data.sort(
        (a: Property, b: Property) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      dispatch(setProperties(sortedData));
    };

    getProperties();
  }, []);

  return (
    <>
      <InteractiveMap />
      <Nav />
      <PropertyList />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
