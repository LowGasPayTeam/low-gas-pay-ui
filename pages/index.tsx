import styled from '@emotion/styled';
import type { NextPage } from 'next'
import Head from 'next/head'

const MainWrap = styled('div')({
  minHeight: 'calc(100vh)'
});
const Home: NextPage = () => {
  return (
    <MainWrap>
      <Head>
        <title>Low Gas Fee</title>
        <meta name="description" content="Low Gas Fee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      </main>
    </MainWrap>
  )
}

export default Home
