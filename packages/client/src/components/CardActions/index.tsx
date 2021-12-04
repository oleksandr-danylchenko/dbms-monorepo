import { FC } from 'react';
import { Button } from 'semantic-ui-react';
import { BindingAction } from '../../models/functions';

interface CardActionsProps {
  onEditClick: BindingAction;
  onDeleteClick: BindingAction;
}

const CardActions: FC<CardActionsProps> = ({ onEditClick, onDeleteClick }) => {
  return (
    <>
      <Button circular icon="pencil alternate" size="mini" color="grey" onClick={onEditClick} />{' '}
      <Button circular icon="trash alternate" size="mini" color="black" onClick={onDeleteClick} />
    </>
  );
};

export default CardActions;
