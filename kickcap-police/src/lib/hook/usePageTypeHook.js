import React, { useEffect } from 'react';
import { useAppDispatch } from './useReduxHook';
import { pageActions } from '../../store/page';
import { navActions } from '../../store/nav';

export const usePageTypeHook = (type) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (type === 'crackdown') {
      dispatch(pageActions.changeReportType('park'));
      dispatch(pageActions.changeComplaintType('progress'));
      dispatch(pageActions.changeboardType('park'));
    } else if (type === 'report') {
      dispatch(pageActions.changeComplaintType('progress'));
      dispatch(pageActions.changeCrackType('helmet'));
      dispatch(pageActions.changeboardType('park'));
    } else if (type === 'complaint') {
      dispatch(pageActions.changeCrackType('helmet'));
      dispatch(pageActions.changeReportType('park'));
      dispatch(pageActions.changeboardType('park'));
    } else if (type === 'board') {
      dispatch(pageActions.changeCrackType('helmet'));
      dispatch(pageActions.changeReportType('park'));
      dispatch(pageActions.changeComplaintType('progress'));
    }
  }, []);
};
