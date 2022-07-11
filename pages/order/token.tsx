import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, Heading, Container, styled, useToast, Text } from '@chakra-ui/react'
import ExpandTable from '../../components/Features/Order/ExpandTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { WalletStateType } from '../../redux';
import { cancelTokenOrder, getTokenOrders } from '../../services/order';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import StatusBadge from '../../components/StatusBadge';
import { daysToWeeks } from 'date-fns';
import dayjs from 'dayjs';

const PAGE_NUMBER = 20;

const MainWrap = styled('div', {
  minHeight: 'calc(100vh - 72px)'
});

const Order: NextPage = () => {
  const [orders, updateOrders] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const state = useSelector((state) => state );
  const { address } = state as WalletStateType;
  const toast = useToast();

  const fetchOrders = useCallback(async () => {
    if (!address) return;
    try{
      const res = await getTokenOrders({ pageNumber: currentPage, address });
      updateOrders(res.data.orders);
      setTotal(Math.ceil(res.data.total / PAGE_NUMBER));
    } catch (err) {
      toast({
        title: `订单数据获取失败`,
        status: 'error',
        isClosable: true,
        position: 'top'
      })
    }
  }, [address, currentPage, toast]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleCancel = (orderId: string) => async () => {
    try {
      await cancelTokenOrder(orderId);
      fetchOrders();
      toast({
        title: `订单取消成功`,
        status: 'success',
        isClosable: true,
        position: 'top'
      });
    } catch (err) {
      console.log(err);
      toast({
        title: `订单取消失败`,
        status: 'error',
        isClosable: true,
        position: 'top'
      });
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: () => null, // No header
        id: "expander",
        Cell: ({ row }: any) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </span>
        ),
      },
      {
        Header: "订单 ID",
        accessor: "order_id",
      },
      {
        Header: "GAS 模式",
        accessor: "order_gas_type",
      },
      {
        Header: "GAS 范围",
        accessor: "trans_gas_fee_limit",
        Cell: ({ row }: any) => (
          <Text>
            {row.original.trans_gas_fee_limit} -{" "}
            {row.original.trans_gas_fee_max}
          </Text>
        ),
      },
      {
        Header: "订单状态",
        id: "order_status",
        Cell: ({ row }: any) => (
          <StatusBadge type={row?.original.order_status as any} />
        ),
      },
      {
        Header: "更新时间",
        id: "updated_at",
        Cell: ({ row }: any) => (
          <Text>
            {!row?.original.updated_at
              ? "-"
              : dayjs(row?.original.updated_at).format("YYYY/MM/DD HH:mm:ss")}
          </Text>
        ),
      },
      {
        Header: "截止时间",
        id: "trans_end_time",
        Cell: ({ row }: any) => (
          <Text>
            {!row?.original.trans_end_time
              ? "-"
              : dayjs(row?.original.trans_end_time).format(
                  "YYYY/MM/DD HH:mm:ss"
                )}
          </Text>
        ),
      },
      {
        Header: "操作",
        id: "action",
        Cell: ({ row }: any) => (
          (row?.original.order_status === 'Created' || row?.original.order_status === 'Pending') && (
            <Button colorScheme="pink" variant="ghost" size="sm" onClick={handleCancel(row?.original.order_id)}>
              取消订单
            </Button>
          )
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders])

  return (
    <MainWrap>
      <Head>
        <title>MetaGas</title>
        <meta name="description" content="MetaGas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW='8xl'>
        <Heading as='h4' size='md' mb={4}>
          我的代币订单
        </Heading>
        <ExpandTable
          columns={columns}
          data={orders}
          pagination={{
            onPageChange,
            size: PAGE_NUMBER,
            total: total
          }}
        />
      </Container>
    </MainWrap>
  )
}

export default Order
