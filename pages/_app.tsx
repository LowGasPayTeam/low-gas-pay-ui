import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper, store } from "../redux";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TopHeader from '../components/TopHeader';
import { Provider } from 'react-redux';
import { createClient, WagmiConfig } from 'wagmi'

const client = createClient()
const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
          <TopHeader />
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </WagmiConfig>
  )
}

export default wrapper.withRedux(MyApp);
