// src/pages/About.js
import React, {useContext,useEffect} from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography ,Grid ,Button,Card, CardContent, CardMedia,  } from '@mui/material';
import backgroundImage from '../assets/background.avif';
import { PostContext } from './postcontext';
const categories = [
  { label: 'Agriculture', path: 'agriculture' },
  { label: 'Health', path: 'health' },
  { label: 'Climate', path: 'climate' },
  { label: 'Law & Order', path: 'law-and-order' },
  { label: 'Society', path: 'society' },
  { label: 'Education', path: 'education' },
  { label: 'Politics', path: 'politics' },
];
const Home = () => {
  const {filterpostByCategory,latestpostData,fetchpost,fetchlatestpost,fetchpodcast, } = useContext(PostContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchpost();
        await fetchlatestpost();
        await fetchpodcast();
      } catch (error) {
        //console.error("Error fetching cart:", error);
      }
    };
  
    fetchData();
    
  }, []);
  return (
    <Box>

      <Box height={100}></Box>

      <Stack spacing={7} alignItems="center">
        
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          Musings with Dara
        </Typography>
        <Box width={500} >
          <Typography variant="h6">
          Science communication, articles and discussions on a variety of Nigerian-related public-health, cultural and political issues, vibrant ideas and more.
          </Typography>
        </Box>
      </Stack>
      <Box height={100}></Box>
      <Box
      sx={{
        backgroundColor: 'primary.main', // Set background color
        color: 'white',                  // Text color for contrast
        padding: 3,                      // Padding inside the Box
        borderRadius: 1,                 // Rounded corners
        minwidth: '100%',                  // Full screen width
        //minHeight: '100vh',              // Full screen height
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {/* Top row with 4 items */}
        {categories.slice(0, 4).map((category, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Button
            fullWidth
            sx={{
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: 'primary.dark', // Theme-based color
              '&:hover': {
                backgroundColor: 'primary.light', // Hover effect
              },
            }}
            onClick={() =>filterpostByCategory(category.path)}
            component={Link}
             // Optional: Use for navigation if using React Router
            to="/post"  //{`/${category.path}`} // Use the `path` property for routing
            >
            {category.label}
            </Button>
          </Grid>
        ))}

        {/* Bottom row with 3 items */}
        {categories.slice(4).map((category, index) => (
          <Grid item xs={12} sm={4} key={index + 4}>
            <Button
              fullWidth
              sx={{
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
              onClick={() =>filterpostByCategory(category.path)}
              component={Link}
              to="/post"
            >
              {category.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
    <Box height={100}></Box>
    <Typography variant="h4" sx={{ fontWeight: 'bold',textDecoration: 'underline', }}>
          Latest Post
    </Typography>
    <Box height={50}></Box>
    <Grid container spacing={3}>
      {latestpostData.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card sx={{  height: { xs: 400, sm: 450, md: 450 }, width: {xs: 400, sm: 300, md: 300, lg: 350,xl: 400},}}>
            <CardMedia
              component="img"
              alt={item.title}
              height="140"
              image={`http://localhost:8000${item.image}`}
              //title={item.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 5, // Limit to 2 lines
            overflow: 'hidden',
          }}
        >
          {item.content}
        </Typography>

        {/* Link to the post detail page */}
        <Link
          component={RouterLink} // Use React Router Link for navigation
          to={`/post/${item.id}`} // Use the post ID for the detail page URL
          variant="body2"
          sx={{ textDecoration: 'none', marginTop: 1 }}
        >
          Read More
        </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    </Box>
  );
};

export default Home;