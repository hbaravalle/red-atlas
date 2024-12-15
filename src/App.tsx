import InteractiveMap from './components/InteractiveMap';
import Nav from './components/Nav';
import PropertyList from './components/PropertyList';
import { Outlet } from 'react-router';

import './App.scss';

function App() {
  return (
    <>
      <InteractiveMap />
      <Nav />
      <PropertyList />
      <Outlet />
    </>
  );
}

export default App;
