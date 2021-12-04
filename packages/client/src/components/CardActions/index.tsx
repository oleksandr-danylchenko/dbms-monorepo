import { FC, MouseEvent, useMemo } from 'react';
import { Button } from 'semantic-ui-react';
import { BindingAction } from '../../models/functions';

interface CardActionsProps {
  onEditClick: BindingAction;
  onDeleteClick: BindingAction;
}

const CardActions: FC<CardActionsProps> = ({ onEditClick, onDeleteClick }) => {
  const createIsolatedHandler = (originalHandler: BindingAction) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    originalHandler();
  };

  const isolatedEditHandler = useMemo(() => createIsolatedHandler(onEditClick), [onEditClick]);
  const isolatedDeleteHandler = useMemo(() => createIsolatedHandler(onDeleteClick), [onDeleteClick]);
  return (
    <>
      <Button circular icon="pencil alternate" size="mini" color="grey" onClick={isolatedEditHandler} />{' '}
      <Button circular icon="trash alternate" size="mini" color="black" onClick={isolatedDeleteHandler} />
    </>
  );
};

export default CardActions;
