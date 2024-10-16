export default function UserDetailes(params) {
  return (
    <div className="detailes user">
      {params.picture && <img src={params.picture} alt="profile" />}
      <section>
        <br />
        <div className="name">{params.name}</div>
        <div>
          <div className="material-symbols-outlined">mail</div>
          {params.email}
        </div>
        <br />
        <a href="/api/logout" className="btn warn logout">
          logout
        </a>
        <br />
        <br />
        <br />
        <a
          href="/a/"
          style={{
            backgroundColor: 'greenyellow',
            borderRadius: '1rem',
            padding: '0.5rem 3rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '1.3rem',
          }}
          className=" hero"
        >
          <span className="material-symbols-outlined hero">home</span>
          <span>Go to Home</span>
        </a>
      </section>
    </div>
  );
}
