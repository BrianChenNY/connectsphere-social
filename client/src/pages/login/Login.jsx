import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null); // Clear previous error message
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputs.username || !inputs.password) {
      setErr("Please enter username and password");
      return;
    }
    
    setLoading(true);
    try {
      await login(inputs);
      console.log('I want to redirect');
      navigate("/", { replace: true });
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
      
    } catch (err) {
      setErr(err.response?.data || "Login failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Welcome Back</h1>
          <p>
            Welcome to our social platform, where you can share your life, make friends, and discover amazing content.
          </p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register Now</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              disabled={loading}
            />
            {err && <div className="error">{err}</div>}
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
