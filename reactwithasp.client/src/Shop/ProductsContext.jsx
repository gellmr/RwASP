import { createContext, useContext, useReducer } from 'react';

const ProductsContext = createContext(null);
const ProductsDispatchContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, dispatch] = useReducer(productsReducer, initialProducts);

  return (
    <ProductsContext.Provider value={products}>
      <ProductsDispatchContext.Provider value={dispatch}>
        {children}
      </ProductsDispatchContext.Provider>
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}

export function useProductsDispatch() {
  return useContext(ProductsDispatchContext);
}

function productsReducer(products, action) {
  switch (action.type) {
    case 'add': {
      return [...products, {
        id: action.id
      }];
    }
    case 'deleted': {
      return products.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialProducts = [
  { id: 0, title: 'Soccer Ball $35.00', slug: "FIFA approved size and weight."},
  { id: 1, title: 'Corner Flags $25.00', slug: "Give some flourish to your playing field with these coloured corner flags." },
  { id: 2, title: 'Referee Whistle $12.00', slug: "For serious games, call it with this chrome Referee Whistle." },
  { id: 3, title: 'Red and Yellow Cards $10.00', slug: "Official size and colour, waterproof high visibility retroflective coating." },
];
