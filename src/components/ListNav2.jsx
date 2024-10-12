import { useEffect, useState } from 'react';

export default function ListNav2({ title, category }) {
  const [navlist, setNavlist] = useState([]);
  function getListNav(title_, category_) {
    fetch(`/api/list/nav/${title_}/${category_}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else setNavlist([]);
      })
      .then((d) => {
        d && setNavlist(d);
      })
      .catch(console.warn);
  }
  useEffect(() => {
    console.warn(title, category);
    title && category && getListNav(title, category);
    return () => {};
  }, [title, category]);

  return (
    <div>
      {title} - {category}
      <br />
      {navlist.map((t_, ind) => {
        <div key={ind}>{JSON.stringify(t_)}</div>;
      })}
    </div>
  );
}
