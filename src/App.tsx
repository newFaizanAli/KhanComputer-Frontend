import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ToastProvider } from './components/shared';
import appRoutes from './routes';

function App() {

  function AppRoutes() {
    const routes = useRoutes([...appRoutes]);

    return routes;
  }

  return (
    <Router>
      <AppRoutes />
      <ToastProvider />
    </Router>
  )

}

export default App
