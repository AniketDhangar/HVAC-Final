import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './Components/Reduxwork/store.js'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <HelmetProvider>
          <Suspense>
            <App />
          </Suspense>
        </HelmetProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>



  ,
)
