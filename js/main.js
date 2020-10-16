/**
 * Represents a book.
 */
class Book {
	/**
	 * 
	 * @param {*} title title of the book.
	 * @param {*} author author of the book.
	 * @param {*} isbn isbn of the book.
	 */
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

/**
 * Handles UI tasks.
 */
class UI {
	/**
	 * Displays all books.
	 */
	static displayBooks() {
		const books = Store.getBooks();

		books.forEach(book => UI.addBookToList(book));
	}

	/**
	 * Adds a book to the list.
	 * @param {*} book book to be added.
	 */
	static addBookToList(book) {
		const list = document.getElementById('book-list');
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;
		list.appendChild(row);
	}

	/**
	 * Removes a book from the table.
	 * @param {*} element book to be removed.
	 */
	static deleteBook(element) {
		if (element.classList.contains('delete')) {
			element.parentElement.parentElement.remove();
			// Show success message
			UI.showAlert('The book has been removed', 'success');
		}
	}

	/**
	 * Shows alert message above the table.
	 * @param {*} message message to be displayed.
	 * @param {*} className either 'success' or 'danger'.
	 */
	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.getElementById('book-form');
		container.insertBefore(div, form);

		// The message should vanish in three seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}
}

/**
 * Handles local storage.
 */
class Store {
	/**
	 * Gets books from the local storage.
	 */
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	/**
	 * Adds a book to the local storage.
	 * @param {*} book book to be added.
	 */
	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	/**
	 * Removes a book from the local storage.
	 * @param {*} isbn isbn of the book to be removed.
	 */
	static removeBook(isbn) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event: display a book.
document.addEventListener('DOMContentLoaded', UI.displayBooks());

// Event: add a book.
document.getElementById('book-form').addEventListener('submit', event => {
	event.preventDefault();

	// Get form values
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const isbn = document.getElementById('isbn').value;

	// Validate the values
	if (title === '' || author === '' || isbn === '') {
		UI.showAlert('Please fill in all fields', 'danger');
	} else {
		// Instantiate a book
		const book = new Book(title, author, isbn);

		// Add book to UI
		UI.addBookToList(book);

		// Add book to the local storage
		Store.addBook(book);

		// Show success message
		UI.showAlert('The book has been added', 'success');

		// Clear fields
		document.getElementById('book-form').reset();
	}
});

// Event: remove a book.
document.getElementById('book-list').addEventListener('click', event => {
	// Remove book from UI
	UI.deleteBook(event.target);

	// Remove book from the local storage
	Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
});