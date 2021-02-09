'use strict';

/**
 * Represents a book.
 */
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

/**
 * Handles UI tasks.
 */
class UI {}

/**
 * Displays all books that are stored in the local storage.
 */
UI.displayBooks = function() {
  const books = Store.getBooks();

  books.forEach(book => UI.addBook(book));
}

/**
 * Adds book to the DOM.
 * @param {*} book book to be added.
 */
UI.addBook = function(book) {
  const bookList = document.getElementById('book-list');

  const row = document.createElement('tr');
  row.insertAdjacentHTML('afterbegin',
  `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td class="book-isbn">${book.isbn}</td>
    <td>
      <button type="button" class="btn btn-danger btn-sm delete">Delete</a>
    </td>
  `);

  bookList.appendChild(row);
}

/**
 * Removes book from the DOM.
 * @param {*} target target of the mouse click.
 */
UI.deleteBook = function(target) {
  if (target.classList.contains('delete')) {
    target.parentElement.parentElement.remove();
  }
}

/**
 * Shows alert messages.
 * @param {string} message message of the alert.
 * @param {string} className class name of the alert.
 */
UI.showAlerts = function(message, className) {
  const div = document.createElement('div');
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));

  const container = document.querySelector('.container');
  const form = document.getElementById('book-form');
  container.insertBefore(div, form);

  setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

/**
 * Handles the local storage.
 */
class Store {}

/**
 * Fetches books from the local storage.
 */
Store.getBooks = function() {
  const books = localStorage.getItem('books')
    ? JSON.parse(localStorage.getItem('books'))
    : [];

  return books;
}

/**
 * Adds book to the local storage.
 * @param {Book} book book to be added.
 */
Store.addBook = function(book) {
  const books = Store.getBooks();
  books.push(book);

  localStorage.setItem('books', JSON.stringify(books));
}

/**
 * Removes book from the local storage by the specified isbn.
 * @param {number} isbn isbn of the book to be removed.
 */
Store.removeBook = function(isbn) {
  const books = Store.getBooks();
  const index = books.findIndex(book => book.isbn === isbn);
  books.splice(index, 1);

  if (books.length === 0) {
    localStorage.clear();
  } else {
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.getElementById('book-form').addEventListener('submit', event => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  // Validation
  if (title.trim() === '' || author.trim() === '' || isbn.trim() === '') {
    UI.showAlerts('Please, fill in all the fields', 'danger');
  } else {
    const book = new Book(title, author, isbn);
    UI.addBook(book);

    Store.addBook(book);

    UI.showAlerts('The book has been added', 'success');
  
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
});

document.getElementById('book-list').addEventListener('click', event => {
  UI.deleteBook(event.target);

  Store.removeBook(event.target.parentElement.parentElement.querySelector('.book-isbn').innerText);

  UI.showAlerts('The book has been removed', 'success');
});