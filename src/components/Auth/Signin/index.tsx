import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      {/* <GoogleSigninButton text="Sign in" /> */}

      <div>
        <SigninWithPassword />
      </div>

      {/* <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div> */}
    </>
  );
}
