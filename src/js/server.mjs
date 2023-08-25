import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000; // You can change this to any port you prefer

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Proxy route
app.get('/proxy', async (req, res) => {
  const { url } = req.query;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Proxy Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
