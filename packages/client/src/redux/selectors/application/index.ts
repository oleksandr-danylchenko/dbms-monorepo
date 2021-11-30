import { RootState } from '../../store';

export const selectActiveDatabaseId = (state: RootState): string | undefined => state.application.activeIds.databaseId;
export const selectActiveTableId = (state: RootState): string | undefined => state.application.activeIds.tableId;
