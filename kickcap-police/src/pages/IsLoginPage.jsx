import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../lib/hook/useReduxHook';
import { pageActions } from '../store/page';

export const PrivateRoute = () => {
  const checkLogin = !!localStorage.getItem('accessToken');

  if (!checkLogin) {
    alert('로그인 후 접근 가능합니다.');
  }
  return checkLogin ? <Outlet /> : <Navigate to={'/'} />;
};

export const PublicRoute = () => {
  // localStorage.removeItem('persist:redux-state');
  const dispatch = useAppDispatch();
  dispatch(pageActions.changeboardType('park'));
  const checkLogin = !!localStorage.getItem('accessToken');
  const location = useLocation();
  if (checkLogin && location.pathname === '/') {
    return <Navigate replace to="/board" />;
  }
  return checkLogin ? <Navigate to={'*'} /> : <Outlet />;
};
