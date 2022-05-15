export const initialState = {
  web3Loading: false,
  web3Modal: null,
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null
};

function web3Reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
        web3Loading: false,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    case 'SET_LOADING':
      return {
        ...state,
        web3Loading: true,
      }
    default:
      return state;
  }
}

export default web3Reducer;