// === main.jsx ===
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// === App.jsx ===
import React, { useState } from "react";
import { Home } from "./pages/Home";
import { Tasks } from "./pages/Tasks";
import { Games } from "./pages/Games";
import { Profile } from "./pages/Profile";
import { BottomNav } from "./components/BottomNav";
import { useTelegram } from "./hooks/useTelegram";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const { tg } = useTelegram();

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home />;
      case "tasks":
        return <Tasks />;
      case "games":
        return <Games />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app bg-gray-900 text-white min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto p-4">{renderPage()}</main>
      <BottomNav active={activePage} onChange={setActivePage} />
    </div>
  );
}

// === hooks/useTelegram.js ===
import { useEffect } from "react";

export function useTelegram() {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) tg.ready();
  }, [tg]);

  return { tg };
}

// === components/BottomNav.jsx ===
import React from "react";
import { Home, Gamepad2, DollarSign, User } from "lucide-react";

export const BottomNav = ({ active, onChange }) => {
  const navItems = [
    { id: "home", icon: <Home size={22} />, label: "الرئيسية" },
    { id: "tasks", icon: <DollarSign size={22} />, label: "المهام" },
    { id: "games", icon: <Gamepad2 size={22} />, label: "الألعاب" },
    { id: "profile", icon: <User size={22} />, label: "حسابي" },
  ];

  return (
    <nav className="bg-gray-800 text-gray-300 border-t border-gray-700 flex justify-around py-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center text-sm transition-colors duration-200 ${
            active === item.id ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// === pages/Home.jsx ===
import React from "react";
export const Home = () => (
  <div>
    <h1 className="text-2xl font-bold mb-2">🏠 الصفحة الرئيسية</h1>
    <p>مرحباً بك في تطبيق الربح المصغر داخل تيليجرام!</p>
  </div>
);

// === pages/Tasks.jsx ===
import React from "react";
export const Tasks = () => (
  <div>
    <h1 className="text-2xl font-bold mb-2">💰 المهام</h1>
    <p>أنجز المهام لتحصل على النقاط والمكافآت.</p>
  </div>
);

// === pages/Games.jsx ===
import React from "react";
export const Games = () => (
  <div>
    <h1 className="text-2xl font-bold mb-2">🎮 الألعاب</h1>
    <p>العب ألعابًا صغيرة واربح المزيد من النقاط!</p>
  </div>
);

// === pages/Profile.jsx ===
import React from "react";
export const Profile = () => (
  <div>
    <h1 className="text-2xl font-bold mb-2">👤 حسابي</h1>
    <p>تفاصيل المستخدم والمكافآت ستظهر هنا.</p>
  </div>
);

// === index.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: "Cairo", sans-serif;
  background-color: #111827;
  color: #fff;
}

// === index.html (إضافة SDK Telegram) ===
// <script async src="https://telegram.org/js/telegram-web-app.js"></script>

// === vite.config.js ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });
          
