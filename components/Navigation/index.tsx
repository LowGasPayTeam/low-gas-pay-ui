import { WalletStateType } from "../../redux";
import { FC, useCallback, useEffect, useRef } from "react";
import { useRouter } from 'next/router'
import { providers } from "ethers";
import {
  Button,
  Text,
  Box,
  HStack,
  Flex,
  Spacer,
  Divider,
  useRadioGroup,
} from "@chakra-ui/react";
import { BiHomeHeart, BiListUl  } from "react-icons/bi";
import { createWeb3Modal } from "../../utils/createWeb3Modal";
import { useDispatch, useSelector } from "react-redux";
import { summaryAddress } from "../../utils";
import { useBalance } from "wagmi";
import { NETWORKING } from "../../constants";

import Link from "next/link";
import Logo from "../../assets/text-446*96.png";
import Image from "next/image";
import NavRadio from "./NavRadio";

const Navigation: FC = () => {
  const web3Modal = useRef<any>();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const router = useRouter();

  const { connection, provider, address } = state as WalletStateType;
  const { data } = useBalance({
    addressOrName: address,
    chainId: NETWORKING.CHAIN_ID,
  });

  const handleNavChange = (value: string) => {
    router.push(value);
  };

  const connectWallet = useCallback(async () => {
    try {
      const connection = await web3Modal.current.connect();
      const provider = new providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      dispatch({
        type: "SET_WEB3_PROVIDER",
        connection,
        provider,
        address,
        chainId: network.chainId,
        signer,
      });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.current.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    },
    [provider, dispatch]
  );

  useEffect(() => {
    if (!web3Modal.current) {
      web3Modal.current = createWeb3Modal();
    }
  }, []);

  useEffect(() => {
    if (web3Modal.current?.cachedProvider) {
      connectWallet();
    }
  }, [connectWallet]);

  useEffect(() => {
    if (connection?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged", accounts);
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      const handleChainChanged = (_hexChainId: string) => {
        // todo: 非 Ethereum 错误提示
        window.location.reload();
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log("disconnect", error);
        disconnect();
      };

      connection.on("accountsChanged", handleAccountsChanged);
      connection.on("chainChanged", handleChainChanged);
      connection.on("disconnect", handleDisconnect);

      return () => {
        if (connection.removeListener) {
          connection.removeListener("accountsChanged", handleAccountsChanged);
          connection.removeListener("chainChanged", handleChainChanged);
          connection.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [connection, disconnect, dispatch]);

  const {
    value: currentPage,
    getRadioProps,
    getRootProps,
  } = useRadioGroup({
    defaultValue: router.asPath ?? '/',
    onChange: handleNavChange,
  });

  return (
    <Flex px={4} py={8} bg='gray.100'>
      <Box>
        <Link href="/">
          <Image
            src={Logo}
            width={200}
            height={43}
            quality={100}
            alt="metagas"
            layout="intrinsic"
            objectFit="contain"
          />
        </Link>
      </Box>
      <Spacer />
      <HStack>
        <HStack {...getRootProps()} spacing='5'>
          <NavRadio
            text="首页"
            icon={BiHomeHeart}
            {...getRadioProps({ value: "/" })}
          />
          <NavRadio
            text="订单"
            icon={BiListUl}
            {...getRadioProps({ value: "/order/token" })}
          />
        </HStack>
        <HStack px={3} h={8}>
          <Divider
            size='sx'
            orientation="vertical" 
            borderColor='gray.400'
          />
        </HStack>
        {address ? (
          <Box
            py={1}
            px={2}
            borderWidth="2px"
            borderRadius="3xl"
            overflow="hidden"
            bg='white'
          >
            <HStack pl={2}>
              <Text minW={50}>
                {Number(data?.formatted).toFixed(3)} {data?.symbol}
              </Text>
              <Box bg="gray.100" px={3} py={1} borderRadius="3xl">
                {summaryAddress(address)}
              </Box>
            </HStack>
          </Box>
        ) : (
          <Button size="md" colorScheme="brand" onClick={connectWallet} mr={8}>
            链接钱包
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default Navigation;
