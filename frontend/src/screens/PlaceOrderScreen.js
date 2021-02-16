import React, { useState } from 'react';
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderScreen = () => {
  const cart = useSelector((state) => state.cart);
  const addDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
  };

  //Calculate Prices
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number(0.15 * cart.itemsPrice));

  cart.totalPrice = addDecimals(
    Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
  );

  const placeOrderHandler = () => {
    console.log('order');
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <strong>Address:</strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}
              {cart.shippingAddress.postalcode}, {cart.shippingAddress.country}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>

              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>

              {cart.cartItems.length === 0 ? (
                <Message>Your Cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((element, idx) => (
                    <ListGroup.Item key={idx}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={element.image}
                            alt={element.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${element.product}`}>
                            {element.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {element.qty} x ${element.price} = $
                          {element.qty * element.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  diabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Link to='/payment'>
        <Button type='button'>Back</Button>
      </Link>
    </>
  );
};

export default PlaceOrderScreen;
