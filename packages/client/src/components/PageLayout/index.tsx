import { FC, ReactElement } from 'react';
import { Grid } from 'semantic-ui-react';
import styles from './styles.module.scss';

interface PageLayoutProps {
  sidebar: ReactElement;
  content: ReactElement;
}

const PageLayout: FC<PageLayoutProps> = ({ sidebar, content }) => (
  <Grid row={1} columns="equal" padded className={styles.PageLayout}>
    <Grid.Column width={3}>{sidebar}</Grid.Column>
    <Grid.Column>{content}</Grid.Column>
  </Grid>
);

export default PageLayout;
