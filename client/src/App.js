import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    // usin regex for validation
    const urlPattern = /^(?:(?:(?:https?|ftp):)?\/\/)(?!(?:.*ww\.)){1}(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    const numericPattern = /^\d+$/;
    
    // Check if the entered URL matches the pattern, but only if the URL has been modified by the user
    if (url.trim() !== '') {
      setIsValidUrl(urlPattern.test(url) || numericPattern.test(url));
    }
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidUrl) {
      console.log('Invalid URL');
      return;
    }
    try {
      const response = await fetch('https://url-shortener-1zjp.onrender.com/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setShortenedUrl(data.shortenedUrl);
      setUrl('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
    <div className="App" >
     <div className="card">
      <h1 style={{color:"blue"}}>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL to shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ borderColor: isValidUrl ? 'initial' : 'red' }}
        />,
        {!isValidUrl && url.trim() !== '' && <p style={{ color: 'red' }}>Invalid URL</p>}
        <button type="submit">Shorten</button>
      </form>
      
      {shortenedUrl && (
        <div>
          <p>Shortened URL:</p>
          <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
            {shortenedUrl}
          </a>
        </div>
      )}
      </div>
    </div>
    </div>
  );
}

export default App;