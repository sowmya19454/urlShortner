const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.xrmgzhl.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Mappings = require("./models/Schema"); 

const endpoints = [
  { path: '/', description: 'Home page', response: 'Rendered HTML' },
  { path: '/i/google', description: 'Link to Google', response: 'HTML anchor tag' },
  { path: '/i/github', description: 'Link to Github', response: 'HTML anchor tag' },
  { path: '/i', description: 'List all the endpoints that are available', response: 'Endpoints List' },
  { path: '/r/google', description: 'Redirect to Google', response: 'Redirect to https://google.com' },
  { path: '/r/github', description: 'Redirect to Github', response: 'Redirect to https://github.com' },
  { path: '/r', description: 'Information about redirection endpoint', response: 'Message about how to use /r/google and /r/github' },
  { path: '/map', description: 'Save URL to alias mapping', response: 'Save a mapping between a URL and an alias' },
  { path: '/mappings', description: 'Display alias-to-URL mappings', response: 'List of alias-to-URL mappings' },
  { path: '/r/ALIAS', description: 'Redirect to URL for specified ALIAS', response: 'Redirect to previously defined URL' },
];

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/i', (req, res) => {
  res.json(endpoints);
}); 

app.get('/i/google', (req, res) => {
  res.send('<a href="https://www.google.com">Go to Google</a>');
})

app.get('/i/github', (req, res) => {
  res.send('<a href="https://github.com/">Go to Github</a>');
})

app.get('/r', (req, res) => {
  const message = 'To use the redirection endpoint, make a GET request to /r/google and /r/github.';
  res.send(message);
});

app.get('/r/google', (req, res) => {
  res.writeHead(302, { Location: 'https://www.google.com' });
  res.end();
})

app.get('/r/github', (req, res) => {
  res.redirect('https://github.com/');
})

app.post('/map', async (req, res) => {
  const { url, alias } = req.body;
  if (!url || !alias) {
    return res.status(400).send('Both URL and alias are required.');
  }
  const newUrl = new Mappings({
    alias : alias,
    url : url,
  })
  const savedUrl = await newUrl.save();
  res.send('Mapping saved successfully.');
});

app.get('/mappings', async (req, res) => {
  try {
    const mappings = await Mappings.find().exec();
    res.json(mappings);
  } catch (error) {
    res.status(500).send('Internal Server Error.');
  }
});

app.get('/:alias', async (req, res) => {
  const { alias } = req.params;
  try {
    const mapping = await Mappings.findOne({ alias: alias }).exec();
    if (mapping) {
      res.redirect(mapping.url);
    } else {
      res.status(404).send('Mapping not found.');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error.');
  }
});

app.listen(5005, () => {
  console.log('Server is running at port 5005');
});

