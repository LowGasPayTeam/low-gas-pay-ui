import styled from '@emotion/styled';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Select, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { NextPage } from 'next'
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { chain, useBalance } from 'wagmi'
import { NETWORKING } from '../constants';
import { WalletStateType } from "../redux";

const MainWrap = styled('div')({
  minHeight: 'calc(100vh - 68.5px)'
});

const TokenSection = styled(Paper)({
  minHeight: 500,
  padding: '16px 8px',
  boxSizing: 'border-box',
  borderRadius: 20,
})

const ApproveButton = styled(Button)({
  width: '100%',
  textTransform: 'none',
})

const CreateButton = styled(Button)({
  width: '100%',
  textTransform: 'none',
})

const TokenButton = (
  tokenName: string = '',
  isApproved: boolean,
  isSelected: boolean,
  onApprove: () => void,
) => {
  if (!isSelected) {
    return (
      <ApproveButton variant="outlined" size='large' disabled>
        Select a token
      </ApproveButton>
    )
  } else if (isApproved) {
    return (
      <ApproveButton variant="outlined" size='large' disabled>
        Approved
      </ApproveButton>
    )
  } else {
    return (
      <ApproveButton
        variant="contained"
        size='large'
        onClick={onApprove}
      >
        Allow to use your {tokenName}
      </ApproveButton>
    )
  }
}

interface TokenTransferItem {
  address: string;
  amount: string;
}

const TokenPage: NextPage = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { connection, provider, address, chainId } = state as WalletStateType;
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    chainId: NETWORKING.CHAIN_ID,
  });

  const [addrList, setAddrList] = useState<TokenTransferItem[]>([
    { address: 'example', amount: '1000' }
  ]);
  const [token, setToken] = useState();
  const [tokenName, setTokenName] = useState();
  const handleApprove = () => {};
  const handleChange = () => {};
  const handleRowDelete = (index: number) => {
    // TODO
  }
  const handleAddRow = () => {
    const newAddr = {
      address: '',
      amount: '',
    }
    setAddrList([...addrList, newAddr])
  }
  return (
    <MainWrap>
      <Container maxWidth="lg" sx={{
        marginTop: '100px',
      }}>
        <TokenSection>
          <Box sx={{
            padding: '8px 16px'
          }}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Stack spacing={2}>
                  <Select
                    value={tokenName}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  />
                  <Typography>
                    Balance: {data?.formatted} {data?.symbol}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={2}>
                  { TokenButton('DAI', true, false, handleApprove) }
                  <CreateButton variant="outlined" size='large' disabled>
                    Create
                  </CreateButton>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <TableContainer component={Box}>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddRow}
            >
              Add
            </Button>
            <Table sx={{ minWidth: 650 }} aria-label="table">
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell align="right">Address</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addrList.map((item, index) => (
                  <TableRow
                    key={item.address || index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      { index + 1 }
                    </TableCell>
                    <TableCell align="right">{ item.address }</TableCell>
                    <TableCell align="right">{ item.amount  }</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete" 
                        onClick={() => { handleRowDelete(index) }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TokenSection>
      </Container>
    </MainWrap>
  )
}

export default TokenPage
