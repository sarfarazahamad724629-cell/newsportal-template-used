import { useState } from "react";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../admin/components/ImageUploader";
import {
  account,
  ensureUniqueUsername,
  ensureUserDocument,
} from "./userAuthUtils";

export default function UserSignUpForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await ensureUniqueUsername(username, "");
      const newUser = await account.create(
        ID.unique(),
        email.trim(),
        password,
        name.trim()
      );
      await account.createEmailPasswordSession(
        email.trim(),
        password
      );
      await ensureUserDocument(newUser, {
        name,
        username,
        avatar,
        email,
      });
      navigate("/user/profile");
    } catch (err) {
      setError(err.message || "Unable to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="user-auth-error">{error}</p>}
      <form className="user-auth-form" onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <div className="avatar-row">
          {avatar ? (
            <img src={avatar} alt="avatar" />
          ) : (
            <div className="avatar-placeholder">+</div>
          )}
          <button
            type="button"
            onClick={() => setShowUploader(true)}
          >
            Upload avatar
          </button>
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      {showUploader && (
        <ImageUploader
          onUpload={(uploaded) => {
            const file = uploaded[0];
            if (file) {
              setAvatar(file.src);
            }
            setShowUploader(false);
          }}
          onClose={() => setShowUploader(false)}
        />
      )}
    </>
  );
}
