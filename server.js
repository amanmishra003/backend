
const express = require('express');
//const bookRoutes = require('./routes/books')
const mongoose = require('mongoose')
const cors = require('cors');

//express app
const port = process.env.PORT || 5000;
const URI= "mongodb+srv://amanmishra4191:amanmishra786@booklist.vpa971x.mongodb.net/?retryWrites=true&w=majority"

const app = express();
const router = express.Router();

//schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String,required:true}
  }, { timestamps: true });

const Book = mongoose.model('300352187-aman', bookSchema);


// Get all the books
async function getbooks(req, res) {
    try {
      const books = await Book.find({}).sort({createdAt: -1}); // Sorting in descending order based on creation date
      res.status(200).json(books);
    } catch (err) {
      res.status(400).json({error: err.message});
    }
  }
  
  // Get a single
  async function getBookById(req, res) {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: "Invalid Book ID"});
    }
    try {
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({error: "Book not found"});
      }
      res.status(200).json(book);
    } catch (err) {
      res.status(400).json({error: err.message});
    }
  }
  
    
  // Create a new 
  async function createBook(req, res) {
    const {
      title,
      author,
      description
    } = req.body;
    console.log(req.body)
    try {
      const book = await Book.create({
          title,
          author,
          description
      });
      res.status(201).json(book);
    } catch (err) {
      console.error('Error creating new book:', err.message);
      res.status(500).json({error: err.message});
    }
  }
  
  // Delete 
  async function deleteBook(req, res) {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: "Invalid Book ID"});
    }
    try {
      const book = await Book.findOneAndDelete({_id: id});
      if (!book) {
        return res.status(400).json({error: "Book not found"});
      }
      res.status(200).json(book);
    } catch (err) {
      res.status(400).json({error: err.message});
    }
  }
  
  // Update 
  async function updateBook(req, res) {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: "Invalid Book ID"});
    }
    try {
      const book = await Book.findOneAndUpdate({_id: id}, {...req.body});
      if (!book) {
        return res.status(400).json({error: "Book not found"});
      }
      res.status(200).json(book);
    } catch (err) {
      res.status(400).json({error: err.message});
    }
  }


router.get('/', getbooks);

//get book by id 
router.get('/:id',getBookById);

// Post a new book
router.post('/', createBook);

//update a book 
router.patch('/:id',updateBook);

//delete book
router.delete('/:id',deleteBook)


  //Middlewares
app.use(express.json()); //parses the http request's body/data to the 'req' object like body-parser
app.use(cors());
app.use((req, res, next) => {
    console.log(req.path, req.method); //Middleware for logging the requests to console our server
    next()                              //This middle ware will run everytime before getting to the requested route coz of 'next' function
})
app.use('/api/books',router);

//connect to db
mongoose.connect(URI)
    .then(() => {
        //listern for requests only after connection
        app.listen(port, () => {
            console.log("Connected to DB Listening on port",port);
        })
    })
    .catch((error) => {
        console.log(error);
    })

