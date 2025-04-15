import { useEffect, useState } from "react";
import { useLoginMutation } from "../redux/api/apiSlice";
import logo from "../assets/mmi_logo.png";
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { setCredentials } from "../redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Use the auth hook to check both token and user
  const { token, user } = useAuth();

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login({ email, password }).unwrap();
      if (!result.ok) {
        setError(result.message);
      } else {
        dispatch(setCredentials(result.token));
      }
    } catch (error) {
      setError(error.data?.message || "Login failed. Please try again.");
    }
  };

  // Check both token and user to ensure we're fully authenticated
  useEffect(() => {
    if (token && user) {
      navigate('tickets');
    }
  }, [token, user, navigate]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-card p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <img src={logo} alt="MMI" className="h-20 w-auto" />
        </Link>
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
            <div className="text-center p-6 pb-2">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Welcome back</h3>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  {error && (
                    <div className="p-3 text-sm text-white bg-danger rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="grid gap-6">
                    <Input
                      id="email"
                      type="email"
                      label="Email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                    />

                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                        <Link
                          to="forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
                        >
                          Forgot your password?
                        </Link>
                      </div>

                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={Lock}
                      />
                    </div>

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Logging in..."
                      content="Login"
                    />
                  </div>

                </div>
              </form>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            By clicking continue, you agree to our <br /><a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;