
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

currentIndex = myLibrary.length - 1;

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
  let haveRead = document.querySelector('#have-read');

  if(haveRead.checked) {
    haveRead = 'Finished Reading';
  } else {
    haveRead = 'Currently Reading';
  }

  const newBook = new Book(bookTitle, bookAuthor, bookPages, haveRead)

  if(myLibrary.length === 0) {
    currentIndex++;
    saveDataToLocalStorage(newBook);
    if(newBook.read === 'Finished Reading') {
      incrementBooksRead();
      updatePagesRead(newBook);
    }
    displayBooks();
  } else{
    if(!containsBook(newBook, myLibrary)) {
      currentIndex++;
      saveDataToLocalStorage(newBook);
      if(newBook.read === 'Finished Reading') {
        incrementBooksRead();
        updatePagesRead(newBook);
      }
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
    const finishedReadingButton = document.createElement('button');
    const markUnreadButton = document.createElement('button');

  
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
          read.innerText = books[i][prop];
          card.appendChild(read);
          break;
        default:
          break;
      }
    }

    finishedReadingButton.innerText = 'Mark Read';
    markUnreadButton.innerText = 'Mark Not Read'
    finishedReadingButton.classList.add('button');
    finishedReadingButton.classList.add('button-completed');
    markUnreadButton.classList.add('button');
    markUnreadButton.classList.add('button-unread');
    
    if(read.innerText === 'Currently Reading') {
      card.append(finishedReadingButton);
      card.append(markUnreadButton);
      markUnreadButton.classList.add('invisible');
    } else {
      card.append(markUnreadButton);
      card.append(finishedReadingButton);
      finishedReadingButton.classList.add('invisible');
    }

    finishedReadingButton.addEventListener('click', e => {
      read.innerText = 'Finished Reading';
      let currentPagesRead = Number(localStorage.getItem('pagesRead'));
      currentPagesRead += Number(e.target.parentElement.children[2].innerText.split(' ')[0]);
      localStorage.setItem('pagesRead', currentPagesRead);
      pagesRead.innerText = currentPagesRead.toLocaleString();
      incrementBooksRead();
      finishedReadingButton.classList.add('invisible');
      markUnreadButton.classList.remove('invisible');
    })

    markUnreadButton.addEventListener('click', e => {
      read.innerText = 'Currently Reading';
      let currentPagesRead = Number(localStorage.getItem('pagesRead'));
      currentPagesRead -= Number(e.target.parentElement.children[2].innerText.split(' ')[0]);
      localStorage.setItem('pagesRead', currentPagesRead);
      pagesRead.innerText = currentPagesRead.toLocaleString();
      decrementBooksRead();
      markUnreadButton.classList.add('invisible');
      finishedReadingButton.classList.remove('invisible');
    })

    document.querySelector('.book-container').appendChild(card);

  }
}

function incrementBooksRead() {
  let currentBooksRead = Number(localStorage.getItem('booksRead'));
  currentBooksRead++;
  localStorage.setItem('booksRead', currentBooksRead);
  booksRead.innerText = currentBooksRead.toLocaleString();
}

function decrementBooksRead() {
  let currentBooksRead = Number(localStorage.getItem('booksRead'));
  currentBooksRead--;
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

  for(let book of library) {
    if( data.title === book.title && data.author === book.author) {
      return true;
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