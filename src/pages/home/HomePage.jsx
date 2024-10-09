import { useEffect, useRef, useState } from 'react';
import Header from '../../layout/header/Header';
import Login from '../../auth/Login';

export default function HomePage() {
  const btnSend = useRef();
  /**
   * @type {[messages:Array<{ms:string, from:"me" | "server"}>, setmessages:Function]} state
   */
  const [messages, setmessages] = useState([]);
  const [socket, setSocket] = useState();
  useEffect(() => {
    const socket = new WebSocket(
      process.env.NODE_ENV == 'development' ? 'ws://localhost:5000/ws' : '/ws'
    );
    socket.addEventListener('message', (ev) => {
      console.log(ev.data);
      setmessages((prev) => [...prev, { ms: ev.data, from: 'server' }]);
    });
    socket.addEventListener('open', (ev) => {
      console.log(ev);
    });
    socket.addEventListener('close', (ev) => {
      console.log(ev);
    });
    socket.addEventListener('error', (ev) => {
      console.log(ev);
    });
    setSocket(socket);
    return () => {
      socket.close();
      setmessages(() => []);
    };
  }, []);
  function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const f = Object.fromEntries(formData);
    setmessages([...messages, { ms: f.message, from: 'me' }]);
    socket.send(f.message);
    e.target.reset();
  }
  function fetchProtected() {
    fetch('/api/protected')
      .then((r) => {
        console.log(r);
      })
      .catch(console.warn);
  }

  return (
    <div>
      <Header />
      <b>
        <i>Welcome to Pulse!</i>
      </b>
      <>
        <div className="room" style={{ maxWidth: '30rem' }}>
          {messages.map((ms, ind) => (
            <pre
              style={{
                backgroundColor: 'lightblue',
                padding: '3px',
                marginLeft: ms.from == 'me' ? '' : 'auto',
                width: 'fit-content',
                minWidth: '15rem',
              }}
              key={ind}
            >
              {ms.ms}
            </pre>
          ))}
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            maxLength={15}
            onKeyDown={(e) => {
              if (e.shiftKey && e.code.toLowerCase() == 'enter') {
                e.preventDefault();
                btnSend.current.click();
              }
            }}
            name="message"
            id="message"
            placeholder="type here"
          ></input>
          <button ref={btnSend} type="submit">
            send
          </button>
        </form>
        <button onClick={fetchProtected} type="button">
          check protected route
        </button>
      </>
    </div>
  );
}
