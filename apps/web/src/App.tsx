import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { Toaster, type ToasterProps } from 'react-hot-toast';
import Nav from './components/Nav';
import PropertyList from './components/PropertyList';

import './App.scss';

// Lazy: MapLibre is most of the bundle
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
      <Toaster toastOptions={TOAST_OPTIONS} />
    </>
  );
}

// Same corners and shadow as the panels
const TOAST_OPTIONS: ToasterProps['toastOptions'] = {
  style: {
    padding: '12px 16px',
    maxWidth: 420,
    borderRadius: 6,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 25px 0px',
    color: '#000',
    fontSize: 14,
    lineHeight: 1.4,
  },
  // Errors can list several problems
  error: { duration: 6000 },
};

export default App;
