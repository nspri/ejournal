import React, { useState, useContext ,useEffect} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Drawer, List, ListItem, ListItemText, Stack, } from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import logo from "../../assets/logo.JPG";
//import { PostContext } from './postcontext';
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../../providers/AuthContext";
//import { AuthProvider } from "../providers/AuthContext";
import LogoutButton from "../auth_components/logout";
import Dashboard from "../page_components/Dashboard";
import DropdownMenu from "./dropdown";
import { label } from "framer-motion/client";


const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Editorial Team", path: "/edit_team" },
  { label: "ISSUES", path: "/edit_team" },
  { label: "Ethics", path: "/ethics" },
  { label: "Policies & Guidelines", path: "/p&g" },
  //{ label: ""}
  //{ label: "Article Categories", path: "/article-categories" },
];
const aboutdropdowm = [
  { label: "About NIJOPHAR", path: "/about_nijophar" },
  { label: "About NSPRI", path: "/about_nspri" },

]

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
]
const contributionsdropdown = [
  { label: "Ethics", path: "/ethic" },
  { label: "Journal Template", path: "/jt" },
]

let drop_downlabels = [
  { label: "About", items: aboutdropdowm },
  { label: "Policies & Guidelines", items: policydropdown },
  { label: "ISSUES", items: issuesdropdown },
  { label: "Ethics", items: ethicsDropdown },


]
const navAccess = [
  { label: "Login", path: "/login" },
  { label: "Register", path: "/register" }
]

const staffAccess = [
  { label: "Review Articles", path: "/review" },
]


const articleCategories = [
  { label: 'Agriculture', path: 'agriculture' },
  { label: 'Health', path: 'health' },
  { label: 'Climate', path: 'climate' },
  { label: 'Law & Order', path: 'law-and-order' },
  { label: 'Society', path: 'society' },
  { label: 'Education', path: 'education' },
  { label: 'Politics', path: 'politics' },
];
const loggedIn = false; // <-- Replace this with actual login check (e.g. from context or localStorage)



function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext); // Access isLoggedIn and logout
  //const fullNav = isLoggedIn ? navItems : [...navItems, ...navAccess];
  const isStaff = sessionStorage.getItem('is_staff')
  console.log(isStaff)
  
   const [fullNav, setFullNav] = useState([]);
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
  }, [isLoggedIn, isStaff, navItems, staffAccess, navAccess]);
  const dropdownMap = Object.fromEntries(
    drop_downlabels.map(({ label, items }) => [label, items])
  );
  //const { isLoggedIn, setIsLoggedIn} = useState(false)
  //let isLoggedIn = false;
  const [drawerOpen, setDrawerOpen] = useState(false);
  //const { setCate,filterpostByCategory } = useContext(PostContext);
  const handleClick = () => {
    //setCate("All Post"); // Replace 'item.category' with the appropriate category value
    filterpostByCategory("all");
    // console.log("all post");   
  };
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown menu
  };
  const toggleDrawer = (open) => setDrawerOpen(open);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      // Clear session storage, localStorage or any other session data
      //localStorage.removeItem('token'); // If you're using localStorage to store tokens
      sessionStorage.clear(); // If session data is stored in sessionStorage
      logout();

      // Optionally redirect to login or homepage
      navigate("/login"); // Redirecting user to login page after logout

      // You can also update the state to reflect the logged-out status
    }
  };

  const handleMenuClose = (category) => {
    //filterpostByCategory(category.path)
    setAnchorEl(null); // Close the dropdown menu
  };
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#c0d3d9' }}> {/* Changed position to "fixed" */}
        <Toolbar>
          {/* Website Name on the Left */}
          <Stack direction="row" spacing={1 }>
            <Typography textAlign="left" variant="h6" component="div">
              NIJOPHAR
            </Typography>
            <Box>
              <Box
                component="img"
                src={logo}
                alt="Website Logo"
                sx={{ width: 40, height: 40 }}
              />
            </Box>
          </Stack>

          {/* Navigation Items on the Right */}
          <Box sx={{ ml: 'auto', display: { xs: "none", md: "flex" } }}>
            {fullNav.map((item, index) => (
              dropdownMap[item.label] ? (
                <DropdownMenu
                  location
                  key={index}
                  label={item.label}
                  menuItems={dropdownMap[item.label]} // Pass the matched items
                />
              ) : (
                <Button
                  key={index}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  onClick={handleClick}
                  sx={{
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
              )
            ))}
            <Button color="inherit" onClick={handleMenuOpen} onMouseEnter={handleMenuOpen} sx={{
              '&:hover': {
                color: 'black', // Change this to the desired hover color
                textDecoration: 'underline',
              },
            }}>
              Article Categories
            </Button>
            <LogoutButton />
            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)} // Boolean to show/hide menu
              onClose={handleMenuClose} // Handle menu close
              MenuListProps={{
                onMouseLeave: handleMenuClose, // Close menu when mouse leaves
              }}
            >
              {articleCategories.map((category, index) => (
                <MenuItem
                  key={index}
                  //component={Link} // Use React Router Link
                  //to={category.path}
                  // onClick={() =>filterpostByCategory(category.path)}
                  component={Link}
                  to="/post"
                  onClick={() => filterpostByCategory(category.path)} // Close menu after click
                >
                  {category.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box color="powderblue" sx={{ ml: 'auto', display: { xs: "flex", md: "none" } }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              color="powderblue"
              anchor="left"
              open={drawerOpen}
              onClose={() => toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => toggleDrawer(false)}
                onKeyDown={() => toggleDrawer(false)}

              >
                <List>
                  {fullNav.map((item, index) => (
                    <ListItem>
                      <Button
                        key={index}
                        color="inherit"
                        component={Link}
                        to={item.path}
                        onClick={handleClick}
                        sx={{
                          color: location.pathname === item.path ? 'black' : 'inherit', // Highlight if active
                          textDecoration: location.pathname === item.path ? 'underline' : 'none', // Underline if active
                          '&:hover': {
                            color: 'black', // Change this to the desired hover color
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </ListItem>
                  ))}
                  <ListItem>

                    <Button color="inherit" onClick={handleMenuOpen} onMouseEnter={handleMenuOpen} sx={{
                      '&:hover': {
                        color: 'black', // Change this to the desired hover color
                        textDecoration: 'underline',
                      },
                    }}>
                      Article Categories
                    </Button>
                    {/* Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)} // Boolean to show/hide menu
                      onClose={handleMenuClose} // Handle menu close
                      MenuListProps={{
                        onMouseLeave: handleMenuClose, // Close menu when mouse leaves
                      }}
                    >
                      {articleCategories.map((category, index) => (
                        <MenuItem
                          key={index}
                          //component={Link} // Use React Router Link
                          //to={category.path}
                          // onClick={() =>filterpostByCategory(category.path)}
                          component={Link}
                          to="/post"
                          onClick={() => filterpostByCategory(category.path)} // Close menu after click
                        >
                          {category.label}
                        </MenuItem>
                      ))}
                    </Menu>

                  </ListItem>
                  <ListItem>
                    <LogoutButton />
                  </ListItem>

                </List>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </AppBar>
    </>

  );
}


export default Navbar;