import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const productTopRated = useSelector((i) => i.productTopRated);
  const { loading, error, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel pause='hover' className='carousel-hero' indicators={false}>
      {products.map((i) => (
        <Carousel.Item key={i._id}>
          <div className='carousel-slide-inner'>
            <Link to={`/product/${i._id}`} className='carousel-slide-media'>
              <img src={i.image} alt={i.name} />
            </Link>
            <div className='carousel-slide-content'>
              <Link to={`/product/${i._id}`} className='carousel-slide-name'>
                {i.name}
              </Link>
              <span className='carousel-slide-price'>${i.price}</span>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
