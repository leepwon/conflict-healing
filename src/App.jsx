import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);

  const goHomeTop = () => {
    setHomeMenuOpen(false);

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150);
    }
  };

  const goHomeSection = (sectionId) => {
    setHomeMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#8c6b2f] font-semibold">
            DONGGUK UNIVERSITY WISE CAMPUS
          </p>
          <h1 className="text-lg font-bold text-[#6f0f14]">갈등치유연구소</h1>
        </div>

        <nav className="flex items-center gap-6 text-sm font-bold text-slate-800">
          <div
            className="relative"
            onMouseEnter={() => setHomeMenuOpen(true)}
            onMouseLeave={() => setHomeMenuOpen(false)}
          >
            <button
              type="button"
              onClick={goHomeTop}
              className="hover:text-[#6f0f14]"
            >
              홈
            </button>

            {homeMenuOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-44 -translate-x-1/2 rounded-md border border-slate-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => goHomeSection("purpose")}
                  className="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-[#f9f4ec] hover:text-[#6f0f14]"
                >
                  설립목적
                </button>
                <button
                  type="button"
                  onClick={() => goHomeSection("research-content")}
                  className="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-[#f9f4ec] hover:text-[#6f0f14]"
                >
                  연구내용
                </button>
                <a
                  href="https://rule.dongguk.edu/lmxsrv/main/main.srv"
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-3 text-left text-sm text-slate-700 hover:bg-[#f9f4ec] hover:text-[#6f0f14]"
                >
                  연구소 규정
                </a>
              </div>
            )}
          </div>

          <Link to="/board" className="hover:text-[#6f0f14]">
            게시판
          </Link>
          <Link to="/archive" className="hover:text-[#6f0f14]">
            자료실
          </Link>
          <Link to="/admin" className="hover:text-[#6f0f14]">
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
      Supabase 환경변수가 아직 연결되지 않았습니다. 자료실 업로드 기능은 동작하지 않을 수
      있습니다.
    </div>
  );
}

function Home() {
  return (
    <>
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

      <section id="purpose" className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-white border border-slate-200 p-10 shadow-sm">
          <p className="text-sm tracking-[0.22em] uppercase text-[#8c6b2f] font-semibold">
            Purpose of Establishment
          </p>
          <h3 className="mt-3 text-3xl font-bold text-[#6f0f14]">설립목적</h3>

          <p className="mt-6 text-base leading-8 text-slate-700">
            학제간 융합연구를 통하여 개인 및 사회갈등 치유에 공헌할 학술 연구와 교육을 통한
            인재양성을 목적으로 합니다. 개인주의 및 민주화, 삶의 질에 대한 욕구 증대로 개인 및
            사회갈등이 심화되는 현실 속에서, 불교를 건학이념으로 하는 동국대학교 WISE캠퍼스에
            갈등치유연구소를 두어 갈등치유 관련 연구와 교육에 이바지하고자 합니다.
          </p>

          <ul className="mt-6 list-disc pl-6 space-y-3 text-slate-700 leading-8">
            <li>
              사회갈등 치유의 이론과 기법을 연구하여 관련 종사자와 당사자들이 쉽게 활용하도록
              돕습니다.
            </li>
            <li>
              교육과 훈련을 통하여 사회갈등을 효과적으로 치유할 전문인력 양성에 이바지합니다.
            </li>
            <li>갈등 현장에 직접 참여하여 문제 해결과 당사자 치유에 봉사합니다.</li>
            <li>사회갈등의 과학적 접근을 통해 갈등산업 육성의 기반 조성에 힘씁니다.</li>
          </ul>
        </div>
      </section>

      <section id="research-content" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-white border border-slate-200 p-10 shadow-sm">
          <p className="text-sm tracking-[0.22em] uppercase text-[#8c6b2f] font-semibold">
            Research Content
          </p>
          <h3 className="mt-3 text-3xl font-bold text-[#6f0f14]">연구내용</h3>

          <p className="mt-6 text-base leading-8 text-slate-700">
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
      </section>

      <section id="regulations" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-white border border-slate-200 p-10 shadow-sm">
          <p className="text-sm tracking-[0.22em] uppercase text-[#8c6b2f] font-semibold">
            Research Institute Regulations
          </p>
          <h3 className="mt-3 text-3xl font-bold text-[#6f0f14]">연구소 규정</h3>

          <p className="mt-6 text-base leading-8 text-slate-700">
            연구소 규정은 동국대학교 규정 시스템에서 확인할 수 있습니다.
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
      </section>
    </>
  );
}

