import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (!inputs.username || !inputs.email || !inputs.password || !inputs.name) {
      setErr("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://connectsphere.uu.sy/api/auth/register", inputs);
      setSuccess(true);
      setErr(null);
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErr(err.response?.data || "Registration failed, please try again");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Social Platform</h1>
          <p>
            Join our social platform and start your social journey. Here, you can make new friends and share your life moments.
          </p>
          <span>Already have an account?</span>
          <Link to="/login">
            <button>Login Now</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleClick}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              disabled={loading || success}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              disabled={loading || success}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              disabled={loading || success}
            />
            <input
              type="text"
              placeholder="Display Name"
              name="name"
              onChange={handleChange}
              disabled={loading || success}
            />
            {err && <div className="error">{err}</div>}
            {success && (
              <div className="success">
                Registration successful! Redirecting to login page in 3 seconds...
              </div>
            )}
            <button type="submit" disabled={loading || success}>
              {loading ? "Registering..." : success ? "Registered" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
