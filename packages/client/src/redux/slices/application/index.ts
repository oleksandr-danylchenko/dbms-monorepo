import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_HOST } from '../../../constants';
import { selectDefinedProperties } from '../../../utils/objects';

export interface ApplicationState {
  activeIds: Partial<{
    databaseId: string;
    tableId: string;
  }>;

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
  activeIds: {},
  api: {
    host: API_HOST,
  },
} as ApplicationState;

export const applicationsSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateActiveIds: (state, action: PayloadAction<Partial<ApplicationState['activeIds']>>) => {
      state.activeIds = {
        ...state.activeIds,
        ...selectDefinedProperties(action.payload),
      };
    },
  },
});

export const { updateActiveIds } = applicationsSlice.actions;

export default applicationsSlice.reducer;
