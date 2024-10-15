import { useState } from 'react';

export default function ExitBtnMain() {
  const [last, setlast] = useState();
  function onClick() {
    const { pathname } = window.location;
    if (last == pathname) return window.location.replace('/a');
    setlast(pathname);
    if (window.history.length <= 2) return window.location.replace('/a');
    window.history.back();
  }
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        padding: '0px',
        position: 'fixed',
        top: '3px',
        right: '3px',
        height: '2rem',
        width: '2rem',
        display: 'block',
        backgroundColor: 'red',
        border: 'none',
      }}
      className="material-symbols-outlined"
    >
      close
    </button>
  );
}
