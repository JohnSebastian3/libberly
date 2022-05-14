// OUR ELEMENTS
// Buttons, modal, overlay
const addBookButton = document.querySelector('.add-book-button');
const removeAllButton = document.querySelector('.remove-all-button');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const submitButton = document.querySelector('#submit');

// Elements where we will store our stats
const booksRead = document.querySelector('.books-read');
const pagesRead = document.querySelector('.pages-read');

// Input elements
const titleInput = document.querySelector('#book-title');
const authorInput = document.querySelector('#book-author');
const pageInput = document.querySelector('#book-pages');


// EVENT LISTENERS 
// Open modal and form to add book
addBookButton.addEventListener('click', requestBook);

// Submit the form and add book to library and local storage
submitButton.addEventListener('click', addBookToLibrary);

// Clear local storage, reload the page to start from a fresh library
removeAllButton.addEventListener('click', () => {
  const response = prompt('Are you sure you want to clear your library? If so, click OK. If not, click Cancel.');
  if(!(response === null)) {
    localStorage.clear();
    document.location.reload();
  }
});

// Close the modal and go back to seeing your library
btnCloseModal.addEventListener('click', hideModal)


// Keep track of how many books we have added thus far
let currentIndex = 0;

// This is to be able to access each book card when we want to remove them                      
let dataIndex = -1;

// Initialize our library by accessing local storage 
let myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];
displayStats();
displayBooks();

// This is to display books on load
currentIndex = myLibrary.length - 1;

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Runs when we click the "Add" button on the form. Adds the
// book to the display, as well as local storage.
function addBookToLibrary() {

  hideModal();
  
  // Only run if we have valid form information, otherwise alert
  // user they are missing information, and refresh form
  if(verifyInputs()) {

    const bookTitle = titleInput.value;
    const bookAuthor = authorInput.value;
    const bookPages = pageInput.value;
    let haveRead = document.querySelector('#have-read');
  
    if(haveRead.checked) {
      haveRead = 'Finished Reading';
    } else {
      haveRead = 'Currently Reading';
    }
  
    // This book will be added to local storage
    const newBook = new Book(bookTitle, bookAuthor, bookPages, haveRead)
  
    // If first book, add. If not the first, check whether we have
    // a duplicate. If duplicate, alert user
    if(myLibrary.length === 0) { 
      handleBookAddition(newBook);
    } else{

      if(!containsBook(newBook, myLibrary)) {
        handleBookAddition(newBook);
      } else {
        alert('This book is already in your Library!');
      }

    }
  } else {
    alert('Please enter all fields!');
  }

  clearInputs();

}

// Populate the book cards and display them in a grid, one by one
function displayBooks() {
  
  let books = JSON.parse(localStorage.getItem('myLibrary')) || [];

  for(let i = currentIndex; i < books.length; i++) {
    // Create a card for each book in library
    let card = document.createElement('div');
    card.classList.add('card');

    // Create info which will populate card 
    const title = document.createElement('p');
    const author = document.createElement('p');
    const pages = document.createElement('p');
    const read = document.createElement('p');

    // Buttons in card
    const finishedReadingButton = document.createElement('button');
    const markUnreadButton = document.createElement('button');
    const removeButton = document.createElement('button');
    removeButton.classList.add('button');

    // Populate card with info
    populateCard(card, books[i], title, author, pages, read);
    
    dataIndex++;
    styleCardButtons(finishedReadingButton, markUnreadButton);

    
    // Determine whether to show the button to mark book as read
    // or the button to mark book as unread
    if(read.innerText === 'Currently Reading') {
      appendButtons(card, finishedReadingButton, markUnreadButton);
      markUnreadButton.classList.add('invisible');
    } else {
      appendButtons(card, finishedReadingButton, markUnreadButton);
      finishedReadingButton.classList.add('invisible');
    }
    
    styleRemoveButton(removeButton) 
    
    card.appendChild(removeButton);
    card.setAttribute('data-index', dataIndex);
    document.querySelector('.book-container').appendChild(card);
    
    // EVENT LISTENERES
    // Each status change button in each card needs these event listener
    finishedReadingButton.addEventListener('click', e => {
      handleReadStatusChange(e, read, finishedReadingButton, markUnreadButton);
    })

    markUnreadButton.addEventListener('click', e => {
      handleReadStatusChange(e, read, finishedReadingButton, markUnreadButton);
    })

    removeButton.addEventListener('click', e => {
      if(read.innerText === 'Finished Reading') {
        updatePagesRead(e, '-');
        decrementBooksRead();
      }

      handleBookRemoval(e);
      setCardDataAttriute();
    
      // Since we removed a book, we need to go back one index
      currentIndex--;
      dataIndex--;
    });

  }
}


