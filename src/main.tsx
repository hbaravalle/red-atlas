import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import ModalDetail from './components/ModalDetail';
import ModalCreate from './components/ModalCreate';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='/detail/:id' element={<ModalDetail />} />
            <Route path='/create' element={<ModalCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
