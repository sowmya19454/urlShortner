const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const mappings = {}; 

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

app.post('/map', (req, res) => {
  const { url, alias } = req.body;
  if (!url || !alias) {
    return res.status(400).send('Both URL and alias are required.');
  }
  mappings[alias] = url;
  res.send('Mapping saved successfully.');
});

app.get('/mappings', (req, res) => {
  res.json(mappings);
});

app.get('/r/:alias', (req, res) => {
  const { alias } = req.params;
  const url = mappings[alias];
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).send('Mapping not found.');
  }
});

app.listen(5005, () => {
  console.log('Server is running at port 5005');
});
