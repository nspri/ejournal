import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Adjust the import based on your file structure

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  
  // Separate state variables for art, clothing, and comics
  const [artData, setArtData] = useState(() => {
    const storedArtData = sessionStorage.getItem('artData');
    return storedArtData ? JSON.parse(storedArtData) : [];
  });
  
  const [clothingData, setClothingData] = useState(() => {
    const storedClothingData = sessionStorage.getItem('clothingData');
    return storedClothingData ? JSON.parse(storedClothingData) : [];
  });

  const [comicsData, setComicsData] = useState(() => {
    const storedComicsData = sessionStorage.getItem('comicsData');
    return storedComicsData ? JSON.parse(storedComicsData) : [];
  });

  // Fetch user data from API when logged in
  const fetchUserData = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch('https://npvbackend.onrender.com/shop/getall'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Store data separately in state and sessionStorage
        setArtData(data.art);
        setClothingData(data.clothing);
        setComicsData(data.comics);
        console.log(data.comics)
        
        sessionStorage.setItem('artData', JSON.stringify(data.art));
        sessionStorage.setItem('clothingData', JSON.stringify(data.clothing));
        sessionStorage.setItem('comicsData', JSON.stringify(data.comics));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isLoggedIn]);

  // Function to update individual data
  const updateArtData = (newData) => {
    setArtData((prevData) => [...prevData, newData]);
    sessionStorage.setItem('artData', JSON.stringify([...artData, newData]));
  };

  const updateClothingData = (newData) => {
    setClothingData((prevData) => [...prevData, newData]);
    sessionStorage.setItem('clothingData', JSON.stringify([...clothingData, newData]));
  };

  const updateComicsData = (newData) => {
    setComicsData((prevData) => [...prevData, newData]);
    sessionStorage.setItem('comicsData', JSON.stringify([...comicsData, newData]));
  };
  const getItemById = (type, id) => {
    if (type === 'art') {
      return artData.find((item) => item.art_id === id);
    } else if (type === 'clothing') {
      return clothingData.find((item) => item.id === id);
    } else if (type === 'comics') {
      return comicsData.find((item) => item.id === id);
    }
    return null;
  };

  return (
    <UserContext.Provider 
      value={{ 
        artData, 
        clothingData, 
        comicsData, 
        getItemById,
        updateArtData, 
        updateClothingData, 
        updateComicsData 
      }}>
      {children}
    </UserContext.Provider>
  );
};
