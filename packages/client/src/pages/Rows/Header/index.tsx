import { FC } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { useActiveTable } from '../../../redux/hooks/tables';
import { BindingAction } from '../../../models/functions';
import styles from './styles.module.scss';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectActiveTableColumnsOrderIndex } from '../../../redux/selectors/tables';

interface RowsHeaderProps {
  onCreateClick: BindingAction;
}

const RowsHeader: FC<RowsHeaderProps> = ({ onCreateClick }) => {
  const { data: activeTable, isFetching: isTableFetching } = useActiveTable();
  const columnsOrderIndex = useAppSelector(selectActiveTableColumnsOrderIndex);
  return (
    <span className={styles.RowsHeader}>
      <span>Rows {!isTableFetching && activeTable?.name && `for ${activeTable.name}`}</span>
      {!!columnsOrderIndex?.length && (
        <Button color="grey" circular onClick={onCreateClick}>
          <Icon name="plus circle" />
          Add a row
        </Button>
      )}
    </span>
  );
};

export default RowsHeader;
