export default function Logo() {
  return (
    <a
      style={{
        textDecoration: 'none',
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
      href="/a/"
      className="logo"
    >
      <img height="30" src="/a/favicon_bg.png" alt="" />
      Pulse
    </a>
  );
}
