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
      </section>
    </div>
  );
}
