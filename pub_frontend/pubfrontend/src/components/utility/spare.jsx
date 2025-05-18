
const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        //const res = await axios.post("/api/upload-and-extract", formData);

    } catch (err) {
        console.error("Upload error:", err);
        setError("Failed to extract content. Please try a valid .docx or .pdf file.");
    }
};

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
    <Typography variant="h5" mb={2}>Upload a Document</Typography>
    <Button variant="contained" component="label">
        Choose File
        <input type="file" hidden onChange={handleUpload} />
    </Button>
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
</>





// 🛠️ Fetch previews only once when the component mounts
//useEffect(() => {
//    const loadPreviews = async () => {
//        setLoading(true);
//        try {
//            const previewsMap = await generateArticlePreviews(storedUserProfile.articles_submitted);
//            setPreviews(previewsMap);
//        } catch (error) {
//            console.error("Error generating previews:", error);
//        } finally {
//                setLoading(false);
//           }
//      };

//loadPreviews();
//}, [storedUserProfile.articles_submitted]);
//sessionStorage.setItem("articlePreviews", JSON.stringify(previewsMap));
//setPreviews(previewsMap);