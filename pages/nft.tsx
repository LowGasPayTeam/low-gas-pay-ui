import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, Heading, Container, styled, useToast, Text, Box, HStack, Switch, Spacer } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { daysToWeeks } from 'date-fns';
import dayjs from 'dayjs';
import { WalletStateType } from '../redux';
import { TransferRecord } from '../typing';
import ReceiveBox from '../components/Features/NFT/ReceiveBox';
import NFTList from '../components/Features/NFT/NFTList';

const NFTSettings = styled('div', {
  width: 400
});

const NFTMain: NextPage = () => {
  const [isRecharge, setIsRecharge] = useState(false);
  const state = useSelector((state) => state );
  const { address } = state as WalletStateType;


  // Gas 代扣模式变化
  const onFeeModeChagne = (e: any) => {
    setIsRecharge(e.target.checked);
  };

  const onAmountChange = () => {}
  const onRowAdd = (addr: string) => {};
  const onRowDelete = (index: number) => {};
  return (
    <>
      <Head>
        <title>MetaGas - NFT</title>
        <meta name="description" content="MetaGas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="8xl" centerContent>
        <HStack spacing="24px" align="flex-start" w="full">
          <NFTSettings>
            <Box
              w={800}
              borderWidth="1px"
              p={6}
              borderRadius="xl"
              bg="white"
              mb={6}
            >
              <HStack mb={2}>
                <Text>使用充值 Gas Fee</Text>
                <Switch
                  checked={isRecharge}
                  onChange={onFeeModeChagne}
                  colorScheme="brand"
                />
              </HStack>
              <HStack>
                <Button disabled w={120} variant="outline" colorScheme="brand">
                  充值
                </Button>
                <Spacer />
                <Text fontSize="xs" color="gray.600">
                  余额: {0}
                </Text>
              </HStack>
            </Box>
            <ReceiveBox
              data={[]}
              onAmountChange={onAmountChange}
              onRowAdd={onRowAdd}
              onRowDelete={onRowDelete}
            />
          </NFTSettings>
          <NFTList />
        </HStack>
      </Container>
    </>
  );
}

export default NFTMain;
