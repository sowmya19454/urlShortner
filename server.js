const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
const urlRoute = require("./routes/url");
const URL = require("./models/Schema");
const createHttpError = require('http-errors')
const app = express();
const bodyParser=require("body-parser");
app.use(bodyParser.json())
app.use("/url", urlRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
const shortid = require("shortid");
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

mongoose.set("strictQuery", false);
mongoose.connect(
  `${process.env.MONGODB_URI}`,
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

app.post('/', (req, res) => {
  res.render('index');
})

app.get('/shorten', (req, res) => {
  res.render('index1');
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
  const alias  = req.params.alias;
  try {
    const mapping = await URL.findOne({ alias });
    if (mapping) {
      res.redirect(mapping.url);
    } else {
      res.status(404).send('Mapping not found.');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error.');
  }
});

app.post('/shorten', async (req, res, next) => {
    const { url } = req.body
    if (!url) {
     throw createHttpError.BadRequest('Provide a valid url')
    }
    const urlExists = await URL.findOne({ url })
    if (urlExists) {
      res.render('index1', {
         short_url: `${req.headers.host}/${urlExists.alias}`,
        //short_url: `https://url-shortener-1zjp.onrender.com/${urlExists.alias}`,
      })
      return
    }
    const shortUrl = new URL({ url: url, alias:shortid() })
    const result = await shortUrl.save()
    res.render('index1', {
      short_url: `${req.headers.host}/${result.alias}`,
      //short_url: `https://url-shortener-1zjp.onrender.com/${result.alias}`,
    })
})

app.listen(5002, () => {
  console.log('Server is running at port 5002');
});


