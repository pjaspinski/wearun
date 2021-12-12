import React, {createContext, useContext, useReducer} from 'react';

export const Context = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {...state, user: action.payload};
  }
  return state;
};

export const Store = ({children, initialState}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
  );
};

export const useStore = () => useContext(Context);
