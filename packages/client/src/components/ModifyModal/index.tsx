import { FC, ReactElement } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { BindingAction } from '../../models/functions';

interface ModifyModalProps {
  open?: boolean;
  header: string | ReactElement;
  content: string | ReactElement;
  onClose: BindingAction;
  onSave: BindingAction;
}

const ModifyModal: FC<ModifyModalProps> = ({ open, header, content, onClose, onSave }) => {
  return (
    <Modal open={open} onClose={onClose} dimmer="blurring">
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>{content}</Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={onClose}>
          Cancel
        </Button>
        <Button color="black" onClick={onSave}>
          <Icon name="save" /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ModifyModal;
