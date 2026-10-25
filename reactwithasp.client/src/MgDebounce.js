
import { debounce } from 'lodash'; // Alternatively write a custom timer-based debounce wrapper
import { setCartQuantity, updateCartOnServer } from '@/features/cart/cartSlice';

// Map 'debounce dispatch' functions with a unique ID to avoid collisions.
// Eg if the user cart is empty and we click to add bottle, then kayak,
// we want the kayak debounce tracking to use its own new function,
// rather than reuse the one from the bottle.
const debouncedUpdaters = {};

export const dispatchDebouncedCartUpdate = (dispatch, cartLineID, newQty, copyProduct) =>
{
  // Dispatch an update for the local UI so it updates instantly.
  dispatch(setCartQuantity({ cartLineID, qty: newQty, isp: copyProduct }));

  // Dispatch an update to the server to tell it new quantity for this cart line item.
  // Here we create a new 'debounced server dispatcher' if one does not exist yet for the clicked line item.
  const debounceDelay = 400; // ms delay
  const key = cartLineID ?? copyProduct?.id; // Ensure unique ID to avoid collisions.
  if (!debouncedUpdaters[key]){
    debouncedUpdaters[key] = debounce((q, c, prod) => {
      dispatch(updateCartOnServer({ cartLineID:c, qty:q, isp:prod }));
    }, debounceDelay);
  }
  debouncedUpdaters[key](newQty, cartLineID, copyProduct); // Trigger the debounced call.
};
