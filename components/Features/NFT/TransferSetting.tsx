import {
  Box,
  Button,
  HStack,
  Input,
  Spacer,
  Switch,
  Text,
} from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TESTNET_TOKENS } from "../../../constants";
import { WalletStateType } from "../../../redux";
import { TransferSettings } from "../../../typing";
import { checkApproved, fetchBalance, signApprove } from "../../../utils";
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
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [visible, setVisible] = useState(false);
  const [isRecharge, setIsRecharge] = useState(false);
  const [gasPrice, SetGasPrice] = useState("");
  const [gasLimit, SetGasLimit] = useState("");
  const [startDatetime, setStartDatetime] = useState(new Date());
  const [endDatetime, setEndDatetime] = useState(new Date());

  // Gas 代扣模式变化
  const onFeeModeChagne = (e: any) => {
    setIsRecharge(e.target.checked);
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
    </Box>
  );
};

export default TransferSetting;
