// src/controllers/authorController.js
const fs = require("fs").promises;
const path = require("path");
const Author = require("../models/Author");

const authorsFilePath = path.join(__dirname, "../../data/authors.json");

// Helper
async function readAuthorsFromFile() {
  try {
    const data = await fs.readFile(authorsFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading authors file:", err);
    return [];
  }
}

async function writeAuthorsToFile(authors) {
  try {
    await fs.writeFile(authorsFilePath, JSON.stringify(authors, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing authors file:", err);
    return false;
  }
}

// CRUD
async function getAllAuthors(req, res) {
  const authors = await readAuthorsFromFile();
  res.json({ success: true, data: authors });
}

async function getAuthorById(req, res) {
  const authors = await readAuthorsFromFile();
  const author = authors.find((a) => a.id === req.params.id);
  if (!author) {
    return res.status(404).json({ success: false, message: "Author not found" });
  }
  res.json({ success: true, data: author });
}

async function createAuthor(req, res) {
  const authors = await readAuthorsFromFile();

  const newAuthor = new Author(req.body.name, req.body.birthYear, req.body.nationality, req.body.biography);
  authors.push(newAuthor);

  const success = await writeAuthorsToFile(authors);
  if (!success) {
    return res.status(500).json({ success: false, message: "Failed to save author" });
  }

  res.status(201).json({ success: true, data: newAuthor });
}

async function updateAuthor(req, res) {
  const authors = await readAuthorsFromFile();
  const index = authors.findIndex((a) => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Author not found" });
  }

  const updatedAuthor = { ...authors[index], ...req.body, updatedAt: new Date().toISOString() };
  authors[index] = updatedAuthor;

  await writeAuthorsToFile(authors);
  res.json({ success: true, data: updatedAuthor });
}

async function deleteAuthor(req, res) {
  const authors = await readAuthorsFromFile();
  const index = authors.findIndex((a) => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Author not found" });
  }

  const deleted = authors.splice(index, 1);
  await writeAuthorsToFile(authors);

  res.json({ success: true, data: deleted[0] });
}

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
