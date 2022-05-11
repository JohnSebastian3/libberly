
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
    // Create a card for each book in library
    let card = document.createElement('div');
    card.classList.add('card');
    console.log(card);

    const title = document.createElement('p');
    const author = document.createElement('p');
    const pages = document.createElement('p');
    const read = document.createElement('p');

    for(prop in book) {
      switch(prop) {
        case 'title':
          title.innerText = book[prop];
          card.appendChild(title);
          break;
        case 'author':
          author.innerText =book[prop];
          card.appendChild(author);
          break;
        case 'pages':
          pages.innerText = book[prop] + ' pages';
          card.appendChild(pages);
          break;
        case 'isRead':
          read.innerText = book[prop];
          card.appendChild(read);
          break;
        default:
          break;
      }
    }

    document.querySelector('.book-container').appendChild(card);

  }
}

displayBooks();