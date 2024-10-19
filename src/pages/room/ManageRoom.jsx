import './manageroom.css';
import '../../components/maincontact.css';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigation, useParams } from 'react-router-dom';
import ExitBtnMain from '../../components/ExitBtnMain';
import RenderInfoFields from '../../components/RenderInfoFields';
import { User } from '../../context/context';

export default function ManageRoom() {
  const { uuid: admin_uuid_ } = useContext(User);
  const [roomInfo, setroomInfo] = useState({});
  const { idroom, uuid } = useParams();
  const { state } = useLocation();
  const [formData, setFormData] = useState({ name: '', value: '' });
  useEffect(() => {
    // fetch
    fetchRoomInfo();
  }, [idroom, uuid]);
  const room = state?.room ? { ...state.room, ...roomInfo } : roomInfo;
  return (
    <>
      {/* <header className="header2">
        <h2>Manage room</h2>
        <ExitBtnMain onClick={() => window.history.back()} />
      </header> */}
      <main className="main info manage room">
        <RenderInfoFields
          canEdit={room?.admin_uuid == admin_uuid_}
          online={false}
          openModal={(e) => {
            console.warn('unhandled open\n', e);
          }}
          user={roomInfo}
        >
          <Link
            className="btn hero"
            state={{ room }}
            to={`/room/private/_/${room.idroom}`}
          >
            Chat in {room.name}
          </Link>
        </RenderInfoFields>
        {JSON.stringify(room)}
      </main>
    </>
  );
  async function fetchRoomInfo() {
    const url = `/api/info/room/${idroom}`;
    try {
      const r_ = await fetch(url);
      if (!r_ || !r_.ok) {
        alert('error\n' + r_.statusText);
        // if (r_.status == 401)
      }
      const r2_ = await r_.json();
      if (r2_) {
        setroomInfo(r2_.room);
      } else {
        console.warn('no ms', r2_);
      }
    } catch (error) {
      console.warn(error);
    }
  }
}
