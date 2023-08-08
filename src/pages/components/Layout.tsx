import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
// import AutoRefreshPage from './AutoRefreshPage';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {/* <AutoRefreshPage /> */}
      <div className="container mx-auto my-5">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
