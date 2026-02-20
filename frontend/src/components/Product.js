import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='product-card my-3'>
      <Link to={`/product/${product._id}`} className='d-block'>
        <Card.Img src={product.image} variant='top' className='product-image' />
      </Link>
      <Card.Body className='product-content'>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            {product.name}
          </Card.Title>
        </Link>
        <Card.Text as='div' className='product-rating rating-stars'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
            color='#f59e0b'
          />
        </Card.Text>
        <Card.Text as='div' className='product-price'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
