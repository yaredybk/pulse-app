import { Link } from 'react-router-dom';
import './home.css';
export default function Home() {
  return (
    <div className="main home bg_logo full_h nofooter">
      <center>
        <h1>
          <img className='logo_inline' src="/a/favicon_bg.png" alt="logo" />
          Pulse
        </h1>
        <h2>Real-Time Conversations, Simplified </h2>
        <article>
          Pulse is your new go-to chat application, designed to seamlessly
          connect you with friends, family, and colleagues. With its sleek
          interface and intuitive features, Pulse makes staying in touch easier
          and more enjoyable than ever.
        </article>
        <div className="warning">This app is under development !</div>
        {process.env.NODE_ENV == 'development' && 
        <Link className='btn hero' to="/dev">DEV</Link>}
      </center>
    </div>
  );
}
