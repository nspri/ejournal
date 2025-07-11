  const [clothingData, setClothingData] = useState(() => {
    const storedClothingData = sessionStorage.getItem('clothingData');
    return storedClothingData ? JSON.parse(storedClothingData) : [];
  });

  const [comicsData, setComicsData] = useState(() => {
    const storedComicsData = sessionStorage.getItem('comicsData');
    return storedComicsData ? JSON.parse(storedComicsData) : [];
  });

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
    <Typography variant="body2" sx={{ mb: 2 }}>
                                            {previews[article.id] || "Generating preview..."}
                                        </Typography>