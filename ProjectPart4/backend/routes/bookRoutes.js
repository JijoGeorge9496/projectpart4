const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve books." });
  }
});

// Add a new book
router.post("/", async (req, res) => {
  const { title, author, genre, year } = req.body;

  // Validate request data
  if (!title || !author || !genre || !year || isNaN(year)) {
    return res.status(400).json({ message: "All fields are required, and 'year' must be a valid number." });
  }

  const newBook = new Book({ title, author, genre, year: parseInt(year, 10) });

  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: "Failed to save the book." });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Find book by ID
    if (!book) {
      return res.status(404).json({ message: "Book not found." }); // Handle book not found
    }
    await book.remove(); // Delete the book
    res.json({ message: "Book deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete the book." });
  }
});

module.exports = router;
