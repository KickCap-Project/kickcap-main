import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useReduxHook';
import { modalActions, selectModalCalendar } from '../../store/modal';
import { useLocation, useNavigate } from 'react-router';

export const useModalExitHook = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(modalActions.ChangeIsCamera(false));
      dispatch(modalActions.ChangeIsEmergency(false));
      dispatch(modalActions.ChangeIsComplaintInfo(false));
      dispatch(modalActions.ChangeIsComplaintSend(false));
      dispatch(modalActions.ChangeIsReportInfo(false));
      dispatch(modalActions.ChangeIsReportPark(false));
    };

    handleRouteChange();
  }, [dispatch, location]);
};
