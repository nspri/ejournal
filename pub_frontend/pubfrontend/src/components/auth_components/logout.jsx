// src/components/LogoutButton.jsx
import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { AuthContext } from '../../providers/AuthContext'; // Update path as needed
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
            // Clear session storage, localStorage or any other session data
            //localStorage.removeItem('token'); // If you're using localStorage to store tokens
            sessionStorage.clear(); // If session data is stored in sessionStorage
            localStorage.clear();
            logout();

            // Optionally redirect to login or homepage
            navigate("/login"); // Redirecting user to login page after logout

            // You can also update the state to reflect the logged-out status
        }
    };

    return (
        isLoggedIn == true ? (
            <>
                <Button color="inherit" onClick={handleLogout}>
                    LogOut
                </Button>
            </>
        ) : (<></>)
    );
};

export default LogoutButton;
