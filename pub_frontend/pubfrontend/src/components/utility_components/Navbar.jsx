import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Drawer, List, ListItem, Stack } from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.JPG";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../../providers/AuthContext";
import LogoutButton from "../auth_components/logout";
import DropdownMenu from "./dropdown";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Articles" },
  { label: "About", path: "/about" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Editorial Team", path: "/edit_team" },
  { label: "ISSUES", path: "/edit_team" },
  { label: "Ethics", path: "/ethics" },
  { label: "Policies & Guidelines", path: "/p&g" },
];

const articlesdropdown = [
  { label: "Articles & Submissions", path: "/articles_list" },
  { label: "Submit Articles", path: "/submission" },
];

const aboutdropdowm = [
  { label: "About NIJOPHAR", path: "/about_nijophar" },
  { label: "About NSPRI", path: "/about_nspri" },
];

const ethicsDropdown = [
  { label: "Duties of Publisher", path: "/duties-of-publisher" },
  { label: "Publication Ethics Policy", path: "/publication-ethics-policy" },
  { label: "Duties of Editors", path: "/duties-of-editors" },
  { label: "Duties of Authors", path: "/duties-of-authors" },
  { label: "Duties of Reviewers", path: "/duties-of-reviewers" },
  { label: "Duties of Sponsors", path: "/duties-of-sponsors" },
  { label: "Copyright Issues", path: "/copyright-issues" },
  { label: "Handling Publication Malpractice", path: "/handling-publication-malpractice" },
];

const policydropdown = [
  { label: "Peer Review Policy", path: "/peer-review-policy" },
  { label: "Editorial Policies", path: "/editorial-policies" },
  { label: "Reviewer's Guidelines", path: "/reviewer-guidelines" },
  { label: "Digital Archiving Policy", path: "/digital-archiving-policy" },
  { label: "Advertising & Marketing Policies", path: "/advertising-marketing-policies" },
];

const issuesdropdown = [
  { label: "CURRENT", path: "/current" },
  { label: "ARCHIVE", path: "/archive" },
];

const drop_downlabels = [
  { label: "Articles", items: articlesdropdown },
  { label: "About", items: aboutdropdowm },
  { label: "Policies & Guidelines", items: policydropdown },
  { label: "ISSUES", items: issuesdropdown },
  { label: "Ethics", items: ethicsDropdown },
];

const navAccess = [
  { label: "Login", path: "/login" },
  { label: "Register", path: "/register" }
];

const staffAccess = [
  { label: "Review Articles", path: "/review" },
];

