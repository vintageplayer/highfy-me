import { useEffect, useState, useContext } from "react";
import { useToast } from "@chakra-ui/core";
import dynamic from 'next/dynamic'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

const DynamicComponent = dynamic(() => import('../components/test'), { ssr: false })

// Import Pages
import Main from "../components/Main";
import SignIn from "../components/SignIn";
import NavigationBar from "../components/NavigationBar";

import Web3Context from "../context/web3/Web3Context";
import UserContext from "../context/user/UserContext";

const App = () => {
    const { web3DisplayMessage, web3Loading, address, web3Provider, connect, disconnect, web3Modal, provider, removeListeners, contract } =
        useContext(Web3Context);
    const {
        userDisplayMessage,
        message,
        userCredits,
        userExists,
        userLoading,
        loggedInUser,
        loginUser,
        resetUser,
        createUser,
        isGasless,
        createUserGasless,
    } = useContext(UserContext);
    

    const connectHandler = async (e) => {
        await connect();
    };

    const disconnectHandler = async (e) => {
        disconnect();
    };

    // Auto connect to the cached provider
    useEffect(() => {
        if (web3Modal && web3Modal.cachedProvider) {
            connect();
        }
    }, [web3Modal]);

    useEffect(() => {
        if (provider?.on) {
            // Subscription Cleanup
            return () => {
                if (provider.removeListener) {
                    removeListeners;
                }
            };
        }
    }, [provider, disconnect]);

    const createUserHandler = async (e) => {
        if (!isGasless) {
            createUser(address, contract);
        } else {
            createUserGasless(address, web3Provider);
        }
    };

    useEffect(() => {
        if (address && address !== loggedInUser) {
            resetUser();
            loginUser(address);
        }
    }, [address, loggedInUser]);

    return (
        <>
            {address && loggedInUser == address ? (
                <>
                    <NavigationBar disconnectHandler={disconnectHandler} address={address} credits={userCredits} />
                    <Main address={address} />
                </>
            ) : (
                <SignIn
                    web3Loading={web3Loading}
                    web3Provider={web3Provider}
                    connectHandler={connectHandler}
                    disconnectHandler={disconnectHandler}
                    userExists={userExists}
                    userLoading={userLoading}
                    createUserHandler={createUserHandler}
                    web3DisplayMessage={web3DisplayMessage}
                    userDisplayMessage={userDisplayMessage}
                />
            )}
            <DynamicComponent/>
        </>
    );
};

export default App;
