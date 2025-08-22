const fs = require("fs").promises; 
const path = require("path"); 
const Book = require("../models/Book"); 
 
const booksFilePath = path.join(__dirname, "../../data/books.json"); 
 
// Helper function เพื่ออ่านข้อมูลหนังสือ 
async function readBooksFromFile() { 
  try { 
    const data = await fs.readFile(booksFilePath, "utf8"); 
    return JSON.parse(data); 
  } catch (error) { 
    console.error("Error reading books file:", error); 
    return []; 
  } 
} 
 
// Helper function เพื่อเขียนข้อมูลหนังสือ 
async function writeBooksToFile(books) { 
  try { 
    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2)); 
    return true; 
  } catch (error) { 
    console.error("Error writing books file:", error); 
    return false; 
  } 
} 
 
// GET /api/books - ดึงรายการหนังสือทั ้งหมด 
async function getAllBooks(req, res) { 
  try { 
    const books = await readBooksFromFile(); 
 
    // Support query parameters 
    let filteredBooks = [...books]; 
 
    // Filter by genre 
    if (req.query.genre) { 
      filteredBooks = filteredBooks.filter((book) => 
        book.genre.toLowerCase().includes(req.query.genre.toLowerCase()) 
      ); 
    } 
 
    // Filter by author 
    if (req.query.author) { 
      filteredBooks = filteredBooks.filter((book) => 
        book.author.toLowerCase().includes(req.query.author.toLowerCase()) 
      ); 
    } 
 
    // Sort by field 
    if (req.query.sort) { 
      const sortField = req.query.sort; 
      const sortOrder = req.query.order === "desc" ? -1 : 1; 
 
      filteredBooks.sort((a, b) => { 
        if (a[sortField] < b[sortField]) return -1 * sortOrder; 
        if (a[sortField] > b[sortField]) return 1 * sortOrder; 
        return 0; 
      }); 
    } 
 
    // Pagination 
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const startIndex = (page - 1) * limit; 
    const endIndex = page * limit; 
 
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex); 
 
    res.json({ 
      success: true, 
      data: paginatedBooks, 
      pagination: { 
        currentPage: page, 
        totalPages: Math.ceil(filteredBooks.length / limit), 
        totalBooks: filteredBooks.length, 
        hasNext: endIndex < filteredBooks.length, 
        hasPrev: startIndex > 0, 
      }, 
    }); 
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch books", 
      error: error.message, 
    }); 
  } 
} 
 
// GET /api/books/:id - ดึงหนังสือตาม ID 
async function getBookById(req, res) { 
  try { 
    const books = await readBooksFromFile(); 
    const book = books.find((book) => book.id === req.params.id); 
 
    if (!book) { 
      return res.status(404).json({ 
        success: false, 
        message: "Book not found", 
      }); 
    } 
 
    res.json({ 
      success: true, 
      data: book, 
    }); 
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch book", 
      error: error.message, 
    }); 
  } 
} 
 
// POST /api/books - สร้างหนังสือใหม่ 
async function createBook(req, res) { 
  try { 
    // Validate input 
    // const validation = Book.validate(req.body); 
    // if (!validation.isValid) { 
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: "Validation failed", 
    //     errors: validation.errors, 
    //   }); 
    // } 
 
    const books = await readBooksFromFile(); 
 
    // // Check if ISBN already exists 
    const existingBook = books.find((book) => book.isbn === req.body.isbn); 
    if (existingBook) { 
      return res.status(409).json({ 
        success: false, 
        message: "Book with this ISBN already exists", 
      }); 
    } 
 
    // Create new book 
    const newBook = new Book( 
      req.body.title, 
      req.body.authorId, 
      req.body.categoryId, 
      req.body.isbn, 
      req.body.publishedYear, 
      req.body.genre, 
      req.body.description 
    ); 
 
    books.push(newBook); 
 
    const success = await writeBooksToFile(books); 
    if (!success) { 
      throw new Error("Failed to save book"); 
    } 
 
    res.status(201).json({ 
      success: true, 
      message: "Book created successfully", 
      data: newBook, 
    }); 
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: "Failed to create book", 
      error: error.message, 
    }); 
  } 
} 
 
