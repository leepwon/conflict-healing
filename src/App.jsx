import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { supabase } from "./lib/supabase";

function Navbar({ session, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const move = (path) => {
    setOpen(false);
    navigate(path);
    window.scrollTo({ top: 0 });
  };

  const active = (p) => location.pathname === p;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
        <div>
          <p className="text-xs text-[#8c6b2f]">DONGGUK UNIVERSITY</p>
          <h1 className="font-bold text-[#6f0f14]">갈등치유연구소</h1>
        </div>

        <nav className="flex gap-6 items-center text-sm font-bold">
          <div ref={ref} className="relative">
            <button onClick={() => setOpen((prev) => !prev)}>홈</button>

            {open && (
              <div className="absolute right-0 top-full mt-2 bg-white border shadow w-48">
                <button onClick={() => move("/purpose")} className="block w-full text-left px-4 py-3">
                  설립목적
                </button>
                <button onClick={() => move("/research")} className="block w-full text-left px-4 py-3">
                  연구내용
                </button>
                <button onClick={() => move("/rules")} className="block w-full text-left px-4 py-3">
                  연구소 규정
                </button>
              </div>
            )}
          </div>

          <Link to="/board" className={active("/board") ? "text-[#6f0f14]" : ""}>
            게시판
          </Link>
          <Link to="/archive" className={active("/archive") ? "text-[#6f0f14]" : ""}>
            자료실
          </Link>
          <Link to="/admin" className={active("/admin") ? "text-[#6f0f14]" : ""}>
            관리자
          </Link>

          {session && <button onClick={onLogout}>로그아웃</button>}
        </nav>
      </div>
    </header>
  );
}

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center text-4xl font-bold">
      갈등치유연구소
    </div>
  );
}

function Purpose() {
  return <div className="p-20">설립목적 페이지</div>;
}

function Research() {
  return <div className="p-20">연구내용 페이지</div>;
}

function Rules() {
  return <div className="p-20">연구소 규정 페이지</div>;
}

function Board() {
  return <div className="p-20">게시판 페이지</div>;
}

function Archive() {
  return <div className="p-20">자료실 페이지</div>;
}

function Admin({ session }) {
  return (
    <div className="p-20">
      관리자 페이지
      {session && <div className="mt-4">로그인됨: {session.user?.email}</div>}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    alert("로그아웃");
  };

  return (
    <Router>
      <Navbar session={session} onLogout={logout} />
      <div className="pt-[80px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/purpose" element={<Purpose />} />
          <Route path="/research" element={<Research />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/board" element={<Board />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/admin" element={<Admin session={session} />} />
        </Routes>
      </div>
    </Router>
  );
}