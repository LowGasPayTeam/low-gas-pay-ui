import { createStore, applyMiddleware, Reducer } from "redux";
import { createWrapper } from "next-redux-wrapper";

export type WalletStateType = {
  connection?: any
  provider?: any
  address?: string
  chainId?: number
}

type WalletActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      connection?: WalletStateType['provider']
      provider?: WalletStateType['provider']
      address?: WalletStateType['address']
      chainId?: WalletStateType['chainId']
    }
  | {
      type: 'SET_ADDRESS'
      address?: WalletStateType['address']
    }
  | {
      type: 'SET_CHAIN_ID'
      chainId?: WalletStateType['chainId']
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

const initialState: WalletStateType = {
  connection: null,
  provider: null,
  address: undefined,
  chainId: undefined,
}

const reducer = (
  state: WalletStateType, action: WalletActionType
) => {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        connection: action.connection,
        provider: action.provider,
        address: action.address,
        chainId: action.chainId,
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
      return initialState;
    default:
      return state;
  }
}

export const store = createStore(
  reducer as Reducer<WalletStateType, WalletActionType>,
  initialState,
);

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
