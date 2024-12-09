const API_URL = "http://localhost:5000/api/books";

// Fetch and display books
async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    const books = await response.json();
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    books.forEach((book) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.year}</td>
        <td>
          <button onclick="deleteBook('${book._id}')">Delete</button>
        </td>
      `;
      bookList.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to fetch books:", err);
  }
}

// Add a new book
document.getElementById("book-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const genre = document.getElementById("genre").value.trim();
  const year = document.getElementById("year").value.trim();

  if (!title || !author || !genre || !year) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, genre, year }),
    });

    if (!response.ok) {
      throw new Error("Failed to add book");
    }
    document.getElementById("book-form").reset();
    fetchBooks();
  } catch (err) {
    console.error(err);
  }
});

// Delete a book
async function deleteBook(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to delete book");
    }
    fetchBooks();  // Refresh the list after deletion
  } catch (err) {
    console.error("Error deleting book:", err);
  }
}

// Initial fetch
fetchBooks();

// Handling form submission (Add Book)
const form = document.querySelector('form');
const bookList = document.querySelector('table tbody');

// Add book function
async function addBook(event) {
  event.preventDefault();

  const bookTitle = document.querySelector('#bookTitle').value;
  const author = document.querySelector('#author').value;
  const year = document.querySelector('#year').value;
  const genre = document.querySelector('#genre').value;

  const newBook = {
    title: bookTitle,
    author: author,
    year: year,
    genre: genre
  };

  try {
    const response = await fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook)
    });

    if (response.ok) {
      const data = await response.json();
      displayNewBook(data);
      showSuccessMessage("Book added successfully!");
    } else {
      throw new Error("Failed to add book");
    }
  } catch (error) {
    console.error(error);
    showErrorMessage("Failed to add book. Please try again.");
  }
}

// Display new book in table
function displayNewBook(book) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.year}</td>
    <td>${book.genre}</td>
    <td><button class="delete" onclick="deleteBook('${book._id}')">Delete</button></td>
  `;
  bookList.appendChild(row);
}

// Handling delete button click
async function deleteBook(bookId) {
  try {
    const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      document.querySelector(`[data-id='${bookId}']`).remove();
      showSuccessMessage("Book deleted successfully!");
    } else {
      throw new Error("Failed to delete book");
    }
  } catch (error) {
    console.error(error);
    showErrorMessage("Failed to delete book. Please try again.");
  }
}

// Show success message
function showSuccessMessage(message) {
  const successMessage = document.createElement('div');
  successMessage.classList.add('success-message');
  successMessage.innerText = message;
  document.body.appendChild(successMessage);
  
  setTimeout(() => successMessage.remove(), 3000);
}

// Show error message
function showErrorMessage(message) {
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('error-message');
  errorMessage.innerText = message;
  document.body.appendChild(errorMessage);
  
  setTimeout(() => errorMessage.remove(), 3000);
}

// Event listener for form submission
form.addEventListener('submit', addBook);
