import { Link, useParams } from 'react-router-dom';

export default function Header1() {
  const { title } = useParams();
  const category = {
    chat: [
      { title: 'private', to: 'private' },
      { title: 'room', to: 'room' },
      { title: 'global', to: 'global' },
      { title: 'me', to: 'me' },
    ],
    contact: [
      { title: 'private', to: 'private' },
      { title: 'room', to: 'room' },
      { title: 'global', to: 'global' },
    ],
    search: [
      { title: 'private', to: 'private' },
      { title: 'room', to: 'room' },
      { title: 'global', to: 'global' },
    ],
  }[title];
  if (!category) return <b>. . .</b>;
  return (
    <header className="header1">
      {category.map(({ title, to }) => (
        <Link to={to} key={title}>
          {title}
        </Link>
      ))}
    </header>
  );
}
