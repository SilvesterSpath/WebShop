import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((i) => i.orderList);
  const { loading, orders, error } = orderList;

  //console.log('orders', orders);

  const userLogin = useSelector((i) => i.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ORDER_ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((i) => (
              <tr key={i._id}>
                <td>{i._id}</td>
                <td>{i.user.name}</td>
                <td>{i.createdAt.substring(0, 10)}</td>
                <td>${i.totalPrice}</td>
                <td>
                  {i.isPaid ? (
                    i.paidAt.substring(0, 10)
                  ) : (
                    <Message variant='danger'>not paid</Message>
                  )}
                </td>
                <td>
                  {i.isDelivered ? (
                    i.deliveredAt.substring(0, 10)
                  ) : (
                    <Message variant='danger'>not delivered</Message>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${i._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
