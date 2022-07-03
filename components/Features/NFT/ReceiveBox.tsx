import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  styled,
  Text,
  VStack,
  Image,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { isAddress } from "ethers/lib/utils";
import React, { DragEvent, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NFTToken } from "../../../services/opensea";
import { TransferNFTRecord } from "../../../typing";

interface PropTypes {
  data: TransferNFTRecord[];
  onRowAdd: (addr: string) => void;
  onRowDelete: (addr: string) => void;
  onNFTAdd: (addr: string) => void;
  onNFTDrap: (addr: string, item: NFTToken) => void;
  hasChecked: boolean;
}

const ReceiveWrap = styled('div', {
  baseStyle: {
    flex: 1,
    height: 'calc(100vh - 133px)',
  }
});

const ReceiveBox: React.FC<PropTypes> = ({
  data,
  onRowAdd,
  onNFTAdd,
  onRowDelete,
  onNFTDrap,
  hasChecked,
}) => {
  // from redux
  const state = useSelector((state) => state);
  const [newAddr, setNewAddr] = useState('');
  const [activeAddr, setActiveAddr] = useState('');
  const isValidAddr = useMemo(() => {
    const isEnsName = (/\w+(.eth)$/).test(newAddr);
    const noRepeat = !(data.find(item => item.address === newAddr));
    return newAddr && (isAddress(newAddr) || isEnsName) && noRepeat;
  }, [newAddr, data]);

  const handleAddrChange = (addr: string) => {
    setNewAddr(addr);
  }

  const hanleDragEnter = (addr: string) => (e: DragEvent) => {
    setActiveAddr(addr);
  };

  const hanleDragLeave = (addr: string) => (e: DragEvent) => {
    if (activeAddr === addr) {
      setActiveAddr('');
    }
  };
  const hanleDragOver = (addr: string) => (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };
  const hanleDragDrop = (addr: string) => (e: DragEvent) => {
    e.stopPropagation();
    if (activeAddr === addr) {
      setActiveAddr('');
    }
    const data = e.dataTransfer.getData('application/json');
    try {
      const parsed = JSON.parse(data);
      onNFTDrap(addr, parsed);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ReceiveWrap>
      <VStack height="100%">
        <Box
          w={500}
          borderWidth="1px"
          p={6}
          borderRadius="xl"
          bg="white"
          mb={4}
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
        <Box w="full" flex={1} overflow="auto">
          {data.map((item) => (
            <Box
              key={item.address}
              w={"100%"}
              p={4}
              mb={2}
              borderWidth="1px"
              borderRadius="xl"
              bg={activeAddr === item.address ? "gray.300" : "white"}
              onDragEnter={hanleDragEnter(item.address)}
              onDragLeave={hanleDragLeave(item.address)}
              onDragOver={hanleDragOver(item.address)}
              onDrop={hanleDragDrop(item.address)}
            >
              <Text fontSize="sm" mb={2}>
                接收地址：{item.address}
              </Text>
              <Divider mb={2} />
              <Wrap minHeight={16} pointerEvents="none">
                {item.tokens.length > 0 ? (
                  item.tokens.map((token) => (
                    <WrapItem
                      key={token.name}
                      w={70}
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Image
                        boxSize="56px"
                        objectFit="contain"
                        src={token.image_thumbnail_url}
                        alt={token.name}
                      />
                      <Text fontSize="xs">{token.name}</Text>
                    </WrapItem>
                  ))
                ) : (
                  <Text
                    pt={3}
                    textAlign="center"
                    w="full"
                    color="gray.500"
                    fontSize="sm"
                  >
                    请从右边”我的 NFT“列表中拖入要转移的 NFT
                  </Text>
                )}
              </Wrap>
              <Divider mb={2} />
              <HStack w="full" justify="space-between">
                <Button
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={() => onRowDelete(item.address)}
                >
                  删除此接收地址
                </Button>
                <Text fontSize="sm">总计：{item.tokens.length}</Text>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasChecked}
                  onClick={() => onNFTAdd(item.address)}
                >
                  添加所选 NFT
                </Button>
              </HStack>
            </Box>
          ))}
        </Box>
      </VStack>
    </ReceiveWrap>
  );
};

export default ReceiveBox;
