import express from 'express';
import dotenv from 'dotenv';
import products from './data/products.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((i) => req.params.id === i._id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, console.log(`Server running in ${NODE_ENV} on port ${PORT}`));
