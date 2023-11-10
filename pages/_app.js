// pages/_app.js

import { createContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const AppContext = createContext();

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
