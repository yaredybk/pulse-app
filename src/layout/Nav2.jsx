import { Link, useParams } from 'react-router-dom';
import ListNav2 from '../components/ListNav2';
import { _customListNav2 } from '../preset';

export default function Nav2() {
  const { title, category, uuid } = useParams();
  const list1 = _customListNav2[title];
  if (!title) {
    return <header> . . . </header>;
  }
  return (
    <nav className="nav2">
      <header>
        <span>
          {title} - {category}
        </span>
      </header>
      {list1?.map(({ title: t2, icon }) => (
        <Link
          className="card contact"
          to={`/${title}/${category}/new`}
          key={t2}
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span>{t2}</span>
        </Link>
      ))}
      <ListNav2 />
    </nav>
  );
}
