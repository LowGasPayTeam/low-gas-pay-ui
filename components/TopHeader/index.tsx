import { FC, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { providers } from "ethers";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import styled from "@emotion/styled";
import { createWeb3Modal } from '../../utils/createWeb3Modal';
import { reducer, initialState } from "../../redux";
const pages = ["Token", "NFT"];

const TextButton = styled(Button)({
  textTransform: 'none',
});

const GreenDotted = styled('span')({
  display: 'inline-block',
  lineHeight: 0,
  width: 8,
  height: 8,
  background: '#00e676',
  borderRadius: '100%',
  marginRight: 4
});

const summaryAddress = (addr: string) => addr ? `${addr.slice(0,2)}...${addr.slice(-4)}` : '';


const TopHeader: FC<any> = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const web3Modal = useRef<any>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { connection, provider, address, chainId } = state;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleWalletPickerClosed = () => {
  }

  const connectWallet = useCallback(async () => {
    try {
      console.log(web3Modal);
      const connection = await web3Modal.current.connect();
      const provider = new providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      dispatch({
        type: 'SET_WEB3_PROVIDER',
        connection,
        provider,
        address,
        chainId: network.chainId,
      });
    } catch(err) {
      console.log(err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = useCallback(async function () {
    await web3Modal.current.clearCachedProvider()
    if (provider?.disconnect && typeof provider.disconnect === 'function') {
      await provider.disconnect();
    }
    dispatch({
      type: 'RESET_WEB3_PROVIDER',
    })
  }, [provider]);

  useEffect(() => {
    if (!web3Modal.current) {
      web3Modal.current = createWeb3Modal();
    }
  }, []);

  useEffect(() => {
    if (web3Modal.current?.cachedProvider) {
      connectWallet()
    }
  }, [connectWallet]);

  useEffect(() => {
    if (connection?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('accountsChanged', accounts);
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        });
      }

      const handleChainChanged = (_hexChainId: string) => {
        // todo: 非 Ethereum 错误提示
        window.location.reload();
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log('disconnect', error);
        disconnect();
      }

      connection.on('accountsChanged', handleAccountsChanged)
      connection.on('chainChanged', handleChainChanged)
      connection.on('disconnect', handleDisconnect)

      return () => {
        if (connection.removeListener) {
          connection.removeListener('accountsChanged', handleAccountsChanged)
          connection.removeListener('chainChanged', handleChainChanged)
          connection.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [connection, disconnect]);

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Low Gas Fee
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Low Gas Fee
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <TextButton
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </TextButton>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            { address ? (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter var", sans-serif',
                  fontSize: '1rem',
                }}>
                  <GreenDotted />
                  { summaryAddress(address) }
              </Typography>
            ) : (
              <TextButton onClick={connectWallet} sx={{ my: 2, color: "white", display: "block" }}> 
                Connect Wallet
              </TextButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopHeader;
