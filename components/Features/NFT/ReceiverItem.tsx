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
  Wrap,
  WrapItem,
  Image
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TESTNET_NFTS } from "../../../constants";
import { WalletStateType } from "../../../redux";
import { signNFTSetApproveForAll } from "../../../utils";

interface PropTypes {
  data: any[];
  name: string;
}

const ReceiverItem: React.FC<PropTypes> = ({
  data,
  name
}) => {
  // from redux
  const state = useSelector((state) => state);
  const { provider, address, signer } = state as WalletStateType;

  useEffect(() => {
    if (!address) return;
  }, [address, provider]);
  
  return (
    <Box
      width='full'
      borderWidth="1px"
      borderRadius="xl"
      bg="white"
    >
      <HStack mb={2}>
        <Text borderBottom={1}>{ name }</Text>
      </HStack>
      <Wrap>
        {data.map(item => (
          <WrapItem key={item.id}>
            <Image
              boxSize='80px'
              objectFit='contain'
              src='https://bit.ly/dan-abramov'
              alt='Dan Abramov'
            />
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default ReceiverItem;
