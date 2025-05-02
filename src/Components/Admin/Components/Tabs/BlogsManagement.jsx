// Full Code - BlogsManagement.jsx

import React, { useState, useEffect } from "react";
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
} from "@mui/icons-material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
  const token = localStorage.getItem("token"); // Assuming you have a token stored in localStorage
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/blogsforadmin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data.blogs);
      setFilteredBlogs(response.data.blogs);
      toast.success("Blogs fetched successfully");
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        blogName: blog.blogName || "",
        blogImage: "",
        blogCategory: blog.blogCategory || "",
        blogDescription: blog.blogDescription || "",
        uploadedDate: blog.uploadedDate || "",
      });
    } else {
      setSelectedBlog(null);
      setFormData({
        blogName: "",
        blogImage: "",
        blogCategory: "",
        blogDescription: "",
        uploadedDate: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBlog(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("blogName", formData.blogName);
    if (formData.blogImage) form.append("blogImage", formData.blogImage);
    form.append("blogCategory", formData.blogCategory);
    form.append("blogDescription", formData.blogDescription);
    form.append("uploadedDate", formData.uploadedDate);

    try {
      if (selectedBlog) {
        await axios.put(`http://localhost:3000/updateblog/${selectedBlog._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Blog updated successfully");
      } else {
        await axios.post("http://localhost:3000/addblogs", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Blog added successfully");
      }
      fetchBlogs();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Error saving blog");
    }
  };

  const handleOpenConfirm = (id) => {
    setBlogToDelete(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setBlogToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:3000/deleteblog`, {
        data: { _id: blogToDelete },
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
                  <TableCell onClick={() => handleSort("blogName")}>Name {sortField === "blogName" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                  <TableCell onClick={() => handleSort("blogCategory")}>Category {sortField === "blogCategory" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>{blog.blogName}</TableCell>
                    <TableCell>{blog.blogCategory}</TableCell>
                    <TableCell>{blog.blogDescription}</TableCell>
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

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedBlog ? "Edit Blog" : "Add Blog"}</DialogTitle>
        <DialogContent>
          <TextField label="Blog Name" name="blogName" value={formData.blogName} onChange={handleChange} fullWidth margin="normal" />
          <TextField type="file" name="blogImage" onChange={handleChange} fullWidth margin="normal" inputProps={{ accept: "image/*" }} />
          <TextField label="Category" name="blogCategory" value={formData.blogCategory} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Description" name="blogDescription" value={formData.blogDescription} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
          {/* <TextField label="Date" name="uploadedDate" type="date" value={formData.uploadedDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            {selectedBlog ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogsManagement;
