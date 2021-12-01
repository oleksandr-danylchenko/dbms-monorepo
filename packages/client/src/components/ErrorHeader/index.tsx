import { FC } from 'react';
import { Header, Icon } from 'semantic-ui-react';

interface ErrorHeaderProps {
  message: string;
  submessage?: string;
}

const ErrorHeader: FC<ErrorHeaderProps> = ({ message, submessage }) => {
  return (
    <Header as="h2" icon textAlign="center" color="red">
      <Icon name="bomb" />
      {message}
      {submessage && <Header.Subheader>{submessage}</Header.Subheader>}
    </Header>
  );
};

export default ErrorHeader;