function populateCard(card, book, title, author, pages, read) {
  for(prop in book) {
    switch(prop) {
      case 'title':
        title.innerText = book[prop];
        card.appendChild(title);
        break;
      case 'author':
        author.innerText = book[prop];
        card.appendChild(author);
        break;
      case 'pages':
        pages.innerText = book[prop] + ' pages';
        card.appendChild(pages);
        break;
      case 'read':
        read.innerText = book[prop];
        card.appendChild(read);
        break;
      default:
        break;
    }
  }
}

// Increase or decrease book count and page count depending on
// whether we hit the mark as read
// or mark as unread button
function handleReadStatusChange(e, read, readButton, unreadButton) {

  if(e.target.innerText === 'Mark Read') {;
    read.innerText = 'Finished Reading';
    updatePagesRead(e, '+');
    incrementBooksRead();
    readButton.classList.add('invisible');
    unreadButton.classList.remove('invisible');
  } else {
    read.innerText = 'Currently Reading';
    updatePagesRead(e, '-');
    decrementBooksRead();
    unreadButton.classList.add('invisible');
    readButton.classList.remove('invisible');
  }
  

}

// Update local storage, index, stats, and display
function handleBookAddition(book) {
  currentIndex++;
  saveDataToLocalStorage(book);
  updateStatsIfFinished(book);
  displayBooks();
}

function handleBookRemoval(e) {
 
  // Find book which matches index of the HTML book card,
  // and remove it from local storage and from the display
  const index = e.target.parentElement.getAttribute('data-index');
  const currentLib = JSON.parse(localStorage.getItem('myLibrary'));
  currentLib.splice(index, 1);
  localStorage.setItem('myLibrary', JSON.stringify(currentLib));
  e.target.parentElement.remove();
}

// If we checked Finished Reading, then
// we update stats, otherwise we don't
function updateStatsIfFinished(book) {
  if(book.read === 'Finished Reading') {
    incrementBooksRead();
    updatePages(book);
  }
} 

// Set a data attribute on each generated card, from 0 to n
// where n is current number of books in library
function setCardDataAttriute() {
  myLibrary = JSON.parse(localStorage.getItem('myLibrary'))
  let cards = document.querySelectorAll('.card');
  for(let i = 0; i < cards.length; i++) {
    cards[i].setAttribute('data-index', i);
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

// Helper function to icrease/decrease pages read in local storage and DOM
function updatePagesRead(e, op) {

  let currentPagesRead = Number(localStorage.getItem('pagesRead'));

  if(op === '+') {
    currentPagesRead += Number(e.target.parentElement.children[2].innerText.split(' ')[0]);
  } else {
    currentPagesRead -= Number(e.target.parentElement.children[2].innerText.split(' ')[0]);
  }

  localStorage.setItem('pagesRead', currentPagesRead);
  pagesRead.innerText = currentPagesRead.toLocaleString();
}

// Update pages read by completion of specific book
function updatePages(book) {
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

    // I assume that same title and author equals same book
    // The reason that I don't include pages is because different
    // editions of books can have different number of pages
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


function styleCardButtons(read, unread) {
  read.innerText = 'Mark Read';
  unread.innerText = 'Mark Not Read'
  read.classList.add('button');
  read.classList.add('button-completed');
  unread.classList.add('button');
  unread.classList.add('button-unread');
}


function styleRemoveButton(button) {
  button.innerText = 'Remove';
  button.classList.add('button');
  button.classList.add('remove-button');
}

// Refresh form
function clearInputs() {
  titleInput.value = '';
  authorInput.value = '';
  pageInput.value = '';
}

// Show form
function requestBook() {
  clearInputs();
  showModal();
}


function showModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  overlay.classList.add('shown');
  modal.classList.add('shown');
  modal.classList.add('popup');
}

function hideModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  overlay.classList.remove('shown');
  modal.classList.remove('shown');
  modal.classList.remove('popup');
}

function verifyInputs() {
  let inputs = document.querySelectorAll('input');
  let isValid = true;
  inputs.forEach(input => {
    if(input.value === "") {
      isValid = false;
    }
  })
  return isValid;
}

function appendButtons(card, read, unread) {
  card.append(read);
  card.append(unread);
}

localStorage.setItem('myLibrary', JSON.stringify(myLibrary));