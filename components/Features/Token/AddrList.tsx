import {
  Button,
  HStack,
  Input,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  TableContainer,
  TableCaption
} from "@chakra-ui/react";
import { isAddress } from "ethers/lib/utils";
import React, { PropsWithChildren, useMemo, useState } from "react";
import { TransferRecord } from "../../../typing";

interface PropTypes{
  data: TransferRecord[];
  currentToken: string;
  onAmountChange: (index: number, value: string | number) => void;
  onRowAdd: (addr: string) => void;
  onRowDelete: (index: number) => void;
}

const AddrList: React.FC<PropTypes> = ({ 
  data,
  currentToken,
  onAmountChange,
  onRowAdd,
  onRowDelete,
}) => {
  const [newAddr, setNewAddr] = useState('');

  const isValidAddr = useMemo(() => {
    const isEnsName = (/\w+(.eth)$/).test(newAddr);
    return newAddr && (isAddress(newAddr) || isEnsName);
  }, [newAddr])
  const handleAddrChange = (addr: string) => {
    setNewAddr(addr);
  }

  return (
    <VStack
      alignItems='stretch'
      align='stretch'
      flex='1'
    >
      <HStack
        p={4}
        borderWidth='1px' 
        borderRadius='xl'
        mb={2}
      >
        <Input
          id="newAddr"
          value={newAddr}
          size="md"
          type="text"
          onChange={(e) => {
            handleAddrChange(e.target.value);
          }}
          placeholder="转账地址"
        />
        <Button
          width={160}
          onClick={() => {
            onRowAdd(newAddr);
            setNewAddr('');
          }}
          disabled={!isValidAddr}
        >
          添加地址
        </Button>
      </HStack>
      <TableContainer borderWidth='1px' p={2} borderRadius='xl'>
        <Table>
          { data.length < 1 && (
            <TableCaption>
              请在上面添加需要接收的 ETH 地址或者 ENS 地址
            </TableCaption>
          )}
          <Thead>
            <Tr>
              <Th w={400}>接收地址</Th>
              <Th>接收数量</Th>
              <Th>操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((record: TransferRecord, index) => (
              <Tr key={record.id}>
                <Td>
                  <Text>
                    {record.address}
                  </Text>
                </Td>
                <Td>
                  <HStack>
                    <Input
                      value={record.amount}
                      size="sm"
                      type="number"
                      borderRadius='md'
                      onChange={(e) =>
                        onAmountChange(index, e.target.value)
                      }
                      placeholder="数量"
                    />
                    <Text pl={2}>{ currentToken }</Text>
                  </HStack>
                </Td>
                <Td>
                  <Button 
                    variant='ghost'
                    colorScheme="pink" 
                    onClick={() => onRowDelete(index)}
                  >
                    删除
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default AddrList;
