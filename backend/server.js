import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js ';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);

/* middleware log 'SilvesterSpath' to the console
app.use((req, res, next) => {
  console.log('SilvesterSpath');
  next();
});
*/

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
//const NODE_ENV = process.env.NODE_ENV;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);