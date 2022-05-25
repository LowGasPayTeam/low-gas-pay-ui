import { FC, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
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
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    // window is accessible here.
  }, []);

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
            { account ? (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter var", sans-serif',
                }}>
                  <GreenDotted />
                  { ensName ?? summaryAddress(account.address ?? '') }
              </Typography>
            ) : (
              <TextButton onClick={() => connect()} sx={{ my: 2, color: "white", display: "block" }}> 
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
