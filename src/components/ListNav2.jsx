import { useContext, useEffect, useState } from 'react';
import CardContact from './CardContact';
import { Sync, User } from '../context/context';

export default function ListNav2({ title, category, active }) {
  const synContext = useContext(Sync);
  const { uuid, isLoading } = useContext(User);
  const [navlist, setNavlist] = useState([]);
  async function getListNav(title_, category_) {
    if (['chat', 'contact', 'search'].find((a) => a == title_)) {
      fetch(`/api/list/${title_}/${category_}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else setNavlist([]);
        })
        .then((d) => {
          d && setNavlist(d.filter(({ uuid: u }) => u != uuid));
        })
        .catch(console.warn);
    }
  }
  useEffect(() => {
    if (!isLoading)
      title && category ? getListNav(title, category) : setNavlist([]);
    return () => {};
  }, [title, category, isLoading]);
  const getUpdates = ({
    data,
    touuid,
    fromuuid,
    type,
    category: categoryin,
  }) => {
    if (type != title || category != categoryin)
      return console.warn('nav missmatch', type, category);
    const uuid_ = fromuuid == uuid ? touuid : fromuuid;
    const ind = navlist.findIndex((n) => uuid_ == n.uuid);
    if (ind == -1) setNavlist((p) => [{ uuid: uuid_ }, ...p]);
    else {
      setNavlist((p) => [
        navlist[ind],
        ...p.slice(0, ind),
        ...p.slice(ind + 1),
      ]);
    }
  };
  useEffect(() => {
    synContext.messageNav.update && getUpdates(synContext.messageNav);
  }, [synContext.messageNav.update]);
  const nav1 = {
    chat: 'chats',
    person: 'private',
    contact: 'contacts',
    search: 'search',
    me: 'me',
  };
  const nav2 = {
    chat: 'private',
    person: 'private',
    group: 'group',
    public: 'public',
  };
  return (
    <>
      <div
        style={{
          backgroundColor: 'black',
          color: 'white',
          paddingBlock: '8px',
          textAlign: 'center',
        }}
      >
        {nav1[title]} - {nav2[category]}
      </div>
      {navlist
        // .filter(({ uuid: u }) => u != uuid)
        .map((user) => (
          <CardContact
            to={`/${title}/${category}/`}
            active={active}
            key={user.uuid}
            user={user}
          />
        ))}
    </>
  );
}
