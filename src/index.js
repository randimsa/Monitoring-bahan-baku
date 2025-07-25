import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LoginPage from "./LoginPage";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./index.css";

function RootApp() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  return user ? <App /> : <LoginPage />
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootApp />);