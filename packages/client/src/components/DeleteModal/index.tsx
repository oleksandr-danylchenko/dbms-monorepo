import { FC, ReactElement } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { BindingAction } from '../../models/functions';

interface DeleteModalProps {
  open?: boolean;
  header: string | ReactElement;
  onClose: BindingAction;
  onDelete: BindingAction;
}

const DeleteModal: FC<DeleteModalProps> = ({ open, header, onClose, onDelete }) => {
  return (
    <Modal onClose={onClose} open={open} size="tiny" dimmer="blurring">
      <Modal.Header>{header}</Modal.Header>
      <Modal.Actions>
        <Button basic color="grey" onClick={onClose}>
          Cancel
        </Button>
        <Button color="google plus" onClick={onDelete}>
          <Icon name="trash" /> Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteModal;
