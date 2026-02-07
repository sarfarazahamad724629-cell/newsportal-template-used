import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageUploader from "../admin/components/ImageUploader";
import {
  account,
  databases,
  ensureUniqueUsername,
  ensureUserDocument,
} from "./userAuthUtils";
import { DATABASE_ID } from "./appwriteClient";
import "./UserAuth.css";

const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

export default function UserProfilePage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [userDoc, setUserDoc] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const user = await account.get();
        const doc = await ensureUserDocument(user, { email: user.email });
        setUserDoc(doc);
        setName(doc.name || "");
        setUsername(doc.username || "");
        setAvatar(doc.avatar || "");
      } catch (err) {
        setError("Sign in to manage your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileError("");

    try {
      const currentUser = await account.get();
      await ensureUniqueUsername(username, currentUser.$id);
      const currentDoc = userDoc || (await ensureUserDocument(currentUser, {}));
      const updated = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        currentDoc.$id,
        {
          name: name.trim(),
          username: username.trim(),
          avatar,
        }
      );
      setUserDoc(updated);
    } catch (err) {
      setProfileError(err.message || "Profile update failed.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    setProfileError("");
    await account.deleteSession("current");
    setUserDoc(null);
    setName("");
    setUsername("");
    setAvatar("");
  };

  if (loading) {
    return (
      <div className="user-auth-page">
        <div className="user-auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-auth-page">
      <div className="user-auth-card">
        <div className="user-auth-header">
          <h2>Your profile</h2>
          <p>Update your public details</p>
        </div>
        <div className="user-auth-actions">
          <Link className="user-auth-home-link" to="/">
            Return To Home Page
          </Link>
          <button
            type="button"
            className="user-auth-logout"
            onClick={handleSignOut}
          >
            Log Out
          </button>
        </div>

        {error && <p className="user-auth-error">{error}</p>}
        {profileError && <p className="user-auth-error">{profileError}</p>}

        {!error && (
          <form className="user-profile-form" onSubmit={handleProfileSave}>
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
            <label>
              Avatar
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
                  Change avatar
                </button>
              </div>
            </label>
            <button type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save profile"}
            </button>
          </form>
        )}
      </div>

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
    </div>
  );
}
