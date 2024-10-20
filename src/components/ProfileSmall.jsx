import { Link } from 'react-router-dom';

/**
 *
 * @param {{src,height}} props link to profile pic
 * @returns
 */
export default function ProfileSmall(props) {
  if (props.src)
    return (
      <Link
        onClick={()=>props.onClick && props.onClick(props)}
        to={props.to}
        state={{ user: { uuid: props.uuid, profile: props.src } }}
      >
        <img
          className="profile small"
          height={props.height || 28}
          width={props.height || 28}
          style={{ borderRadius: 10 }}
          src={props.src}
          alt=""
        />
      </Link>
    );
}
