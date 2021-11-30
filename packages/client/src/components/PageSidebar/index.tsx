import { FC, ReactElement, useMemo } from 'react';
import { Header, Menu, Placeholder, Sidebar } from 'semantic-ui-react';
import styles from './styles.module.scss';

interface PageSidebarProps {
  title?: string;
  items: ReactElement[];
  isLoading?: boolean;
  error?: boolean;
  placeholderElementsAmount?: number;
}

const PageSidebar: FC<PageSidebarProps> = ({ title, items, isLoading, error, placeholderElementsAmount = 7 }) => {
  const menuPlaceholderElement = useMemo(() => {
    return [...Array(placeholderElementsAmount).keys()].map((value) => (
      <Menu.Item key={value}>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Menu.Item>
    ));
  }, [placeholderElementsAmount]);

  return (
    <Sidebar animation="push" vertical visible={!error}>
      <Header className={styles.PageSidebar__Header}>{title}</Header>
      <Menu vertical fluid className={styles.PageSidebar__Menu}>
        {isLoading ? menuPlaceholderElement : items}
      </Menu>
    </Sidebar>
  );
};

export default PageSidebar;
