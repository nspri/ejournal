import { useNavigate } from "react-router-dom";
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
import { get_article_html } from '../api/api_services';


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
  const navigate = useNavigate();
  //.log(articleData)
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
  const handlereadarticle = async (articleId) => {
    let final_destination = `articles/article_detail/${articleId}/`
    await get_article_html(final_destination);
    navigate("/fileviewer");
  }

  return (
    <Box>
      <Stack
  spacing={4}
  alignItems="center"
  textAlign="center"
  color="#dfdfdf"     // <--- add this here
>
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
  component={RouterLink}
  to="/submission"
  sx={{
    bgcolor: '#333',           // dark background
    color: '#dfdfdf',          // light text
    '&:hover': {
      bgcolor: '#555',         // slightly lighter on hover
    },
  }}
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
        color="#dfdfdf"
      >
        Latest Publications
      </Typography>

      <Box height={50} />

      <Grid container spacing={4} justifyContent="center" sx={{ padding: 3 }}>
        {articleData.map((item) => (
          < Grid item xs={12} sm={6} md={4} key={item.id} >
            <Card sx={{ height: { xs: 300, sm: 300, md: 300 }, width: { xs: 200, sm: 300, md: 300, lg: 350, xl: 350 }, }}>
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
                    //component={RouterLink}
                    //to={`/post/${item.id}`}
                    variant="body2"
                    //sx={{ textDecoration: 'none' }}
                    onClick={() => handlereadarticle(item.id)}
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
