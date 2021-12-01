import { FC, useCallback, useMemo } from 'react';
import { Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import PageSidebar from '../../../components/PageSidebar';
import { useAppDispatch } from '../../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../../redux/slices/application';
import { selectAllTables } from '../../../redux/selectors/tables';
import { useActiveDatabase } from '../../../redux/hooks/databases';
import { useActiveDatabaseTables } from '../../../redux/hooks/tables';
import { selectActiveTableId } from '../../../redux/selectors/application';

const TablesSidebar: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const activeTableId = useAppSelector(selectActiveTableId);

  const { data: activeDatabase } = useActiveDatabase();

  const {
    isLoading: isTablesLoading,
    isUninitialized: isTablesUninitialized,
    error: tablesError,
  } = useActiveDatabaseTables();
  const tables = useAppSelector(selectAllTables);

  const handleTableClick = useCallback(
    (tableId: string): void => {
      history.push(`/databases/${activeDatabase?.id}/tables/${tableId}/rows`);
    },
    [activeDatabase?.id, history]
  );

  const tablesTitle = useMemo(() => {
    return <>Tables {activeDatabase?.name && `for ${activeDatabase.name}`}</>;
  }, [activeDatabase?.name]);

  const databasesSidebarItems = useMemo(
    () =>
      tables.map((table) => (
        <Menu.Item key={table.id} link active={table.id === activeTableId} onClick={() => handleTableClick(table.id)}>
          <Menu.Header>{table.name}</Menu.Header>
          <Menu.Menu>
            <Menu.Item>{table.id}</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      )),
    [activeTableId, handleTableClick, tables]
  );

  return (
    <PageSidebar
      title={tablesTitle}
      items={databasesSidebarItems}
      isLoading={isTablesLoading || isTablesUninitialized}
      error={!!tablesError}
    />
  );
};

export default TablesSidebar;
