// middleware/books/validateBook.js
module.exports = (req, res, next) => {
  const { title, authorId, categoryId } = req.body;

  if (!title || !authorId || !categoryId) {
    return res.status(400).json({
      error: "Missing some required fields: title, authorId, categoryId",
    });
  }

  next();
};
