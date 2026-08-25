import LoginSide from "./LoginSide";
import LoginForm from "./LoginForm";
import LoginBG from "../../../assets/images/loginBG.png";

export default function Login() {
  return (
    <div
      className="h-screen overflow-hidden grid md:grid-cols-2 bg-cover"
      style={{ backgroundImage: `url(${LoginBG})` }}
    >
      {/* Left side (form) */}
      <div>
        <LoginForm />
      </div>

      {/* Right side */}
      <LoginSide />
    </div>
  );
}
