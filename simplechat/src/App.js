import './App.css';
import Chat from './Chat';
import { useState, useEffect } from 'react';
import Login from './Login';
import Axios from 'axios';

import worker from 'worker-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const workerInstance = worker();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity
      }
    }
  });

  const loginHandler = (name, pass) => {
    Axios({
      method: "POST",
      data: {
        username: name,
        password: pass
      },
      withCredentials: true,
      url: "http://localhost:3000/login"
    }).then((res) => {
      console.log(res)
      setIsAuth(res.data.authenticated);
    }).catch((err)=> {
      setIsAuth(false);
    });
  }

  const logOutHandler = () => {
    Axios({
      method: "Get",
      withCredentials: true,
      url: "http://localhost:3000/logout"
    }).then((res) => {
      setIsAuth(false);
      console.log(res)
    })
  }

  useEffect(() => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3000/chat",
    }).then((res) => {
      if(res.data) {
        setIsAuth(true);
      }
      console.log(res.data);
    }).catch((err)=> {
      setIsAuth(false);
    });
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {
          isAuth ?
          <Chat logOutClicked = {logOutHandler} worker = {workerInstance} />
          : <Login loginClicked = {loginHandler} />
        }
        <ReactQueryDevtools initialIsOpen />
      </div>
    </QueryClientProvider>
    
  );
}

export default App;
