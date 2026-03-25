import { useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { supabase } from "./lib/supabase";

/* =========================
   공통 유틸
========================= */

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return dateValue;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function todayString() {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

function makeSafeFileName(name) {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot >= 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot >= 0 ? name.slice(lastDot).toLowerCase() : "";

  const safeBase = base
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  return `${safeBase || "file"}${ext}`;
}

function getFileExt(name = "") {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function isImageFile(name = "") {
  const ext = getFileExt(name);
  return ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
}

function isPdfFile(name = "") {
  return getFileExt(name) === "pdf";
}

/* =========================
   기본 데이터
========================= */

const defaultNoticePosts = [
  {
    id: 1,
    category: "공지",
    title: "갈등치유연구소 홈페이지 시범 운영 안내",
    content:
      "동국대학교 WISE캠퍼스 갈등치유연구소 홈페이지가 시범 운영 중입니다. 게시판, 자료실, 연구소 정보 메뉴를 순차적으로 정비하고 있습니다.",
    date: "2026.03.16",
    isNotice: true,
  },
  {
    id: 2,
    category: "학술행사",
    title: "갈등치유 국제학술대회 발표자 모집",
    content:
      "학술대회 발표를 희망하시는 연구자께서는 발표 초록과 간단한 이력을 제출해 주시기 바랍니다.",
    date: "2026.03.15",
    isNotice: false,
  },
];

const defaultHistory = [
  { id: "h1", ym: "2011-09", content: "갈등치유연구소 설립" },
  {
    id: "h2",
    ym: "2011-12",
    content:
      "갈등치유연구소 부설 사회갈등치유연구센터, 관계치유연구소, 마음 뇌 연구센터, 심신의학연구소, 철학치유연구소 설치",
  },
  { id: "h3", ym: "2012-01", content: "갈등치유연구소 부설 센터 운영 규정 제정" },
  { id: "h4", ym: "2012-06", content: "총서 개발 : 갈등치유론(한국학술정보)" },
  {
    id: "h5",
    ym: "2012-08",
    content:
      "갈등치유연구소 네이버 카페 개발 및 운영 / 방폐물 지역수용성 문제와 환경안전을 위한 연구용역",
  },
  {
    id: "h6",
    ym: "2012-10",
    content: "방폐장 유치에 따른 경주지역 경제유발 효과와 지역협력 증대방안 연구용역",
  },
  { id: "h7", ym: "2013-03", content: "경주시 힐링시티 조성을 위한 전문가 워크숍" },
];

const defaultConferences = [
  {
    id: "c1",
    title: "갈등치유연구소 콜로키움-인도종교에서의 갈등의 딜레마",
    period: "2024-12-19",
    place: "ZOOM 온라인",
    papers: "1편",
    presenters: "1명",
    cost: "0천원",
  },
  {
    id: "c2",
    title: "갈등치유연구소 콜로키움-헤겔철학에서 불행한 의식과 소외의 갈등",
    period: "2024-10-31",
    place: "ZOOM 온라인",
    papers: "1편",
    presenters: "1명",
    cost: "0천원",
  },
  {
    id: "c3",
    title: "갈등치유연구소-타이치학회 2024년도 하계 공동학술대회",
    period: "2024-08-31",
    place: "밝은빛 태극권 4층",
    papers: "3편",
    presenters: "4명",
    cost: "0천원",
  },
];

const defaultPerformances = [
  {
    id: "p1",
    type: "단독연구",
    title: "원전에 대한 주민 경험인식(heuristic cognition) 구성요소와 형성과정",
    manager: "오영석",
    researchers: "5명",
    period: "2016-11-01 ~ 2017-06-30",
    supportType: "기타",
    budget: "77,000천원",
    agency: "경희대학교산학협력단",
  },
  {
    id: "p2",
    type: "단독연구",
    title: "발전소 인근지역 주민 집단이주제도의 타당성 고찰 및 합리적 제도개선 방안 연구",
    manager: "오영석",
    researchers: "6명",
    period: "2015-08-01 ~ 2016-01-31",
    supportType: "중앙정부",
    budget: "67,500천원",
    agency: "산업통상자원부",
  },
  {
    id: "p3",
    type: "산학협동",
    title: "사용후핵연료 관리방안에 대한 원전지역 의견수렴 지원용역",
    manager: "오영석",
    researchers: "8명",
    period: "2014-12-17 ~ 2015-06-16",
    supportType: "기타",
    budget: "533,635천원",
    agency: "한국원자력환경공단",
  },
];

/* =========================
   공통 UI
========================= */

function SectionShell({ eyebrow, title, children }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="bg-white border border-slate-200 p-10 shadow-sm">
        {eyebrow && (
          <p className="text-sm tracking-[0.22em] uppercase text-[#8c6b2f] font-semibold">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-4xl font-bold text-[#6f0f14]">{title}</h2>
        <div className="mt-8 text-slate-700">{children}</div>
      </div>
    </div>
  );
}

function FormActions({ onSave, onCancel, saveLabel = "저장" }) {
  return (
    <div className="mt-5 flex gap-3">
      <button
        onClick={onSave}
        className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
      >
        {saveLabel}
      </button>
      <button
        onClick={onCancel}
        className="border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700"
      >
        취소
      </button>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="bg-white border border-slate-200 p-12 text-center text-slate-500">
      <p className="text-lg font-semibold text-slate-700">{title}</p>
      <p className="mt-2">{desc}</p>
    </div>
  );
}

/* =========================
   Navbar
========================= */

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const moveTo = (path) => {
    setHomeMenuOpen(false);
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 30);
  };

  const isActive = (path) => location.pathname === path;
  const homeFamilyActive =
    isActive("/") ||
    isActive("/purpose") ||
    isActive("/research-content") ||
    isActive("/regulations");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.12em] text-[#8c6b2f]">DONGGUK UNIVERSITY WISE CAMPUS</p>
          <h1 className="text-[18px] leading-none font-bold text-[#7a1318] mt-2">
            갈등치유연구소
          </h1>
        </div>

        <nav className="flex items-center gap-8 text-[16px] font-bold text-slate-900">
          <div className="relative flex items-center gap-1" ref={menuRef}>
            <button
              type="button"
              onClick={() => moveTo("/")}
              className={homeFamilyActive ? "text-[#7a1318]" : "hover:text-[#7a1318]"}
            >
              홈
            </button>

            <button
              type="button"
              onClick={() => setHomeMenuOpen((prev) => !prev)}
              className="px-1 hover:text-[#7a1318]"
              aria-label="홈 하위메뉴 열기"
            >
              ▼
            </button>

            {homeMenuOpen && (
              <div className="absolute right-0 top-full mt-4 w-56 overflow-hidden border border-slate-300 bg-white shadow-md">
                <button
                  type="button"
                  onClick={() => moveTo("/purpose")}
                  className="block w-full px-6 py-4 text-left font-bold text-slate-800 hover:bg-slate-50"
                >
                  설립목적
                </button>
                <button
                  type="button"
                  onClick={() => moveTo("/research-content")}
                  className="block w-full px-6 py-4 text-left font-bold text-slate-800 hover:bg-slate-50"
                >
                  연구내용
                </button>
                <button
                  type="button"
                  onClick={() => moveTo("/regulations")}
                  className="block w-full px-6 py-4 text-left font-bold text-slate-800 hover:bg-slate-50"
                >
                  연구소 규정
                </button>
              </div>
            )}
          </div>

          <Link
            to="/board"
            className={isActive("/board") ? "text-[#7a1318]" : "hover:text-[#7a1318]"}
          >
            게시판
          </Link>

          <Link
            to="/archive"
            className={
              location.pathname.startsWith("/archive")
                ? "text-[#7a1318]"
                : "hover:text-[#7a1318]"
            }
          >
            자료실
          </Link>

          <Link
            to="/admin"
            className={isActive("/admin") ? "text-[#7a1318]" : "hover:text-[#7a1318]"}
          >
            관리자
          </Link>

          {session && (
            <button onClick={onLogout} className="hover:text-[#7a1318]">
              로그아웃
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

/* =========================
   경고 배너
========================= */

function WarningBanner() {
  if (supabase) return null;

  return (
    <div className="max-w-5xl mx-auto mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 text-sm">
      Supabase 환경변수가 아직 연결되지 않았습니다. 로그인 및 자료실 기능 일부가 제한될 수 있습니다.
    </div>
  );
}

/* =========================
   Home
========================= */

function HomeCard({ title, desc, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur px-6 py-6 text-left text-white shadow-lg hover:bg-white/15 transition"
    >
      <div className="text-xl font-bold">{title}</div>
      <div className="mt-2 text-sm text-white/85 leading-6">{desc}</div>
    </Link>
  );
}

function Home() {
  return (
    <div>
      <section
        className="relative min-h-[78vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,20,35,0.38), rgba(10,20,35,0.42)), url('/wise-hero.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 min-h-[78vh] flex items-center">
          <div className="max-w-4xl text-white">
            <p className="text-sm tracking-[0.32em] uppercase text-yellow-200 font-semibold">
              DONGGUK UNIVERSITY WISE CAMPUS
            </p>

            <h2 className="mt-6 text-5xl md:text-7xl font-bold leading-tight drop-shadow">
              동국대학교 WISE캠퍼스
              <br />
              갈등치유연구소
            </h2>

            <p className="mt-6 text-lg md:text-2xl text-white/95">
              Conflict Healing Research Institute
            </p>

            <p className="mt-8 max-w-3xl text-base md:text-lg leading-8 text-white/92">
              갈등의 분석을 넘어 치유의 관점에서 사회적 문제를 탐구하고,
              연구·교육·실천을 통하여 지역사회와 공공영역의 지속가능한 협력 기반을 조성합니다.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <HomeCard
                title="설립목적"
                desc="연구소의 비전과 설립 취지를 확인합니다."
                to="/purpose"
              />
              <HomeCard
                title="연구내용"
                desc="주요 연구 분야와 실천 과제를 살펴봅니다."
                to="/research-content"
              />
              <HomeCard
                title="자료실"
                desc="연구자료, 공지자료, 업로드 문서를 확인합니다."
                to="/archive"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-sm font-semibold tracking-[0.18em] text-[#8c6b2f] uppercase">
              Research
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[#6f0f14]">연구</h3>
            <p className="mt-4 text-slate-600 leading-7">
              사회갈등의 구조와 현상을 분석하고 치유 중심의 이론과 실천 모델을 개발합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-sm font-semibold tracking-[0.18em] text-[#8c6b2f] uppercase">
              Education
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[#6f0f14]">교육</h3>
            <p className="mt-4 text-slate-600 leading-7">
              갈등관리 및 협력 촉진에 필요한 전문인력 양성을 위한 교육과 훈련을 제공합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-sm font-semibold tracking-[0.18em] text-[#8c6b2f] uppercase">
              Practice
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[#6f0f14]">실천</h3>
            <p className="mt-4 text-slate-600 leading-7">
              지역사회와 공공기관의 실제 갈등 현장에 참여하여 대화와 협력의 기반을 지원합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   소개 페이지
========================= */

function PurposePage() {
  return (
    <SectionShell eyebrow="Purpose of Establishment" title="설립목적">
      <p className="text-base leading-8">
        학제간 융합연구를 통하여 개인 및 사회갈등 치유에 공헌할 학술 연구와 교육을 통한
        인재양성을 목적으로 합니다. 개인주의 및 민주화, 삶의 질에 대한 욕구 증대로 개인 및
        사회갈등이 심화되는 현실 속에서, 불교를 건학이념으로 하는 동국대학교 WISE캠퍼스에
        갈등치유연구소를 두어 갈등치유 관련 연구와 교육에 이바지하고자 합니다.
      </p>

      <ul className="mt-8 list-disc pl-6 space-y-3 leading-8">
        <li>사회갈등 치유의 이론과 기법을 연구하여 관련 종사자와 당사자들이 쉽게 활용하도록 돕습니다.</li>
        <li>교육과 훈련을 통하여 사회갈등을 효과적으로 치유할 전문인력 양성에 이바지합니다.</li>
        <li>갈등 현장에 직접 참여하여 문제 해결과 당사자 치유에 봉사합니다.</li>
        <li>사회갈등의 과학적 접근을 통해 갈등산업 육성의 기반 조성에 힘씁니다.</li>
      </ul>
    </SectionShell>
  );
}

function ResearchContentPage() {
  return (
    <SectionShell eyebrow="Research Content" title="연구내용">
      <p className="text-base leading-8">
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
    </SectionShell>
  );
}

function RegulationsPage() {
  return (
    <SectionShell eyebrow="Research Institute Regulations" title="연구소 규정">
      <p className="text-base leading-8">
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
    </SectionShell>
  );
}

/* =========================
   Board
========================= */

function Board({ session }) {
  const NOTICE_KEY = "dongguk-board-posts-v5";
  const HISTORY_KEY = "dongguk-history-v5";
  const CONF_KEY = "dongguk-conference-v5";
  const PERF_KEY = "dongguk-performance-v5";

  const [activeTab, setActiveTab] = useState("notice");
  const [mode, setMode] = useState("list"); // list | create | edit

  const [noticePosts, setNoticePosts] = useState(() => {
    const saved = localStorage.getItem(NOTICE_KEY);
    return saved ? JSON.parse(saved) : defaultNoticePosts;
  });

  const [historyItems, setHistoryItems] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : defaultHistory;
  });

  const [conferenceItems, setConferenceItems] = useState(() => {
    const saved = localStorage.getItem(CONF_KEY);
    return saved ? JSON.parse(saved) : defaultConferences;
  });

  const [performanceItems, setPerformanceItems] = useState(() => {
    const saved = localStorage.getItem(PERF_KEY);
    return saved ? JSON.parse(saved) : defaultPerformances;
  });

  const [selectedPost, setSelectedPost] = useState(null);

  const [noticeForm, setNoticeForm] = useState({
    id: null,
    category: "일반",
    title: "",
    content: "",
    isNotice: false,
  });

  const [historyForm, setHistoryForm] = useState({
    id: null,
    ym: "",
    content: "",
  });

  const [conferenceForm, setConferenceForm] = useState({
    id: null,
    title: "",
    period: "",
    place: "",
    papers: "",
    presenters: "",
    cost: "",
  });

  const [performanceForm, setPerformanceForm] = useState({
    id: null,
    type: "",
    title: "",
    manager: "",
    researchers: "",
    period: "",
    supportType: "",
    budget: "",
    agency: "",
  });

  useEffect(() => {
    localStorage.setItem(NOTICE_KEY, JSON.stringify(noticePosts));
  }, [noticePosts]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyItems));
  }, [historyItems]);

  useEffect(() => {
    localStorage.setItem(CONF_KEY, JSON.stringify(conferenceItems));
  }, [conferenceItems]);

  useEffect(() => {
    localStorage.setItem(PERF_KEY, JSON.stringify(performanceItems));
  }, [performanceItems]);

  const sortedNoticePosts = useMemo(() => {
    return [...noticePosts].sort((a, b) => {
      if ((a.isNotice ? 1 : 0) !== (b.isNotice ? 1 : 0)) {
        return (b.isNotice ? 1 : 0) - (a.isNotice ? 1 : 0);
      }
      return b.id - a.id;
    });
  }, [noticePosts]);

  const resetForms = () => {
    setNoticeForm({
      id: null,
      category: "일반",
      title: "",
      content: "",
      isNotice: false,
    });
    setHistoryForm({
      id: null,
      ym: "",
      content: "",
    });
    setConferenceForm({
      id: null,
      title: "",
      period: "",
      place: "",
      papers: "",
      presenters: "",
      cost: "",
    });
    setPerformanceForm({
      id: null,
      type: "",
      title: "",
      manager: "",
      researchers: "",
      period: "",
      supportType: "",
      budget: "",
      agency: "",
    });
  };

  const openCreate = () => {
    if (!session) return;
    resetForms();
    setMode("create");
  };

  const openEditNotice = (item) => {
    if (!session) return;
    setNoticeForm({
      id: item.id,
      category: item.category,
      title: item.title,
      content: item.content,
      isNotice: item.isNotice,
    });
    setMode("edit");
  };

  const openEditHistory = (item) => {
    if (!session) return;
    setHistoryForm({
      id: item.id,
      ym: item.ym,
      content: item.content,
    });
    setMode("edit");
  };

  const openEditConference = (item) => {
    if (!session) return;
    setConferenceForm({ ...item });
    setMode("edit");
  };

  const openEditPerformance = (item) => {
    if (!session) return;
    setPerformanceForm({ ...item });
    setMode("edit");
  };

  const cancelEdit = () => {
    resetForms();
    setMode("list");
  };

  const saveNotice = () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    if (mode === "edit" && noticeForm.id) {
      setNoticePosts((prev) =>
        prev.map((item) =>
          item.id === noticeForm.id
            ? {
                ...item,
                category: noticeForm.category,
                title: noticeForm.title.trim(),
                content: noticeForm.content.trim(),
                isNotice: noticeForm.isNotice,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        category: noticeForm.category,
        title: noticeForm.title.trim(),
        content: noticeForm.content.trim(),
        date: todayString(),
        isNotice: noticeForm.isNotice,
      };
      setNoticePosts((prev) => [...prev, newItem]);
      setSelectedPost(newItem);
    }

    cancelEdit();
  };

  const deleteNotice = (id) => {
    if (!session) return;
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    const next = noticePosts.filter((item) => item.id !== id);
    setNoticePosts(next);
    if (selectedPost?.id === id) {
      setSelectedPost(next.length > 0 ? next[0] : null);
    }
  };

  const saveHistory = () => {
    if (!historyForm.ym.trim() || !historyForm.content.trim()) {
      alert("연월과 내용을 입력해 주세요.");
      return;
    }

    if (mode === "edit" && historyForm.id) {
      setHistoryItems((prev) =>
        prev.map((item) =>
          item.id === historyForm.id
            ? { ...item, ym: historyForm.ym.trim(), content: historyForm.content.trim() }
            : item
        )
      );
    } else {
      const newItem = {
        id: `hx-${Date.now()}`,
        ym: historyForm.ym.trim(),
        content: historyForm.content.trim(),
      };
      setHistoryItems((prev) => [newItem, ...prev]);
    }

    cancelEdit();
  };

  const deleteHistory = (id) => {
    if (!session) return;
    if (!confirm("이 데이터를 삭제하시겠습니까?")) return;
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveConference = () => {
    if (!conferenceForm.title.trim() || !conferenceForm.period.trim()) {
      alert("학술대회명과 개최일을 입력해 주세요.");
      return;
    }

    if (mode === "edit" && conferenceForm.id) {
      setConferenceItems((prev) =>
        prev.map((item) => (item.id === conferenceForm.id ? { ...conferenceForm } : item))
      );
    } else {
      setConferenceItems((prev) => [{ ...conferenceForm, id: `cx-${Date.now()}` }, ...prev]);
    }

    cancelEdit();
  };

  const deleteConference = (id) => {
    if (!session) return;
    if (!confirm("이 데이터를 삭제하시겠습니까?")) return;
    setConferenceItems((prev) => prev.filter((item) => item.id !== id));
  };

  const savePerformance = () => {
    if (!performanceForm.title.trim() || !performanceForm.period.trim()) {
      alert("연구과제명과 연구기간을 입력해 주세요.");
      return;
    }

    if (mode === "edit" && performanceForm.id) {
      setPerformanceItems((prev) =>
        prev.map((item) => (item.id === performanceForm.id ? { ...performanceForm } : item))
      );
    } else {
      setPerformanceItems((prev) => [{ ...performanceForm, id: `px-${Date.now()}` }, ...prev]);
    }

    cancelEdit();
  };

  const deletePerformance = (id) => {
    if (!session) return;
    if (!confirm("이 데이터를 삭제하시겠습니까?")) return;
    setPerformanceItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm tracking-[0.18em] uppercase text-[#8c6b2f] font-semibold">
            Board
          </p>
          <h2 className="mt-2 text-4xl font-bold text-[#6f0f14]">게시판</h2>
        </div>

        {session && mode === "list" && (
          <button
            onClick={openCreate}
            className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
          >
            데이터 추가
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {[
          ["notice", "공지사항"],
          ["history", "연구소 연혁"],
          ["conference", "학술대회 개최 현황"],
          ["performance", "연구소 수행 현황"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveTab(key);
              setMode("list");
            }}
            className={`px-5 py-3 text-sm font-bold border ${
              activeTab === key
                ? "bg-[#6f0f14] text-white border-[#6f0f14]"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {session && mode !== "list" && activeTab === "notice" && (
        <div className="mt-8 bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">
            {mode === "edit" ? "공지사항 수정" : "공지사항 등록"}
          </p>

          <div className="grid gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={noticeForm.isNotice}
                onChange={(e) =>
                  setNoticeForm((prev) => ({ ...prev, isNotice: e.target.checked }))
                }
              />
              공지로 상단 고정
            </label>

            <select
              value={noticeForm.category}
              onChange={(e) =>
                setNoticeForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="일반">일반</option>
              <option value="공지">공지</option>
              <option value="학술행사">학술행사</option>
              <option value="연구성과">연구성과</option>
              <option value="세미나">세미나</option>
            </select>

            <input
              value={noticeForm.title}
              onChange={(e) =>
                setNoticeForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="제목"
            />

            <textarea
              value={noticeForm.content}
              onChange={(e) =>
                setNoticeForm((prev) => ({ ...prev, content: e.target.value }))
              }
              className="min-h-[180px] border border-slate-300 px-4 py-3 outline-none"
              placeholder="내용"
            />

            <FormActions onSave={saveNotice} onCancel={cancelEdit} />
          </div>
        </div>
      )}

      {session && mode !== "list" && activeTab === "history" && (
        <div className="mt-8 bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">
            {mode === "edit" ? "연혁 수정" : "연혁 추가"}
          </p>
          <div className="grid gap-4">
            <input
              value={historyForm.ym}
              onChange={(e) => setHistoryForm((prev) => ({ ...prev, ym: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="연월 (예: 2026-03)"
            />
            <textarea
              value={historyForm.content}
              onChange={(e) =>
                setHistoryForm((prev) => ({ ...prev, content: e.target.value }))
              }
              className="min-h-[150px] border border-slate-300 px-4 py-3 outline-none"
              placeholder="연혁 내용"
            />
            <FormActions onSave={saveHistory} onCancel={cancelEdit} />
          </div>
        </div>
      )}

      {session && mode !== "list" && activeTab === "conference" && (
        <div className="mt-8 bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">
            {mode === "edit" ? "학술대회 현황 수정" : "학술대회 현황 추가"}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={conferenceForm.title}
              onChange={(e) =>
                setConferenceForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none md:col-span-2"
              placeholder="학술대회명"
            />
            <input
              value={conferenceForm.period}
              onChange={(e) =>
                setConferenceForm((prev) => ({ ...prev, period: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="개최일 또는 기간"
            />
            <input
              value={conferenceForm.place}
              onChange={(e) =>
                setConferenceForm((prev) => ({ ...prev, place: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="장소"
            />
            <input
              value={conferenceForm.papers}
              onChange={(e) =>
                setConferenceForm((prev) => ({ ...prev, papers: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="논문 수"
            />
            <input
              value={conferenceForm.presenters}
              onChange={(e) =>
                setConferenceForm((prev) => ({ ...prev, presenters: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="발표자 수"
            />
            <input
              value={conferenceForm.cost}
              onChange={(e) =>
                setConferenceForm((prev) => ({ ...prev, cost: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none md:col-span-2"
              placeholder="개최 비용"
            />
          </div>

          <FormActions onSave={saveConference} onCancel={cancelEdit} />
        </div>
      )}

      {session && mode !== "list" && activeTab === "performance" && (
        <div className="mt-8 bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">
            {mode === "edit" ? "연구소 수행 현황 수정" : "연구소 수행 현황 추가"}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={performanceForm.type}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="구분"
            />
            <input
              value={performanceForm.manager}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, manager: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="책임자"
            />
            <input
              value={performanceForm.title}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none md:col-span-2"
              placeholder="연구과제명"
            />
            <input
              value={performanceForm.researchers}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, researchers: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="연구원 수"
            />
            <input
              value={performanceForm.period}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, period: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="연구기간"
            />
            <input
              value={performanceForm.supportType}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, supportType: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="지원구분"
            />
            <input
              value={performanceForm.budget}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, budget: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="연구비"
            />
            <input
              value={performanceForm.agency}
              onChange={(e) =>
                setPerformanceForm((prev) => ({ ...prev, agency: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none md:col-span-2"
              placeholder="지원기관"
            />
          </div>

          <FormActions onSave={savePerformance} onCancel={cancelEdit} />
        </div>
      )}

      <div className="mt-8">
        {activeTab === "notice" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
            <div className="overflow-hidden bg-white border border-slate-200 shadow-sm">
              <div className="grid grid-cols-[110px_1fr_110px_130px] border-b border-slate-200 bg-[#f9f4ec] px-6 py-4 text-sm font-medium text-slate-500">
                <span>분류</span>
                <span>제목</span>
                <span>날짜</span>
                <span>관리</span>
              </div>

              {sortedNoticePosts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[110px_1fr_110px_130px] items-center border-b border-slate-100 px-6 py-5 text-sm last:border-b-0"
                >
                  <span className="text-slate-500">{item.isNotice ? "공지" : item.category}</span>

                  <button
                    type="button"
                    onClick={() => setSelectedPost(item)}
                    className="text-left font-medium text-slate-800 hover:text-[#6f0f14] hover:underline"
                  >
                    {item.title}
                  </button>

                  <span className="text-slate-500">{item.date}</span>

                  <div className="flex gap-2">
                    {session ? (
                      <>
                        <button
                          onClick={() => openEditNotice(item)}
                          className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteNotice(item.id)}
                          className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                        >
                          삭제
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-[#6f0f14] mb-6">게시글 상세</h3>

              {selectedPost ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#f9f4ec] px-3 py-1 text-xs font-medium text-[#6f0f14]">
                      {selectedPost.isNotice ? "공지" : selectedPost.category}
                    </span>
                    <span className="text-sm text-slate-500">{selectedPost.date}</span>
                  </div>

                  <h4 className="mt-4 text-2xl font-bold text-slate-800">
                    {selectedPost.title}
                  </h4>

                  <div className="mt-6 bg-[#f9f4ec] p-6 text-base leading-8 text-slate-700 whitespace-pre-wrap">
                    {selectedPost.content}
                  </div>
                </>
              ) : (
                <EmptyState
                  title="게시글을 선택해 주세요"
                  desc="왼쪽 목록에서 제목을 클릭하면 상세 내용이 표시됩니다."
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[140px_1fr_130px] bg-[#f9f4ec] border-b border-slate-200 px-6 py-4 text-sm font-medium text-slate-500">
              <span>연월</span>
              <span>연혁</span>
              <span>관리</span>
            </div>
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[140px_1fr_130px] border-b border-slate-100 px-6 py-4 text-sm last:border-b-0"
              >
                <span className="text-slate-600">{item.ym}</span>
                <span className="text-slate-800">{item.content}</span>
                <div className="flex gap-2">
                  {session ? (
                    <>
                      <button
                        onClick={() => openEditHistory(item)}
                        className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteHistory(item.id)}
                        className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                      >
                        삭제
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "conference" && (
          <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
            <div className="min-w-[1120px]">
              <div className="grid grid-cols-[1.8fr_160px_180px_100px_100px_120px_130px] bg-[#f9f4ec] border-b border-slate-200 px-6 py-4 text-sm font-medium text-slate-500">
                <span>학술대회명</span>
                <span>개최일</span>
                <span>장소</span>
                <span>논문 수</span>
                <span>발표자 수</span>
                <span>비용</span>
                <span>관리</span>
              </div>

              {conferenceItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.8fr_160px_180px_100px_100px_120px_130px] border-b border-slate-100 px-6 py-4 text-sm last:border-b-0"
                >
                  <span className="text-slate-800">{item.title}</span>
                  <span className="text-slate-600">{item.period}</span>
                  <span className="text-slate-600">{item.place}</span>
                  <span className="text-slate-600">{item.papers}</span>
                  <span className="text-slate-600">{item.presenters}</span>
                  <span className="text-slate-600">{item.cost}</span>
                  <div className="flex gap-2">
                    {session ? (
                      <>
                        <button
                          onClick={() => openEditConference(item)}
                          className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteConference(item.id)}
                          className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                        >
                          삭제
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
            <div className="min-w-[1360px]">
              <div className="grid grid-cols-[110px_1.8fr_100px_100px_180px_110px_120px_180px_130px] bg-[#f9f4ec] border-b border-slate-200 px-6 py-4 text-sm font-medium text-slate-500">
                <span>구분</span>
                <span>연구과제명</span>
                <span>책임자</span>
                <span>연구원 수</span>
                <span>연구기간</span>
                <span>지원구분</span>
                <span>연구비</span>
                <span>지원기관</span>
                <span>관리</span>
              </div>

              {performanceItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[110px_1.8fr_100px_100px_180px_110px_120px_180px_130px] border-b border-slate-100 px-6 py-4 text-sm last:border-b-0"
                >
                  <span className="text-slate-600">{item.type}</span>
                  <span className="text-slate-800">{item.title}</span>
                  <span className="text-slate-600">{item.manager}</span>
                  <span className="text-slate-600">{item.researchers}</span>
                  <span className="text-slate-600">{item.period}</span>
                  <span className="text-slate-600">{item.supportType}</span>
                  <span className="text-slate-600">{item.budget}</span>
                  <span className="text-slate-600">{item.agency}</span>
                  <div className="flex gap-2">
                    {session ? (
                      <>
                        <button
                          onClick={() => openEditPerformance(item)}
                          className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deletePerformance(item.id)}
                          className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                        >
                          삭제
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   Archive
========================= */

function ArchiveList({ session }) {
  const navigate = useNavigate();

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list"); // list | create | edit
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    is_notice: false,
    author_name: "관리자",
  });

  const [searchField, setSearchField] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");

  const loadPapers = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .order("is_notice", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("자료 목록을 불러오지 못했습니다.");
    } else {
      setPapers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setFile(null);
    setForm({
      title: "",
      is_notice: false,
      author_name: "관리자",
    });
  };

  const openEdit = (paper) => {
    setMode("edit");
    setEditId(paper.id);
    setFile(null);
    setForm({
      title: paper.title || "",
      is_notice: !!paper.is_notice,
      author_name: paper.author_name || "관리자",
    });
  };

  const cancelForm = () => {
    setMode("list");
    setEditId(null);
    setFile(null);
    setForm({
      title: "",
      is_notice: false,
      author_name: "관리자",
    });
  };

  const createFile = async () => {
    if (!supabase) {
      alert("Supabase 환경변수가 연결되지 않았습니다.");
      return;
    }
    if (!session) {
      alert("로그인 후 등록할 수 있습니다.");
      return;
    }
    if (!form.title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }
    if (!file) {
      alert("파일을 선택해 주세요.");
      return;
    }

    try {
      setUploading(true);

      const safeFileName = makeSafeFileName(file.name);
      const filePath = `uploads/${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("papers")
        .upload(filePath, file);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { error: insertError } = await supabase.from("papers").insert({
        title: form.title.trim(),
        file_name: file.name,
        file_path: filePath,
        is_notice: form.is_notice,
        author_name: form.author_name.trim() || "관리자",
        view_count: 0,
      });

      if (insertError) {
        alert(insertError.message);
        return;
      }

      alert("등록되었습니다.");
      cancelForm();
      await loadPapers();
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const updateFileMeta = async () => {
    if (!supabase) {
      alert("Supabase 환경변수가 연결되지 않았습니다.");
      return;
    }
    if (!session) {
      alert("로그인 후 수정할 수 있습니다.");
      return;
    }
    if (!editId) return;
    if (!form.title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }

    const { error } = await supabase
      .from("papers")
      .update({
        title: form.title.trim(),
        is_notice: form.is_notice,
        author_name: form.author_name.trim() || "관리자",
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("수정되었습니다.");
    cancelForm();
    await loadPapers();
  };

  const deletePaper = async (paper) => {
    if (!session) {
      alert("로그인 후 삭제할 수 있습니다.");
      return;
    }
    if (!confirm("이 파일을 삭제하시겠습니까?")) return;

    if (!supabase) return;

    const { error: storageError } = await supabase.storage
      .from("papers")
      .remove([paper.file_path]);

    if (storageError) {
      alert(storageError.message);
      return;
    }

    const { error: deleteError } = await supabase.from("papers").delete().eq("id", paper.id);

    if (deleteError) {
      alert(deleteError.message);
      return;
    }

    await loadPapers();
  };

  const filteredPapers = useMemo(() => {
    if (!searchKeyword.trim()) return papers;
    const keyword = searchKeyword.trim().toLowerCase();

    return papers.filter((paper) => {
      const title = (paper.title || "").toLowerCase();
      const fileName = (paper.file_name || "").toLowerCase();

      if (searchField === "title") return title.includes(keyword);
      return title.includes(keyword) || fileName.includes(keyword);
    });
  }, [papers, searchField, searchKeyword]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm tracking-[0.18em] uppercase text-[#8c6b2f] font-semibold">
            Archive
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">자료실</h2>
        </div>

        {session && mode === "list" && (
          <button
            onClick={openCreate}
            className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
          >
            글쓰기
          </button>
        )}
      </div>

      <div className="mt-10 border-t border-[#a5b84b] pt-10">
        <div className="flex justify-end gap-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border border-slate-300 px-4 py-2 bg-white text-sm"
          >
            <option value="title">제목</option>
            <option value="all">제목+파일명</option>
          </select>

          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="w-64 border border-slate-300 px-4 py-2 text-sm"
          />

          <button className="bg-[#97b12c] px-5 py-2 text-sm font-bold text-white">
            검색
          </button>
        </div>
      </div>

      {session && mode !== "list" && (
        <div className="mt-8 bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">
            {mode === "edit" ? "자료 수정" : "자료 등록"}
          </p>

          <div className="grid gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_notice}
                onChange={(e) => setForm((prev) => ({ ...prev, is_notice: e.target.checked }))}
              />
              공지로 등록
            </label>

            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="제목"
            />

            <input
              value={form.author_name}
              onChange={(e) => setForm((prev) => ({ ...prev, author_name: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="작성자"
            />

            {mode === "create" && (
              <input
                type="file"
                accept=".pdf,.hwp,.hwpx,.doc,.docx,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full border border-slate-300 px-4 py-3 bg-white"
              />
            )}

            {file && <p className="text-sm text-slate-600">선택된 파일: {file.name}</p>}

            <FormActions
              onSave={mode === "edit" ? updateFileMeta : createFile}
              onCancel={cancelForm}
              saveLabel={uploading ? "처리 중..." : mode === "edit" ? "수정" : "등록"}
            />
          </div>
        </div>
      )}

      <div className="mt-8 overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[90px_1fr_70px_100px_120px_90px_150px] border-b border-slate-200 bg-[#fafafa] px-4 py-4 text-sm font-medium text-slate-700">
          <span>번호</span>
          <span>제목</span>
          <span className="text-center">파일</span>
          <span className="text-center">작성자</span>
          <span className="text-center">작성일</span>
          <span className="text-center">조회수</span>
          <span className="text-center">관리</span>
        </div>

        {loading ? (
          <div className="px-4 py-12 text-slate-500">불러오는 중...</div>
        ) : filteredPapers.length === 0 ? (
          <div className="px-4 py-12 text-slate-500">등록된 자료가 없습니다.</div>
        ) : (
          filteredPapers.map((paper, index) => (
            <div
              key={paper.id}
              className="grid grid-cols-[90px_1fr_70px_100px_120px_90px_150px] items-center border-b border-slate-100 px-4 py-4 text-sm last:border-b-0"
            >
              <div>
                {paper.is_notice ? (
                  <span className="inline-block bg-[#97b12c] px-3 py-1 text-white text-xs font-bold">
                    공지
                  </span>
                ) : (
                  filteredPapers.length - index
                )}
              </div>

              <button
                onClick={() => navigate(`/archive/${paper.id}`)}
                className="text-left text-slate-800 hover:text-[#6f0f14] hover:underline"
              >
                {paper.title}
              </button>

              <div className="text-center text-slate-500">📎</div>
              <div className="text-center text-slate-700">{paper.author_name || "관리자"}</div>
              <div className="text-center text-slate-700">{formatDate(paper.created_at)}</div>
              <div className="text-center text-slate-700">{paper.view_count || 0}</div>

              <div className="flex justify-center gap-2">
                {session ? (
                  <>
                    <button
                      onClick={() => openEdit(paper)}
                      className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deletePaper(paper)}
                      className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">-</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ArchiveDetail({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPaper = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.from("papers").select("*").eq("id", id).single();

    if (error) {
      console.error(error);
      setPaper(null);
    } else {
      setPaper(data || null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPaper();
  }, [id]);

  const handleDownload = async () => {
    if (!paper || !supabase) return;

    await supabase
      .from("papers")
      .update({ view_count: (paper.view_count || 0) + 1 })
      .eq("id", paper.id);

    const { data } = supabase.storage.from("papers").getPublicUrl(paper.file_path);
    window.open(data.publicUrl, "_blank", "noopener,noreferrer");

    setPaper((prev) =>
      prev ? { ...prev, view_count: (prev.view_count || 0) + 1 } : prev
    );
  };

  const previewUrl = useMemo(() => {
    if (!paper || !supabase) return "";
    return supabase.storage.from("papers").getPublicUrl(paper.file_path).data.publicUrl;
  }, [paper]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.18em] uppercase text-[#8c6b2f] font-semibold">
            Archive Detail
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">자료 상세</h2>
        </div>

        <button
          onClick={() => navigate("/archive")}
          className="border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
        >
          목록으로
        </button>
      </div>

      {loading ? (
        <div className="mt-8 bg-white border border-slate-200 p-12 text-slate-500">
          불러오는 중...
        </div>
      ) : !paper ? (
        <EmptyState title="자료를 찾을 수 없습니다" desc="삭제되었거나 존재하지 않는 자료입니다." />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              {paper.is_notice && (
                <span className="bg-[#97b12c] px-3 py-1 text-xs font-bold text-white">
                  공지
                </span>
              )}
              <span className="text-sm text-slate-500">{formatDate(paper.created_at)}</span>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-[#6f0f14]">{paper.title}</h3>

            <div className="mt-8 grid gap-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-500">파일명</span>
                <span className="text-slate-800">{paper.file_name}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-500">작성자</span>
                <span className="text-slate-800">{paper.author_name || "관리자"}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-500">작성일</span>
                <span className="text-slate-800">{formatDate(paper.created_at)}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr]">
                <span className="font-semibold text-slate-500">조회수</span>
                <span className="text-slate-800">{paper.view_count || 0}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
              >
                다운로드
              </button>
              <button
                onClick={() => navigate("/archive")}
                className="border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700"
              >
                목록
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 shadow-sm">
            <h4 className="text-xl font-bold text-[#6f0f14]">미리보기</h4>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[480px]">
              {!previewUrl ? (
                <div className="text-slate-500">미리보기를 불러올 수 없습니다.</div>
              ) : isImageFile(paper.file_name) ? (
                <img
                  src={previewUrl}
                  alt={paper.file_name}
                  className="w-full rounded-lg object-contain"
                />
              ) : isPdfFile(paper.file_name) ? (
                <iframe
                  title="pdf-preview"
                  src={previewUrl}
                  className="w-full h-[620px] rounded-lg bg-white"
                />
              ) : (
                <div className="text-slate-600 leading-7">
                  이 파일 형식은 브라우저 내 미리보기를 지원하지 않습니다.
                  <br />
                  아래 다운로드 버튼을 눌러 파일을 확인해 주세요.
                </div>
              )}
            </div>

            {session && (
              <div className="mt-6 text-sm text-slate-500">
                자료 수정은 자료실 목록 페이지의 <span className="font-semibold">수정</span> 버튼에서 할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   Admin
========================= */

function Admin({ session }) {
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

/* =========================
   App
========================= */

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
        <div className="pt-[96px]">
          <WarningBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purpose" element={<PurposePage />} />
            <Route path="/research-content" element={<ResearchContentPage />} />
            <Route path="/regulations" element={<RegulationsPage />} />
            <Route path="/board" element={<Board session={session} />} />
            <Route path="/archive" element={<ArchiveList session={session} />} />
            <Route path="/archive/:id" element={<ArchiveDetail session={session} />} />
            <Route path="/admin" element={<Admin session={session} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}