import { createContext, useContext, useReducer } from 'react';

const InStockContext = createContext(null);
const InStockDispatchContext = createContext(null);

export function InStockProvider({ children }) {
  const [inStockProducts, dispatch] = useReducer(inStockReducer, initialProducts);

  return (
    <InStockContext.Provider value={inStockProducts}>
      <InStockDispatchContext.Provider value={dispatch}>
        {children}
      </InStockDispatchContext.Provider>
    </InStockContext.Provider>
  );
}

export function useInStockProducts() {
  return useContext(InStockContext);
}
export function useInStockDispatch() {
  return useContext(InStockDispatchContext);
}

function inStockReducer(inStockProducts, action) {
  switch (action.type) {
    //case 'add': {
    //  return [...inStockProducts, {
    //    id: action.id
    //  }];
    //}
    case 'addRange': {
      return [...inStockProducts, ...action.payload];
    }
    //case 'deleted': {
    //  return inStockProducts.filter(p => p.id !== action.id);
    //}
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialProducts = [
];