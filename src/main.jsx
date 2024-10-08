
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {UserProvider} from '../src/Contaxt/contaxt.jsx'
import { ToastContainer } from 'react-toastify'
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')).render(

    <>
<CookiesProvider defaultSetOptions={{ path: '/' }}>
<UserProvider>
    <App />
</UserProvider>
<ToastContainer autoClose={2000} />
</CookiesProvider>
    </>
)
