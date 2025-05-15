import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import { Link } from "react-router-dom";

const DropdownMenu = ({ location, label = "Menu", menuItems, onItemClick = () => { } }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button sx={{
                //color: location.pathname === item.path ? 'black' : 'inherit',
                color: "inherit",
                //textDecoration: location.pathname === item.path ? 'underline' : 'none',
                '&:hover': {
                    color: 'black',
                    textDecoration: 'underline',
                },
            }} onClick={handleMenuOpen}>{label}</Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                    onMouseLeave: handleMenuClose,
                }}
            >
                {menuItems.map((item, index) => (
                    <MenuItem
                        sx={{
                            color: location.pathname === item.path ? 'black' : 'inherit',
                            textDecoration: location.pathname === item.path ? 'underline' : 'none',
                            '&:hover': {
                                color: 'black',
                                textDecoration: 'underline',
                            },
                        }}
                        key={index}
                        component={Link}
                        to={item.path}
                        onClick={() => {
                            onItemClick(item.path);
                            handleMenuClose();
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default DropdownMenu;
