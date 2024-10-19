import { useNavigate } from 'react-router-dom';
import './new.css';
import { useState } from 'react';

export default function NewRoom() {
  const navigate = useNavigate();
  const [roomInfo, setRoomInfo] = useState({
    name: '',
    bio: '',
    profile: '',
  });

  async function onSubmit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (roomInfo.name) {
      const r = await fetch(`/api/info/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      if (!r.ok) return alert('error', r.statusText);
      const { room } = await r.json();

      if (!room) return alert('error');
      
      navigate(`/room/private/_/${room.idroom}`, {
        state: { room: { name: roomInfo.name, bio: roomInfo.bio, ...room } },
      });
      return;
    }
    setRoomInfo({ ...roomInfo, ...f });
    console.log(f);
  }
  return (
    <main className="new room">
      <h2>create new room</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">
          <input
            autoFocus
            required
            title="put at least 4 characters"
            pattern=".{4,}"
            type="text"
            name="name"
            id="name"
            placeholder="room name"
          />
        </label>
        <br />
        <br />
        {roomInfo.name && (
          <>
            <label htmlFor="bio">
              <textarea
                rows={3}
                cols={30}
                type="text"
                name="bio"
                id="bio"
                placeholder="room description"
                autoFocus
              />
            </label>
            <br />
            <br />
          </>
        )}
        <button role="button">cancel</button>
        <button>{roomInfo.name ? 'create' : 'next'}</button>
      </form>
    </main>
  );
}
