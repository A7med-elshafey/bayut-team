import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";

export default function WelcomeOverlay() {
  const { showWelcome, session } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showWelcome && session) {
      setVisible(true);
    } else {
      // تأخير بسيط عشان يعمل fade-out
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, session]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-500 ${
        showWelcome ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-md bg-gradient-to-br from-green-100 via-white to-blue-100 backdrop-blur-md border border-white/70 shadow-2xl rounded-3xl p-8 text-center transition-transform duration-500 transform animate-in fade-in zoom-in">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-200 flex items-center justify-center shadow-lg">
          <span className="text-3xl">✅💪</span>
        </div>
        <h3 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-wide">
          Welcome
        </h3>
        <p className="mt-1 text-lg font-semibold text-gray-800">
          {session?.fullName || session?.name}
        </p>
      </div>
    </div>
  );
}
