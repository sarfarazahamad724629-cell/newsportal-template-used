import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  account,
  ensureUserDocument,
  resolveIdentifierToEmail,
} from "./userAuthUtils";

export default function UserSignInForm() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const email = await resolveIdentifierToEmail(identifier);
      await account.createEmailPasswordSession(
        email,
        password
      );
      const user = await account.get();
      await ensureUserDocument(user, { email });
      navigate("/user/profile");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="user-auth-error">{error}</p>}
      <form className="user-auth-form" onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
