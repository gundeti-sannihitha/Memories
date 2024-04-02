import React, { useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import PageRender from './customRouter/PageRender'
import PrivateRouter from './customRouter/PrivateRouter'

import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'

import Alert from './components/alert/Alert'
import Header from './components/header/Header'
import StatusModal from './components/StatusModal'

import { useSelector, useDispatch } from 'react-redux'
import { refreshToken } from './redux/actions/authAction'
import { getPosts } from './redux/actions/postAction'
import { getSuggestions } from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'
import CallModal from './components/message/CallModal'
import Peer from 'peerjs'

function App() {
  const auth = useSelector(state => state.auth);
  const status = useSelector(state => state.status);
  const modal = useSelector(state => state.modal);
  const call = useSelector(state => state.call);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(auth.token) {
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])

  
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])

 
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])


  return (
    
    <Router>
      <Alert />

      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}

          <Routes>
  <Route element={<React.Fragment>
    <Route path="/" element={auth.token ? <Home/> : <Login/>} />
    <Route path="/register" element={<Register/>} />
    
    <Route path="/:page" element={<PrivateRouter element={PageRender} />} />
    <Route path="/:page/:id" element={<PrivateRouter element={PageRender} />} />
  </React.Fragment>} />
</Routes>

        {/* <Routes>
  <Route path="/" element={auth.token ? <Home/> : <Login/>} />
  <Route path="/register" element={<Register/>} />
  <Route
    path="/:page"
    element={
      <React.Fragment>
        {/* Pass PageRender as a child component to PrivateRouter */}
        {/* <PrivateRouter element={PageRender} />
      </React.Fragment>
    }
  />
  <Route
    path="/:page/:id"
    element={
      <React.Fragment>
        {/* Pass PageRender as a child component to PrivateRouter */}
        {/* <PrivateRouter element={PageRender} />
      </React.Fragment>
    }
  />
</Routes> */} 

          {/* <Routes>
          
          <Route  path="/" element={auth.token ? <Home/> : <Login/>} />
          <Route path="/register" element={<Register/>} />
            <Route
              path="/:page"
              element={
                <React.Fragment>
                  <PrivateRouter >
                  <PageRender />
                  </PrivateRouter>
                </React.Fragment>
              }
            />
            <Route
              path="/:page/:id"
              element={
                <React.Fragment>
                  <PrivateRouter >
                  <PageRender />
                  </PrivateRouter>
                </React.Fragment>
              }
             />
          </Routes> */}
        </div>
      </div>
    </Router>
    
  );
}

export default App;