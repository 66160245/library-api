const { v4: uuidv4 } = require("uuid"); 
 
class Book { 
  constructor(title, authorId, categoryId, isbn, publishedYear, genre, description) { 
    this.id = uuidv4(); 
    this.title = title; 
    this.authorId = authorId; 
    this.categoryId = categoryId;
    this.isbn = isbn; 
    this.publishedYear = publishedYear; 
    this.genre = genre; 
    this.description = description; 
    this.createdAt = new Date().toISOString(); 
    this.updatedAt = new Date().toISOString(); 
  } 
 
  // Validation method 
  static validate(bookData) { 
    const errors = []; 
 
    if (!bookData.title || bookData.title.trim().length === 0) { 
      errors.push("Title is required"); 
    } 
 
    if (!bookData.authorId || bookData.authorId.trim().length === 0) { 
      errors.push("authorId is required"); 
    } 
    if (!bookData.categoryId || bookData.categoryId.trim().length === 0) { 
      errors.push("categoryId is required"); 
    } 

    if ( 
      bookData.publishedYear && 
      (bookData.publishedYear < 1000 || 
        bookData.publishedYear > new Date().getFullYear()) 
    ) { 
      errors.push("Published year must be between 1000 and current year"); 
    } 
 
    return { 
      isValid: errors.length === 0, 
      errors: errors, 
    }; 
  } 
 
  // Update method 
  update(newData) { 
    Object.keys(newData).forEach((key) => { 
      if (key !== "id" && key !== "createdAt" && this.hasOwnProperty(key)) { 
        this[key] = newData[key]; 
      } 
    }); 
    this.updatedAt = new Date().toISOString(); 
  } 
} 
 
module.exports = Book;