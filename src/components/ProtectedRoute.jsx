import React, { useContext } from "react";
import { Outlet, redirect } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = () => {
  const { loading, user } = useAuth();
  if (loading) "<h2>loading...</h2>";

  if (user) {
    return <Outlet />;
  }
  redirect("/");
};

export default ProtectedRoute;
