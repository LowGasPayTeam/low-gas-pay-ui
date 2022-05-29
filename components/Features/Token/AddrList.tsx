import {
  Button,
  Col,
  Input,
  Row,
  styled,
  Table,
  Text,
} from "@nextui-org/react";
import React, { FC, useState } from "react";
import { TransferRecord } from "../../../typing";

interface PropTypes {
  data: TransferRecord[];
  onAmountChange: (index: number, value: string | number) => void;
  onRowAdd: (addr: string) => void;
  onRowDelete: (index: number) => void;
  children: any
}

const AddrList: React.FC<PropTypes> = ({ 
  data, 
  onAmountChange,
  onRowAdd,
  onRowDelete,
  children,
}) => {
  const columns = [
    { name: "ADDRESS", uid: "address" },
    { name: "AMOUNT", uid: "amount" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const [newAddr, setNewAddr] = useState('');

  const handleAddrChange = (addr: string) => {
    setNewAddr(addr);
  }

  return (
    <>
      <Row css={{ mb: "$8" }}>
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
            placeholder="转账地址"
          />
        </Col>
        <Col span={3}>
          <Button
            size="md"
            auto
            css={{ ml: "$8" }} 
            onPress={() => {
              onRowAdd(newAddr);
              setNewAddr('');
            }}
            disabled={!newAddr}
          >
            添加地址
          </Button>
        </Col>
        <Col span={3}>
          { children }
        </Col>
      </Row>
      <Table
        bordered
        shadow={false}
        aria-label="Transfer Record"
        selectionMode="none"
        css={{ height: "auto", minWidth: "100%" }}
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
        <Table.Body>
          {data.map((record: TransferRecord, index) => (
            <Table.Row key={record.id}>
              <Table.Cell>
                <Text size={14} css={{ minWidth: "200px" }}>
                  {record.address}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Input
                  className="fixed-table-input-bug"
                  aria-label="amount"
                  aria-labelledby="amount"
                  value={record.amount}
                  fullWidth
                  type="number"
                  onChange={(e) =>
                    onAmountChange(index, e.target.value)
                  }
                  placeholder="数量"
                />
              </Table.Cell>
              <Table.Cell>
                <div style={{ width: "60px" }}>
                  <Button light color="error" auto onPress={() => onRowDelete(index)}>
                    删除
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default AddrList;
