import { WalletStateType } from "../../redux";
import { FC, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { providers } from "ethers";
import { Button, Col, Container, Row, Text, styled, Card } from "@nextui-org/react";
import { createWeb3Modal } from '../../utils/createWeb3Modal';
import { useDispatch, useSelector } from "react-redux";
import { summaryAddress } from '../../utils';
import { useBalance } from "wagmi";
import { NETWORKING } from '../../constants';

const LogoContainer = styled('div', {
  width: 'auto',
})
const LogoTitle = styled(Text, {
  fontSize: '20px',
  fontWeight: 'normal',
  lineHeight: '40px',
});

const NavigationWrap = styled(Container, {
  padding: '1rem',
})

const AddressText = styled('span', {
  padding: '$2 $6',
  borderRadius: '$md',
  backgroundColor: '$gray100'
})

const Navigation: FC = () => {
  const web3Modal = useRef<any>();
  const dispatch = useDispatch();
  const state = useSelector((state) => state );
  const { connection, provider, address, chainId } = state as WalletStateType;
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    chainId: NETWORKING.CHAIN_ID,
  });

  const connectWallet = useCallback(async () => {
    try {
      const connection = await web3Modal.current.connect();
      const provider = new providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      console.log(network);
      dispatch({
        type: 'SET_WEB3_PROVIDER',
        connection,
        provider,
        address,
        chainId: network.chainId,
      });
    } catch(err) {
      console.log(err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = useCallback(async function () {
    await web3Modal.current.clearCachedProvider()
    if (provider?.disconnect && typeof provider.disconnect === 'function') {
      await provider.disconnect();
    }
    dispatch({
      type: 'RESET_WEB3_PROVIDER',
    })
  }, [provider, dispatch]);

  useEffect(() => {
    if (!web3Modal.current) {
      web3Modal.current = createWeb3Modal();
    }
  }, []);

  useEffect(() => {
    if (web3Modal.current?.cachedProvider) {
      connectWallet()
    }
  }, [connectWallet]);

  useEffect(() => {
    if (connection?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('accountsChanged', accounts);
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        });
      }

      const handleChainChanged = (_hexChainId: string) => {
        // todo: 非 Ethereum 错误提示
        window.location.reload();
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log('disconnect', error);
        disconnect();
      }

      connection.on('accountsChanged', handleAccountsChanged)
      connection.on('chainChanged', handleChainChanged)
      connection.on('disconnect', handleDisconnect)

      return () => {
        if (connection.removeListener) {
          connection.removeListener('accountsChanged', handleAccountsChanged)
          connection.removeListener('chainChanged', handleChainChanged)
          connection.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [connection, disconnect, dispatch]);

  return (
    <NavigationWrap gap={1} fluid>
      <Row justify="space-between">
        <LogoContainer>
          <LogoTitle h1>Low Gas Pay</LogoTitle>
        </LogoContainer>
        <div>
          {
            address ? (
              <Card bordered shadow={false} css={{ padding: '$1' }}>
                <Card.Body css={{ padding: "$0" }}>
                  <Row>
                    <Text span css={{ minWidth: '50px', padding: '$2 $6' }}>
                      {Number(data?.formatted).toFixed(3)} {data?.symbol}
                    </Text>
                    <AddressText>
                      { summaryAddress(address) }
                    </AddressText>
                  </Row>
                </Card.Body>
              </Card>
            ) : <Button onClick={connectWallet}>链接钱包</Button>
          }
        </div>
      </Row>
    </NavigationWrap>
  )
}

export default Navigation