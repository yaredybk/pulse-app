/**
 *
 * @param {{src,height}} props link to profile pic
 * @returns
 */
export default function ProfileSmall(props) {
  if (props.src)
    return (
      <img
        className="profile small"
        height={props.height || 28}
        width={props.height || 28}
        style={{borderRadius:10}}
        src={props.src}
        alt=""
      />
    );
}
