import { useParams } from 'react-router-dom';
import ListNav2 from '../components/ListNav2';

export default function Nav2() {
  const { title,category } = useParams();
  if (!title) {
    return <b>...</b>;
  }
  return (
    <nav className="nav2">
      <ListNav2 title={title} category={category} />
    </nav>
  );
}
