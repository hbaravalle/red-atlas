import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Nav from './components/Nav';
import PropertyList from './components/PropertyList';

import './App.scss';

// MapLibre is most of the bundle, so the list renders before it loads
const InteractiveMap = lazy(() => import('./components/InteractiveMap'));

function App() {
  return (
    <>
      <Suspense fallback={<div className='map-container' />}>
        <InteractiveMap />
      </Suspense>
      <Nav />
      <PropertyList />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
