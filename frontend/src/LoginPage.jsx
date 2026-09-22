function LoginPage() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;
  };

  return (
    <div>
      <h1>AI Capsule</h1>
      <p>Save and manage your useful AI prompts in one place.</p>
      <button onClick={handleLogin}>Sign in with GitHub</button>
    </div>
  )
}

export default LoginPage
