import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TopHeader from '../components/TopHeader';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <TopHeader />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
