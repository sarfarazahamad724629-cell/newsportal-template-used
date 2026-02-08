import { useState } from "react";
import { Link } from "react-router-dom";
import UserSignUpForm from "./UserSignUpForm";
import UserSignInForm from "./UserSignInForm";
import "./UserAuth.css";

export default function UserAuthLayout() {
  const [mode, setMode] = useState("signup");

  return (
    <div className="user-auth-page">
      <div className="user-auth-card user-auth-split">
        <div className="user-auth-form-pane">
          {mode === "signup" ? (
            <>
              <div className="user-auth-header">
                <h2>Create your account</h2>
                <p>Join as a reader</p>
              </div>
              <UserSignUpForm />
              <p className="user-auth-switch">
                Already Have An Account? –{" "}
                <button
                  type="button"
                  className="user-auth-switch-btn"
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="user-auth-header">
                <h2>Member sign in</h2>
                <p>Access your reader account</p>
              </div>
              <UserSignInForm />
              <p className="user-auth-switch">
                New here?{" "}
                <button
                  type="button"
                  className="user-auth-switch-btn"
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </p>
            </>
          )}
          <p className="user-auth-back">
            Or <Link to="/">Return To Home Page</Link>
          </p>
        </div>
        <div className="user-auth-panel">
          <img src="/logo-square.png" alt="Social Activity BSP" />
          <h2>Social Activity BSP</h2>
          <p>Voice of Society, Power of Truth.</p>
        </div>
      </div>
    </div>
  );
}
