import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../utils/axiosClient';

const OrdersPage = () => {

    let { user_uuid } = useParams();
    let navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axiosClient.get(`/users/${user_uuid}/orders/`);
            if (res.status === 200) {
                setOrders(res.data);
            } else {
                console.error('Unexpected response status:', res.status);
                setOrders([]);
                navigate('/');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setOrders([]);
            navigate('/');
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [user_uuid]);

    return (
        <div>
            <h1 className='font-poppins text-neutral-100 text-2xl mt-40'>Your Orders</h1>
        </div>
    )
}

export default OrdersPage
