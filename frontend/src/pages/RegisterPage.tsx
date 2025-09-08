import { useState } from "react";
import { Link, useNavigate } from "react-router";
import NavigationBar from "../components/NavigationBar";

export default function RegisterPage() {
  const router = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function sendLogin() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ fullName: name, email, password }),
      });

      console.log(res.status);
      switch (res.status) {
        case 400:
          setError("Email address already existed");
          break;
        case 201:
          router({ pathname: "/" });
          break;
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <>
      <NavigationBar active="/register" />
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <form
          className="p-8 rounded-2xl shadow-md w-96 space-y-4 bg-white border border-gray-300"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            sendLogin();
          }}
        >
          <h2 className="text-2xl font-bold text-center">Register</h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <Link to="/login" className="underline text-blue-600">
          Already have an account? Login!
        </Link>
      </div>
    </>
  );
}
