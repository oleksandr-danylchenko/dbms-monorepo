import { FC, useCallback, useMemo } from 'react';
import { Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import PageSidebar from '../../../components/PageSidebar';
import { selectNameSortedTables } from '../../../redux/selectors/tables';
import { useActiveDatabase } from '../../../redux/hooks/databases';
import { useActiveDatabaseTables } from '../../../redux/hooks/tables';
import { selectActiveTableId } from '../../../redux/selectors/application';

const TablesSidebar: FC = () => {
  const history = useHistory();

  const activeTableId = useAppSelector(selectActiveTableId);

  const { data: activeDatabase, isFetching: isDatabaseFetching } = useActiveDatabase();

  const {
    isFetching: isTablesFetching,
    isUninitialized: isTablesUninitialized,
    error: tablesError,
  } = useActiveDatabaseTables();
  const tables = useAppSelector(selectNameSortedTables);

  const handleTableClick = useCallback(
    (tableId: string): void => {
      if (isDatabaseFetching) return;
      history.push(`/databases/${activeDatabase?.id}/tables/${tableId}/rows`);
    },
    [activeDatabase?.id, history, isDatabaseFetching]
  );

  const tablesTitle = useMemo(() => {
    return <>Tables {!isDatabaseFetching && activeDatabase?.name && `for ${activeDatabase.name}`}</>;
  }, [activeDatabase?.name, isDatabaseFetching]);

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
      isLoading={isDatabaseFetching || isTablesFetching || isTablesUninitialized}
      error={!!tablesError}
    />
  );
};

export default TablesSidebar;
