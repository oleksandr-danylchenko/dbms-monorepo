import { FC } from 'react';
import DatabasesSidebar from './Sidebar';
import DatabasesCards from './Cards';
import PageLayout from '../../components/PageLayout';

const Databases: FC = () => <PageLayout sidebar={<DatabasesSidebar />} content={<DatabasesCards />} />;

export default Databases;
