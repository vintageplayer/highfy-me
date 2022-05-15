import {useReducer} from 'react';
import Web3Context from "./Web3Context";
import Web3Reducer, {initialState} from "./Web3Reducer";
import { providers } from 'ethers';

import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletLink from 'walletlink';

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
  'custom-walletlink': {
    display: {
      logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      name: 'Coinbase',
      description: 'Connect to Coinbase Wallet (not Coinbase App)',
    },
    options: {
      appName: 'Coinbase', // Your app name
      networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1,
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName,
      })
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
      await provider.enable()
      return provider
    },
  },
}

const Web3State = (props) => {
	const [state, dispatch] = useReducer(Web3Reducer, initialState);

	const handleAccountsChanged = (accounts) => {
		// eslint-disable-next-line no-console
		console.log('accountsChanged', accounts)
		dispatch({
		  type: 'SET_ADDRESS',
		  address: accounts[0],
		})
	}

	// https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
	const handleChainChanged = (_hexChainId) => {
		window.location.reload()
	}

	const handleDisconnect = (error) => {
		// eslint-disable-next-line no-console
		console.log('disconnect', error)
		disconnect()
	}

	const connect = async () => {
		if (typeof window !== 'undefined' && !state.web3Modal) {
			state.web3Modal = new Web3Modal({
				network: 'mainnet', // optional
				cacheProvider: true,
				providerOptions: providerOptions, // required
			})
		}

		const provider = await state.web3Modal.connect()
		const web3Provider = new providers.Web3Provider(provider)
		const signer = web3Provider.getSigner()
		const address = await signer.getAddress()
		const network = await web3Provider.getNetwork()

		provider.on('accountsChanged', handleAccountsChanged)
		provider.on('chainChanged', handleChainChanged)
		provider.on('disconnect', handleDisconnect)

		dispatch({
		  type: 'SET_WEB3_PROVIDER',
		  provider,
		  web3Provider,
		  address,
		  chainId: network.chainId,
		})
	};

	const removeListeners = () => {
		provider.removeListener('accountsChanged', handleAccountsChanged)
		provider.removeListener('chainChanged', handleChainChanged)
		provider.removeListener('disconnect', handleDisconnect)
	}

	const disconnect = async () => {
	  await state.web3Modal.clearCachedProvider()
	  if (state.provider?.disconnect && typeof state.provider.disconnect === 'function') {
	    await state.provider.disconnect();
	  }
	  dispatch({
	    type: 'RESET_WEB3_PROVIDER',
	  })
	}

	return (
		<Web3Context.Provider
			value={{
				provider: state.provider,
				web3Provider: state.web3Provider,
				address: state.address,
				chainId: state.chainId,
				web3Modal: state.web3Modal,
				connect,
				disconnect
			}}
		>
			{props.children}
		</Web3Context.Provider>
		)
}

export default Web3State;