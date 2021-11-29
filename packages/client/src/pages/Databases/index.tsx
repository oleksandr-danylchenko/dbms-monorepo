import { FC } from 'react';
import { useHistory } from 'react-router';
import styles from './styles.module.scss';

const Databases: FC = () => {
  const history = useHistory();

  return <h1>Hello, databases</h1>;
};

export default Databases;
