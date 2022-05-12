
const addBookButton = document.querySelector('.add-book-button');
const removeAllButton = document.querySelector('.remove-all-button');
const modal = document.querySelector('.modal');
const submitButton = document.querySelector('#submit');
const booksRead = document.querySelector('.books-read');
const pagesRead = document.querySelector('.pages-read');


addBookButton.addEventListener('click', requestBook);
submitButton.addEventListener('click', addBookToLibrary);
removeAllButton.addEventListener('click', () => {
  localStorage.clear();
  document.location.reload();
});

let currentIndex = 0;
let myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];
displayStats();
displayBooks();


console.log('My Library: ', myLibrary);
currentIndex = myLibrary.length - 1;
console.log('Current index: ', currentIndex);

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary() {
  hideModal();

  const bookTitle = document.querySelector('#book-title').value;
  const bookAuthor = document.querySelector('#book-author').value;
  const bookPages = document.querySelector('#book-pages').value;
  const haveRead = document.querySelector('#have-read').value;

  const newBook = new Book(bookTitle, bookAuthor, bookPages, haveRead)

  if(myLibrary.length === 0) {
    currentIndex++;
    saveDataToLocalStorage(newBook);
    incrementBooksRead();
    updatePagesRead(newBook);
    displayBooks();
  } else{
    if(!containsBook(newBook, myLibrary)) {
      currentIndex++;
      saveDataToLocalStorage(newBook);
      incrementBooksRead();
      updatePagesRead(newBook);
      displayBooks();
    }
  }

}

function displayBooks() {
  
  let books = JSON.parse(localStorage.getItem('myLibrary')) || [];


  
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
        case 'read':
          read.innerText = 'Finished Reading';
          card.appendChild(read);
          break;
        default:
          break;
      }
    }

    document.querySelector('.book-container').appendChild(card);

  }
}

function incrementBooksRead() {
  let currentBooksRead = Number(localStorage.getItem('booksRead'));
  currentBooksRead++;
  localStorage.setItem('booksRead', currentBooksRead);
  booksRead.innerText = currentBooksRead.toLocaleString();
}

function updatePagesRead(book) {
  let currentPagesRead = Number(localStorage.getItem('pagesRead'));
  currentPagesRead += Number(book.pages);
  localStorage.setItem('pagesRead', currentPagesRead);
  pagesRead.innerText = currentPagesRead.toLocaleString();
} 

function displayStats() {
  booksRead.innerText =  Number(localStorage.getItem('booksRead')).toLocaleString();
  pagesRead.innerText =  Number(localStorage.getItem('pagesRead')).toLocaleString();

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

function hideModal() {
  modal.classList.add('hidden');
}


function requestBook() {
  modal.classList.remove('hidden');
}


localStorage.setItem('myLibrary', JSON.stringify(myLibrary));