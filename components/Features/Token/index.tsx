import { Button, Card, Container, styled, Text } from "@nextui-org/react";
import React, { FC, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TESTNET_TOKENS } from "../../../constants";
import { type WalletStateType } from "../../../redux";
import { createOrder, type Transaction } from "../../../services/order";
import { TransferRecord, TransferSettings } from "../../../typing";
import AddrList from "./AddrList";
import TransferSetting from "./TransferSetting";

const TokenFeatureWrap = styled(Container, {});

const TokenSelectCard = styled(Card, {
  margin: '$8 0'
});

const FeatureToken: FC = () => {
  const state = useSelector((state) => state );
  const { address } = state as WalletStateType;
  const [records, setRecords] = useState<TransferRecord[]>([]);
  const settings = useRef<TransferSettings>({
    token: 'ETH',
    orderGasType: '',
  });
  
  const canPlaceOrder = useMemo(() => {
    return records.length > 0;
  }, [records]);
  
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

  const handleSettingChange = (params: TransferSettings) => {
    settings.current = { ...params };
  };

  const handlePlaceOrder = async () => {
    const txn: Transaction[] = records.map(item => ({
      amount: item.amount,
      contract: TESTNET_TOKENS[settings.current.token],
      from: address || '',
      gas_paid_amount: '',
      gas_paid_status: '',
      gas_used: '',
      status: '',
      to: item.address
    }));
  
    const data = {
      order_create_addr: address || '',
      order_gas_type: 'ntom',
      transactions: txn,
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
    <TokenFeatureWrap xs>
      <TransferSetting onChange={handleSettingChange}/>
      <TokenSelectCard>
        <Card.Header>
          <Text h5>接收地址</Text>
        </Card.Header>
        <AddrList
          data={records}
          onAmountChange={handleAmountChange}
          onRowDelete={handleDelRecord}
          onRowAdd={handleAddRecord}
        >
          <Button
            size="md"
            color="secondary"
            disabled={!canPlaceOrder}
            auto
            css={{ width: "100%" }}
            onPress={handlePlaceOrder}
          >
            确认转账
          </Button>
        </AddrList>
      </TokenSelectCard>
    </TokenFeatureWrap>
  );
};

export default FeatureToken;
