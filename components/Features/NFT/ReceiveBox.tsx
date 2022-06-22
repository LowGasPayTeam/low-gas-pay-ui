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
import { formatEther, isAddress } from "ethers/lib/utils";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TESTNET_TOKENS } from "../../../constants";
import { WalletStateType } from "../../../redux";
import { TransferRecord, TransferSettings } from "../../../typing";

interface PropTypes {
  data: TransferRecord[];
  onAmountChange: (index: number, value: string | number) => void;
  onRowAdd: (addr: string) => void;
  onRowDelete: (index: number) => void;
}

const ReceiveWrap = styled('div', {
  baseStyle: {
    flex: 1,
  }
});

const ReceiveBox: React.FC<PropTypes> = ({
  data,
  onAmountChange,
  onRowAdd,
  onRowDelete,
}) => {
  // from redux
  const state = useSelector((state) => state);
  const { provider, address, signer } = state as WalletStateType;
  const [newAddr, setNewAddr] = useState('');

  const isValidAddr = useMemo(() => {
    const isEnsName = (/\w+(.eth)$/).test(newAddr);
    const noRepeat = !(data.find(item => item.address === newAddr));
    return newAddr && (isAddress(newAddr) || isEnsName) && noRepeat;
  }, [newAddr, data]);

  const handleAddrChange = (addr: string) => {
    setNewAddr(addr);
  }

  return (
    <ReceiveWrap>
      <Box
        w={"100%"}
        borderWidth="1px"
        p={6}
        borderRadius="xl"
        bg="white"
        mb={6}
      >
        <HStack>
          <Input
            id="newAddr"
            value={newAddr}
            size="md"
            type="text"
            focusBorderColor="gray.400"
            onChange={(e) => {
              handleAddrChange(e.target.value);
            }}
            placeholder="转账地址"
          />
          <Button
            width={160}
            onClick={() => {
              onRowAdd(newAddr);
              setNewAddr("");
            }}
            disabled={!isValidAddr}
          >
            添加地址
          </Button>
        </HStack>
      </Box>
      <Box
        w={"100%"}
        borderWidth="1px"
        p={6}
        borderRadius="xl"
        bg="white"
      ></Box>
    </ReceiveWrap>
  );
};

export default ReceiveBox;
