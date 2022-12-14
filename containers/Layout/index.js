import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "../../redux/store";
import { PersistGate } from "redux-persist/integration/react";

const Layout = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="main_wrp">{children}</div>
      </PersistGate>
    </Provider>
  );
};

export default Layout;
