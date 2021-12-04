import { FC, ReactElement } from 'react';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

interface PageLayoutProps {
  header?: string | ReactElement;
  backLink?: string;
  sidebar: ReactElement;
  content: ReactElement;
}

const PageLayout: FC<PageLayoutProps> = ({ header, backLink, sidebar, content }) => (
  <Grid columns="equal" padded className={styles.PageLayout}>
    <Grid.Column width={3}>{sidebar}</Grid.Column>
    <Grid.Column>
      {(header || backLink) && (
        <Segment inverted className={styles.PageLayout__Header}>
          {backLink && (
            <Link to={backLink}>
              <Icon name="arrow left" />
            </Link>
          )}
          {header && <Header className={styles.PageLayout__HeaderContent}>{header}</Header>}
        </Segment>
      )}
      {content}
    </Grid.Column>
  </Grid>
);

export default PageLayout;
