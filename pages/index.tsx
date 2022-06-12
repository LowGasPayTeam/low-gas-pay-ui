import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Button, Container, HStack, styled } from '@chakra-ui/react';
import { useMemo, useRef, useState } from 'react';
import TransferSetting from '../components/Features/Token/TransferSetting';
import { useSelector } from 'react-redux';
import { WalletStateType } from '../redux';
import { TransferRecord, TransferSettings } from '../typing';
import AddrList from '../components/Features/Token/AddrList';
import { createOrder, Transaction } from '../services/order';
import { toast } from 'react-toastify';
import { TESTNET_TOKENS } from '../constants';

const Home: NextPage = () => {
  const state = useSelector((state) => state );
  const { address } = state as WalletStateType;
  const [records, setRecords] = useState<TransferRecord[]>([]);
  const [currentToken, setCurrentToken] = useState('ETH');

  const settings = useRef<TransferSettings>({
    token: 'ETH',
    orderGasType: '',
  });
  
  const canPlaceOrder = useMemo(() => {
    return records.length > 0;
  }, [records]);

  const handleSettingChange = (params: TransferSettings) => {
    settings.current = { ...params };
    setCurrentToken(settings.current.token);
  };

  const handleAmountChange = (index: number, amount: string | number) => {
    setRecords(records => {
      records[index].amount = amount?.toString();
      return [...records];
    });
  }
  const handleAddRecord = (addr: string) => {
    const newRecord: TransferRecord = {
      id: addr,
      amount: '',
      address: addr
    }
    setRecords([...records, newRecord]);
  }
  const handleDelRecord = (index: number) => {
    setRecords(records => [
      ...records.slice(0, index),
      ...records.slice(index + 1)
    ]);
  }
  const handlePlaceOrder = async () => {
    console.log(settings.current);
    const txn: Transaction[] = records.map(item => ({
      token_amount: item.amount,
      token_contract: TESTNET_TOKENS[settings.current.token],
      from_addr: address || '',
      gas_paid_amount: '',
      gas_paid_status: '',
      gas_used: '',
      status: '',
      to_addr: item.address
    }));
  
    const data = {
      order_create_addr: address || '',
      order_gas_type: 'ntom',
      transactions: txn,
      trans_gas_fee_limit: settings.current.gasLimit,
      trans_gas_fee_max: settings.current.gasPrice,
      trans_begin_time: settings.current.startDatetime ?? '',
      trans_end_time: settings.current.endDatetime ?? '',
    }
    
    try {
      const res = await createOrder(data);
      console.log(res);
      setRecords([]);
      toast.success('订单提交成功！');
    } catch(err) {
      toast.error('订单提交失败！');
      console.log(err);
    }
  }
  return (
    <>
      <Head>
        <title>MetaGas</title>
        <meta name="description" content="MetaGas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW='8xl' centerContent>
        <HStack spacing='24px' align='flex-start' w='full'>
          <TransferSetting
            onChange={handleSettingChange}
            canPlaceOrder={canPlaceOrder}
            onOrder={handlePlaceOrder}
          />
          <AddrList
            data={records}
            currentToken={currentToken}
            onAmountChange={handleAmountChange}
            onRowDelete={handleDelRecord}
            onRowAdd={handleAddRecord}
          />
        </HStack>
      </Container>
    </>
  )
}

export default Home
