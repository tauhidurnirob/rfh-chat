import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from './SweetState/authState';

const PrivateRoute = ({ redirectPath, ...props }) => {
  const [authState] = useAuthState();

  const isAuthenticated = authState.loggedIn;
  console.log(isAuthenticated)

  return(
    <>
    {
      !isAuthenticated ?
      <Navigate to={redirectPath} />
      :
      <Route {...props} />
    }</>
  );
};

export default PrivateRoute;