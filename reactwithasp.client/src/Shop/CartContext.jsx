import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({ children }) {
  const [cartProducts, dispatch] = useReducer(cartProductsReducer, initialCartProducts);

  return (
    <CartContext.Provider value={cartProducts}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}

export function useCartProducts() {
  return useContext(CartContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}

function cartProductsReducer(cartProducts, action) {
  switch (action.type) {
    case 'add': {
      debugger;
      return [...cartProducts, {
        id: action.id
      }];
    }
    case 'deleted': {
      return cartProducts.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialCartProducts = [
  //{ id: 0, title: 'Soccer Ball $35.00', slug: "FIFA approved size and weight."},
  //{ id: 1, title: 'Corner Flags $25.00', slug: "Give some flourish to your playing field with these coloured corner flags." },
  //{ id: 2, title: 'Referee Whistle $12.00', slug: "For serious games, call it with this chrome Referee Whistle." },
  //{ id: 3, title: 'Red and Yellow Cards $10.00', slug: "Official size and colour, waterproof high visibility retroflective coating." },
];