// PUT /api/books/:id - อัปเดตหนังสือ 
async function updateBook(req, res) { 
  try { 
    const books = await readBooksFromFile(); 
    const bookIndex = books.findIndex((book) => book.id === req.params.id); 
 
    if (bookIndex === -1) { 
      return res.status(404).json({ 
        success: false, 
        message: "Book not found", 
      }); 
    } 
 
    // Validate input (เฉพาะฟิลด์ที่ส่งมา) 
    const fieldsToUpdate = {}; 
    Object.keys(req.body).forEach((key) => { 
      if (req.body[key] !== undefined && req.body[key] !== null) { 
        fieldsToUpdate[key] = req.body[key]; 
      } 
    }); 
 
    if (Object.keys(fieldsToUpdate).length === 0) { 
      return res.status(400).json({ 
        success: false, 
        message: "No valid fields to update", 
      }); 
    } 
 
    const validation = Book.validate({ 
      ...books[bookIndex], 
      ...fieldsToUpdate, 
    }); 
 
    if (!validation.isValid) { 
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: validation.errors, 
      }); 
    } 
 
    // Update book 
    const updatedBook = { ...books[bookIndex] }; 
    Object.assign(updatedBook, fieldsToUpdate); 
    updatedBook.updatedAt = new Date().toISOString(); 
 
    books[bookIndex] = updatedBook; 
 
    const success = await writeBooksToFile(books); 
    if (!success) { 
      throw new Error("Failed to update book"); 
    } 
 
    res.json({ 
      success: true, 
      message: "Book updated successfully", 
      data: updatedBook, 
    }); 
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: "Failed to update book", 
      error: error.message, 
    }); 
  } 
} 
 
// DELETE /api/books/:id - ลบหนังสือ 
async function deleteBook(req, res) { 
  try { 
    const books = await readBooksFromFile(); 
    const bookIndex = books.findIndex((book) => book.id === req.params.id); 
 
    if (bookIndex === -1) { 
      return res.status(404).json({ 
        success: false, 
        message: "Book not found", 
      }); 
    } 
 
    const deletedBook = books[bookIndex]; 
    books.splice(bookIndex, 1); 
 
    const success = await writeBooksToFile(books); 
    if (!success) { 
      throw new Error("Failed to delete book"); 
    } 
 
    res.json({ 
      success: true, 
      message: "Book deleted successfully", 
      data: deletedBook, 
    }); 
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete book", 
      error: error.message, 
    }); 
  } 
} 
 
// GET /api/books/stats - ดูสถิติหนังสือ 
async function getBookStats(req, res) { 
  try { 
    const books = await readBooksFromFile(); 
 
    // คํานวณสถิติ 
    const stats = { 
      totalBooks: books.length, 
      genreDistribution: {}, 
      authorCount: new Set(books.map((book) => book.author)).size, 
      yearRange: { 
        oldest: Math.min( 
          ...books.map((book) => book.publishedYear || new Date().getFullYear()) 
        ), 
        newest: Math.max(...books.map((book) => book.publishedYear || 0)), 
      }, 
      averageYear: Math.round( 
        books.reduce((sum, book) => sum + (book.publishedYear || 0), 0) / 
          books.length 
      ), 
    }; 
 
    // นับจํานวนหนังสือในแต่ละประเภท 
    books.forEach((book) => { 
      const genre = book.genre || "Unknown"; 
      stats.genreDistribution[genre] = 
        (stats.genreDistribution[genre] || 0) + 1; 
    }); 
 
    res.json({ 
      success: true, 
      data: stats, 
    }); 
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch book statistics", 
      error: error.message, 
    }); 
  } 
} 
 
module.exports = { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook, 
  getBookStats, 
}; 