

<>
    <Box height={80}>

    </Box>

    <Box
        sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            padding: 4,
            borderRadius: 2,
        }}
    >
        <Grid container spacing={3} justifyContent="center">
            {categories.map((category, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                    <Button
                        fullWidth
                        sx={{
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: 'primary.dark',
                            '&:hover': { backgroundColor: 'primary.light' },
                        }}
                        component={RouterLink}
                        to="/post"
                        onClick={() => filterpostByCategory?.(category.path)}
                    >
                        {category.label}
                    </Button>
                </Grid>
            ))}
        </Grid>
    </Box>
</>