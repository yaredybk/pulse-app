import { Link } from 'react-router-dom';
import './header.css';
export default function Header() {
  return (
    <header>
      <a
        style={{
          textDecoration: 'none',
          fontSize: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
        href="/a/"
        className="header"
      >
        <img height="30" src="/a/favicon_bg.png" alt="" />
        Pulse
      </a>
      <nav>
        <Link to={'/profile'}>me</Link>
      </nav>
    </header>
  );
}
