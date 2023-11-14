// pages/_app.js

import { Analytics } from "@vercel/analytics/react";
import { createContext, useState } from "react";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const AppContext = createContext();

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
      <Analytics />
    </AppContext.Provider>
  );
}

export default MyApp;
