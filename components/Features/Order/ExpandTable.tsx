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
  pagination: {
    total: number;
    onPageChange: (page: number, size?: number) => void;
    defaultPage?: number,
    size?: number,
  }
}

const PaginatorWithChild: FC<PropsWithChildren<PaginatorProps>> = Paginator;

const TransferList: FC<{ data: any[]}> = ({ data }) => {
  const columns = useMemo(() => [
    { Header: '接收地址', accessor: 'to' },
    { 
      Header: '转账数量', 
      Cell: ({ row }: any) => (
        <Text>
          {row.original.amount}
          {getTokenByContract(row.original.contract)}
        </Text>
      ),
    },
    { Header: 'Gas 使用数量', accessor: 'gas_paid_amount' },
    { Header: 'Gas 使用状态', accessor: 'gas_paid_status' },
    { Header: '已使用 Gas 数量', accessor: 'gas_used' },
  ], []);
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
          <Tr>
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

const ExpandTable: FC<PropTypes> = ({ columns, data, pagination }) => {
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
              return (
                <>
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    ))}
                  </Tr>
                  {row.isExpanded ? (
                    <Tr>
                      <Td colSpan={visibleColumns.length}>
                        <TransferList data={row.original.transactions} />
                      </Td>
                    </Tr>
                  ) : null}
                </>
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
