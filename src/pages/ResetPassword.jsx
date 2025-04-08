import { useState } from "react";
import { useResetPasswordMutation } from "../redux/api/apiSlice";
import logo from "../assets/mmi_logo.png";
import { Lock, ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const result = await resetPassword({ token, password }).unwrap();
      if (!result.ok) {
        setError(result.message);
        setSuccess("");
      } else {
        setSuccess(result.message);
        setError("");
        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      setError(error.data?.message || "An error occurred");
      setSuccess("");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-card p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <img src={logo} alt="MMI" className="h-20 w-auto" />
        </Link>
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
            <div className="text-center p-6 pb-2">
              <Link 
                to="/" 
                className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary mb-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to login
              </Link>
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Reset Password</h3>
              <p className="text-sm text-muted-foreground">
                Enter your new password
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
                  {success && (
                    <div className="p-3 text-sm text-white bg-success rounded-md">
                      {success}
                    </div>
                  )}
                  <div className="grid gap-6">
                    <Input
                      id="password"
                      type="password"
                      label="New Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={Lock}
                    />

                    <Input
                      id="confirmPassword"
                      type="password"
                      label="Confirm New Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      icon={Lock}
                    />

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Resetting..."
                      content="Reset Password"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;