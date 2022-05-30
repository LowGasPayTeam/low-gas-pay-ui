import type { NextPage } from 'next'
import Head from 'next/head'
import { Container, Row, Col, Button, styled } from '@nextui-org/react';
import { useState } from 'react';
import FeatureSwitch, { ActiveTab } from '../components/Features/FeatureSwitch';
import FeatureToken from '../components/Features/Token';
import FeatureNFT from '../components/Features/NFT';

const MainWrap = styled('div', {
  minHeight: 'calc(100vh - 72px)'
});

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Token');
  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
  }
  return (
    <MainWrap>
      <Head>
        <title>Low Gas Fee</title>
        <meta name="description" content="Low Gas Fee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <FeatureSwitch active={activeTab} onChange={handleTabClick} />
        { activeTab === 'Token' && <FeatureToken />}
        { activeTab === 'NFT' && <FeatureNFT />}
      </Container>
    </MainWrap>
  )
}

export default Home
