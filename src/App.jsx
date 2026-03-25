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
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setHomeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const moveTo = (path) => {
    setHomeMenuOpen(false);
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#8c6b2f] font-semibold">
            DONGGUK UNIVERSITY WISE CAMPUS
          </p>
          <h1 className="text-lg font-bold text-[#6f0f14]">갈등치유연구소</h1>
        </div>

        <nav className="flex items-center gap-8 text-sm font-bold text-slate-800">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setHomeMenuOpen((prev) => !prev)}
              className={`hover:text-[#6f0f14] ${
                isActive("/") ||
                isActive("/purpose") ||
                isActive("/research-content") ||
                isActive("/regulations")
                  ? "text-[#6f0f14]"
                  : ""
              }`}
            >
              홈
            </button>

            {homeMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => moveTo("/purpose")}
                  className="block w-full px-6 py-4 text-left text-slate-700 hover:bg-[#f9f4ec] hover:text-[#6f0f14]"
                >
                  설립목적
                </button>
                <button
                  type="button"
                  onClick={() => moveTo("/research-content")}
                  className="block w-full px-6 py-4 text-left text-slate-700 hover:bg-[#f9f4ec] hover:text-[#6f0f14]"
                >
                  연구내용
                </button>
                <button
                  type="button"
                  onClick={() => moveTo("/regulations")}
                  className="block w-full px-6 py-4 text-left text-slate-700 hover:bg-[#f9f4ec] hover:text-[#6f0f14]"
                >
                  연구소 규정
                </button>
              </div>
            )}
          </div>

          <Link
            to="/board"
            className={isActive("/board") ? "text-[#6f0f14]" : "hover:text-[#6f0f14]"}
          >
            게시판
          </Link>

          <Link
            to="/archive"
            className={isActive("/archive") ? "text-[#6f0f14]" : "hover:text-[#6f0f14]"}
          >
            자료실
          </Link>

          <Link
            to="/admin"
            className={isActive("/admin") ? "text-[#6f0f14]" : "hover:text-[#6f0f14]"}
          >
            관리자
          </Link>

          {session && (
            <button
              onClick={onLogout}
              className="border border-slate-300 px-3 py-2 text-xs hover:border-[#6f0f14]"
            >
              로그아웃
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function WarningBanner() {
  if (supabase) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 text-sm">
      Supabase 환경변수가 아직 연결되지 않았습니다.
    </div>
  );
}

function Home() {
  return (
    <section
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('/wise-hero.png')",
      }}
    >
      <div className="min-h-screen flex items-center justify-center text-center text-white px-6">
        <div>
          <p className="text-sm tracking-[0.25em] uppercase text-yellow-200 font-semibold">
            DONGGUK UNIVERSITY WISE CAMPUS
          </p>

          <h2 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
            동국대학교 WISE캠퍼스
            <br />
            갈등치유연구소
          </h2>

          <p className="mt-6 text-lg md:text-2xl">
            Conflict Healing Research Institute
          </p>
        </div>
      </div>
    </section>
  );
}

function PurposePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="bg-white border border-slate-200 p-10 shadow-sm">
        <p className="text-sm tracking-[0.22em] uppercase text-[#8c6b2f] font-semibold">
          Purpose of Establishment
        </p>
        <h2 className="mt-3 text-4xl font-bold text-[#6f0f14]">설립목적</h2>

        <p className="mt-8 text-base leading-8 text-slate-700">
          학제간 융합연구를 통하여 개인 및 사회갈등 치유에 공헌할 학술 연구와 교육을 통한
          인재양성을 목적으로 합니다. 개인주의 및 민주화, 삶의 질에 대한 욕구 증대로 개인 및
          사회갈등이 심화되는 현실 속에서, 불교를 건학이념으로 하는 동국대학교 WISE캠퍼스에
          갈등치유연구소를 두어 갈등치유 관련 연구와 교육에 이바지하고자 합니다.
        </p>

        <ul className="mt-8 list-disc pl-6 space-y-3 text-slate-700 leading-8">
          <li>사회갈등 치유의 이론과 기법을 연구하여 관련 종사자와 당사자들이 쉽게 활용하도록 돕습니다.</li>
          <li>교육과 훈련을 통하여 사회갈등을 효과적으로 치유할 전문인력 양성에 이바지합니다.</li>
          <li>갈등 현장에 직접 참여하여 문제 해결과 당사자 치유에 봉사합니다.</li>
          <li>사회갈등의 과학적 접근을 통해 갈등산업 육성의 기반 조성에 힘씁니다.</li>
        </ul>
      </div>
    </div>
  );
}

function ResearchContentPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="bg-white border border-slate-200 p-10 shadow-sm">
        <p className="text-sm tracking-[0.22em] uppercase text-[#8c6b2f] font-semibold">
          Research Content
        </p>
        <h2 className="mt-3 text-4xl font-bold text-[#6f0f14]">연구내용</h2>

        <p className="mt-8 text-base leading-8 text-slate-700">
          본 연구소는 갈등의 쟁점뿐 아니라 갈등당사자인 사람에 초점을 둔{" "}
          <span className="font-semibold">치유의 관점</span>에서 사회갈등에 접근합니다.
          특히 환경과 에너지 분야에서 발생하는 지역사회갈등의 해결에 초점을 맞추어 활동합니다.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "맞춤형 갈등치유 프로그램 개발",
            "갈등치유 관리인력 교육",
            "갈등중재 및 협상(공청회 개최 대행 등)",
            "지역사회갈등 해결을 위한 참여와 봉사",
            "「공공기관의 갈등예방과 해결에 관한 규정」이 규정하는 공공갈등의 분석",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-slate-200 bg-[#faf7f2] px-5 py-4 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegulationsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="bg-white border border-slate-200 p-10 shadow-sm">
        <p className="text-sm tracking-[0.22em] uppercase text-[#8c6b2f] font-semibold">
          Research Institute Regulations
        </p>
        <h2 className="mt-3 text-4xl font-bold text-[#6f0f14]">연구소 규정</h2>

        <p className="mt-8 text-base leading-8 text-slate-700">
          갈등치유연구소 관련 규정은 동국대학교 규정 시스템에서 확인할 수 있습니다.
        </p>

        <a
          href="https://rule.dongguk.edu/lmxsrv/main/main.srv"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 bg-[#6f0f14] px-6 py-3 text-white font-bold"
        >
          연구소 규정 보기
        </a>
      </div>
    </div>
  );
}

