import { Button, Card, Col, Container, Input, Row, styled, Table, Text } from "@nextui-org/react";
import React, { FC, useRef, useState } from "react";


interface TransferRecord {
  id: string | number;
  address: string;
  amount: number;
}

const TokenFeatureWrap = styled(Container, {});

const TokenSelectCard = styled(Card, {
  margin: '$8 0'
});

const FeatureToken: FC = () => {
  const [newAddr, setNewAddr] = useState('');
  const columns = [
    { name: "ADDRESS", uid: "address" },
    { name: "AMOUNT", uid: "amount" },
    { name: "ACTIONS", uid: "actions" },
  ];
  const [addrToAmount, setAddrToAmount] = useState<any>({
    'example': ''
  })
  const [records, setRecords] = useState<TransferRecord[]>([
      { id: 0, address: 'example', amount: 0 }
  ]);

  const handleAmountChange = (addr: string, amount: string) => {
    setAddrToAmount({
      ...addrToAmount,
      [addr]: +amount,
    })
    console.log(addr, Number(amount));
    console.log({
      ...addrToAmount,
      [addr]: Number(amount),
    });
  }

  const handleAddrChange = (addr: string) => {
    setNewAddr(addr);
  }
  const handleAddRecord = () => {
    const newRecord: TransferRecord = {
      id: records.length,
      amount: 0,
      address: newAddr
    }
    setRecords([...records, newRecord]);
    setAddrToAmount({
      ...addrToAmount,
      [newAddr]: 0,
    });
    setNewAddr('');
  }

  return (
    <TokenFeatureWrap xs>
      <TokenSelectCard>
        <Card.Header>
          <Text h5>需要转出的 Token</Text>
        </Card.Header>
        <Row css={{ padding: '$8 $0' }}>
          <Col span={4}>
            <Button bordered color="secondary">
              ETH
            </Button>
          </Col>
          <Col span={6}></Col>
          <Col span={2}>
            <Button auto>
              Approve
            </Button>
          </Col>
        </Row>
        <Card.Footer>
          余额: { 0 }
        </Card.Footer>
      </TokenSelectCard>
      <TokenSelectCard>
        <Card.Header>
          <Text h5>接收地址</Text>
        </Card.Header>
        <Row css={{ mb: '$8'}}>
          <Col span={6}>
            <Input
              value={newAddr}
              aria-label="newAddr"
              fullWidth
              size="md"
              type="text"
              onChange={(e) => {
                handleAddrChange(e.target.value);
              }}
              placeholder="转账地址" />
          </Col>
          <Col span={3}>
            <Button size="md" auto css={{ ml: '$8'}} onPress={handleAddRecord}>
              添加地址
            </Button>
          </Col>
          <Col span={3}>
            <Button
              size="md"
              auto
              css={{ width: '100%'}} 
              onPress={handleAddRecord}
            >
              确认转账
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          shadow={false}
          aria-label="Transfer Record"
          selectionMode="none"
          css={{ height: "auto", minWidth: "100%", }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={records}>
            { records.map((record: TransferRecord) => (
              <Table.Row key={record.id}>
                <Table.Cell>
                  <Text size={14} css={{ minWidth: '200px'}}>
                    {record.address}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Input
                    className="fixed-table-input-bug"
                    aria-label="amount"
                    aria-labelledby="amount"
                    value={addrToAmount[record.address]}
                    fullWidth
                    type='number'
                    onChange={(e) => handleAmountChange(record.address, e.target.value)}
                    placeholder="数量" />
                </Table.Cell>
                <Table.Cell>
                <div style={{ width: '60px' }}>
                  <Button light color="error" auto>
                    删除
                  </Button>
                </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </TokenSelectCard>
    </TokenFeatureWrap>
  );
};

export default FeatureToken;
