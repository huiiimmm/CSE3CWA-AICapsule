import './LoginPage.css'

function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">AI Capsule</h1>
        <p className="login-subtitle">
          Save and manage your useful AI prompts in one place.
        </p>
        <button className="login-button" onClick={handleLogin}>
          Sign in with GitHub
        </button>
      </div>
    </div>
  )
}

export default LoginPage
