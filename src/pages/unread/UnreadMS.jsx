import './unread.css';
import { useContext, useEffect, useState } from 'react';
import { Sync } from '../../context/context';
import ProfileSmall from '../../components/ProfileSmall';

export default function UnreadMS() {
  const { unreadMess } = useContext(Sync);
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState({});
  useEffect(() => {
    if (unreadMess.data) {
      let {
        data: content,
        touuid,
        fromuuid,
        type,
        category,
        profile,
      } = unreadMess;
      let m = messages;
      if (m[fromuuid]) {
        m[fromuuid] = {
          content: content.slice(0, 10),
          touuid,
          fromuuid,
          type,
          category,
          profile,
          count: messages[fromuuid].count + 1,
        };
        setMessages(m);
      } else {
        setMessages({
          ...m,
          [fromuuid]: {
            content: content.slice(0, 10),
            touuid,
            fromuuid,
            type,
            category,
            profile,
            count: 1,
          },
        });
      }
      if (document.hidden) {
        navigator.setAppBadge(count + 1);
        setCount(count + 1);
      }
    }
  }, [unreadMess.update]);

  return (
    <div className="notify">
      {Object.keys(messages).map((k) => (
        <span className="ms" key={messages[k].fromuuid}>
          <ProfileSmall
            onClick={(m) => {
              delete messages[m.uuid];
              setMessages({ ...messages });
            }}
            uuid={k}
            src={messages[k].profile}
            to={`/${messages[k].type}/public/${messages[k].fromuuid}`}
          />
          <i>{messages[k].count}</i>
        </span>
      ))}
    </div>
  );
}
