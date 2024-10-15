import { Link, useParams } from 'react-router-dom';

export default function Header1() {
  const { title: title_, category: category_ } = useParams();
  const category = {
    chat: [
      { title: 'chat' },
      { title: 'group' },
      { title: 'public' },
      // { title: 'me', },
    ],
    contact: [{ title: 'person' }, { title: 'public' }],
    search: [{ title: 'chat' }, { title: 'group' }, { title: 'public' }],
  }[title_];

  if (!category) return <header></header>;
  return (
    <header className="header1">
      {category.map(({ title: c_ }) => (
        <Link
          className={
            c_ == category_
              ? 'material-symbols-outlined active'
              : 'material-symbols-outlined'
          }
          title={c_}
          to={`/${title_}/${c_}`}
          key={c_}
        >
          {c_}
        </Link>
      ))}
    </header>
  );
}
