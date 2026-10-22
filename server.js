import express from 'express';
import { fileURLToPath } from 'url';  
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;
const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

//Middlmeware to log all incoming request into terminal 
app.use((req, res, next) => {
  if (NODE_ENV === 'development'){
    console.log(`${req.method} ${req.url}`);
  }
  next(); //Pass control to the next non error function
})

//making the node environment available for all pages....view footer it has been passed
app.use((req, res, next) =>{
  res.locals.NODE_ENV = NODE_ENV //res.locals helps store values in middleware 
  next() //runs the next non-error middleware
});

// Use the imported router to handle routes
app.use(router);

//catch all route for 404 errors
app.use((req, res, next) =>{
  const err = new Error ("Page Not Found!") //Explicitly call an error is page is not found
  err.status = 404; //assign error to a status code
  next(err) ;//call an error handlling function
});

//Global Error handler
app.use((err, req, res, next) =>{
  //log the error to the console ussing err message and stake to trace 
  console.error('Error occured:', err.message);
  console.error('Stack trace:' ,err.stack);

  //determine the error status and error template to display
  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  //prepare the data for the template
  //context is displayed as an object with key and its properties
  const context = {
    title : status === 404 ? 'Page Not Found' : 'Server Error',
    error : err.message,
    stack: err.stack

  };

  //render details to page (appropriate error template)
  res.status(status).render(`errors/${template}`, context);
});

app.listen(PORT, async() => {
  try{
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  }
  catch(error){
    console.error("Error connecting to database ",error)
  }
  
});