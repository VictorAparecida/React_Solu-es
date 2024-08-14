import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider, DrawerProvider } from './shareds/contexts';
import AppRoutes from './routes/AppRoutes';

export const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
            <AppRoutes authenticated={authenticated} setAuthenticated={setAuthenticated} />
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
};

export default App;
