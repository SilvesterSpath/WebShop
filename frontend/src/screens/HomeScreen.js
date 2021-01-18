import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';

const HomeScreens = () => {
  const dispatch = useDispatch();

  const productList = useSelector((i) => i.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  // const products = [];

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <Row>
          {products.map((i) => (
            <Col key={i._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={i} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreens;
