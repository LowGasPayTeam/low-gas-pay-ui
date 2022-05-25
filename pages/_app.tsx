import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient } from 'wagmi'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TopHeader from '../components/TopHeader';

const client = createClient()

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={darkTheme}>
        <TopHeader />
        <Component {...pageProps} />
      </ThemeProvider>
    </WagmiConfig>
  )
}

export default MyApp
