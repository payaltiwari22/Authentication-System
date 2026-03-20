import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="327506233428-g7mu1468ik4cq39immlhrtksm61haocr.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
