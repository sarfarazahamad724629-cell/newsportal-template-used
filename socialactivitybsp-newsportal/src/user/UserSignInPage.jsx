import UserSignInForm from "./UserSignInForm";
import "./UserAuth.css";

export default function UserSignInPage() {
  return (
    <div className="user-auth-page">
      <div className="user-auth-card">
        <div className="user-auth-header">
          <h2>Member sign in</h2>
          <p>Access your reader account</p>
        </div>

        <UserSignInForm />
      </div>
    </div>
  );
}
