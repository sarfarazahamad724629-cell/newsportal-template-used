import UserSignUpForm from "./UserSignUpForm";
import "./UserAuth.css";

export default function UserSignUpPage() {
  return (
    <div className="user-auth-page">
      <div className="user-auth-card">
        <div className="user-auth-header">
          <h2>Create your account</h2>
          <p>Join as a reader</p>
        </div>

        <UserSignUpForm />
      </div>
    </div>
  );
}
