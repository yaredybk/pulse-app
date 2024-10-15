import { useParams } from 'react-router-dom';
import ListNav2 from '../components/ListNav2';

export default function Nav2() {
  const { title, category, uuid } = useParams();
  if (!title) {
    return <header> . . . </header>;
  }
  return (
    <nav className="nav2">
      <ListNav2 title={title} active={uuid} category={category} />
    </nav>
  );
}
