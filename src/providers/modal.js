import { createContext, useContext, useReducer } from "react";

const ModalContext = createContext();

const initialState = {
  modal: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, modal: action.payload };
    case "CLOSE_MODAL":
      return { ...state, modal: action.payload };
    default:
      return state;
  }
};

export const ModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openModal = (modal = null) => {
    console.log("openModal", modal);
    if (modal) {
      dispatch({ type: "OPEN_MODAL", payload: modal });
    }
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL", payload: null });
  };

  return (
    <ModalContext.Provider
      value={{
        state,
        dispatch,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const { state, dispatch, openModal, closeModal } = useContext(ModalContext);
  return {
    modal: state.modal,
    dispatch,
    openModal,
    closeModal,
  };
};
