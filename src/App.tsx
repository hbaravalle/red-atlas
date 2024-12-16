import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
import InteractiveMap from './components/InteractiveMap';
import Nav from './components/Nav';
import PropertyList from './components/PropertyList';

import './App.scss';

function App() {
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
