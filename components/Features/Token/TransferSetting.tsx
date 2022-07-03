import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Input,
  Spacer,
  Spinner,
  Switch,
  Text,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { formatEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TESTNET_TOKENS } from "../../../constants";
import { WalletStateType } from "../../../redux";
import { TransferSettings } from "../../../typing";
import { checkApproved, fetchBalance, signApprove } from "../../../utils";
import TokenModal from "./TokenModal";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
interface PropTypes {
  onChange: (params: TransferSettings) => void;
  onOrder: () => void;
  canPlaceOrder: boolean;
}

const TransferSetting: React.FC<PropTypes> = ({
  onChange,
  onOrder,
  canPlaceOrder,
}) => {
  const [selectedToken, setSelectedToken] = useState("WETH");
  const [balance, setBalance] = useState("0");
  const [approved, setApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isRecharge, setIsRecharge] = useState(false);
  const [gasPrice, SetGasPrice] = useState("");
  const [gasLimit, SetGasLimit] = useState("");
  const [startDatetime, setStartDatetime] = useState(new Date());
  const [endDatetime, setEndDatetime] = useState(new Date());
  // from redux
  const state = useSelector((state) => state);
  const { provider, address, signer } = state as WalletStateType;

  // Modal 关闭与打开
  const openSelectModal = () => setVisible(true);
  const closeSelectModal = () => setVisible(false);

  // Modal 处理选择事件
  const handleChange = async (token: string, balance?: string) => {
    setSelectedToken(token);
    setVisible(false);

    // 是否获取余额
    if (balance === "" || balance === undefined) {
      if (token === "ETH") {
        balance = await provider?.getBalance(address);
        if (balance) {
          balance = Number(formatEther(balance)).toFixed(4);
        }
      }
      balance = await fetchBalance(
        address || "",
        TESTNET_TOKENS[token],
        provider
      );
    }

    // 是否已授权
    if (token !== "ETH") {
      const allowance = await checkApproved(
        address || "",
        TESTNET_TOKENS[token],
        provider
      );
      setApproved(allowance !== "0");
    }
    setBalance(balance || "0");
  };

  // 获取默认选择的余额
  useEffect(() => {
    const fetchETHBalance = async () => {
      let bal = await provider?.getBalance(address);
      if (bal) {
        bal = Number(formatEther(bal)).toFixed(4);
      }
      setBalance(bal || "0");
    };
    if (selectedToken === "ETH") {
      setApproved(true);
      fetchETHBalance();
    }
  }, [selectedToken, address, provider]);

  // Gas 代扣模式变化
  const onFeeModeChagne = (e: any) => {
    setIsRecharge(e.target.checked);
  };

  // 授权
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const tx = await signApprove(
        address || "",
        TESTNET_TOKENS[selectedToken],
        signer
      );
      await toast.promise(tx.wait(), {
        pending: "授权已提交，正在等待确认...",
        success: "授权成功 👌",
        error: "授权失败 🤯",
      });
      setApproved(true);
    } catch (err) {
      toast.error("授权失败！");
      console.log(err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleGasPriceChange = (event: any) => {
    SetGasPrice(event.target.value);
  };
  const handleGasLimitChange = (event: any) => {
    SetGasLimit(event.target.value);
  };

  const handleDateChange = (type: string) => (date: any) => {
    if (type === "start") {
      setStartDatetime(date);
      console.log(date);
    }
    if (type === "end") {
      setEndDatetime(date);
    }
  };

  useEffect(() => {
    onChange({
      token: selectedToken,
      orderGasType: "",
      gasPrice,
      gasLimit,
      startDatetime,
      endDatetime,
    });
  }, [endDatetime, gasLimit, gasPrice, onChange, selectedToken, startDatetime])
  return (
    <Box w={400} borderWidth="1px" p={6} borderRadius="xl" bg="white">
      <HStack justify="space-between" mb={2}>
        <Text fontSize="md">转账的代币</Text>
        <Text fontSize="xs" color="gray.600">
          余额: {balance}
        </Text>
      </HStack>
      <HStack justify="space-between" mb={6}>
        <Button
          borderRadius="full"
          variant="outline"
          minW={100}
          rightIcon={<ChevronDownIcon />}
          onClick={openSelectModal}
        >
          {selectedToken}
        </Button>
        <Button
          colorScheme="brand"
          w={160}
          disabled={approved || isApproving}
          onClick={handleApprove}
        >
          {isApproving ? <Spinner size="sm" /> : approved ? "已授权" : "授权"}
        </Button>
      </HStack>
      <HStack mb={2}>
        <Text>使用充值 Gas Fee</Text>
        <Switch
          checked={isRecharge}
          onChange={onFeeModeChagne}
          colorScheme="brand"
        />
      </HStack>
      <HStack mb={6}>
        <Button disabled w={120} variant="outline" colorScheme="brand">
          充值
        </Button>
        <Spacer />
        <Text fontSize="xs" color="gray.600">
          余额: {0}
        </Text>
      </HStack>
      <Text fontSize="md" mb={2}>
        GAS 设置
      </Text>
      <HStack justify="space-between" mb={6}>
        <Box w={160}>
          <Text mb={1} fontSize="sm" color="gray.700">
            Gas Price(GWei)
          </Text>
          <Input
            borderRadius="lg"
            focusBorderColor="gray.400"
            onChange={handleGasPriceChange}
            placeholder="Gas Price(GWei)"
          />
        </Box>
        <Box w={160}>
          <Text mb={1} fontSize="sm" color="gray.700">
            Gas Limit
          </Text>
          <Input
            focusBorderColor="gray.400"
            borderRadius="lg"
            onChange={handleGasLimitChange}
            placeholder="Gas Limit"
          />
        </Box>
      </HStack>
      <Text fontSize="md" mb={2}>
        订单时效
      </Text>
      <Box mb={2}>
        <Text mb={1} fontSize="sm" color="gray.700">
          起始时间
        </Text>
        <DatePicker
          dateFormat="yyyy/MM/dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={15}
          minDate={new Date()}
          minTime={setHours(setMinutes(new Date(), 0), (new Date().getHours()))}
          maxTime={setHours(setMinutes(new Date(), 59), 23)}
          selected={startDatetime}
          onChange={handleDateChange("start")}
          showTimeSelect
          customInput={<Input focusBorderColor="gray.400" />}
        />
      </Box>
      <Box mb={6}>
        <Text mb={1} fontSize="sm" color="gray.700">
          结束时间
        </Text>
        <DatePicker
          selected={endDatetime}
          dateFormat="yyyy/MM/dd HH:mm"
          timeFormat="HH:mm"
          minDate={startDatetime}
          onChange={handleDateChange("end")}
          showTimeSelect
          customInput={<Input focusBorderColor="gray.400" />}
        />
      </Box>
      <Button
        size="md"
        borderRadius="lg"
        disabled={!canPlaceOrder}
        css={{ width: "100%" }}
        onClick={onOrder}
        colorScheme="brand"
      >
        确认转账
      </Button>
      <TokenModal
        visible={visible}
        onChange={handleChange}
        onClose={closeSelectModal}
      />
    </Box>
  );
};

export default TransferSetting;
