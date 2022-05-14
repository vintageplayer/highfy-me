import '../styles/globals.css'
// Import Context
import UserState from "../context/user/UserState";

function MyApp({ Component, pageProps }) {
  return (
    <UserState>
      <Component {...pageProps} />
    </UserState>
  )
}

export default MyApp
