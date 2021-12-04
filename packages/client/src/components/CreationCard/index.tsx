import { FC, ReactElement } from 'react';
import { Card, Header, Icon } from 'semantic-ui-react';
import { BindingAction } from '../../models/functions';
import styles from './styles.module.scss';

interface CardActionsProps {
  header: string | ReactElement;
  onClick: BindingAction;
}

const CreationCard: FC<CardActionsProps> = ({ header, onClick }) => {
  return (
    <Card key="createDatabase" link onClick={onClick} className={styles.CreationCard}>
      <Card.Content className={styles.CreationCard__Content}>
        <Header as="h3" icon className={styles.CreationCard__Header}>
          <Icon name="plus circle" />
          {header}
        </Header>
      </Card.Content>
    </Card>
  );
};

export default CreationCard;
