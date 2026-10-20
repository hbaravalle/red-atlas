import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import ModalDetail from './components/ModalDetail';
import './index.scss';

// Lazy: the form brings Zod
const ModalCreate = lazy(() => import('./components/ModalCreate'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='/detail/:id' element={<ModalDetail />} />
            <Route
              path='/create'
              element={
                <Suspense>
                  <ModalCreate />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
