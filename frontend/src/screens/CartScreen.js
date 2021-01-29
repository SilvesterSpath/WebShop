import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Form,
  Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;

  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your Cart is Empty<Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((i) => (
              <ListGroup.Item key={i.product}>
                <Row>
                  <Col md={2}>
                    <Image src={i.image} alt={i.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${i.product}`}>{i.name}</Link>
                  </Col>
                  <Col md={2}>${i.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={i.qty}
                      onChange={(event) =>
                        dispatch(
                          addToCart(i.product, Number(event.target.value))
                        )
                      }
                    >
                      {[...Array(i.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(i.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup varinat='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)}) items
              </h2>
              $
              {cartItems
                .reduce((acc, i) => acc + i.qty * i.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
