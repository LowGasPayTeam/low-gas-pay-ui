import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Input,
  Spacer,
  Spinner,
  styled,
  Switch,
  Text,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { formatEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TESTNET_NFTS } from "../../../constants";
import { WalletStateType } from "../../../redux";
import { getMyTokenByContract, signNFTSetApproveForAll } from "../../../utils";
interface PropTypes {}

const NFTList: React.FC<PropTypes> = ({

}) => {
  // from redux
  const state = useSelector((state) => state);
  const { provider, address, signer } = state as WalletStateType;

  useEffect(() => {
    if (!address) return;
  }, [address, provider])
  return (
    <Box
      height={'calc(100vh - 133px)'}
      width='full'
      borderWidth="1px"
      p={6} 
      borderRadius="xl"
      bg="white"
    >
      <HStack mb={2}>
        <Text>我的 NFT</Text>
      </HStack>
    </Box>
  );
};

export default NFTList;
