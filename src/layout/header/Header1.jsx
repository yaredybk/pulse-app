import { Link, useParams } from 'react-router-dom';
import { _nav2 } from '../../preset';

export default function Header1() {
  const { title: title_, category: category_ } = useParams();
  return (
    <header className="header1">
      {_nav2.map(({ title: c_ ,icon}) => (
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
          {icon}
        </Link>
      ))}
    </header>
  );
}
