import { useEffect, useState, useContext } from "react";

// Import Pages
import Main from "../components/Main";
import SignIn from "../components/SignIn";

import Web3Context from "../context/web3/Web3Context";
import UserContext from "../context/user/UserContext";

const App = () => {
  const {web3Loading, address, web3Provider, connect, disconnect, web3Modal, provider, removeListeners, contract } = useContext(Web3Context);
  const {userExists, userLoading, loggedInUser, loginUser, resetUser, createUser} = useContext(UserContext);

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

  const createUserHandler = async(e) => {
    createUser(address, web3Provider)
  }

  useEffect(() => {
    if (address && address!==loggedInUser) {
      resetUser();
      loginUser(address);
    }
  }, [address, loggedInUser])

  return (    
    <>
      { (address && loggedInUser == address) ?  (
        <Main address={address} />
      ) : 
        (<SignIn
          web3Loading={web3Loading}
          web3Provider={web3Provider}
          connectHandler={connectHandler}
          disconnectHandler={disconnectHandler}
          userExists={userExists}
          userLoading={userLoading}
          createUserHandler={createUserHandler}
        />)
      }
    </>
  );
};

export default App;
