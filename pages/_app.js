import '../styles/globals.css'
// Import Context
import Web3State from "../context/web3/Web3State";
import UserState from "../context/user/UserState";
import {ThemeProvider, CSSReset} from '@chakra-ui/core';

function MyApp({ Component, pageProps }) {
  return (
    <Web3State>
      <UserState>
        <ThemeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ThemeProvider>
      </UserState>
    </Web3State>
  )
}

export default MyApp
