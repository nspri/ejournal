import { useState } from "react";
import { TextField, Stack, Typography, Chip, Button, Paper, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from "@mui/system";
import logo from "../../assets/logo.JPG";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import { dev_API_BASE_URL } from "../api/api_services";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
//import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCookie } from "../utility/utility";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // For the error icon




// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 5000,
    margin: "auto",
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: { width: '400px' },
    [theme.breakpoints.up('md')]: { width: '600px' },
    [theme.breakpoints.up('lg')]: { width: '800px' },
    [theme.breakpoints.up('xl')]: { width: '1200px' },
}));

const StyledForm = styled("form")(({ theme }) => ({
    width: "100%",
    marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

function Submissions() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [file, setFile] = useState(null);
    const [authors, setAuthors] = useState([{ firstname: "", lastname: "", title: "" }]);

    const removeAuthor = (indexToRemove) => {
        setAuthors((prev) => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleAuthorChange = (index, field, value) => {
        const newAuthors = [...authors];
        newAuthors[index][field] = value;
        setAuthors(newAuthors);
    };

    const addAuthor = () => {
        setAuthors([...authors, { firstname: "", lastname: "", title: "" }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        if (coverImage) formData.append("cover_image", coverImage);
        if (file) formData.append("file", file);
        formData.append("authors", JSON.stringify(authors)); // send authors list
        //const csrftoken = getCookie("csrftoken");
        // console.log(formData)
        try {
            const response = await fetch(`${dev_API_BASE_URL}${"/articles/articles/"}`, {
                method: "POST",
                headers: {
                    //"X-CSRFToken": csrftoken,
                    //'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                },
                body: formData,
            });
            const result = await response.json();
            if (response.status == 201) {
                console.log("Upload success:", result);
                navigate("/");
            } else {
                setError(result.error || "An error occurred while uploading.");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setError(result.error || "An error occurred while uploading.");
        }
    };

    return (
        <StyledPaper elevation={15}>
            <img src={logo} alt="Logo" style={{ width: 100, marginBottom: 16 }} />
            {error && (
                <Chip
                    label={error}
                    color="error"
                    onDelete={() => setError(null)} // Allows closing the chip
                    icon={<ErrorOutlineIcon />} // Add an error icon for more clarity
                    style={{
                        marginTop: "20px",
                        borderRadius: "25px", // Rounded corners for a smoother look
                        padding: "10px 20px", // Larger padding for a more spacious look
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                        transition: "transform 0.3s ease", // Smooth animation on hover
                        fontWeight: "bold", // Bold text for emphasis
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)"; // Slight scaling on hover
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)"; // Revert scaling when not hovered
                    }}
                />
            )}

            <Typography variant="h5" component="h1" gutterBottom>
                Submit Article
            </Typography>
            <StyledForm onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    sx={{
                        width: {
                            xs: '100%', sm: '80%', md: '60%', lg: '80%'
                        }
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                />

                {/* Author Inputs */}
                <Box justifyContent="center" alignItems="center">
                    <Typography variant="h6">Authors</Typography>
                </Box>
                {authors.map((author, index) => (
                    <Box key={index} justifyContent="center" alignItems="center" display="flex" gap={2} flexWrap="wrap" mb={2}>
                        <TextField
                            label="First Name"
                            value={author.firstname}
                            onChange={(e) => handleAuthorChange(index, "firstname", e.target.value)}
                        />
                        <TextField
                            label="Last Name"
                            value={author.lastname}
                            onChange={(e) => handleAuthorChange(index, "lastname", e.target.value)}
                        />
                        <TextField
                            label="Title"
                            value={author.title}
                            onChange={(e) => handleAuthorChange(index, "title", e.target.value)}
                        />
                        {authors.length > 1 && (
                            <IconButton
                                color="error"
                                onClick={() => removeAuthor(index)}
                                aria-label="delete"
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}

                    </Box>
                ))}
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addAuthor}
                    sx={{ mb: 2 }}
                >
                    Add Another Author
                </Button>


                {/* File Uploads */}
                {/* Cover Image Upload */}
                <Box mt={3}>
                    <Typography variant="body2" gutterBottom>Cover Image</Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Choose Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => setCoverImage(e.target.files[0])}
                        />
                    </Button>

                    {coverImage && (
                        <Stack direction="column" spacing={3} alignItems="center" mt={1}>
                            <Chip
                                icon={<ImageIcon />}
                                label={coverImage.name}
                                onDelete={() => setCoverImage(null)}
                                deleteIcon={<CloseIcon />}
                                color="primary"
                                variant="outlined"
                            />
                        </Stack>
                    )}
                </Box>

                {/* Document Upload */}
                <Box mt={3}>
                    <Typography variant="body2" gutterBottom>Upload Document (.pdf, .docx)</Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Choose File
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            hidden
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </Button>

                    {file && (
                        <Stack direction="column" spacing={3} alignItems="center" mt={1}>
                            <Chip
                                icon={<InsertDriveFileIcon />}
                                label={file.name}
                                onDelete={() => setFile(null)}
                                deleteIcon={<CloseIcon />}
                                color="secondary"
                                variant="outlined"
                            />
                        </Stack>
                    )}
                </Box>


                <StyledButton
                    sx={{
                        width: {
                            xs: '100%', sm: '80%', md: '60%', lg: '80%'
                        }
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Submit

                </StyledButton>
            </StyledForm>
        </StyledPaper >
    );
}

export default Submissions;
