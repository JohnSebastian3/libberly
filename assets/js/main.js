const title = document.querySelector('#title');
const author = document.querySelector('#author');
const pages = document.querySelector("#num-pages");
const read = document.querySelector('#read');


let myLibrary = [
  {
    title: 'The Final Empire',
    author: 'Brandon Sanderson',
    pages: 650,
    isRead: true,
  },
  {
    title: 'The Well of Ascension',
    author: 'Same dude',
    pages: 700,
    isRead: false,
  }
];

function Book() {

}

function addBookToLibrary() {
  
}

function displayBooks() {
  for(let book of myLibrary) {
    for(prop in book) {
      switch(prop) {
        case 'title':
          title.innerText = book[prop];
          break;
        case 'author':
          author.innerText = book[prop];
          break;
        case 'pages':
          pages.innerText = book[prop];
          break;
        case 'isRead':
          read.innerText = book[prop];
          break;
        default:
          break;
      }
    }
  }
}

displayBooks();