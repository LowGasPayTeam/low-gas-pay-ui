import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper, store } from "../redux";
import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import { createClient, WagmiConfig } from 'wagmi'
import Navigation from '../components/Navigation';

const client = createClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Provider store={store}>
        <NextUIProvider>
          <Navigation />
          <Component {...pageProps} />
        </NextUIProvider>
      </Provider>
    </WagmiConfig>
  )
}

export default wrapper.withRedux(MyApp);
