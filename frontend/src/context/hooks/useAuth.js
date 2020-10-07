import React, { useEffect, useState } from 'react';
import api from '../../api';
import history from '../../history';

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  async function handleLogin() {
    const { data: { token } } = await api.post('/authenticate');

    localStorage.setItem('token', JSON.stringify(token))
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setAuthenticated(true);
    history.push('/users');
  }

  function handleLogout() {
      localStorage.removeItem('token');
      setAuthenticated(false);
      api.defaults.headers.Authorization = undefined;
      
      history.push('/login');

  } 

  if(loading) {
    return <h1>Loading...</h1>
  }
  return { authenticated, loading, handleLogin, handleLogout };
}