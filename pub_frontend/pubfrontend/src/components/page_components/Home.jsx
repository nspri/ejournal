import React, { useContext, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles'; // Replace makeStyles with styled
import { Link as RouterLink } from 'react-router-dom';

import { UserContext } from '../../providers/Usercontext';
import { dev_API_BASE_URL } from '../api/api_services';
import { useNavigate } from "react-router-dom";


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
  const { articleData } = useContext(UserContext);
  const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
  }));
  console.log(articleData)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchpost();
        await fetchlatestpost();
        await fetchpodcast();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Box height={100} />

      <Stack spacing={4} alignItems="center" textAlign="center">
        <Typography variant="h3" fontWeight="bold">
          N.S.P.R.I Publication
        </Typography>
        <Box maxWidth={600}>
          <Typography variant="h6">
            Science communication, articles and discussions on Nigerian public-health,
            culture, politics, and more.
          </Typography>
        </Box>
        <StyledButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          component={RouterLink}
          
          to="/submission"
        >
          Publish with us
        </StyledButton>
      </Stack>


      <Box height={50} />

      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{ textDecoration: 'underline' }}
      >
        Latest Post
      </Typography>

      <Box height={50} />

      <Grid container spacing={4} justifyContent="center" sx={{ backgroundColor: '#c0d3d9', padding: 3 }}>
        {articleData.map((item) => (
          < Grid item xs={12} sm={6} md={4} key={item.id} >
            <Card sx={{ height: { xs: 400, sm: 450, md: 450 }, width: { xs: 300, sm: 300, md: 300, lg: 350, xl: 350 }, }}>
              <CardMedia
                component="img"
                height="180"
                image={`${dev_API_BASE_URL}/${item.cover_image}`}
                alt={item.title}
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
                    WebkitLineClamp: 5,
                    overflow: 'hidden',
                  }}
                >
                  {item.content}
                </Typography>
                <Box mt={2}>
                  <Link
                    component={RouterLink}
                    to={`/post/${item.id}`}
                    variant="body2"
                    sx={{ textDecoration: 'none' }}
                  >
                    Read More
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box >
  );
};

export default Home;
