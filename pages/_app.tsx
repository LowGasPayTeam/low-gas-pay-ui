import type { AppProps } from 'next/app'
import { wrapper, store } from "../redux";
import { Provider } from 'react-redux';
import { createClient, WagmiConfig } from 'wagmi'
import Navigation from '../components/Navigation';
import { ToastContainer } from 'react-toastify';
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const client = createClient()

const theme = extendTheme({
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
    },
    styles: {
      light: {
        body: {
          bg: 'gray.100',
        },
      },
    },
  },
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
