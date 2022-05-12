
const addBookButton = document.querySelector('.add-book');
const modal = document.querySelector('.modal');
const submitButton = document.querySelector('#submit');


addBookButton.addEventListener('click', requestBook);
submitButton.addEventListener('click', addBookToLibrary);

let currentIndex = 0;
let myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];
displayBooks();


console.log('My Library: ', myLibrary);
currentIndex = myLibrary.length - 1;
console.log('Current index: ', currentIndex);
// console.log(localStorage);
// localStorage.setItem('myLibrary', JSON.stringify(myLibrary));


function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary() {
  modal.classList.add('hidden');
  const bookTitle = document.querySelector('#book-title').value;
  const bookAuthor = document.querySelector('#book-author').value;
  const bookPages = document.querySelector('#book-pages').value;
  const haveRead = document.querySelector('#have-read').value;

  const newBook = new Book(bookTitle, bookAuthor, bookPages, haveRead)
  // console.log('Newbook ', newBook);
  
  // console.log('Contains? ', containsBook(newBook, myLibrary));
  if(myLibrary.length > 0) {
    if(!containsBook(newBook, myLibrary)) {
      saveDataToLocalStorage(newBook);
      currentIndex++;
      displayBooks();
    }
  } else if(myLibrary.length === 0){
    saveDataToLocalStorage(newBook);
    currentIndex++;
    displayBooks();
  }
  // console.log('LENGTH!!!: ', myLibrary.length);
  // console.log(localStorage)
}

function displayBooks() {
  
  let books = JSON.parse(localStorage.getItem('myLibrary')) || [];
  // console.log('Mybooks ', books);
  for(let i = currentIndex; i < books.length; i++) {
    // Create a card for each book in library
    let card = document.createElement('div');
    card.classList.add('card');

    const title = document.createElement('p');
    const author = document.createElement('p');
    const pages = document.createElement('p');
    const read = document.createElement('p');

    for(prop in books[i]) {
      switch(prop) {
        case 'title':
          title.innerText = books[i][prop];
          card.appendChild(title);
          break;
        case 'author':
          author.innerText = books[i][prop];
          card.appendChild(author);
          break;
        case 'pages':
          pages.innerText = books[i][prop] + ' pages';
          card.appendChild(pages);
          break;
        case 'isRead':
          read.innerText = books[i][prop];
          card.appendChild(read);
          break;
        default:
          break;
      }
    }

    document.querySelector('.book-container').appendChild(card);

  }
}

function containsBook(data, library) {
  console.log('TITLE: ', data.title);
  // console.log('COMAPRE TITLE: ', library[0].title);
  for(let book of library) {
    console.log('Current library book to compare ', book)
    // console.log('sadjkfhl;dsafjklh ', Object.keys(data));
    if( data.title === book.title && data.author === book.author) {
      console.log('true!');
      return true;
    } else {
      console.log('FALSE!');
        }
  }
  return false;
  
}

function saveDataToLocalStorage(data) {
  myLibrary.push(data);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}


function requestBook() {
  modal.classList.remove('hidden');
}


localStorage.setItem('myLibrary', JSON.stringify(myLibrary));