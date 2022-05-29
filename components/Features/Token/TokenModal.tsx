import { Modal, Row, styled, Table, Text } from "@nextui-org/react";
import React, { FC, useEffect, useRef, useState } from "react";
import { TransferRecord } from "../../../typing";
import { TESTNET_TOKENS } from '../../../constants';
import { WalletStateType } from "../../../redux";
import { useDispatch, useSelector } from "react-redux";
import { erc20ABI } from 'wagmi';
import { ethers } from "ethers";
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

  const handleSelectionChange = (keys: any) => {
    onChange(keys.currentKey, balances[keys.currentKey]);
  }

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
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={14}>
          请选择要转账的 Token
        </Text>
      </Modal.Header>
      <Modal.Body css={{  padding: '$0 $8 $8'}}>
        <Table
          aria-label="Example static collection table"
          css={{
            height: "auto",
            minWidth: "100%",
            padding: '$0'
          }}
          lined
          headerLined
          shadow={false}
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
        >
          <Table.Header>
            <Table.Column>Token</Table.Column>
            <Table.Column align="end">余额</Table.Column>
          </Table.Header>
          <Table.Body>
            {tokens.map((token) => (
              <Table.Row key={token.token}>
                <Table.Cell>{ token.token }</Table.Cell>
                <Table.Cell css={{ textAlign: 'right'}}>
                  { balances[token.token] }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Body>
    </Modal>
  )
};

export default TokenModal;
