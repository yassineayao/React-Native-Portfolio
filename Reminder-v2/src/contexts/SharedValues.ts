import React from "react";
import { Database } from "../database/Database";

export const sharedValues = React.createContext({
  db: Database.getInstance(),
  lang: 0,
  setLang: (val: 0 | 1) => {},
});
