import '../styles/globals.css'
import {useState, useEffect} from 'react'

function MyApp({ Component, pageProps }) {

  const [signedIn, setSignedIn] = useState('signedOut') //next auth

  useEffect(() => {
    if(signedIn === 'signedIn')
    {
      console.log('signed in main')
    }
    else if(signedIn === 'signingIn')
    {
        console.log('sign in main')
        setSignedIn('signedIn')
    }
    console.log('test sign in/out main:' + signedIn)
}, [signedIn])

  return(
    <div>
      <button onClick = {() => {
      setSignedIn(signedIn === 'signedOut' ? 'signingIn' : 'signedOut')
      }}>login/out button</button>
      <Component signedIn = {signedIn} {...pageProps} />
    </div>
  ) 
}

export default MyApp
