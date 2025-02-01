import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import AppRouter from './Router/routes';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // const response = await axios.get('http://206.189.179.210/session', { withCredentials: true });
        const response = await axios.get('http://206.189.179.210/session', { withCredentials: true });
        if (response.data.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="App">
      <Router>
        <AppRouter isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </div>
  );
}

export default App;
