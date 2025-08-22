const express = require("express"); 
const router = express.Router(); 
const bookController = require("../controllers/bookController"); 
const validateBook = require("../middleware/books/validateBook");
 
// Route สําหรับสถิติ (ต้องมาก่อน /:id เพื่อไม่ให้ถูก match โดย /:id) 
router.get("/stats", bookController.getBookStats); 
 
// CRUD Routes 
router.get("/", bookController.getAllBooks); 
router.get("/:id", bookController.getBookById); 
router.post("/", validateBook, bookController.createBook);
router.put("/:id", validateBook, bookController.updateBook);
router.delete("/:id", bookController.deleteBook); 
 
module.exports = router;