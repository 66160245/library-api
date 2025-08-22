const fs = require("fs").promises;
const path = require("path");
const Category = require("../models/Category");

const categoriesFilePath = path.join(__dirname, "../../data/categories.json");

// helper function
async function readCategoriesFromFile() {
  try {
    const data = await fs.readFile(categoriesFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeCategoriesToFile(categories) {
  await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));
}

// GET all categories
async function getAllCategories(req, res) {
  const categories = await readCategoriesFromFile();
  res.json({ success: true, data: categories });
}

// GET category by ID
async function getCategoryById(req, res) {
  const categories = await readCategoriesFromFile();
  const category = categories.find((c) => c.id === req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, data: category });
}

// CREATE category
async function createCategory(req, res) {
  const categories = await readCategoriesFromFile();
  const { name, description } = req.body;

  const { isValid, errors } = Category.validate({ name });
  if (!isValid) {
    return res.status(400).json({ success: false, errors });
  }

  const newCategory = new Category(name, description);
  categories.push(newCategory);

  await writeCategoriesToFile(categories);
  res.status(201).json({ success: true, data: newCategory });
}

// UPDATE category
async function updateCategory(req, res) {
  const categories = await readCategoriesFromFile();
  const index = categories.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  categories[index] = { ...categories[index], ...req.body, updatedAt: new Date().toISOString() };

  await writeCategoriesToFile(categories);
  res.json({ success: true, data: categories[index] });
}

//DELETE category
async function deleteCategory(req, res) {
  const categories = await readCategoriesFromFile();
  const index = categories.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const deleted = categories.splice(index, 1);
  await writeCategoriesToFile(categories);

  res.json({ success: true, data: deleted[0] });
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
