import {
  Box,
  Button,
  HStack,
  Image,
  Spacer,
  Spinner,
  styled,
  Switch,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { WalletStateType } from "../../../redux";
import { NFTCollection, NFTToken } from "../../../services/opensea";
import { checkNFTApproved, signNFTSetApproveForAll } from "../../../utils";
interface PropTypes {
  collections: NFTCollection[];
  onNFTChecked: (data: NFTToken[]) => void;
}

const NFTList: React.FC<PropTypes> = ({
  collections,
  onNFTChecked,
}) => {
  // from redux
  const state = useSelector((state) => state);
  const { provider, address, signer } = state as WalletStateType;
  const [checkStatus, setCheckStatus] = useState<Record<string | number, boolean>>({});
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [checkedMap, setCheckedMap] = useState<Record<string | number, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<NFTToken[]>([]);
  const batchCheckApproved = async (contracts: string[]) => {
    if (!address) {
      return;
    }
    const checkResult = await Promise.all(
      contracts.map(c => checkNFTApproved(address, c, provider))
    );
    setCheckStatus({
      ...checkResult.reduce((status, result, index) => {
        status[contracts[index]] = result;
        return status;
      }, {}),
    });
  }

  const handleApprove = async (contract: string) => {
    if (!address) { return; }
    try {
      setIsApproving(true);
      const tx = await signNFTSetApproveForAll(address, contract, signer);
      await toast.promise(tx.wait(), {
        pending: "授权已提交，正在等待确认...",
        success: "授权成功 👌",
        error: "授权失败 🤯",
      });
      setCheckStatus(prev => ({
        ...prev,
        [contract]: true,
      }));
    } catch (err) {
      toast.error("授权失败！");
      console.log(err);
    } finally {
      setIsApproving(false);
    }
  }

  const handleNFTClick = (item: NFTToken) => {
    if (checkedMap[item.id]) {
      setCheckedMap(data => {
        delete data[item.id];
        return { ...data, }
      });
      onNFTChecked([...checkedItems.filter(d => d.id !== item.id)]);
      setCheckedItems(data => data.filter(d => d.id !== item.id));
    } else {
      setCheckedMap(data => ({
        ...data,
        [item.id]: true
      }));
      onNFTChecked([...checkedItems, item]);
      setCheckedItems(data => [...data, item]);
    }
  };

  const handleDragStart = (item: NFTToken) => (e: any) => {
    e.dropEffect = 'linkMove';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  useEffect(() => {
    batchCheckApproved(collections.map(r => r.contract));
    setCheckedItems([]);
    setCheckedMap({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  return (
    <Box
      height={'calc(100vh - 133px)'}
      width='full'
      borderWidth="1px"
      p={6} 
      borderRadius="xl"
      bg="white"
    >
      <HStack mb={4}>
        <Text>我的 NFT</Text>
      </HStack>
      { collections.map(collection => (
        <Box key={collection.name} borderWidth="1px" p={4} borderRadius="lg">
          <HStack mb={2} justify='space-between'>
            <Text fontSize='sm'>{`${collection.name} (${collection.count})`}</Text>
            <Button 
              size='xs' 
              isLoading={isApproving}
              disabled={checkStatus[collection.contract]}
              onClick={() => handleApprove(collection.contract)}
            >
              {
                checkStatus[collection.contract] ? '已授权' : '授权'
              }
            </Button>
          </HStack>
          {collection.tokens.length ? (<Wrap>
            {collection.tokens.map(item => (
              <WrapItem
                key={item.id}
                w={78}
                h={78}
                boxSizing='border-box'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                onClick={() => handleNFTClick(item)}
                cursor='pointer'
                borderWidth={checkedMap[item.id] ? 2 : 0}
                borderColor='green.400'
                borderRadius='sm'
                onDragStart={handleDragStart(item)}
              >
                <Image
                  boxSize='56px'
                  objectFit='contain'
                  src={item.image_thumbnail_url}
                  alt={item.name}
                />
                <Text fontSize='xs'>{item.name}</Text>
              </WrapItem>
            ))}
          </Wrap>) : (
            <Text
              pt={3}
              textAlign="center"
              w="full"
              color="gray.500"
              fontSize="sm"
            >
              无可转移的 NFT
            </Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default NFTList;
