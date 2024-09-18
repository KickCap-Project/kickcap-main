import React, { useEffect } from 'react';
import { useAppDispatch } from './useReduxHook';
import { pageActions } from '../../store/page';

export const usePageTypeHook = (type) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (type === 'crackdown') {
      dispatch(pageActions.changeReportType('park'));
      dispatch(pageActions.changeComplaintType('progress'));
    } else if (type === 'report') {
      dispatch(pageActions.changeComplaintType('progress'));
      dispatch(pageActions.changeCrackType('helmet'));
    } else if (type === 'complaint') {
      dispatch(pageActions.changeCrackType('helmet'));
      dispatch(pageActions.changeReportType('park'));
    } else if (type === 'board') {
      dispatch(pageActions.changeCrackType('helmet'));
      dispatch(pageActions.changeReportType('park'));
      dispatch(pageActions.changeComplaintType('progress'));
    }
  }, []);
};
