import '../styles/globals.css'
// Import Context
import UserState from "../context/user/UserState";
import {ThemeProvider, CSSReset} from '@chakra-ui/core';

function MyApp({ Component, pageProps }) {
  return (
    <UserState>
      <ThemeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </UserState>
  )
}

export default MyApp
