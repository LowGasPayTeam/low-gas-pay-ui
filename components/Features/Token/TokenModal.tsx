import {
  Spinner, 
  Modal, 
  Table, 
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Thead,
  Td,
  Tr,
  Tbody,
  Th,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState } from "react";
import { TESTNET_TOKENS } from '../../../constants';
import { WalletStateType } from "../../../redux";
import { useSelector } from "react-redux";
import { formatEther } from "ethers/lib/utils";
import { fetchBalance } from "../../../utils";

interface PropTypes {
  visible: boolean;
  onChange: (token: string, balance?: string) => void;
  onClose: () => void;
}

const TokenModal: FC<PropTypes> = ({
  visible,
  onChange,
  onClose,
}) => {
  const state = useSelector((state) => state );
  const { provider, address } = state as WalletStateType;
  const [tokens, setTokens] = useState<any[]>(Object.keys(TESTNET_TOKENS).map(key => {
      return {
        token: key,
        addr: TESTNET_TOKENS[key],
      }
    }));
  const [balances, setBalances] = useState<any>({ 'ETH': '0' })

  const handleSelectionChange = (token: any) => {
    onChange(token.token, balances[token.token]);
  }

  // 获取代币列表的余额
  useEffect(() => {
    const fetchBalances = async () => {
      const result: any = {};
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        let balance: string;
        try {
          if (token.token === 'ETH') {
            const bign = await provider.getBalance(address?.toString());
            balance = Number(formatEther(bign)).toFixed(4);
          } else {
            balance = await fetchBalance(address || '', token.addr, provider);
          }
          result[token.token] = balance;
        } catch (err) {
          result[token.token] = '-'
          console.log(err);
        }
      }
      setBalances(result);
    }
    if (!address || !provider || !visible) return;
    fetchBalances();
  }, [provider, address, tokens, visible]);

  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>
            请选择要转账的代币
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table>
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th isNumeric>余额</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tokens.map((token) => (
                <Tr
                  key={token.token} 
                  cursor='pointer'
                  _hover={{
                    background: 'gray.200',
                  }}
                  onClick={() => handleSelectionChange(token)}
                >
                  <Td>{ token.token }</Td>
                  <Td isNumeric>
                    { balances[token.token] ? balances[token.token] : (
                      <Spinner size="xs" />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};

export default TokenModal;
