//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
//import {UserProvider} from './context/UserContext';

createRoot(document.getElementById('root')).render(
 //enable when deploying
  // <StrictMode>
    //<UserProvider>
    <App />
   // </UserProvider>
 // </StrictMode>,
)
