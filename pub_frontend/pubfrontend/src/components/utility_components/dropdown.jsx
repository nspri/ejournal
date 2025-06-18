import React, { useState, useRef } from "react";
import {
    Popper,
    Paper,
    MenuItem,
    Button,
    ClickAwayListener,
    useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const DropdownMenu = ({
    location,
    label = "Menu",
    menuItems = [],
    onItemClick = () => {},
    sx = {},
}) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const timeoutRef = useRef(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // sm & md are mobile now

    const handleMouseEnter = () => {
        if (!isMobile) {
            clearTimeout(timeoutRef.current);
            setOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            timeoutRef.current = setTimeout(() => {
                setOpen(false);
            }, 200);
        }
    };

    const cancelClose = () => clearTimeout(timeoutRef.current);

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen((prev) => !prev);
    };

    const handleClickAway = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleItemClick = (itemPath) => {
        onItemClick(itemPath);
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    display: "inline-block",
                    position: "relative",
                }}
            >
                <Button
                    ref={anchorRef}
                    onClick={handleClick} // always allow click
                    sx={{
                        color: "inherit",
                        textTransform: "none",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        minWidth: "auto",
                        ...sx,
                    }}
                >
                    {label}
                </Button>

                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    disablePortal={false}
                    modifiers={[
                        {
                            name: "offset",
                            options: {
                                offset: [0, 8],
                            },
                        },
                    ]}
                    style={{ zIndex: 1300 }}
                >
                    <Paper
                        onMouseEnter={cancelClose}
                        onMouseLeave={handleMouseLeave}
                        elevation={3}
                        sx={{
                            maxHeight: "400px",
                            overflowY: "auto",
                            minWidth: "200px",
                            mt: 0.5,
                        }}
                    >
                        {menuItems.map((item, index) => (
                            <MenuItem
                                key={index}
                                component={Link}
                                to={item.path}
                                onClick={() => handleItemClick(item.path)}
                                sx={{
                                    color: location?.pathname === item.path ? "primary.main" : "inherit",
                                    fontWeight: location?.pathname === item.path ? "bold" : "normal",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Paper>
                </Popper>
            </div>
        </ClickAwayListener>
    );
};

export default DropdownMenu;
