import { Link } from 'react-router-dom';

export default function Nav1() {
  const navlist = [
    { title: 'home', to: '/' },
    { title: 'chat', to: '/chat/' },
    { title: 'contact', to: '/contact/' },
    { title: 'search', to: '/search/' },
    { title: 'me', to: '/me' },
  ];
  return (
    <nav className='nav1'>
      <ul>
        {navlist.map(({ title,to }, ind) => (
          <li key={ind + title}>
            <Link to={to}>{title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
