import { Button, Card, Col, Container, Input, Row, styled, Table, Text } from "@nextui-org/react";
import React, { FC, useMemo, useRef, useState } from "react";
import { TransferRecord } from "../../../typing";
import AddrList from "./AddrList";
import TransferSetting from "./TransferSetting";

const TokenFeatureWrap = styled(Container, {});

const TokenSelectCard = styled(Card, {
  margin: '$8 0'
});

const FeatureToken: FC = () => {
  const [records, setRecords] = useState<TransferRecord[]>([
  ]);

  const canPlaceOrder = useMemo(() => {
    return false;
  }, []);
  
  const handleAmountChange = (index: number, amount: string | number) => {
    setRecords(records => {
      records[index].amount = amount?.toString();
      return [...records];
    });
  }
  const handleAddRecord = (addr: string) => {
    const newRecord: TransferRecord = {
      id: records.length,
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

  const handlePlaceOrder = () => {
  }
  return (
    <TokenFeatureWrap xs>
      <TransferSetting />
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
