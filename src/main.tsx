import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './consumer/consumer.css'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ErrorBoundary>,
);
