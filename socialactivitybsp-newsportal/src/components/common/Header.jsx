import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { account, ensureUserDocument } from "../../user/userAuthUtils";
import "./Stylings/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await account.get();
        const doc = await ensureUserDocument(user, { email: user.email });
        setUserName(doc?.name || user.name || "User");
        setIsAuthed(true);
      } catch (err) {
        setUserName("");
        setIsAuthed(false);
      }
    };

    loadUser();
  }, []);

  const handleLoginClick = () => {
    if (isAuthed) {
      navigate("/user/profile");
      return;
    }
    navigate("/user/auth");
  };

  return (
    <header className="news-header">
      
      {/* Top Strip */}
      <div className="top-strip">
        <span>24×7 NEWS • SOCIAL ACTIVITY BSP</span>
      </div>

      {/* Logo Row */}
      <div className="logo-row">
        <NavLink to="/" className="logo-link">
        <img src="/Logo.png" alt="Social Activity BSP News" />
        </NavLink>
      </div>

      {/* Navigation Bar */}
      <nav className="news-nav">
        <NavLink to="/" className="news-link">Home</NavLink>
        <NavLink to="/category/politics" className="news-link">Politics</NavLink>
        <NavLink to="/category/sports" className="news-link">Sports</NavLink>
        <NavLink to="/category/tech" className="news-link">Tech</NavLink>
        <NavLink to="/category/entertainment" className="news-link">Entertainment</NavLink>
        <NavLink to="/category/other" className="news-link">Other</NavLink>
        <NavLink to="/admin" className="news-admin">Admin</NavLink>
        <button type="button" className="news-login" onClick={handleLoginClick}>
          {isAuthed ? `Signed In As ${userName}` : "Login"}
        </button>
      </nav>

    </header>
  );
};

export default Header;
