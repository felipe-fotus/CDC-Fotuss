import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const AppShell = () => {
  const shellStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={shellStyle}>
      <Navbar />
      <div style={mainStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default AppShell;
