import '../styles/globals.css'

import { UserProvider } from '@auth0/nextjs-auth0';
import Navbar from '../components/navbar.js'

function MyApp({ Component, pageProps }) {
  return(
    <UserProvider>
      <Navbar/>
      <Component {...pageProps} />
    </UserProvider>
  ) 
}

export default MyApp
