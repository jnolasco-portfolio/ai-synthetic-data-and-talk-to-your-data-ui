import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DataGenerationScreen } from './components/DataGenerationScreen';
import ChatScreen from './components/ChatScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    // 2. BrowserRouter wraps the entire application
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* 3. AppLayout wraps the Routes, making it the persistent shell */}
        <AppLayout>
          <Routes>
            {/* 4. Define specific routes for each screen */}
            <Route
              path='/'
              element={<Navigate to='/generate' replace />}
            />{' '}
            {/* Default route */}
            <Route path='/generate' element={<DataGenerationScreen />} />
            <Route path='/chat' element={<ChatScreen />} />
            {/* Add a 404 route if desired */}
          </Routes>
        </AppLayout>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
