import {
  Button,
  Card,
  Col,
  Input,
  Loading,
  Row,
  Spacer,
  styled,
  Switch,
  SwitchEvent,
  Table,
  Text,
} from "@nextui-org/react";
import { formatEther } from "ethers/lib/utils";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "react-iconly";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TESTNET_TOKENS } from "../../../constants";
import { WalletStateType } from "../../../redux";
import { TransferRecord } from "../../../typing";
import { checkApproved, fetchBalance, signApprove } from "../../../utils";
import TokenModal from "./TokenModal";

const TokenSelectCard = styled(Card, {
  margin: '$8 0'
});

interface PropTypes {}

const TransferSetting: React.FC<PropTypes> = ({
  
}) => {
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [balance, setBalance] = useState('0');
  const [approved, setApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isRecharge, setIsRecharge] = useState(false);
  // from redux
  const state = useSelector((state) => state );
  const { provider, address, signer } = state as WalletStateType;
  
  // Modal 关闭与打开
  const openSelectModal = () => setVisible(true);
  const closeSelectModal = () => setVisible(false);

  // Modal 处理选择事件
  const handleChange = useCallback(async (token: string, balance?: string) => {
    setSelectedToken(token);
    setVisible(false);
  
    // 是否获取余额
    if (balance === '' || balance === undefined) {
      if (token === 'ETH') {
        balance = await provider?.getBalance(address);
        if (balance) {
          balance = Number(formatEther(balance)).toFixed(4);
        }
      }
      balance = await fetchBalance(address || '', TESTNET_TOKENS[token], provider);
    }

    // 是否已授权
    if (token !== 'ETH') {
      const allowance = await checkApproved(address || '', TESTNET_TOKENS[token], provider);
      setApproved(allowance !== '0')
    }
    setBalance(balance || '0');
  }, [address, provider]);

  // 获取默认选择的余额
  useEffect(() => {
    const fetchETHBalance = async () => {
      let bal = await provider?.getBalance(address);
      if (bal) {
        bal = Number(formatEther(bal)).toFixed(4);
      }
      setBalance(bal || '0');
    }
    if (selectedToken === 'ETH') {
      setApproved(true);
      fetchETHBalance();
    }
  }, [selectedToken, address, provider]);

  // Gas 代扣模式变化
  const onFeeModeChagne = (e: SwitchEvent) => {
    setIsRecharge(e.target.checked);
  };

  // 授权
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const tx = await signApprove(address || '', TESTNET_TOKENS[selectedToken], signer);
      await toast.promise(
        tx.wait(),
        {
          pending: '授权已提交，正在等待确认...',
          success: '授权成功 👌',
          error: '授权失败 🤯'
        }
      )
      setApproved(true);
    } catch (err) {
      toast.error("授权失败！");
      console.log(err);
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <TokenSelectCard>
      <Card.Header>
        <Text h5>需要转出的 Token</Text>
      </Card.Header>
      <Row css={{ padding: '$8 $0' }}>
        <Col span={6} css={{ borderRight: '1px solid $gray100' }}>
          <Button
            bordered 
            color="secondary" 
            iconRight={<ChevronDown set="bold" primaryColor="blueviolet"/>}
            onPress={openSelectModal}

          >
            {selectedToken}
          </Button>
          <Spacer y={1} />
          <Button
            size="sm"
            color="error"
            disabled={approved || isApproving}
            onPress={handleApprove}
          >
            { isApproving ? (
              <Loading type="points-opacity" color="currentColor" size="sm" />
            ) : (
                approved ? '已授权' : '授权'
            )}
          </Button>
          <Spacer y={1} />
          <Text size={14}>钱包余额: { balance }</Text>
        </Col>
        <Spacer y={2} />
        <Col span={4}>
          <Row css={{ height: '40px' }}>
            <Text span css={{ lh: '28px'}}>使用充值 Gas Fee：</Text>
            <Switch
              checked={isRecharge} 
              onChange={onFeeModeChagne}
            />
          </Row>
          <Spacer y={1} />
          <Button size="sm" auto disabled>
            充值
          </Button>
          <Spacer y={1} />
          <Text size={14}>账户余额: { 0 }</Text>
        </Col>
      </Row>
      <TokenModal
        visible={visible} 
        onChange={handleChange} 
        onClose={closeSelectModal}
      />
    </TokenSelectCard>
  )
}

export default TransferSetting;
