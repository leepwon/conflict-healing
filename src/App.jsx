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
  const NOTICE_STORAGE_KEY = "dongguk-board-posts-v2";
  const HISTORY_STORAGE_KEY = "dongguk-history-extra";
  const CONF_STORAGE_KEY = "dongguk-conference-extra";
  const PERFORMANCE_STORAGE_KEY = "dongguk-performance-extra";

  const defaultNoticePosts = [
    {
      id: 1,
      category: "공지",
      title: "갈등치유연구소 홈페이지 시범 운영 안내",
      content:
        "동국대학교 WISE캠퍼스 갈등치유연구소 홈페이지가 시범 운영 중입니다. 게시판과 자료실 기능을 순차적으로 정비할 예정입니다.",
      date: "2026.03.16",
      isNotice: true,
    },
    {
      id: 2,
      category: "학술행사",
      title: "갈등치유 국제학술대회 발표자 모집",
      content:
        "학술대회 발표를 희망하시는 연구자께서는 초록을 제출해 주시기 바랍니다.",
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
    { id: "h4", ym: "2012-06", content: "총서 개발 : 갈등치유론(한국학술정보, 2012년)" },
    {
      id: "h5",
      ym: "2012-08",
      content:
        "갈등치유연구소 네이버 cafe 개발 및 운영 / 방폐물 지역수용성 문제와 환경안전을 위한 연구용역",
    },
    {
      id: "h6",
      ym: "2012-10",
      content: "방폐장 유치에 따른 경주지역 경제유발 효과와 지역협력 증대방안 연구용역",
    },
    { id: "h7", ym: "2013-03", content: "경주시 힐링시티 조성을 위한 전문가 워크샵" },
    {
      id: "h8",
      ym: "2013-05",
      content: "'사용후핵연료' 공론화에 대비한 전문가 워크샵",
    },
    {
      id: "h9",
      ym: "2013-06",
      content: "정책자료집 발간 : 사용후핵연료 공론화와 사회갈등",
    },
    {
      id: "h10",
      ym: "2013-08",
      content: "갈등치유연구소 부설 경관치유센터 설치 / 한국갈등관리학회와 MOU협약식 및 공동학술세미나 개최",
    },
    { id: "h11", ym: "2013-09", content: "제2기 갈등관리 아카데미 위탁교육 용역" },
    { id: "h12", ym: "2013-12", content: "2013 영남지역 대학생 공공갈등관리 논문공모전 시상식" },
    {
      id: "h13",
      ym: "2014-01",
      content: "발전소 주변지역 지원제도와 주요쟁점 파악 및 법정 통합기금 조성 방안 연구",
    },
    {
      id: "h14",
      ym: "2014-03",
      content: "송변전주변지역 지원대상 조사 및 세부기준 연구용역",
    },
    { id: "h15", ym: "2014-05", content: "2014년 제2회 갈등치유연구소 콜로퀴움" },
    {
      id: "h16",
      ym: "2014-07",
      content: "play & pray(놀이와 염원) - power of god, power of human",
    },
    {
      id: "h17",
      ym: "2014-08",
      content: "경주시 빅데이터 센터 설립 추진을 위한 제1차 워크숍",
    },
    { id: "h18", ym: "2014-12", content: "2014년 영남지역 대학생 공공갈등관리 논문공모전 시상식" },
    { id: "h19", ym: "2015-11", content: "2015년 제3회 갈등치유연구소 콜로퀴움" },
    { id: "h20", ym: "2015-12", content: "2015년 영남지역 대학생 공공갈등관리 논문공모전 시상식" },
    { id: "h21", ym: "2016-08", content: "에너지시민소통연합 수강생 인식조사" },
    {
      id: "h22",
      ym: "2016-11",
      content: "2016년 제4회 갈등치유연구소 콜로퀴움 / 연구과제 수행을 위한 전문가 포럼",
    },
    {
      id: "h23",
      ym: "2016-12",
      content: "미래에너지 대안에너지를 위한 에너지시민소통포럼 타운홀미팅 참여",
    },
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
    {
      id: "c4",
      title: "갈등치유연구소 콜로키움-Mind Gap",
      period: "2023-10-13",
      place: "ZOOM 온라인",
      papers: "1편",
      presenters: "1명",
      cost: "0천원",
    },
    {
      id: "c5",
      title: "갈등치유연구소 하계 학술대회",
      period: "2023-08-04",
      place: "동국대학교 와이즈캠퍼스 원효관 307",
      papers: "3편",
      presenters: "4명",
      cost: "300천원",
    },
    {
      id: "c6",
      title: "2018년도 한국종교학회 춘계학술대회 : 갈등치유와 종교교육",
      period: "2018-04-20",
      place: "동국대학교 경주캠퍼스",
      papers: "8편",
      presenters: "8명",
      cost: "0천원",
    },
    {
      id: "c7",
      title: "전문가 타운홀미팅",
      period: "2016-12-02",
      place: "경주 코모도호텔",
      papers: "0편",
      presenters: "1명",
      cost: "0천원",
    },
    {
      id: "c8",
      title: "연구과제수행을 위한 전문가 포럼",
      period: "2016-11-28",
      place: "동국대학교 교수회 회의실",
      papers: "1편",
      presenters: "1명",
      cost: "0천원",
    },
    {
      id: "c9",
      title: "제4회 갈등치유연구소 콜로키움",
      period: "2016-11-11",
      place: "동국대학교 교수회 회의실",
      papers: "1편",
      presenters: "1명",
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
    {
      id: "p4",
      type: "단독연구",
      title: "현 발전소 주변지역 지원제도의 주요 쟁점 파악 및 법정 통합기금 조성 방안 연구",
      manager: "오영석",
      researchers: "2명",
      period: "2013-11-01 ~ 2014-01-31",
      supportType: "기타",
      budget: "16,500천원",
      agency: "에너지경제연구원",
    },
    {
      id: "p5",
      type: "단독연구",
      title: "제2기 갈등관리 아카데미 위탁교육",
      manager: "오영석",
      researchers: "4명",
      period: "2013-03-25 ~ 2013-09-27",
      supportType: "기타",
      budget: "15,897천원",
      agency: "방사선환경시민포럼",
    },
    {
      id: "p6",
      type: "단독연구",
      title: "방폐장 유치에 따른 경주지역 경제유발 효과와 지역협력 증대방안 연구용역",
      manager: "오영석",
      researchers: "4명",
      period: "2012-07-23 ~ 2012-10-20",
      supportType: "기타",
      budget: "27,500천원",
      agency: "한국방사성폐기물관리공단",
    },
    {
      id: "p7",
      type: "단독연구",
      title: "지역수용성 조사 용역",
      manager: "오영석",
      researchers: "2명",
      period: "2011-12-21 ~ 2012-01-10",
      supportType: "기타",
      budget: "18,200천원",
      agency: "한국방사성폐기물관리공단",
    },
    {
      id: "p8",
      type: "단독연구",
      title: "갈등관리 및 지역사회 협력 과정 위탁교육",
      manager: "오영석",
      researchers: "8명",
      period: "2011-03-11 ~ 2012-02-28",
      supportType: "기타",
      budget: "102,000천원",
      agency: "한국방사성폐기물관리공단",
    },
    {
      id: "p9",
      type: "단독연구",
      title: "감정이입과 통합사고에 기반한 사회갈등 치유",
      manager: "오영석",
      researchers: "7명",
      period: "2010-09-01 ~ 2011-08-31",
      supportType: "기타",
      budget: "58,338천원",
      agency: "한국연구재단",
    },
    {
      id: "p10",
      type: "단독연구",
      title: "지역 발전을 위한 기업의 사회적 책임과 지역사회의 역할",
      manager: "오영석",
      researchers: "12명",
      period: "2010-07-30 ~ 2011-03-31",
      supportType: "기타",
      budget: "173,600천원",
      agency: "사단법인 포항지역발전 협의회",
    },
    {
      id: "p11",
      type: "단독연구",
      title: "발전소 주변지역 지원사업비의 평가 및 활용방안 도출",
      manager: "오영석",
      researchers: "4명",
      period: "2010-04-01 ~ 2010-08-31",
      supportType: "중앙정부",
      budget: "30,000천원",
      agency: "지식경제부",
    },
  ];

  const [activeTab, setActiveTab] = useState("notice");

  const [noticePosts, setNoticePosts] = useState(() => {
    const saved = localStorage.getItem(NOTICE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultNoticePosts;
  });

  const [historyItems, setHistoryItems] = useState(() => {
    const extra = localStorage.getItem(HISTORY_STORAGE_KEY);
    return extra ? [...defaultHistory, ...JSON.parse(extra)] : defaultHistory;
  });

  const [conferenceItems, setConferenceItems] = useState(() => {
    const extra = localStorage.getItem(CONF_STORAGE_KEY);
    return extra ? [...defaultConferences, ...JSON.parse(extra)] : defaultConferences;
  });

  const [performanceItems, setPerformanceItems] = useState(() => {
    const extra = localStorage.getItem(PERFORMANCE_STORAGE_KEY);
    return extra ? [...defaultPerformances, ...JSON.parse(extra)] : defaultPerformances;
  });

  const [selectedPost, setSelectedPost] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  const [noticeForm, setNoticeForm] = useState({
    category: "일반",
    title: "",
    content: "",
    isNotice: false,
  });

  const [historyForm, setHistoryForm] = useState({
    ym: "",
    content: "",
  });

  const [conferenceForm, setConferenceForm] = useState({
    title: "",
    period: "",
    place: "",
    papers: "",
    presenters: "",
    cost: "",
  });

  const [performanceForm, setPerformanceForm] = useState({
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
    localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(noticePosts));
  }, [noticePosts]);

  const saveExtraHistory = (items) => {
    const extra = items.filter((item) => !String(item.id).startsWith("h"));
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(extra));
  };

  const saveExtraConference = (items) => {
    const extra = items.filter((item) => !String(item.id).startsWith("c"));
    localStorage.setItem(CONF_STORAGE_KEY, JSON.stringify(extra));
  };

  const saveExtraPerformance = (items) => {
    const extra = items.filter((item) => !String(item.id).startsWith("p"));
    localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(extra));
  };

  const sortedNoticePosts = [...noticePosts].sort((a, b) => {
    if ((a.isNotice ? 1 : 0) !== (b.isNotice ? 1 : 0)) {
      return (b.isNotice ? 1 : 0) - (a.isNotice ? 1 : 0);
    }
    return b.id - a.id;
  });

  const addNoticePost = () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    const today = new Date();
    const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(today.getDate()).padStart(2, "0")}`;

    const newPost = {
      id: Date.now(),
      category: noticeForm.category,
      title: noticeForm.title.trim(),
      content: noticeForm.content.trim(),
      date,
      isNotice: noticeForm.isNotice,
    };

    setNoticePosts((prev) => [...prev, newPost]);
    setSelectedPost(newPost);
    setNoticeForm({
      category: "일반",
      title: "",
      content: "",
      isNotice: false,
    });
    setIsWriting(false);
  };

  const deleteNoticePost = (id) => {
    if (!session) {
      alert("로그인 후 삭제할 수 있습니다.");
      return;
    }

    const nextPosts = noticePosts.filter((p) => p.id !== id);
    setNoticePosts(nextPosts);

    if (selectedPost?.id === id) {
      setSelectedPost(nextPosts.length > 0 ? nextPosts[0] : null);
    }
  };

  const addHistoryItem = () => {
    if (!historyForm.ym.trim() || !historyForm.content.trim()) {
      alert("연월과 내용을 입력해 주세요.");
      return;
    }

    const newItem = {
      id: `hx-${Date.now()}`,
      ym: historyForm.ym.trim(),
      content: historyForm.content.trim(),
    };

    const next = [newItem, ...historyItems];
    setHistoryItems(next);
    saveExtraHistory(next);
    setHistoryForm({ ym: "", content: "" });
    setIsWriting(false);
  };

  const addConferenceItem = () => {
    if (!conferenceForm.title.trim() || !conferenceForm.period.trim()) {
      alert("학술대회명과 개최일을 입력해 주세요.");
      return;
    }

    const newItem = {
      id: `cx-${Date.now()}`,
      ...conferenceForm,
    };

    const next = [newItem, ...conferenceItems];
    setConferenceItems(next);
    saveExtraConference(next);
    setConferenceForm({
      title: "",
      period: "",
      place: "",
      papers: "",
      presenters: "",
      cost: "",
    });
    setIsWriting(false);
  };

  const addPerformanceItem = () => {
    if (!performanceForm.title.trim() || !performanceForm.period.trim()) {
      alert("연구과제명과 연구기간을 입력해 주세요.");
      return;
    }

    const newItem = {
      id: `px-${Date.now()}`,
      ...performanceForm,
    };

    const next = [newItem, ...performanceItems];
    setPerformanceItems(next);
    saveExtraPerformance(next);
    setPerformanceForm({
      type: "",
      title: "",
      manager: "",
      researchers: "",
      period: "",
      supportType: "",
      budget: "",
      agency: "",
    });
    setIsWriting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-[#6f0f14] mb-8">게시판</h2>

      <div className="mb-8 flex flex-wrap gap-3">
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
              setIsWriting(false);
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

      {session && !isWriting && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsWriting(true)}
            className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
          >
            데이터 추가
          </button>
        </div>
      )}

      {session && isWriting && activeTab === "notice" && (
        <div className="bg-white border border-slate-200 p-6 shadow-sm mb-8">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">공지사항 등록</p>

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

            <div className="flex gap-3">
              <button
                onClick={addNoticePost}
                className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
              >
                등록
              </button>
              <button
                onClick={() => setIsWriting(false)}
                className="border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {session && isWriting && activeTab === "history" && (
        <div className="bg-white border border-slate-200 p-6 shadow-sm mb-8">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">연구소 연혁 추가</p>
          <div className="grid gap-4">
            <input
              value={historyForm.ym}
              onChange={(e) => setHistoryForm((prev) => ({ ...prev, ym: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="연월 (예: 2026-03)"
            />
            <textarea
              value={historyForm.content}
              onChange={(e) => setHistoryForm((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-[140px] border border-slate-300 px-4 py-3 outline-none"
              placeholder="연혁 내용"
            />
            <div className="flex gap-3">
              <button
                onClick={addHistoryItem}
                className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
              >
                등록
              </button>
              <button
                onClick={() => setIsWriting(false)}
                className="border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {session && isWriting && activeTab === "conference" && (
        <div className="bg-white border border-slate-200 p-6 shadow-sm mb-8">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">학술대회 개최 현황 추가</p>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={conferenceForm.title}
              onChange={(e) => setConferenceForm((prev) => ({ ...prev, title: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none md:col-span-2"
              placeholder="학술대회명"
            />
            <input
              value={conferenceForm.period}
              onChange={(e) => setConferenceForm((prev) => ({ ...prev, period: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="개최일 또는 기간"
            />
            <input
              value={conferenceForm.place}
              onChange={(e) => setConferenceForm((prev) => ({ ...prev, place: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="개최 장소"
            />
            <input
              value={conferenceForm.papers}
              onChange={(e) => setConferenceForm((prev) => ({ ...prev, papers: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="발표 논문 수"
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
              onChange={(e) => setConferenceForm((prev) => ({ ...prev, cost: e.target.value }))}
              className="border border-slate-300 px-4 py-3 outline-none md:col-span-2"
              placeholder="개최 비용"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={addConferenceItem}
              className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
            >
              등록
            </button>
            <button
              onClick={() => setIsWriting(false)}
              className="border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {session && isWriting && activeTab === "performance" && (
        <div className="bg-white border border-slate-200 p-6 shadow-sm mb-8">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">연구소 수행 현황 추가</p>
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
              placeholder="책임자 성명"
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
              placeholder="공동 연구원 수"
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
              placeholder="연구비 지원 구분"
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
              placeholder="연구비 지원 기관"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={addPerformanceItem}
              className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
            >
              등록
            </button>
            <button
              onClick={() => setIsWriting(false)}
              className="border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {activeTab === "notice" && (
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="overflow-hidden bg-white border border-slate-200 shadow-sm">
              <div className="grid grid-cols-[110px_1fr_110px_90px] border-b border-slate-200 bg-[#f9f4ec] px-6 py-4 text-sm font-medium text-slate-500">
                <span>분류</span>
                <span>제목</span>
                <span>날짜</span>
                <span>관리</span>
              </div>

              {sortedNoticePosts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[110px_1fr_110px_90px] items-center border-b border-slate-100 px-6 py-5 text-sm last:border-b-0"
                >
                  <span className="text-slate-500">
                    {item.isNotice ? "공지" : item.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedPost(item)}
                    className="text-left font-medium text-slate-800 hover:text-[#6f0f14] hover:underline"
                  >
                    {item.title}
                  </button>

                  <span className="text-slate-500">{item.date}</span>

                  {session ? (
                    <button
                      type="button"
                      onClick={() => deleteNoticePost(item.id)}
                      className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                    >
                      삭제
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
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
                <div className="text-slate-500">
                  왼쪽 목록에서 게시글 제목을 클릭하면 상세 내용이 표시됩니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[140px_1fr] bg-[#f9f4ec] border-b border-slate-200 px-6 py-4 text-sm font-medium text-slate-500">
            <span>연월</span>
            <span>연혁</span>
          </div>
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[140px_1fr] border-b border-slate-100 px-6 py-4 text-sm last:border-b-0"
            >
              <span className="text-slate-600">{item.ym}</span>
              <span className="text-slate-800">{item.content}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "conference" && (
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1.6fr_160px_180px_100px_100px_120px] bg-[#f9f4ec] border-b border-slate-200 px-6 py-4 text-sm font-medium text-slate-500">
            <span>학술대회명</span>
            <span>개최일</span>
            <span>장소</span>
            <span>논문 수</span>
            <span>발표자 수</span>
            <span>비용</span>
          </div>
          {conferenceItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.6fr_160px_180px_100px_100px_120px] border-b border-slate-100 px-6 py-4 text-sm last:border-b-0"
            >
              <span className="text-slate-800">{item.title}</span>
              <span className="text-slate-600">{item.period}</span>
              <span className="text-slate-600">{item.place}</span>
              <span className="text-slate-600">{item.papers}</span>
              <span className="text-slate-600">{item.presenters}</span>
              <span className="text-slate-600">{item.cost}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "performance" && (
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[110px_1.8fr_100px_100px_180px_110px_120px_160px] bg-[#f9f4ec] border-b border-slate-200 px-6 py-4 text-sm font-medium text-slate-500">
            <span>구분</span>
            <span>연구과제명</span>
            <span>책임자</span>
            <span>연구원 수</span>
            <span>연구기간</span>
            <span>지원구분</span>
            <span>연구비</span>
            <span>지원기관</span>
          </div>
          {performanceItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[110px_1.8fr_100px_100px_180px_110px_120px_160px] border-b border-slate-100 px-6 py-4 text-sm last:border-b-0"
            >
              <span className="text-slate-600">{item.type}</span>
              <span className="text-slate-800">{item.title}</span>
              <span className="text-slate-600">{item.manager}</span>
              <span className="text-slate-600">{item.researchers}</span>
              <span className="text-slate-600">{item.period}</span>
              <span className="text-slate-600">{item.supportType}</span>
              <span className="text-slate-600">{item.budget}</span>
              <span className="text-slate-600">{item.agency}</span>
            </div>
          ))}
        </div>
      )}
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