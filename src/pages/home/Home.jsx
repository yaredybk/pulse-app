import { Link } from 'react-router-dom';
import './home.css';
import { useContext } from 'react';
import { User } from '../../context/context';
export default function Home() {
  const user = useContext(User);
  return (
    <>
      {user.uuid ? (
        <header className="header2 wide">
          <Link to={'/me'} className={`card contact `}>
            <img src={user.profile} alt="" />
            <span>{user.name || user.uuid}</span>
            <span
              className={user.active ? 'userisonline' : 'userisoffline'}
            ></span>
          </Link>
        </header>
      ) : (
        <header className="header2 wide">
          <p>
            you need to{' '}
            <Link style={{ paddingBlock: '0' }} to="/me" className=" btn hero">
              login
            </Link>
          </p>
        </header>
      )}
      <div className="main home bg_logo full_h nofooter">
        <h1>
          <img className="logo_inline" src="/a/favicon_bg.png" alt="logo" />
          Pulse
        </h1>
        <h2>Real-Time Conversations, Simplified </h2>
        <article>
          Pulse is your new go-to chat application, designed to seamlessly
          connect you with friends, family, and colleagues. With its sleek
          interface and intuitive features, Pulse makes staying in touch easier
          and more enjoyable than ever.
        </article>
        <center>
          {process.env.NODE_ENV == 'development' && (
            <Link className="btn hero" to="/dev">
              DEV
            </Link>
          )}
        </center>
        <div style={{ position: 'fixed', bottom: 0 }} className="warning">
          This app is under development !
        </div>
      </div>
    </>
  );
}
