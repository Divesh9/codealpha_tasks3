let library = [];

// Book Div and Template const
const temp = document.querySelector('.book');
const bookshelf = document.querySelector('#bookshelf');
const categoryFilter = document.getElementById('categoryFilter');
let idBook = library.length;

function Book(title, author, category) {
	this.id = idBook;
	this.title = title;
	this.author = author;
	this.category = category;
	this.borrowed = false;
	idBook += 1;
}

function ReloadLibrary() {
	library = JSON.parse(localStorage.getItem('library')) || [];
	bookshelf.innerHTML = '';
	bookshelf.appendChild(temp);
	categoryFilter.innerHTML = '<option value="">All Categories</option>';

	const categories = new Set();
	for (let i = 0; i < library.length; i += 1) {
		DisplayBook(library[i]);
		categories.add(library[i].category);
	}
	categories.forEach(category => {
		const option = document.createElement('option');
		option.value = category;
		option.text = category;
		categoryFilter.appendChild(option);
	});
}

function SaveBook(title, author, category) {
	const book = new Book(title, author, category);
	if (!Array.isArray(library)) {
		library = [];
	}
	library.push(book);
	localStorage.setItem('library', JSON.stringify(library));
	ReloadLibrary();
}

function AddBook() {
	event.preventDefault();
	const formAddBook = document.forms.AddBook;
	const bookData = new FormData(formAddBook);
	const bookTitle = bookData.get('title');
	const bookAuthor = bookData.get('author');
	const bookCategory = bookData.get('category');

	if (!bookTitle || !bookAuthor || !bookCategory) {
		alert("All fields are required!");
		return false;
	}

	formAddBook.reset();
	SaveBook(bookTitle, bookAuthor, bookCategory);
	return false;
}

function DeleteBook(id) {
	library = library.filter((book) => book.id !== id);
	localStorage.setItem('library', JSON.stringify(library));
	ReloadLibrary();
}

function ToggleBorrowStatus(id) {
	const book = library.find((book) => book.id === id);
	book.borrowed = !book.borrowed;
	localStorage.setItem('library', JSON.stringify(library));
	ReloadLibrary();
}

function DisplayBook(book) {
	const clon = temp.content.cloneNode(true);
	clon.querySelectorAll('p')[0].innerHTML = 'BOOK NAME: ' + book.title;
	clon.querySelectorAll('p')[1].innerHTML = 'AUTHOR NAME: ' + book.author;
	clon.querySelectorAll('p')[2].innerHTML = 'CATEGORY: ' + book.category;
	clon.querySelectorAll('p')[3].innerHTML = 'BORROWED: ' + (book.borrowed ? 'Yes' : 'No');
	clon.querySelector('button.btn-primary').addEventListener('click', () => { DeleteBook(book.id); });
	clon.querySelector('button.btn-warning').addEventListener('click', () => { ToggleBorrowStatus(book.id); });
	bookshelf.appendChild(clon);
}

function SearchBooks() {
	const searchInput = document.getElementById('searchInput').value.toLowerCase();
	if (!searchInput) {
		alert("Please enter a search term.");
		return;
	}
	const filteredBooks = library.filter(book =>
		book.title.toLowerCase().includes(searchInput) ||
		book.author.toLowerCase().includes(searchInput) ||
		book.category.toLowerCase().includes(searchInput)
	);
	bookshelf.innerHTML = '';
	bookshelf.appendChild(temp);
	filteredBooks.forEach(book => DisplayBook(book));
}

function FilterByCategory() {
	const category = categoryFilter.value;
	const filteredBooks = category ? library.filter(book => book.category === category) : library;
	bookshelf.innerHTML = '';
	bookshelf.appendChild(temp);
	filteredBooks.forEach(book => DisplayBook(book));
}

// Load the Library on opening the page
ReloadLibrary();
