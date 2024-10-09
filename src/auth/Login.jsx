
export default function Login() {
  return (
    <div>
      <h3>Log in to get access.</h3>
      <form action="/login" method="get">
        <button  className="btn hero" type="submit">
          login
        </button>
      </form>
    </div>
  );
}