function Board({ session }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-[#6f0f14] mb-8">게시판</h2>
      <div className="bg-white border border-slate-200 p-8 shadow-sm text-slate-600">
        게시판 내용은 다음 단계에서 추가하시면 됩니다.
      </div>
    </div>
  );
}
function Admin({ session, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const login = async () => {
    if (!supabase) {
      alert("Supabase 환경변수가 연결되지 않았습니다.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("로그인 성공");
      onLoginSuccess?.();
    }
  };

  const changePassword = async () => {
    if (!supabase) {
      alert("Supabase 환경변수가 연결되지 않았습니다.");
      return;
    }

    if (!newPassword.trim()) {
      alert("새 비밀번호를 입력해 주세요.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("비밀번호가 변경되었습니다.");
      setNewPassword("");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-[#6f0f14] mb-8">관리자</h2>

      {!session ? (
        <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3 outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3 outline-none"
          />
          <button
            onClick={login}
            className="bg-[#6f0f14] px-5 py-3 text-white font-bold"
          >
            로그인
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm text-slate-500 mb-2">현재 로그인된 계정</p>
            <p className="font-semibold text-slate-800">{session.user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-slate-700">비밀번호 변경</p>
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-300 px-4 py-3 outline-none"
            />
            <button
              onClick={changePassword}
              className="mt-3 bg-[#6f0f14] px-5 py-3 text-white font-bold"
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function Admin({ session, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const login = async () => {
    if (!supabase) {
      alert("Supabase 환경변수가 연결되지 않았습니다.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      alert("로그인 성공");
      onLoginSuccess?.();
    }
  };

  const changePassword = async () => {
    if (!supabase) {
      alert("Supabase 환경변수가 연결되지 않았습니다.");
      return;
    }

    if (!newPassword.trim()) {
      alert("새 비밀번호를 입력해 주세요.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert(error.message);
    } else {
      alert("비밀번호가 변경되었습니다.");
      setNewPassword("");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-[#6f0f14] mb-8">관리자</h2>

      {!session ? (
        <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3 outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3 outline-none"
          />
          <button onClick={login} className="bg-[#6f0f14] px-5 py-3 text-white font-bold">
            로그인
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm text-slate-500 mb-2">현재 로그인된 계정</p>
            <p className="font-semibold text-slate-800">{session.user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-slate-700">비밀번호 변경</p>
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-300 px-4 py-3 outline-none"
            />
            <button
              onClick={changePassword}
              className="mt-3 bg-[#6f0f14] px-5 py-3 text-white font-bold"
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Archive({ session }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPapers = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("papers")
        .select("*")
        .order("is_notice", { ascending: false })
        .order("created_at", { ascending: false });

      setPapers(data || []);
      setLoading(false);
    };

    loadPapers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold text-center text-slate-900">자료실</h2>

      <div className="mt-8 overflow-hidden border-t border-slate-300 bg-white shadow-sm">
        <div className="grid grid-cols-[80px_1fr_90px_120px] border-b border-slate-300 bg-[#fafafa] px-4 py-4 text-sm font-medium text-slate-700">
          <span>번호</span>
          <span>제목</span>
          <span className="text-center">작성자</span>
          <span className="text-center">작성일</span>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-slate-500">불러오는 중...</div>
        ) : papers.length === 0 ? (
          <div className="px-4 py-10 text-slate-500">등록된 자료가 없습니다.</div>
        ) : (
          papers.map((paper, index) => (
            <div
              key={paper.id}
              className="grid grid-cols-[80px_1fr_90px_120px] items-center border-b border-slate-200 px-4 py-4 text-sm"
            >
              <span>{paper.is_notice ? "공지" : papers.length - index}</span>
              <span className="text-slate-800">{paper.title}</span>
              <span className="text-center text-slate-700">
                {paper.author_name || "관리자"}
              </span>
              <span className="text-center text-slate-700">
                {paper.created_at
                  ? new Date(paper.created_at).toLocaleDateString("ko-KR")
                  : "-"}
              </span>
            </div>
          ))
        )}
      </div>
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    alert("로그아웃되었습니다.");
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f8f6f1]">
        <Navbar session={session} onLogout={handleLogout} />
        <div className="pt-[88px]">
          <WarningBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purpose" element={<PurposePage />} />
            <Route path="/research-content" element={<ResearchContentPage />} />
            <Route path="/regulations" element={<RegulationsPage />} />
            <Route path="/board" element={<Board session={session} />} />
            <Route
              path="/admin"
              element={<Admin session={session} onLoginSuccess={() => {}} />}
            />
            <Route path="/archive" element={<Archive session={session} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}