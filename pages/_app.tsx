import type { AppProps } from 'next/app'
import { wrapper, store } from "../redux";
import { Provider } from 'react-redux';
import { createClient, WagmiConfig } from 'wagmi'
import Navigation from '../components/Navigation';
import { ToastContainer } from 'react-toastify';
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'

const client = createClient()

const theme: ThemeConfig = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        _light: 'gray.100',
    },
    }
  },
  colors: {
    brand: {
      "50": "#FBECEA",
      "100": "#F3CBC4",
      "200": "#EBA99D",
      "300": "#E38877",
      "400": "#DC6651",
      "500": "#D4452B",
      "600": "#AA3722",
      "700": "#7F291A",
      "800": "#551B11",
      "900": "#2A0E09"
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Navigation />
          <Component {...pageProps} />
          <ToastContainer />
        </ChakraProvider>
      </Provider>
    </WagmiConfig>
  )
}

export default wrapper.withRedux(MyApp);
