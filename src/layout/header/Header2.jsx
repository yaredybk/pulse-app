import { Link, useLocation, useParams } from 'react-router-dom';
import CardContact from '../../components/CardContact';
import ExitBtnMain from '../../components/ExitBtnMain';

export default function Header2({ index = false, user }) {
  const { title, category, uuid } = useParams();
  const { state } = useLocation();
  const user_ = user || state?.user || {};
  if (title == 'me' || category == 'me')
    return (
      <header className="header2">
        <ExitBtnMain />
        <p>Your information</p>
      </header>
    );
  if (index && !user_.uuid)
    return (
      <header className="header2 wide">
        <p>
          you need to{' '}
          <Link style={{ paddingBlock: '0' }} to="/me" className=" btn hero">
            login
          </Link>
        </p>
      </header>
    );
  if (index)
    return (
      <header className="header2 wide">
        <CardContact user={user_} />
      </header>
    );
  return (
    <header className="header2">
      <ExitBtnMain />
      {uuid && <CardContact user={{ ...user_, uuid }} />}
    </header>
  );
}
