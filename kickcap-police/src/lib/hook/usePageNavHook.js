import React, { useEffect } from 'react';
import { useAppDispatch } from './useReduxHook';
import { navActions } from '../../store/nav';

export const usePageNavHook = (mode) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(navActions.change(mode));
  }, []);
};
