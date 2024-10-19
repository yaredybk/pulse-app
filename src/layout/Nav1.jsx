import { Link, useLocation } from 'react-router-dom';
import { _nav1 } from '../preset';

export default function Nav1() {
  const { pathname } = useLocation();
  return (
    <nav className="nav1 bg_logo">
      <ul>
        <li>
          <Link
            className={
              pathname == '/'
                ? 'material-symbols-outlined active'
                : 'material-symbols-outlined'
            }
            to={'/'}
          >
            home
          </Link>
        </li>
        {_nav1.map(({ title, to,icon }, ind) => (
          <li key={ind + title}>
            <Link
              className={
                pathname.startsWith('/'+title)
                  ? 'active material-symbols-outlined'
                  : 'material-symbols-outlined'
              }
              to={to}
              title={title}
            >
              {icon}
              <label>{title}</label>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
