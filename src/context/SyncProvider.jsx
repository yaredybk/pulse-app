import { useContext, useEffect, useRef, useState } from 'react';
import { Sync, User } from './context';

var __timeo__ = 0;
var __isConnecting__ = false;
var __document_hidden__ = false;
export default function SyncProvider(props) {
  const audioRef = useRef(new Audio('/api/audio/new-notification.mp3'));
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState();
  const [messageNav, setMessageNav] = useState('');
  const [messageMain, setMessageMain] = useState('');
  const { refresh } = useContext(User);
  function handleSocketMessage(e) {
    if (!e.data) return;
    // if (typeof e.data !== 'string') return console.warn('data not a string');
    let d = e.data;
    if (!(d.startsWith('{') || d.startsWith('['))) return console.warn(d);
    let { data, path } = JSON.parse(d);
    if (!(path && data)) return console.warn('no path or data');
    let pathes = path.replace(/^\//, '').split('/');
    let [root, type, category, touuid, fromuuid] = pathes;
    // console.log([root, type, category, touuid, fromuuid]);
    if (root == 'api') {
      if (type == 'chat' || type == 'room') {
        setMessageMain(() => {
          return {
            data,
            touuid,
            fromuuid,
            type,
            category,
            update: Date.now(),
          };
        });
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        return;
      }
    } else if (root == 'message') {
      return setMessageNav(() => {
        return {
          data,
          touuid,
          fromuuid,
          type,
          category,
          update: Date.now(),
        };
      });
    }
    // console.warn('unhandled sync');
    // console.log(root, type, category, touuid, fromuuid);
  }
  /**
   * start websocket with auto reconnect
   * **Note:** if timeoutrange is zero (0): auto reconnect is disabled
   * @param {number} [timeoutrange=5000] amout of delay to reconnect
   */
  function startSync(timeoutrange = 5000) {
    if (__isConnecting__) return console.warn('__isConnecting__');
    __isConnecting__ = true;
    refresh()
      .then(() => {
        let wsLink = '/ws';
        if (process.env.NODE_ENV == 'development')
          wsLink = 'ws://' + new URL(window.location).hostname + ':5000/ws';
        const socket = new WebSocket(wsLink);
        socket.addEventListener('message', (e) => handleSocketMessage(e));
        socket.addEventListener('open', () => {
          socket.send('hi there');
          timeoutrange && setIsConnected(() => true);
          __isConnecting__ = false;
        });
        function reconnect_() {
          timeoutrange && setIsConnected(() => false);
          __isConnecting__ = false;
        }
        socket.addEventListener('close', reconnect_);
        socket.addEventListener('error', reconnect_);
        ws.current = socket;
      })
      .catch((e) => {
        console.warn(e);
        __isConnecting__ = false;
        __timeo__ = setTimeout(() => {
          startSync(timeoutrange * 1.2);
        }, timeoutrange * 1.2);
      });
  }
  useEffect(() => {
    function onVisibilityChange() {
      // console.warn('onVisibilityChange', document.hidden);
      if (document.hidden) {
        __document_hidden__ = true;
        if (ws.current) {
          ws.current.close();
          setIsConnected(() => false);
        }
      } else {
        __document_hidden__ = false;
        if (!ws.current) startSync();
        else if (!isConnected) {
          ws.current.close();
          setTimeout(() => {
            startSync();
          }, 1000);
        }
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (isConnected && ws.current) {
        ws.current.close();
      }
      clearTimeout(__timeo__);
    };
  }, []);

  useEffect(() => {
    if (__document_hidden__) {
      // console.warn('__document_hidden__');
      return;
    }
    if (isConnected === undefined) {
      // not initialized
      // console.log('::undefined');
      startSync();
    } else if (!isConnected) {
      // not connected
      if (ws.current) {
        ws.current.close();
        // console.log('::restart');
        __timeo__ = setTimeout(() => {
          startSync();
        }, 5000);
      } else {
        // console.log('::start');
        __timeo__ = setTimeout(() => {
          startSync();
        }, 5000);
      }
    }
    // else console.log('::connected');
    return () => {
      // console.log('::effect return isConnected');
    };
  }, [isConnected]);

  return (
    <Sync.Provider
      value={{
        isConnected,
        messageNav,
        messageMain,
        setMessageMain,
        setMessageNav,
        send: ws.current?.send.bind(ws.current),
      }}
    >
      <div
        title={isConnected ? 'online' : 'offline'}
        className={isConnected ? 'isonline' : 'isoffline'}
      >
        <span></span>
      </div>
      {props.children}
    </Sync.Provider>
  );
}
