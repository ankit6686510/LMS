import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

const Login = () => {
  const [formData, setFormData] = useState({
    signup: { name: "", email: "", password: "", confirmPassword: "" },
    login: { email: "", password: "" },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({ signup: {}, login: {} });

  const changeInputHandler = (e, formType) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [formType]: { ...prev[formType], [name]: value },
    }));
  };

  const validateSignup = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData.signup;
    if (!name) newErrors.name = "Name is required!";
    if (!email || !email.includes("@")) newErrors.email = "Invalid email!";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters!";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match!";
    setErrors((prev) => ({ ...prev, signup: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};
    const { email, password } = formData.login;
    if (!email || !email.includes("@")) newErrors.email = "Invalid email!";
    if (!password) newErrors.password = "Password is required!";
    setErrors((prev) => ({ ...prev, login: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setLoading(true);
    const { email, password } = formData.signup;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await axios.post("http://your-api-url/signup", {
        email,
        password: hashedPassword,
      });
      setSuccess("Signup successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    const { email, password } = formData.login;
    try {
      const response = await axios.post("http://your-api-url/login", {
        email,
        password,
      });
      setSuccess("Login successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  // Button enable/disable check based on form validity
  const isSignupFormValid =
    formData.signup.name &&
    formData.signup.email &&
    formData.signup.password &&
    formData.signup.confirmPassword &&
    !errors.signup.name &&
    !errors.signup.email &&
    !errors.signup.password &&
    !errors.signup.confirmPassword;
  const isLoginFormValid =
    formData.login.email &&
    formData.login.password &&
    !errors.login.email &&
    !errors.login.password;

  return (
    <div className="flex items-center justify-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Signup">Signup</TabsTrigger>
          <TabsTrigger value="Login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="Signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Make your account here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleSignupSubmit}>
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.signup.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter your name"
                    required
                  />
                  {errors.signup.name && (
                    <p className="text-red-500">{errors.signup.name}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.signup.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.signup.email && (
                    <p className="text-red-500">{errors.signup.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.signup.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter your password"
                    required
                  />
                  {errors.signup.password && (
                    <p className="text-red-500">{errors.signup.password}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={formData.signup.confirmPassword}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Confirm your password"
                    required
                  />
                  {errors.signup.confirmPassword && (
                    <p className="text-red-500">
                      {errors.signup.confirmPassword}
                    </p>
                  )}
                </div>
                {loading && <p>Loading...</p>}
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                onClick={handleSignupSubmit}
                disabled={!isSignupFormValid}
              >
                Signup
              </Button>
              {success && <p className="text-green-500">{success}</p>}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="Login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your email and password to log in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleLoginSubmit}>
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.login.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.login.email && (
                    <p className="text-red-500">{errors.login.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    name="password"
                    value={formData.login.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Enter your password"
                    required
                  />
                  {errors.login.password && (
                    <p className="text-red-500">{errors.login.password}</p>
                  )}
                </div>
                {loading && <p>Loading...</p>}
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                onClick={handleLoginSubmit}
                disabled={!isLoginFormValid}
              >
                Login
              </Button>
              {success && <p className="text-green-500">{success}</p>}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
