import { FC, ReactElement, useMemo } from 'react';
import { Header, Menu, Placeholder, Segment } from 'semantic-ui-react';
import clsx from 'clsx';
import styles from './styles.module.scss';

interface PageSidebarProps {
  title?: string | ReactElement;
  items: ReactElement[];
  isLoading?: boolean;
  error?: boolean;
  placeholderElementsAmount?: number;
}

const PageSidebar: FC<PageSidebarProps> = ({ title, items, isLoading, error, placeholderElementsAmount = 7 }) => {
  const menuPlaceholderElement = useMemo(
    () =>
      [...Array(placeholderElementsAmount).keys()].map((value) => (
        <Menu.Item key={value}>
          <Placeholder inverted>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </Menu.Item>
      )),
    [placeholderElementsAmount]
  );

  return (
    <Segment padded={false} inverted className={clsx(styles.PageSidebar)}>
      <Header>{title}</Header>
      {!error && (
        <Menu secondary vertical fluid inverted>
          {isLoading ? menuPlaceholderElement : items}
        </Menu>
      )}
    </Segment>
  );
};

export default PageSidebar;
