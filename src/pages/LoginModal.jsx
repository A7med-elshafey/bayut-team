import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function LoginModal({ open }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError("Wrong username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="px-6 pt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
          <p className="text-gray-500 text-sm mt-1">Please enter your details</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-green-600 text-white py-2.5 font-semibold hover:bg-green-700 transition disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          <div className="text-xs text-gray-400 text-center">
            wish you great day
          </div>
        </form>
      </div>
    </div>
  );
}
