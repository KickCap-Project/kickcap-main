import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../lib/hook/useReduxHook';
import { pageActions } from '../store/page';

export const PrivateRoute = () => {
  const checkLogin = !!sessionStorage.getItem('accessToken');

  if (!checkLogin) {
    alert('로그인 후 접근 가능합니다.');
  }
  return checkLogin ? <Outlet /> : <Navigate to={'/'} />;
};

export const PublicRoute = () => {
  // sessionStorage.removeItem('persist:redux-state');
  const dispatch = useAppDispatch();
  dispatch(pageActions.changeboardType('park'));
  const checkLogin = !!sessionStorage.getItem('accessToken');
  const location = useLocation();
  if (checkLogin && location.pathname === '/') {
    return <Navigate replace to="/board?sido=전국" />;
  }
  return checkLogin ? <Navigate to={'*'} /> : <Outlet />;
};
