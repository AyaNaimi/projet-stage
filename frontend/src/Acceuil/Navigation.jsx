import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PeopleIcon from "@mui/icons-material/People";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";
import { useOpen } from "./OpenProvider";
import { useHeader } from "./HeaderContext";

const drawerWidth = 220;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  width: "100%",
  maxWidth: "420px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#2c3e50",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#2c3e50",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1.2, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

const NavItem = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: "0 24px 24px 0",
  color: "#ffffff",
  "& .MuiListItemIcon-root": {
    color: "#ffffff",
    minWidth: 40,
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  "&.active": {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderLeft: "4px solid #ffffff",
  },
}));

const LogoutItem = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(1),
  marginTop: "auto",
  borderRadius: 12,
  color: "#ffffff",
  "& .MuiListItemIcon-root": {
    color: "#ffffff",
    minWidth: 40,
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
}));

const navItems = [
  {
    to: "/",
    label: "Accueil",
    icon: <HomeIcon />,
    match: (pathname) => pathname === "/",
  },
  {
    to: "/employes",
    label: "Gestion employes",
    icon: <PeopleIcon />,
    match: (pathname) => pathname === "/employes",
  },
  {
    to: "/emphistorique",
    label: "Historique",
    icon: <HistoryIcon />,
    match: (pathname) => pathname === "/emphistorique",
  },
];

const Navigation = () => {
  const { open, toggleOpen } = useOpen();
  const { title, searchQuery, setSearchQuery, onPrint, onExportPDF, onExportExcel } = useHeader();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const isMenuOpen = Boolean(anchorEl);

  const avatarAlt = useMemo(() => {
    if (!user) return "User";
    return user.name || `${user.nom || ""} ${user.prenom || ""}`.trim() || "User";
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      const token = localStorage.getItem("API_TOKEN");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (cancelled) return;

        const payload = Array.isArray(response.data) ? response.data[0] : response.data;
        setUser(payload || null);
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#f9fafb",
          color: "#2c3e50",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          width: open ? `calc(100% - ${drawerWidth}px)` : "calc(100% - 72px)",
          ml: open ? `${drawerWidth}px` : "72px",
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {!open && (
            <IconButton color="inherit" edge="start" onClick={toggleOpen}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            component="h1"
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              fontSize: "22px",
              fontWeight: 700,
              color: "#2c3e50",
            }}
          >
            {title || "Gestion des employes"}
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Recherche globale..."
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </Search>

          <IconButton color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)}>
            <MoreVertIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onPrint?.();
              }}
              disabled={!onPrint}
            >
              <PrintIcon sx={{ mr: 1 }} />
              Imprimer
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onExportPDF?.();
              }}
              disabled={!onExportPDF}
            >
              <PictureAsPdfIcon sx={{ mr: 1 }} />
              Export PDF
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onExportExcel?.();
              }}
              disabled={!onExportExcel}
            >
              <TableViewIcon sx={{ mr: 1 }} />
              Export Excel
            </MenuItem>
          </Menu>

          <Avatar alt={avatarAlt} src={user?.photo || ""} sx={{ width: 40, height: 40 }} />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 72,
            boxSizing: "border-box",
            backgroundColor: "#2c767c",
            color: "#ffffff",
            overflowX: "hidden",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
            minHeight: "64px",
          }}
        >
          {open && (
            <IconButton onClick={toggleOpen} sx={{ color: "#ffffff" }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>

        <Divider />

        <List sx={{ pt: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              component={Link}
              to={item.to}
              className={item.match(location.pathname) ? "active" : ""}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </NavItem>
          ))}

          <Box sx={{ flexGrow: 1 }} />

          <LogoutItem onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Se deconnecter" />}
          </LogoutItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Navigation;
