import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const btnSend = useRef();
  const [messages, setmessages] = useState([]);
  /**
   * @typedef {[]}
   */
  const [sc, setSc] = useState();
  useEffect(() => {
    const socket = new WebSocket(
      process.env.NODE_ENV == 'development' ? 'ws://localhost:5000/ws' : '/ws'
    );
    socket.addEventListener('message', (ev) => {
      console.log(ev.data);
      setmessages((prev) => [...prev, ev.data]);
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
    setSc(socket);
    return () => {
      socket.close();
      setmessages(() => []);
    };
  }, []);
  function onSubmit(e) {
    e.preventDefault();
    console.log(e);
    const formData = new FormData(e.target);
    const f = Object.fromEntries(formData);
    console.log(f);
    sc.send(f.message);
  }
  return (
    <>
      <h1>
        <img height="40" src="/public/favicon_bg.png" alt="" />
        Pulse
      </h1>
      <p>A chat app.</p>
      <div className="room">
        {messages.map((ms, ind) => (
          <pre key={ind}>{ms}</pre>
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
    </>
  );
}

export default App;
