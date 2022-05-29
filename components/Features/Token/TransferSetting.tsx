import {
  Button,
  Card,
  Col,
  Input,
  Row,
  styled,
  Table,
  Text,
} from "@nextui-org/react";
import { formatEther } from "ethers/lib/utils";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TESTNET_TOKENS } from "../../../constants";
import { WalletStateType } from "../../../redux";
import { TransferRecord } from "../../../typing";
import { fetchBalance } from "../../../utils";
import TokenModal from "./TokenModal";

const TokenSelectCard = styled(Card, {
  margin: '$8 0'
});

interface PropTypes {}

const TransferSetting: React.FC<PropTypes> = ({
  
}) => {
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [balance, setBalance] = useState('0');
  const [visible, setVisible] = useState(false);
  const state = useSelector((state) => state );
  const { provider, address } = state as WalletStateType;
  
  const openSelectModal = () => setVisible(true);

  const handleChange = async (token: string, balance?: string) => {
    setSelectedToken(token);
    setVisible(false);
    if ((balance === '' || balance === undefined) && address) {
      if (token === 'ETH') {
        balance = await provider?.getBalance(address);
        if (balance) {
          balance = Number(formatEther(balance)).toFixed(4);
        }
      }
      balance = await fetchBalance(address || '', TESTNET_TOKENS[token], provider);
      setBalance(balance);
    } else {
      setBalance(balance || '0');
    }
  };

  useEffect(() => {
    const fetchETHBalance = async () => {
      let bal = await provider?.getBalance(address);
      if (bal) {
        bal = Number(formatEther(bal)).toFixed(4);
      }
      setBalance(bal || '0');
    }
    if (selectedToken === 'ETH') {
      fetchETHBalance();
    }
  }, [selectedToken, address, provider]);
  return (
    <TokenSelectCard>
      <Card.Header>
        <Text h5>需要转出的 Token</Text>
      </Card.Header>
      <Row css={{ padding: '$8 $0' }}>
        <Col span={4}>
          <Button bordered color="secondary" onPress={openSelectModal}>
            {selectedToken}
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
        余额: { balance }
      </Card.Footer>
      <TokenModal
        visible={visible} 
        onChange={handleChange} 
        onClose={() => setVisible(false)}
      />
    </TokenSelectCard>
  )
}

export default TransferSetting;
