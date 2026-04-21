import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/rides");
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "User registered successfully");
        setTimeout(() => navigate("/login"), 800);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row-reverse bg-background">
      {/* Right side: Image (Reverse layout for variety) */}
      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-lg bg-secondary/60 rounded-[2rem] p-10 text-center border border-border/50">
          <div className="flex justify-center">
            <img 
              src="/login.svg" 
              alt="Join RideShareX" 
              className="w-full max-w-sm drop-shadow-xl hover:scale-105 transition-transform duration-500" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop";
              }}
            />
          </div>
          <h2 className="mt-10 text-3xl font-bold text-foreground">Start your journey</h2>
          <p className="mt-4 text-lg text-muted-foreground">Join our community of riders and drivers. Safe, affordable, and fast.</p>
        </div>
      </div>

      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-8 lg:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h2>
            <p className="text-muted-foreground mt-2">Join RideShareX today</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm text-center border ${
              message.includes("successfully") 
                ? "bg-green-100 border-green-200 text-green-700" 
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <input
                className="w-full px-4 py-3.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                className="w-full px-4 py-3.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                className="w-full px-4 py-3.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">I am a...</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none text-base cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="USER">Passenger (Customer)</option>
                  <option value="DRIVER">Driver</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/50">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-primary text-primary-foreground text-lg font-semibold rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;