import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CardActions,
  InputAdornment,
  TextField,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const REACT_BASE_URL = "http://localhost:3000"

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const Blog = () => {
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${REACT_BASE_URL}/blogs`, { headers });
        console.log("Blogs data:", response.data.blogs); // Debug: Log blog data
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blogs. Please try again.");
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.blogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.blogCategory?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBlogs = filteredBlogs.filter(post => post.featured);
  const regularBlogs = filteredBlogs.filter(post => !post.featured);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const isLongDescription = (description) => {
    return description?.split(' ').length > 14;
  };

  const handleOpenDialog = (blog) => {
    setSelectedBlog(blog);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBlog(null);
  };

  const getTruncatedDescription = (description) => {
    if (!description) return '';
    const words = description.split(' ');
    if (words.length > 14) {
      return words.slice(0, 14).join(' ') + '...';
    }
    return description;
  };

  const fallbackImage = 'https://via.placeholder.com/240x240?text=No+Image'; // Fallback image

  return (
    <Container maxWidth="lg">
      <Toaster position="top-right" />
      <Box sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            AC Repair Blog
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Expert tips and insights for AC maintenance and repair
          </Typography>
          <TextField
            fullWidth
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              maxWidth: 600,
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {featuredBlogs.map((post, index) => (
          <Card key={index} sx={{
            mb: 6,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="400"
                  image={post.blogImage || fallbackImage}
                  alt={post.blogName || 'Blog Image'}
                  onError={() => console.error("Failed to load featured image:", post.blogImage)}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.background.default,
                }}>
                  <Chip
                    label="Featured"
                    color="primary"
                    sx={{
                      mb: 2,
                      borderRadius: '20px',
                      px: 2,
                      py: 1,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  />
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                      mb: 2,
                    }}
                  >
                    {post.blogName}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {getTruncatedDescription(post.blogDescription)}
                  </Typography>
                  {isLongDescription(post.blogDescription) && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleOpenDialog(post)}
                      sx={{
                        borderRadius: '25px',
                        py: 1.5,
                        px: 4,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      Read More
                    </Button>
                  )}
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))}

        <Divider sx={{ my: 6 }} />

        <Grid container spacing={4}>
          {(showAll ? regularBlogs : regularBlogs.slice(0, 3)).map((post, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledCard sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={post.blogImage || fallbackImage}
                  alt={post.blogName || 'Blog Image'}
                  onError={() => console.error("Failed to load regular image:", post.blogImage)}
                  sx={{
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    {post.blogName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{
                      lineHeight: 1.6,
                      mb: 2,
                    }}
                  >
                    {getTruncatedDescription(post.blogDescription)}
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: theme.palette.text.secondary,
                    mb: 2,
                  }}>
                    <Typography variant="caption">
                      {post.uploadedDate}
                    </Typography>
                  </Box>
                </CardContent>
                {isLongDescription(post.blogDescription) && (
                  <CardActions sx={{
                    p: 2,
                    pt: 0,
                    justifyContent: 'flex-end',
                  }}>
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(post)}
                      sx={{
                        borderRadius: '20px',
                        px: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                )}
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {regularBlogs.length > 3 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleShowAll}
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              {showAll ? 'Show Less' : `Show More (${regularBlogs.length - 3} more)`}
            </Button>
          </Box>
        )}

        {filteredBlogs.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No blogs found matching your search.
            </Typography>
          </Box>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              maxHeight: '90vh',
            }
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
          }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {selectedBlog?.blogName}
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                color: theme.palette.grey[500],
                '&:hover': {
                  color: theme.palette.grey[700],
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <img
                src={selectedBlog?.blogImage || fallbackImage}
                alt={selectedBlog?.blogName || 'Blog Image'}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
                onError={() => console.error("Failed to load dialog image:", selectedBlog?.blogImage)}
              />
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {selectedBlog?.blogDescription}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Blog;