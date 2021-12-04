import { FC } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { BindingAction } from '../../models/functions';

interface DeleteModalProps {
  open?: boolean;
  entityName: string;
  icon?: SemanticICONS;
  onCancel: BindingAction;
  onPermit: BindingAction;
}

const DeleteModal: FC<DeleteModalProps> = ({ open, entityName, icon = 'trash alternate', onCancel, onPermit }) => {
  return (
    <Modal basic onClose={onCancel} open={open} size="tiny" dimmer="blurring">
      <Header icon>
        <Icon name={icon} />
        Delete {entityName}
      </Header>
      <Modal.Content>
        <p>Are you really want to delete {entityName}?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" inverted onClick={onCancel}>
          <Icon name="remove" /> No
        </Button>
        <Button color="black" inverted onClick={onPermit}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteModal;
