// IS TRASH
// DO NOT USE THIS COMPONENT
import { Link, useLocation, useParams } from 'react-router-dom';
import CardContact from '../../components/CardContact';
import ExitBtnMain from '../../components/ExitBtnMain';
import CardRoom from '../../components/CardRoom';

export default function Header2({ index = false, user }) {
  const { title, category, uuid, idroom } = useParams();
  const { state } = useLocation();
  const user_ = !idroom ? user || state?.user || {} : {};
  if (title == 'me' || category == 'me')
    return (
      <header className="header2">
        <ExitBtnMain />
        <p>Your information</p>
      </header>
    );
  
  if (title == 'room')
    return (
      <header className="header2">
        <ExitBtnMain />
        {<CardRoom title="room" room={{ ...user_, uuid }} />}
      </header>
    );
  return (
    <header className="header2">
      <ExitBtnMain />
      {uuid && <CardContact user={{ ...user_, uuid }} />}
    </header>
  );
}
