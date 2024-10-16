import { Link, useLocation } from 'react-router-dom';

export default function Nav1() {
  const { pathname } = useLocation();
  const navlist = [
    // { title: 'home', to: '/' },
    { title: 'chat', to: '/chat/public/' },
    { title: 'contacts', to: '/contact/public/' },
    { title: 'search', to: '/search/public/' },
    { title: 'more_horiz', to: '/me' },
  ];
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
        {navlist.map(({ title, to }, ind) => (
          <li key={ind + title}>
            <Link
              className={
                pathname.startsWith('/' + title.replace(/s$/, ''))
                  ? 'active material-symbols-outlined'
                  : 'material-symbols-outlined'
              }
              to={to}
              title={title}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