function Board({ session }) {
  const defaultPosts = [
    {
      id: 1,
      category: "공지",
      title: "갈등치유연구소 홈페이지 시범 운영 안내",
      content:
        "동국대학교 WISE캠퍼스 갈등치유연구소 홈페이지가 시범 운영 중입니다. 게시판과 자료실 기능을 순차적으로 정비할 예정입니다.",
      date: "2026.03.16",
    },
    {
      id: 2,
      category: "학술행사",
      title: "갈등치유 국제학술대회 발표자 모집",
      content:
        "학술대회 발표를 희망하시는 연구자께서는 초록을 제출해 주시기 바랍니다.",
      date: "2026.03.15",
    },
  ];

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("dongguk-board-posts");
    return saved ? JSON.parse(saved) : defaultPosts;
  });

  const [selectedPost, setSelectedPost] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [form, setForm] = useState({
    category: "일반",
    title: "",
    content: "",
  });

  useEffect(() => {
    localStorage.setItem("dongguk-board-posts", JSON.stringify(posts));
  }, [posts]);

  const addPost = () => {
    if (!form.title.trim() || !form.content.trim()) {
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
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      date,
    };

    setPosts((prev) => [newPost, ...prev]);
    setSelectedPost(newPost);
    setForm({
      category: "일반",
      title: "",
      content: "",
    });
    setIsWriting(false);
  };

  const deletePost = (id) => {
    if (!session) {
      alert("로그인 후 삭제할 수 있습니다.");
      return;
    }

    const target = posts.find((p) => p.id === id);
    if (!target) return;

    const ok = confirm(`"${target.title}" 글을 삭제하시겠습니까?`);
    if (!ok) return;

    const nextPosts = posts.filter((p) => p.id !== id);
    setPosts(nextPosts);

    if (selectedPost?.id === id) {
      setSelectedPost(nextPosts.length > 0 ? nextPosts[0] : null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-[#6f0f14] mb-8">게시판</h2>

      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          {isWriting && session && (
            <div className="bg-white border border-slate-200 p-6 shadow-sm mb-8">
              <p className="text-sm font-medium text-[#8c6b2f] mb-4">새 글 작성</p>

              <div className="grid gap-4">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
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
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="border border-slate-300 px-4 py-3 outline-none"
                  placeholder="게시글 제목"
                />

                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="min-h-[180px] border border-slate-300 px-4 py-3 outline-none"
                  placeholder="게시글 내용"
                />

                <div className="flex gap-3">
                  <button
                    onClick={addPost}
                    className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
                  >
                    글 등록
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

          <div className="overflow-hidden bg-white border border-slate-200 shadow-sm">
            <div className="grid grid-cols-[110px_1fr_110px_90px] border-b border-slate-200 bg-[#f9f4ec] px-6 py-4 text-sm font-medium text-slate-500">
              <span>분류</span>
              <span>제목</span>
              <span>날짜</span>
              <span>관리</span>
            </div>

            {posts.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[110px_1fr_110px_90px] items-center border-b border-slate-100 px-6 py-5 text-sm last:border-b-0"
              >
                <span className="text-slate-500">{item.category}</span>

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
                    onClick={() => deletePost(item.id)}
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

          {session && !isWriting && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsWriting(true)}
                className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
              >
                글쓰기
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white border border-slate-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#6f0f14] mb-6">게시글 상세</h3>

            {selectedPost ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="bg-[#f9f4ec] px-3 py-1 text-xs font-medium text-[#6f0f14]">
                    {selectedPost.category}
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

function Archive({ session }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [searchField, setSearchField] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [form, setForm] = useState({
    title: "",
    is_notice: false,
  });

  const loadPapers = async () => {
    if (!supabase) return;

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

  const makeSafeFileName = (name) => {
    const lastDotIndex = name.lastIndexOf(".");
    const base = lastDotIndex >= 0 ? name.slice(0, lastDotIndex) : name;
    const ext = lastDotIndex >= 0 ? name.slice(lastDotIndex).toLowerCase() : "";

    const safeBase = base
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    return `${safeBase || "file"}${ext}`;
  };

  const upload = async () => {
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
        author_name: "관리자",
        view_count: 0,
      });

      if (insertError) {
        alert(insertError.message);
        return;
      }

      alert("등록되었습니다.");
      setFile(null);
      setForm({
        title: "",
        is_notice: false,
      });
      setIsWriting(false);
      await loadPapers();
    } catch (err) {
      console.error(err);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const deletePaper = async (paper) => {
    if (!supabase) {
      alert("Supabase 환경변수가 연결되지 않았습니다.");
      return;
    }

    if (!session) {
      alert("로그인 후 삭제할 수 있습니다.");
      return;
    }

    const ok = confirm(`"${paper.file_name}" 파일을 삭제하시겠습니까?`);
    if (!ok) return;

    const { error: storageError } = await supabase.storage
      .from("papers")
      .remove([paper.file_path]);

    if (storageError) {
      alert(storageError.message);
      return;
    }

    const { error: dbError } = await supabase
      .from("papers")
      .delete()
      .eq("id", paper.id);

    if (dbError) {
      alert(dbError.message);
      return;
    }

    await loadPapers();
  };

  const openFile = async (paper) => {
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from("papers")
      .update({ view_count: (paper.view_count || 0) + 1 })
      .eq("id", paper.id);

    if (!updateError) {
      setPapers((prev) =>
        prev.map((item) =>
          item.id === paper.id
            ? { ...item, view_count: (item.view_count || 0) + 1 }
            : item
        )
      );
    }

    const { data } = supabase.storage.from("papers").getPublicUrl(paper.file_path);
    window.open(data.publicUrl, "_blank", "noopener,noreferrer");
  };

  const filteredPapers = papers.filter((paper) => {
    if (!searchKeyword.trim()) return true;

    const keyword = searchKeyword.trim().toLowerCase();

    if (searchField === "title") {
      return (paper.title || "").toLowerCase().includes(keyword);
    }

    return (
      (paper.title || "").toLowerCase().includes(keyword) ||
      (paper.file_name || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold text-center text-slate-900">자료실</h2>

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

      {session && !isWriting && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsWriting(true)}
            className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white"
          >
            글쓰기
          </button>
        </div>
      )}

      {session && isWriting && (
        <div className="mt-6 bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-[#8c6b2f] mb-4">자료 등록</p>

          <div className="grid gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_notice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_notice: e.target.checked }))
                }
              />
              공지로 등록
            </label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border border-slate-300 px-4 py-3 outline-none"
              placeholder="제목"
            />

            <input
              type="file"
              accept=".pdf,.hwp,.hwpx,.doc,.docx,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full border border-slate-300 px-4 py-3 bg-white"
            />

            {file && (
              <p className="text-sm text-slate-600">선택된 파일: {file.name}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={upload}
                disabled={uploading}
                className="bg-[#6f0f14] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {uploading ? "등록 중..." : "등록"}
              </button>

              <button
                onClick={() => {
                  setIsWriting(false);
                  setFile(null);
                  setForm({ title: "", is_notice: false });
                }}
                className="border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-hidden border-t border-slate-300">
        <div className="grid grid-cols-[80px_1fr_60px_90px_110px_80px] border-b border-slate-300 bg-[#fafafa] px-4 py-4 text-sm font-medium text-slate-700">
          <span>번호</span>
          <span>제목</span>
          <span className="text-center">파일</span>
          <span className="text-center">작성자</span>
          <span className="text-center">작성일</span>
          <span className="text-center">조회수</span>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-slate-500">불러오는 중...</div>
        ) : filteredPapers.length === 0 ? (
          <div className="px-4 py-10 text-slate-500">등록된 자료가 없습니다.</div>
        ) : (
          filteredPapers.map((paper, index) => (
            <div
              key={paper.id}
              className="grid grid-cols-[80px_1fr_60px_90px_110px_80px] items-center border-b border-slate-200 px-4 py-4 text-sm"
            >
              <div>
                {paper.is_notice ? (
                  <span className="inline-block bg-[#97b12c] px-3 py-1 text-white text-xs font-bold">
                    공지
                  </span>
                ) : (
                  <span>{filteredPapers.length - index}</span>
                )}
              </div>

              <button
                onClick={() => openFile(paper)}
                className="text-left text-slate-800 hover:underline"
              >
                {paper.title}
              </button>

              <div className="text-center">
                <button
                  onClick={() => openFile(paper)}
                  className="text-slate-500 hover:text-[#6f0f14]"
                  title="파일 열기"
                >
                  📎
                </button>
              </div>

              <div className="text-center text-slate-700">
                {paper.author_name || "관리자"}
              </div>

              <div className="text-center text-slate-700">
                {paper.created_at
                  ? new Date(paper.created_at).toLocaleDateString("ko-KR")
                  : "-"}
              </div>

              <div className="text-center text-slate-700">{paper.view_count || 0}</div>

              {session && (
                <div className="col-span-6 mt-2 flex justify-end">
                  <button
                    onClick={() => deletePaper(paper)}
                    className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                  >
                    삭제
                  </button>
                </div>
              )}
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