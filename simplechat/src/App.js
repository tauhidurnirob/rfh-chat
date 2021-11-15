import './App.css';
import Chat from './Chat';
import { useRef } from 'react';
import Login from './Login';

import worker from 'worker-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";
import Home from './Home';
import { Route, Routes, useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { useAppState } from './SweetState/appState';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import CreateCommunity from './CreateCommunity';
import CreateDiscussion from './CreateDiscussion';
import UserImageUpload from './UserImageUpload';
import { useAuthState } from './SweetState/authState';
import RequireAuth from './RequireAuth';
import { getCookie } from './CustomMethods';

//Web Worker instance
const workerInstance = worker();

const App = () => {
  //Global State
  const [appState, appActions] = useAppState();
  const [authState, authActions] = useAuthState();
  //State
  // const [authClicked, setAuthClicked] = useState(false);
  // const [loginClicked, setLoginClicked] = useState(false);

  //References
  const authClicked = useRef(null);
  const loginClicked = useRef(null);

  // React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity
      }
    }
  });

  //Routing
  const navigate = useNavigate();

  workerInstance.onmessage = e => {
    console.log(JSON.parse(e.data));
    const data = JSON.parse(e.data);
    if(data.type === 'WEBSOCKET_CONNECTED_EVENT') {
      workerInstance.postMessage({
        op: 'sendCommand',
        command: {
          "type": "SESSION_CREATE_COMMAND",
          "commandId": uuidv4()
        }
      });
    }
    else if (data.type === "SESSION_CREATED_EVENT") {
      appActions.setSessionCreatedEvent(data);
      appActions.setLoading(false);
    }
    if(data.type === 'SECURE_CONNECT_EVENT') {
      if(authClicked.current) {
        workerInstance.postMessage({
          op: 'sendCommand',
          command: {
            "type": "SESSION_LOGIN_COMMAND",
            "sessionId": appState.sessionCreatedEvent.sessionId,
            "commandId": uuidv4()
          }
        });
      }
      else if(loginClicked.current) {
        navigate('/login');
        appActions.setLoading(false);
      }
      else appActions.setLoading(false);
    }
    else if(data.type === 'SESSION_LOGGED_IN_EVENT') {
      // navigate('/createCommunity');
      appActions.setLoading(false);
    }
    else if(data.type === 'CATEGORY_DETAILS_RESULT_SET') {
      appActions.setCategories(data.categories)
      appActions.setLoading(false);
    }
    else if(data.type === 'COMMUNITY_CREATED_EVENT') {
      workerInstance.postMessage({
        op: 'sendCommand',
        command: {
          "type": "COMMUNITY_FETCH_QUERY",
          "commandId": uuidv4()
        }
      });
      navigate('/createDiscussion');
    }
    else if(data.type === 'COMMUNITY_DETAILS_RESULT_SET') {
      appActions.setCommunities(data.communities);
      navigate('/createDiscussion');
      appActions.setLoading(false);
    }
    else if(data.type === 'DISCUSSION_CREATED_EVENT') {
      navigate('/chat');
      appActions.setLoading(false);
    }
    else if(data.type === "USER_LOGGED_IN_EVENT") {
      appActions.setLoading(false);
      authActions.login();
      navigate('/uploadImage');
    }
    else if(data.type === "USER_IMAGE_UPLOADED_EVENT") {
      appActions.setLoading(false);
      navigate('/createCommunity');
    }
    else if(data.type === "DISCUSSION_COMMENT_ADDED_EVENT") {
      appActions.setComments({id: data.comment.commentId, comment: data.comment.comment})
    }
  }
  console.log(getCookie('loggedIn'));
  console.log(authState.loggedIn);

  const authenticateGuest = () => {
    appActions.setLoading(true);
    workerInstance.postMessage({
      op: 'secureConnect',
      sessionId: appState.sessionCreatedEvent.sessionId
    });
    loginClicked.current = false;
    authClicked.current = true;
  }

  const loginPage = () => {
    workerInstance.postMessage({
      op: 'secureConnect',
      sessionId: appState.sessionCreatedEvent.sessionId
    });
    appActions.setLoading(true);
    loginClicked.current = true;
    authClicked.current = false;
  }

  // const createCookieInHour = (cookieName, cookieValue, hourToExpire) => {
  //   let date = new Date();
  //   date.setTime(date.getTime()+(hourToExpire*60*60*1000));
  //   document.cookie = cookieName + " = " + cookieValue + "; expires = " +date.toGMTString();
  // }
  // createCookieInHour('test1', 'testValue2', 1);
  // console.log(document.cookie)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {
          appState.loading ?
          <LoadingScreen />
          : null
        }
        <Routes>
          <Route path="/" element={
            <Home
            userName = {appState.sessionCreatedEvent ? appState.sessionCreatedEvent.userName : 'Guest'}
            authGuestClicked = {authenticateGuest}
            loginClicked = {loginPage}
            worker = {workerInstance}
          />}
          />
          <Route path="/login" element={<Login worker = {workerInstance} /> } />
          <Route element={<RequireAuth />}>
            <Route path="/chat" element={<Chat worker = {workerInstance} />} />
            <Route path="/createCommunity" element={<CreateCommunity worker = {workerInstance} />} />
            <Route path="/createDiscussion" element={<CreateDiscussion worker = {workerInstance} />} />
            <Route path="/uploadImage" element={<UserImageUpload worker = {workerInstance} />} />
          </Route>
        </Routes>
        {/* <ReactQueryDevtools initialIsOpen /> */}
      </div>
    </QueryClientProvider>
  );
}

export default App;
