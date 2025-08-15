import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { nullOrUndefined } from '@/MgUtility.js';
import { fetchMyOrders } from '@/features/myOrders/myOrdersSlice.jsx'
import { NavLink } from "react-router";

function CheckoutSuccess()
{
  const dispatch = useDispatch();

  const guest = useSelector(state => state.login.guest);
  const guestID = !nullOrUndefined(guest) ? guest.id : null;

  const loginValue = useSelector(state => state.login.user);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  useEffect(() => {
    dispatch(fetchMyOrders({ uid: myUserId, gid: guestID }));
  }, []);

  return (
    <>
      <h2 style={{ marginTop: "20px", marginBottom:"15px" }}>Thanks!</h2>
      <p className={"mb-4"}>Your order has been submitted. We'll ship your goods as soon as possible.</p>

      <NavLink to={"/"} className={"btn btn-primary"}>Continue Shopping</NavLink>
    </>
  );
}
export default CheckoutSuccess;