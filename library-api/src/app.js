const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import routes 
const bookRoutes = require("./routes/books");
const authorRoutes = require("./routes/authors");
const categoryRoutes = require("./routes/categories");


const app = express();

// Middleware 
app.use(cors()); // เปิดใช้ CORS สําหรับ Cross-Origin Requests 
app.use(morgan("combined")); // Logging 
app.use(express.json({ limit: "10mb" })); // Parse JSON body 
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body 

// Health check endpoint 
app.get("/health", (req, res) => {
  res.json({
    status: "OK WAN JAEW",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes 
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/categories", categoryRoutes);

// Welcome route 
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Book Management REST API",
    version: "1.0.0",
    documentation: {
      endpoints: "/api-docs",
      health: "/health",
    },
  });
});

// API Documentation route 
app.get("/api-docs", (req, res) => {
  res.json({
    title: "Book Management REST API Documentation",
    version: "1.0.0",
    baseUrl: req.protocol + "://" + req.get("host"),
    endpoints: [
      {
        method: "GET",
        path: "/api/books",
        description:
          "Get all books with optional filtering, sorting, and pagination",
        queryParams: [
          "genre - filter by genre",
          "author - filter by author",
          "sort - sort field (title, author, publishedYear)",
          "order - sort order (asc, desc)",
          "page - page number (default: 1)",
          "limit - items per page (default: 10)",
        ],
      },
      {
        method: "GET",
        path: "/api/books/{id}",
        description: "Get a specific book by ID",
      },
      {
        method: "POST",
        path: "/api/books",
        description: "Create a new book",
        bodyExample: {
          title: "Book Title",
          author: "Author Name",
          isbn: "978-0000000000",
          publishedYear: 2024,
          genre: "Fiction",
          description: "Book description",
        },
      },
      {
        method: "PUT",
        path: "/api/books/{id}",
        description: "Update a book",
      },
      {
        method: "DELETE",
        path: "/api/books/{id}",
        description: "Delete a book",
      },
      {
        method: "GET",
        path: "/api/books/stats",
        description: "Get book statistics",
      },

      //author
      {
        method: "GET",
        path: "/api/authors",
        description: "Get all authors"
      },
      {
        method: "GET",
        path: "/api/authors/{id}",
        description: "Get a specific author by ID"
      },
      {
        method: "POST",
        path: "/api/authors",
        description: "Create a new author",
        bodyExample: {
          name: "New Author",
          country: "Country Name"
        }
      },
      {
        method: "PUT",
        path: "/api/authors/{id}",
        description: "Update an author"
      },
      {
        method: "DELETE",
        path: "/api/authors/{id}",
        description: "Delete an author"
      },
      {
        method: "GET",
        path: "/api/authors/stats",
        description: "Get author statistics"
      },

      //category
      {
        method: "GET",
        path: "/api/categories",
        description: "Get all categories"
      },
      {
        method: "GET",
        path: "/api/categories/{id}",
        description: "Get a specific category by ID"
      },
      {
        method: "POST",
        path: "/api/categories",
        description: "Create a new category",
        bodyExample: { name: "Fiction", 
        description: "Books that contain fictional stories" },
      },
      {
        method: "PUT",
        path: "/api/categories/{id}",
        description: "Update a category"
      },
      {
        method: "DELETE",
        path: "/api/categories/{id}",
        description: "Delete a category"
      },
      {
        method: "GET",
        path: "/api/categories/stats",
        description: "Get category statistics"
      },

    ],
  });
});

// 404 handler 
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedUrl: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware 
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});


module.exports = app;