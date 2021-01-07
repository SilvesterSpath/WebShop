import React from 'react';
import products from '../products';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';

const HomeScreens = () => {
  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((i) => (
          <Col key={i._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={i} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreens;
