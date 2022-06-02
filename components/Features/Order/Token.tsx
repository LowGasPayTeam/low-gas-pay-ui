import { Button, Container, Popover, Row, Spacer, Table } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WalletStateType } from "../../../redux";
import { getTokenOrders, TokenOrdersItem } from "../../../services/order";
import { StyledBadge } from "../../StyledBadge";
import { DeleteOrder } from "./DeleteOrder";

const PAGE_NUMBER = 20;
interface PropTypes {}

const TokenOrderList: FC<PropTypes> = ({}) => {
  const [orders, updateOrders] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const state = useSelector((state) => state );
  const { address } = state as WalletStateType;
  
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!address) return;
      const res = await getTokenOrders({ pageNumber: currentPage, address });
      updateOrders(res.data.orders);
      setTotal(Math.ceil(res.data.total / PAGE_NUMBER));
    }
    fetchOrders();
  }, [address, currentPage])
  return (
    <Container>
      <Spacer y={2} />
      <Table
        bordered
        shadow={false}
        color="secondary"
        aria-label="Token Table"
        css={{
          minWidth: "100%",
        }}
      >
        <Table.Header>
          <Table.Column>订单 ID</Table.Column>
          <Table.Column>GAS 模式</Table.Column>
          <Table.Column>GAS 范围</Table.Column>
          <Table.Column>订单状态</Table.Column>
          <Table.Column>更新时间</Table.Column>
          <Table.Column>操作</Table.Column>
        </Table.Header>
        <Table.Body items={orders}>
          {(item: TokenOrdersItem) => (
            <Table.Row key={item.order_id}>
              <Table.Cell>{item.order_id}</Table.Cell>
              <Table.Cell>{item.order_gas_type}</Table.Cell>
              <Table.Cell>{item.trans_gas_fee_limit} - {item.trans_gas_fee_max}</Table.Cell>
              <Table.Cell>
                <StyledBadge type={item?.order_status as any}>
                  {item.order_status}
                </StyledBadge>
              </Table.Cell>
              <Table.Cell>{item.updated_at}</Table.Cell>
              <Table.Cell>
                <Button
                  light
                  disabled={['Created', 'Pending'].indexOf(item.order_status) < 0}
                  css={{ padding: '$0' }}
                  color="secondary" 
                  auto
                >
                  取消订单
                </Button>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          shadow
          noMargin
          total={total}
          align="center"
          rowsPerPage={20}
          onPageChange={onPageChange}
        />
      </Table>
    </Container>
  );
};

export default TokenOrderList;
