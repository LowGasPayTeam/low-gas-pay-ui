import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper, store } from "../redux";
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { createClient, WagmiConfig } from 'wagmi'
import Navigation from '../components/Navigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const client = createClient()

const lightTheme = createTheme({
  type: 'light',
})

const darkTheme = createTheme({
  type: 'dark',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Provider store={store}>
        <NextThemesProvider
          defaultTheme="system"
          attribute="class"
          value={{
            light: lightTheme.className,
            dark: darkTheme.className
          }}
        >
          <NextUIProvider>
            <Navigation />
            <Component {...pageProps} />
            <ToastContainer />
          </NextUIProvider>
        </NextThemesProvider>
      </Provider>
    </WagmiConfig>
  )
}

export default wrapper.withRedux(MyApp);
