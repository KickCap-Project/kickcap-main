import { useEffect } from 'react';
import { useAppDispatch } from './useReduxHook';
import { modalActions } from '../../store/modal';
import { useLocation } from 'react-router';

export const useModalExitHook = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(modalActions.ChangeIsMain(false));
      dispatch(modalActions.ChangeIsPhone(false));
    };
    handleRouteChange();
  }, [dispatch, location]);
};
