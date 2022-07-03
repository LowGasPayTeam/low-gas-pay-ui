import type { NextPage } from 'next'
import Head from 'next/head'
import { Container, HStack } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { WalletStateType } from '../redux';
import { TransferNFTRecord, NFTTransferSettings } from '../typing';
import ReceiveBox from '../components/Features/NFT/ReceiveBox';
import NFTList from '../components/Features/NFT/NFTList';
import TransferSetting from '../components/Features/NFT/TransferSetting';
import { getAllowedNFTS, NFTCollection, NFTToken } from '../services/opensea';
import { createNFTOrder, NFTTransaction } from '../services/order';
import { toast } from 'react-toastify';

const NFTMain: NextPage = () => {
  const settings = useRef<NFTTransferSettings>({
    orderGasType: '',
  });
  const [records, setRecords] = useState<TransferNFTRecord[]>([]);
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [allMyCollections, setAllMyCollections] = useState<NFTCollection[]>([]);
  const [checkedNFTs, setCheckedNFTs] = useState<NFTToken[]>([]);
  const state = useSelector((state) => state );
  const { address } = state as WalletStateType;

  const handleSettingChange = (params: NFTTransferSettings) => {
    settings.current = { ...params };
  };

  const canPlaceOrder = useMemo(() => {
    const noEmpty = records.filter(r => !r.tokens.length).length === 0;
    return records.length > 0 && noEmpty;
  }, [records]);

  const onRowAdd = (addr: string) => {
    const newRecord: TransferNFTRecord = {
      tokens: [],
      address: addr
    }
    setRecords([...records, newRecord]);
  };

  const onRowDelete = (addr: string) => {
    const index = records.findIndex(r => r.address === addr);
    setRecords(records => [
      ...records.slice(0, index),
      ...records.slice(index + 1)
    ]);
  };

  const onNFTAdd = (addr: string) => {
    setRecords(rd => rd.map(r => {
      if (r.address === addr) {
        const tokens = new Set([...r.tokens, ...checkedNFTs]);
        r.tokens = Array.from(tokens);
      }
      return r;
    }));
    // 设置可选择的 NFT
    setCheckedNFTs([]);
  }

  const onNFTDrop = (addr: string, item: NFTToken) => {
    setRecords(rd => rd.map(r => {
      if (r.address === addr) {
        const tokens = new Set([...r.tokens, item]);
        r.tokens = Array.from(tokens);
      }
      return r;
    }));
    // 设置可选择的 NFT
    setCheckedNFTs(data => data.filter(d => d.name !== item.name));
  }

  const handleNFTChecked = (data: NFTToken[]) => {
    setCheckedNFTs([...data]);
  }

  const handlePlaceOrder = async () => {
    const txn: NFTTransaction[] = records.filter(
      record => record.tokens.length
    ).reduce((txns, record) => {
      const txnByRecord = record.tokens.map(token => ({
        token_id: token.id.toString(),
        token_name: token.name,
        collection_name: token.collection_name,
        token_contract: token.contract,
        from_addr: address || '',
        gas_paid_amount: '',
        gas_paid_status: '',
        gas_used: '',
        status: '',
        to_addr: record.address
      }));
      txns.push(...txnByRecord);
      return txns;
    }, [] as NFTTransaction[]);

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
      await createNFTOrder(data);
      setRecords([]);
      toast.success('订单提交成功！');
    } catch(err) {
      toast.error('订单提交失败！');
      console.log(err);
    }
  };

  useEffect(() => {
    if (!address) return;
    getAllowedNFTS(address).then(setAllMyCollections);
  }, [address]);

  useEffect(() => {
    if (records.length < 1) {
      setCollections([...allMyCollections]);
    }
    const recordsNFTS = records.reduce((arr, r) => {
      arr.push(...r.tokens);
      return arr;
    }, [] as any[]);

    setCollections(allMyCollections.map(col => {
      return {
        ...col,
        tokens: col.tokens.filter(
          token => recordsNFTS.find(r => r.name === token.name) === undefined
        ),
      }
    }));
  }, [allMyCollections, records]);

  return (
    <>
      <Head>
        <title>MetaGas - NFT</title>
        <meta name="description" content="MetaGas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="8xl" centerContent>
        <HStack spacing="24px" align="flex-start" w="full">
          <TransferSetting 
            onChange={handleSettingChange}
            canPlaceOrder={canPlaceOrder}
            onOrder={handlePlaceOrder}
          />
          <ReceiveBox
            data={records}
            onRowAdd={onRowAdd}
            onRowDelete={onRowDelete}
            onNFTAdd={onNFTAdd}
            onNFTDrap={onNFTDrop}
            hasChecked={checkedNFTs.length > 0}
          />
          <NFTList
            collections={collections}
            onNFTChecked={handleNFTChecked}
          />
        </HStack>
      </Container>
    </>
  );
}

export default NFTMain;
