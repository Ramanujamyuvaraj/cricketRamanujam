const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const sqlite3 = require("sqlite3");

const { open } = require("sqlite");
const dbPath = path.join(__dirname, "goodreads.db");

let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDbAndServer();

// all books
app.get("/books/", async (request, response) => {
  const getBookQuery = `
    SELECT *
    FROM book
    ORDER BY 
    book_id;`;

  const books = await db.all(getBookQuery);
  response.send(books);
});

//single books
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const getBookQuery = `
    SELECT * 
    FROM book 
    WHERE book_id = ${bookId};`;

  const books = await db.get(getBookQuery);
  response.send(books);
});

//add book
app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;

  const addBookQuery = `
        INSERT INTO 
        book(title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
        VALUES (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;

  const books = await db.run(addBookQuery);
  const bookId = books.lastID;
  response.send({ bookId: bookId });
});

// update book
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const bookDetails = request.body;

  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const updateBookQuery = `
    UPDATE book
    SET 
    title = ${title},
    author_id =  ${authorId},
    rating = ${rating},
    rating_count =  ${ratingCount},
    review_count =   ${reviewCount},
    description=   '${description}',
    pages =   ${pages},
    date_of_publication = '${editionLanguage}',
    edition_language =  '${editionLanguage}',
    price =  ${price},
    online_stores =  '${onlineStores}'
    WHERE book_id = ${bookId};`;

  await db.run(updateBookQuery);
  response.send("update successfully");
});

//delete

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const deleteBooks = `
    
    DELETE 
    FROM book 
    WHERE book_id = ${bookId};
    `;

  await db.run(deleteBooks);
  response.send("deleted successfully");
});

//authors

app.get("/authors/:authorId/books/", async (request, response) => {
  const { authorId } = request.params;

  const authorsBooks = `
    
    SELECT * 
    FROM book 
    WHERE author_id = ${authorId};`;

  const authorsQuery = await db.all(authorsBooks);

  response.send(authorsQuery);
});
