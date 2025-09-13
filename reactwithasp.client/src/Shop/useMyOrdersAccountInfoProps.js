import { useSelector } from 'react-redux';
import { nullOrUndefined } from '@/MgUtility.js';

export const useMyOrdersAccountInfoProps = () =>
{
  let full_name = null;
  let order_email = null;

  const guest = useSelector(state => state.login.guest);
  const guestID = !nullOrUndefined(guest) ? guest.id : null;
  full_name = !nullOrUndefined(guest) ? guest.fullname : null;
  order_email = !nullOrUndefined(guest) ? guest.email : order_email;

  const loginValue = useSelector(state => state.login.user);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;
  full_name = !nullOrUndefined(loginValue) ? loginValue.fullname : full_name;
  order_email = !nullOrUndefined(loginValue) ? loginValue.email : order_email;

  const fullname = full_name;
  const email = !nullOrUndefined(order_email) ? order_email : '';

  // "Guest" | "User" | null
  const accType = !nullOrUndefined(guestID) ? "Guest" : (!nullOrUndefined(loginValue) ? loginValue.loginType : null);
  const idval = !nullOrUndefined(guestID) ? guestID : (!nullOrUndefined(myUserId) ? myUserId : null);

  const devMode = (import.meta.env.DEV); // true if environment is development

  return {
    fullname,
    email,
    accType,
    idval,
    myUserId,
    guestID,
    devMode
  };
};