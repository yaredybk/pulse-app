import { useParams } from 'react-router-dom';
import CardContact from '../../components/CardContact';
import ExitBtnMain from '../../components/ExitBtnMain';

export default function Header2() {
  const { title, category, uuid } = useParams();
  return (
    <header className="header2">
      <ExitBtnMain />
      {uuid && <CardContact user={{ uuid }} />}
    </header>
  );
}
