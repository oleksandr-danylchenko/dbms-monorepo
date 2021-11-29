import { createSlice } from '@reduxjs/toolkit';
import { API_HOST } from '../../../constants';

export interface ApplicationState {
  /**
   * Defines urls for the Core API and required applications
   */
  api: ApplicationApi;
}

export interface ApplicationApi {
  host: string;
}

export interface ApplicationCoursesIndex {
  [courseId: number]: {
    /**
     * Defines current date for the instructor, can be changed from outside
     */
    pivotDate: string;
  };
}

const initialState = {
  coursesIndex: {},
  api: {
    host: API_HOST,
  },
} as ApplicationState;

export const applicationsSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
});

// eslint-disable-next-line no-empty-pattern
export const {} = applicationsSlice.actions;

export default applicationsSlice.reducer;
