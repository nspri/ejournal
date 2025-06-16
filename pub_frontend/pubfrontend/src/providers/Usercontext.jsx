import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Adjust the import based on your file structure
import { dev_API_BASE_URL } from '../components/api/api_services';
// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // Separate state variables for art, clothing, and comics
  const [articleData, setArticleData] = useState(() => {
    const storedArticleData = sessionStorage.getItem('articleData');
    return storedArticleData ? JSON.parse(storedArticleData) : [];
  });

  // Fetch user data from API when logged in
  const fetchUserData = async () => {
    if (isLoggedIn) {
      try {

        const response = await fetch(`${dev_API_BASE_URL}${"/articles/articles"}`);//shop / getall'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Store data separately in state and sessionStorage
        setArticleData(data);
        //setClothingData(data.clothing);
        //setComicsData(data.comics);
        console.log(data)

        sessionStorage.setItem('articleData', JSON.stringify(data));
        //sessionStorage.setItem('clothingData', JSON.stringify(data.clothing));
        //sessionStorage.setItem('comicsData', JSON.stringify(data.comics));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isLoggedIn]);

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
        articleData,
        //clothingData,
        //comicsData,
        getItemById,
      }}>
      {children}
    </UserContext.Provider>
  );
};
