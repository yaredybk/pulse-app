import { useContext, useEffect, useState } from 'react';
import CardContact from './CardContact';
import { Sync, User } from '../context/context';
import { _nav1 } from '../preset';
import CardRoom from './CardRoom';
import { createPortal } from 'react-dom';
import ExitBtnMain from './ExitBtnMain';
import { useNavigate, useParams } from 'react-router-dom';

export default function ListNav2() {
  const { title, category, uuid: uuid2, idroom } = useParams();
  const synContext = useContext(Sync);
  const { uuid, isLoading } = useContext(User);
  const [navlist, setNavlist] = useState([]);
  const [selected, setSelected] = useState();
  async function fetchListNav(title_, category_) {
    if (_nav1.some((a) => a.title == title_)) {
      fetch(`/api/list/${title_}/${category_}`)
        .then(async (res) => {
          if (res.ok) {
            let d = await res.json();
            if (d) {
              setNavlist(d);
              if (idroom) {
                setSelected(d.find((e) => e.idroom == idroom));
              } else if (uuid2) {
                setSelected(d.find((e) => e.uuid == uuid2));
              }
            } else setNavlist([]);
          }
        })
        .catch(console.warn);
    } else {
      setNavlist([]);
    }
  }
  function onUpdate({
    // data,
    touuid,
    fromuuid,
    type,
    category: categoryin,
  }) {
    if (type != title || category != categoryin)
      return console.warn('nav missmatch', type, category);
    if (title == 'room') {
      const idroom = touuid;
      const ind = navlist.findIndex((n) => idroom == n.uuid);
      if (ind == -1) setNavlist((p) => [{ idroom }, ...p]);
      else if (ind != 0) {
        setNavlist((p) => [
          navlist[ind],
          ...p.slice(0, ind),
          ...p.slice(ind + 1),
        ]);
      } else {
        const uuid_ = fromuuid == uuid ? touuid : fromuuid;
        const ind = navlist.findIndex((n) => uuid_ == n.uuid);
        if (ind == -1) setNavlist((p) => [{ uuid: uuid_ }, ...p]);
        else if (ind != 0) {
          setNavlist((p) => [
            navlist[ind],
            ...p.slice(0, ind),
            ...p.slice(ind + 1),
          ]);
        }
      }
    }
  }
  useEffect(() => {
    if (!(idroom || uuid2)) setSelected();
    if (!isLoading)
      title && category ? fetchListNav(title, category) : setNavlist([]);
    return () => {};
  }, [title, category, isLoading]);
  useEffect(() => {
    synContext.messageNav.update && onUpdate(synContext.messageNav);
  }, [synContext.messageNav.update]);
  const nav = useNavigate();
  function onClick() {
    nav(`/${title}/${category}/`);
    setSelected();
  }
  if (title == 'room')
    return (
      <>
        {uuid &&
          selected &&
          createPortal(
            <header className="header2">
              <ExitBtnMain onClick={onClick} />
              {<CardRoom to={`/${title}/info/_/`} room={selected} />}
            </header>,
            document.querySelector('header.header2')
          )}
        {navlist.map((room) => (
          <CardRoom
            onClick={(r) => {
              setSelected(r || room);
            }}
            title={title}
            to={`/${title}/${category}/_/`}
            active={room.idroom == idroom}
            key={room.uuid}
            room={room}
          />
        ))}
      </>
    );
  // if (title)
  return (
    <>
      {uuid &&
        selected &&
        createPortal(
          <header className="header2">
            <ExitBtnMain onClick={onClick} />
            {<CardContact user={selected} />}
          </header>,
          document.querySelector('header.header2')
        )}
      {navlist.map((user) => (
        <CardContact
          to={`/${title}/${category}/`}
          title={title}
          category={category}
          active={user.uuid == uuid2}
          key={user.uuid}
          user={user}
          onClick={setSelected}
        />
      ))}
    </>
  );
}
