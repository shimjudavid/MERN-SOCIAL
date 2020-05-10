const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

//import routes
const AuthRoutes = require('./routes/auth');
const UserRoutes = require('./routes/user');

const app = express();

//connect TO DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('mongodb connected')
  }
  catch (error) {
    console.log('mongodb is not connected due to the error ->', error.message);
  }

}
connectDB();

//middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Morgan is now logging every HTTP requests that look like "GET /myURL 304 9.072 ms - - on your terminal"
app.use(morgan('dev'));
// app.use(cors()); // allows all origins
if (process.env.NODE_ENV === 'development') {
  app.use(cors({origin: `http://localhost:3000`}))
}

//finally apply routes as middleware
app.use('/api', AuthRoutes);
app.use('/api', UserRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set the static folder
  app.use(express.static('client/build'));
  // now create a route, * means anything but the above routes, so that's the reason
  // we put this route below the api routes
  // if app hits the homepage- / , load the index.html
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) );
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is listening on port ${port} on ${process.env.NODE_ENV} server!`);
});