const articleCategories = [
  { label: 'Agriculture', path: '/agriculture' },
  { label: 'Health', path: '/health' },
  { label: 'Climate', path: '/climate' },
  { label: 'Law & Order', path: '/law-and-order' },
  { label: 'Society', path: '/society' },
  { label: 'Education', path: '/education' },
  { label: 'Politics', path: '/politics' },
];

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isStaff = sessionStorage.getItem('is_staff');
  
  const [fullNav, setFullNav] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerAnchorEl, setDrawerAnchorEl] = useState(null);
  
  const location = useLocation();

  useEffect(() => {
    let updatedNav;

    if (isLoggedIn) {
      updatedNav = [...navItems];
      if (isStaff === "true") {
        updatedNav = [...updatedNav, ...staffAccess];
      }
    } else {
      updatedNav = [...navItems, ...navAccess];
    }

    setFullNav(updatedNav);
  }, [isLoggedIn, isStaff]);

  const dropdownMap = Object.fromEntries(
    drop_downlabels.map(({ label, items }) => [label, items])
  );

  const filterpostByCategory = (category) => {
    console.log("Filtering by category:", category);
  };

  const handleClick = () => {
    filterpostByCategory("all");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerMenuOpen = (event) => {
    setDrawerAnchorEl(event.currentTarget);
  };

  const handleDrawerMenuClose = () => {
    setDrawerAnchorEl(null);
  };

  const toggleDrawer = (open) => setDrawerOpen(open);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#141414' }}>
        <Toolbar>
          {/* Logo and Title */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="Website Logo"
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              NIJOPHAR
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          <Box sx={{ 
            ml: 'auto', 
            display: { xs: "none", md: "flex" },
            alignItems: 'center',
            gap: 0.5
          }}>
            {fullNav.map((item, index) => (
              dropdownMap[item.label] ? (
                <DropdownMenu
                  key={index}
                  location={location}
                  label={item.label}
                  menuItems={dropdownMap[item.label]}
                  sx={{
                    color: location.pathname.startsWith(item.path || '') ? '#fff' : '#dfdfdf',
                    textDecoration: location.pathname.startsWith(item.path || '') ? 'underline' : 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      color: '#fff',
                      bgcolor: '#333',
                      textDecoration: 'underline',
                    },
                  }}
                />
              ) : (
                <Button
                  key={index}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  onClick={handleClick}
                  sx={{
                    color: location.pathname === item.path ? '#fff' : '#dfdfdf',
                    textDecoration: location.pathname === item.path ? 'underline' : 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      color: '#fff',
                      bgcolor: '#333',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {item.label}
                </Button>
              )
            ))}
            
            {/* Article Categories Dropdown */}
            <Button 
              color="inherit" 
              onClick={handleMenuOpen}
              sx={{
                color: '#dfdfdf',
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                px: 1,
                '&:hover': {
                  color: '#fff',
                  bgcolor: '#333',
                  textDecoration: 'underline',
                },
              }}
            >
              Categories
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              {articleCategories.map((category, index) => (
                <MenuItem
                  key={index}
                  component={Link}
                  to="/post"
                  onClick={() => {
                    filterpostByCategory(category.path);
                    handleMenuClose();
                  }}
                >
                  {category.label}
                </MenuItem>
              ))}
            </Menu>
            
            {/* Logout Button */}
            {isLoggedIn && <LogoutButton />}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "block", md: "none" }, ml: 'auto' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {fullNav.map((item, index) => (
              <ListItem key={index} sx={{ padding: 0 }}>
                {dropdownMap[item.label] ? (
                  <DropdownMenu
                    location={location}
                    label={item.label}
                    menuItems={dropdownMap[item.label]}
                    onItemClick={() => toggleDrawer(false)}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      color: location.pathname.startsWith(item.path || '') ? 'black' : 'inherit',
                      textDecoration: location.pathname.startsWith(item.path || '') ? 'underline' : 'none',
                      '&:hover': {
                        color: 'black',
                        bgcolor: '#dfdfdf',
                        textDecoration: 'underline',
                      },
                    }}
                  />
                ) : (
                  <Button
                    color="inherit"
                    component={Link}
                    to={item.path}
                    onClick={() => {
                      handleClick();
                      toggleDrawer(false);
                    }}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      color: location.pathname === item.path ? 'black' : 'inherit',
                      textDecoration: location.pathname === item.path ? 'underline' : 'none',
                      '&:hover': {
                        color: 'black',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                )}
              </ListItem>
            ))}
            
            <ListItem sx={{ padding: 0 }}>
              <Button 
                color="inherit" 
                onClick={handleDrawerMenuOpen}
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    color: 'black',
                    textDecoration: 'underline',
                  },
                }}
              >
                Categories
              </Button>
              
              <Menu
                anchorEl={drawerAnchorEl}
                open={Boolean(drawerAnchorEl)}
                onClose={handleDrawerMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    maxHeight: '50vh',
                    overflowY: 'auto',
                  },
                }}
              >
                {articleCategories.map((category, index) => (
                  <MenuItem
                    key={index}
                    component={Link}
                    to="/post"
                    onClick={() => {
                      filterpostByCategory(category.path);
                      handleDrawerMenuClose();
                      toggleDrawer(false);
                    }}
                  >
                    {category.label}
                  </MenuItem>
                ))}
              </Menu>
            </ListItem>
            
            {isLoggedIn && (
              <ListItem sx={{ padding: 0 }}>
                <LogoutButton />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;