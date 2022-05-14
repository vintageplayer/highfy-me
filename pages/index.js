import { useEffect, useState, useContext } from "react";

// Import Pages
import Main from "../components/Main";
import SignIn from "../components/SignIn";

import UserContext from "../context/user/UserContext";

const App = () => {
  const {address, web3Provider, connect, disconnect, web3Modal, provider, removeListeners } = useContext(UserContext);

  const connectHandler = async (e) => {
    await connect();
  };

  const disconnectHandler = async (e) => {  
    disconnect();
  };

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect()
    }
  }, [web3Modal])

  useEffect(() => {
    if (provider?.on) {
      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          removeListeners
        }
      }
    }
  }, [provider, disconnect])

  return (    
    <>
      {address && (
        <Main address={address} />
      )} 
        <SignIn
          web3Provider={web3Provider}
          connectHandler={connectHandler}
          disconnectHandler={disconnectHandler}
        />
      
    </>
  );
};

export default App;
