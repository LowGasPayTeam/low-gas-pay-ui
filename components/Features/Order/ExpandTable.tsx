/* eslint-disable react/jsx-key */
import { FC, Fragment, useCallback, useMemo, useState, PropsWithChildren } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Text, Box, TableContainer, TableCaption } from "@chakra-ui/react";
import { useTable, useExpanded, Row } from "react-table";
import {
  Paginator,
  Container,
  Previous,
  Next,
  usePaginator
} from "chakra-paginator";
import { getTokenByContract } from "../../../utils";
import { PaginatorProps } from "chakra-paginator/dist/components/Paginator";

interface PropTypes {
  columns: any[];
  data: any[];
  mode?: 'nft' | 'token';
  pagination: {
    total: number;
    onPageChange: (page: number, size?: number) => void;
    defaultPage?: number,
    size?: number,
  }
}

const PaginatorWithChild: FC<PropsWithChildren<PaginatorProps>> = Paginator;

const TransferList: FC<{ mode: 'nft' | 'token', data: any[]}> = ({ mode, data }) => {
  const columns = useMemo(() => mode === 'nft' ? [
    { Header: '接收地址', accessor: 'to_addr' },
    { Header: 'NFT Name', accessor: 'collection_name'},
    { Header: 'Token Name', accessor: 'token_name' },
    { Header: 'Gas 使用数量', accessor: 'gas_paid_amount' },
    { Header: 'Gas 使用状态', accessor: 'gas_paid_status' },
    { Header: '已使用 Gas 数量', accessor: 'gas_used' },
  ] : [
    { Header: '接收地址', accessor: 'to_addr' },
    { 
      Header: '转账数量', 
      id: 'token_amount',
      Cell: ({ row }: any) => (
        <Text key={row.original.to_addr}>
          {
            row.original.token_amount + ' ' +
            getTokenByContract(row.original.token_contract)
          }
        </Text>
      ),
    },
    { Header: 'Gas 使用数量', accessor: 'gas_paid_amount' },
    { Header: 'Gas 使用状态', accessor: 'gas_paid_status' },
    { Header: '已使用 Gas 数量', accessor: 'gas_used' },
  ], [mode]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<any>({ columns, data}, useExpanded);
  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps()}
              >
                {column.render('Header')}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
      {rows.map((row) => {
        prepareRow(row)
        return (
          <Tr {...row.getRowProps()}>
            {row.cells.map((cell) => (
              <Td {...cell.getCellProps()}>
                {cell.render('Cell')}
              </Td>
            ))}
          </Tr>
      )})}
      </Tbody>
    </Table>
  )
}

const ExpandTable: FC<PropTypes> = ({ columns, data, pagination, mode }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable<any>({ columns, data}, useExpanded);

  const { pagesQuantity, currentPage, setCurrentPage } = usePaginator({
    total: pagination.total,
    initialState: {
      currentPage: 1,
      pageSize: pagination.size
    }
  });

  return (
    <Box
      maxW="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
    >
      <TableContainer>
        <Table {...getTableProps()}>
          { rows.length < 1 && (<TableCaption>暂无数据</TableCaption>) }
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {(rows as Array<Row<any> & { isExpanded: boolean }>).map((row) => {
              prepareRow(row);
              const { key } = row.getRowProps()
              return (
                <Fragment key={key}>
                  <Tr>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    ))}
                  </Tr>
                  {row.isExpanded ? (
                    <Tr>
                      <Td colSpan={visibleColumns.length} key={row.original.order_id}>
                        <TransferList mode={mode ?? 'token'} data={row.original.transactions} />
                      </Td>
                    </Tr>
                  ) : null}
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
        <PaginatorWithChild
          pagesQuantity={pagesQuantity}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            pagination.onPageChange(page);
          }}
        >
          <Container align="center" justify="space-between" w="full" p={4}>
            <Box>
              {currentPage} / {pagesQuantity}
            </Box>
            <Box>
              <Previous mr="8"> 上一页 </Previous>
              <Next> 下一页 </Next>
            </Box>
          </Container>
        </PaginatorWithChild>
      </TableContainer>
    </Box>
  );
};

export default ExpandTable;
