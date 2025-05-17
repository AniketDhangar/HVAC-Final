// Full Code - BlogsManagement.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Box,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const REACT_BASE_URL = "http://localhost:3000" 

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    blogName: "",
    blogImage: "",
    blogCategory: "",
    blogDescription: "",
    uploadedDate: "",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("blogName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = [...blogs];
    if (searchTerm) {
      filtered = filtered.filter((blog) =>
        blog.blogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blogDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blogCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase() || "";
      const bValue = b[sortField]?.toLowerCase() || "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const token = localStorage.getItem("accessToken"); // Assuming you have a token stored in localStorage
  const fetchBlogs = async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${REACT_BASE_URL}/blogsforadmin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data.blogs);
      setFilteredBlogs(response.data.blogs);
      toast.success("Blogs fetched successfully");
    } catch (error) {
      console.log("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  // Validate form fields
  const validateForm = () => {
    if (!formData.blogName.trim()) {
      toast.error("Blog name is required");
      return false;
    }
    if (!formData.blogCategory.trim()) {
      toast.error("Category is required");
      return false;
    }
    if (!formData.blogDescription.trim()) {
      toast.error("Description is required");
      return false;
    }
    return true;
  };

  // Handle image change with validation and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, blogImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle dialog open (edit/add)
  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        blogName: blog.blogName || "",
        blogImage: "", // Will only set if new image is selected
        blogCategory: blog.blogCategory || "",
        blogDescription: blog.blogDescription || "",
        uploadedDate: blog.uploadedDate || "",
      });
      setImagePreview(blog.blogImage ? blog.blogImage : null); // Show current image
    } else {
      setSelectedBlog(null);
      setFormData({
        blogName: "",
        blogImage: "",
        blogCategory: "",
        blogDescription: "",
        uploadedDate: "",
      });
      setImagePreview(null);
    }
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBlog(null);
    setImagePreview(null);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "blogImage") {
      handleImageChange(e);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };



  // Handle form submit (add/edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    
    try {
      const form = new FormData();
      form.append("blogName", formData.blogName);
      form.append("blogCategory", formData.blogCategory);
      form.append("blogDescription", formData.blogDescription);
      
      if (selectedBlog) {
        // Update blog
        form.append("_id", selectedBlog._id);
        if (formData.blogImage) {
          form.append("blogImage", formData.blogImage);
        }
        
        const response = await axios.put(`${REACT_BASE_URL}/updateblog`, form, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        
        if (response.data.message) {
          toast.success(response.data.message);
          fetchBlogs();
          handleCloseDialog();
        }
      } else {
        // Add new blog
        if (!formData.blogImage) {
          toast.error("Please select an image");
          setFormLoading(false);
          return;
        }
        form.append("blogImage", formData.blogImage);
        
        const response = await axios.post(`${REACT_BASE_URL}/addblogs`, form, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        
        if (response.data.message) {
          toast.success(response.data.message);
          fetchBlogs();
          handleCloseDialog();
        }
      }
    } catch (error) {
      console.log("Error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenConfirm = (_id) => {
    setBlogToDelete(_id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setBlogToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${REACT_BASE_URL}/deleteblog`, {
        data: { _id: blogToDelete },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.error("Blog deleted successfully");
      setBlogs(blogs.filter((blog) => blog._id !== blogToDelete));
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Error deleting blog");
    } finally {
      handleCloseConfirm();
    }
  };

  const handlePreviewImage = (imageUrl) => {
    // Convert relative path to full URL
    const fullImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${REACT_BASE_URL}/${imageUrl.replace(/\\/g, '/')}`;
    setPreviewImage(fullImageUrl);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewImage(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Paper elevation={6} sx={{ p: 2, m: 2, mt: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4">Blogs Management</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="warning" onClick={() => handleOpenDialog()}>
              Add New Blog
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr.No</TableCell>
                  <TableCell onClick={() => handleSort("blogName")}>Name {sortField === "blogName" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                  <TableCell onClick={() => handleSort("blogCategory")}>Category {sortField === "blogCategory" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBlogs.map((blog,index) => (
                  <TableRow key={blog._id}>
                     <TableCell>{index+1}</TableCell>
                    <TableCell>{blog.blogName}</TableCell>
                    <TableCell>{blog.blogCategory}</TableCell>
                    <TableCell>{blog.blogDescription}</TableCell>
                    <TableCell>
                      {blog.blogImage && (
                        <IconButton 
                          color="primary" 
                          onClick={() => handlePreviewImage(blog.blogImage)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenDialog(blog)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenConfirm(blog._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Image Preview Dialog */}
      <Dialog 
        open={openPreview} 
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Blog Image Preview</DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <img 
                src={previewImage} 
                alt="Blog Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain' 
                }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedBlog ? "Edit Blog" : "Add Blog"}</DialogTitle>
        <DialogContent>
          <TextField label="Blog Name" name="blogName" value={formData.blogName} onChange={handleChange} fullWidth margin="normal" />
          {/* Image upload and preview */}
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="blog-image-upload"
              type="file"
              name="blogImage"
              onChange={handleChange}
            />
            <label htmlFor="blog-image-upload">
              <Button variant="outlined" component="span" sx={{ mb: 1 }}>
                {formData.blogImage ? "Change Image" : "Upload Image"}
              </Button>
            </label>
            {imagePreview && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8 }} />
                <Button size="small" color="error" onClick={() => { setFormData({ ...formData, blogImage: "" }); setImagePreview(null); }}>
                  Remove Image
                </Button>
              </Box>
            )}
          </Box>
          <TextField label="Category" name="blogCategory" value={formData.blogCategory} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Description" name="blogDescription" value={formData.blogDescription} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={formLoading}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary" disabled={formLoading}>
            {formLoading ? <CircularProgress size={24} /> : (selectedBlog ? "Update" : "Add")}
            </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this blog?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogsManagement;
