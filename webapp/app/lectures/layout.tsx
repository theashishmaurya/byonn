import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='flex flex-col overflow-hidden'>
      {/* <header className='bg-gray-800 py-4'>
      </header> */}
      <main className='flex-grow overflow-hidden h-screen'>{children}</main>
      {/* <footer className='bg-gray-800 py-4'>
      </footer> */}
    </div>
  );
};

export default Layout;
