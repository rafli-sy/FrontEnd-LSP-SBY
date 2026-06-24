import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './LandingPage.css';
import logoLSP from '../../assets/logo.png';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

// URL backend Flask Sentiment Analysis
const SENTIMENT_API = 'https://api-sentiment-blk.vercel.app/api';

const CountUp = ({ end, decimals = 0, duration = 1500, suffix = "", start = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * end);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [selectedSkema, setSelectedSkema] = useState(null);

  // Gunakan Environment Variable untuk API Master Data
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://lspblksurabaya.id';

  // =========================================================
  // STATE DATA DINAMIS DARI API
  // =========================================================
  const [dataSkema, setDataSkema] = useState([]);
  const [totalSkemaDinamis, setTotalSkemaDinamis] = useState(0);
  const [totalTuk, setTotalTuk] = useState(0);
  const [totalAsesor, setTotalAsesor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // =========================================================
  // DATA GRAFIK
  // =========================================================
  const [topSkema, setTopSkema] = useState([]);
  const [grafikBulan, setGrafikBulan] = useState([
    { bulan: 'Jan', total: 0 },
    { bulan: 'Feb', total: 0 },
    { bulan: 'Mar', total: 0 },
    { bulan: 'Apr', total: 0 },
    { bulan: 'Mei', total: 0 },
    { bulan: 'Jun', total: 0 },
    { bulan: 'Jul', total: 0 },
    { bulan: 'Agt', total: 0 },
    { bulan: 'Sep', total: 0 },
    { bulan: 'Okt', total: 0 },
    { bulan: 'Nov', total: 0 },
    { bulan: 'Des', total: 0 },
  ]);

  // =========================================================
  // STATE SENTIMENT ANALYSIS - PASTE KOMENTAR
  // =========================================================
  const [sentimentComments, setSentimentComments] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sentimentStats, setSentimentStats] = useState(null);
  const [sentimentLoading, setSentimentLoading] = useState(true);
  const [sentimentError, setSentimentError] = useState(null);
  const [pasteText, setPasteText] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteLoading, setPasteLoading] = useState(false);

  // Load data demo saat pertama kali buka
  const fetchDemoSentiment = useCallback(async () => {
    setSentimentLoading(true);
    setSentimentError(null);
    try {
      const [resComments, resStats] = await Promise.all([
        fetch(`${SENTIMENT_API}/comments?n=15`),
        fetch(`${SENTIMENT_API}/stats`),
      ]);
      if (!resComments.ok) throw new Error('Server analisis tidak bisa dijangkau.');
      const dataComments = await resComments.json();
      const dataStats = resStats.ok ? await resStats.json() : null;
      setSentimentComments(dataComments.comments || []);
      setSentimentStats(dataStats);
    } catch (err) {
      setSentimentError(err.message);
    } finally {
      setSentimentLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // PARSER: Bersihkan teks copy-paste dari Instagram
  // Otomatis hapus: "1 wReply", "4 d1 likeReply", "@mention", baris kosong, dll.
  // ─────────────────────────────────────────────────────────────────────────
  const parseInstagramPaste = (rawText) => {
    const lines = rawText.split('\n');
    const cleanComments = [];
    let currentLines = [];

    // Pola baris metadata Instagram yang harus DIABAIKAN
    const SKIP_PATTERNS = [
      /^\d+\s*[wdhms]\s*\d*\s*(like[s]?)?\s*Reply\s*$/i,   // "1 wReply", "4 d1 likeReply"
      /^\d+\s*(like[s]?)\s*Reply\s*$/i,                      // "3 likesReply"
      /^Reply\s*$/i,                                           // "Reply" saja
      /^\d+\s*(like[s]?)\s*$/i,                              // "1 like", "5 likes"
      /^@[a-zA-Z0-9._]+\s*$/,                                // "@username" saja
      /^@[a-zA-Z0-9._]+\s*Reply\s*$/i,                      // "@username Reply"
      /^\d+\s*[wdhms]\s*$/i,                                  // "1 w", "4 d" waktu saja
      /^\d+\s*[wdhms]\s*\d+\s*(like[s]?)?\s*$/i,            // "4 d1 like"
      /^\s*$/,                                                  // baris kosong
    ];

    // Kata tunggal yang pasti metadata
    const SKIP_SINGLE = new Set(['reply', 'like', 'likes', 'likeReply', 'Suka']);

    const isMetadata = (line) => {
      const t = line.trim();
      if (SKIP_SINGLE.has(t)) return true;
      if (/^\d+$/.test(t)) return true; // angka murni
      return SKIP_PATTERNS.some(p => p.test(t));
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (isMetadata(trimmed)) {
        // Ketemu metadata → simpan komentar yang sudah terkumpul
        if (currentLines.length > 0) {
          const comment = currentLines.join(' ').trim();
          if (comment.length > 1) cleanComments.push(comment);
          currentLines = [];
        }
      } else if (trimmed.length > 0) {
        currentLines.push(trimmed);
      }
    }
    // Simpan komentar terakhir
    if (currentLines.length > 0) {
      const comment = currentLines.join(' ').trim();
      if (comment.length > 1) cleanComments.push(comment);
    }

    // Deduplicate: buang komentar yang persis sama (edge case emoji parsing)
    const seen = new Set();
    return cleanComments.filter(c => {
      if (seen.has(c)) return false;
      seen.add(c);
      return true;
    });
  };

  // Analisis komentar yang di-paste user (auto-bersihkan metadata Instagram)
  const analyzePastedComments = useCallback(async () => {
    const cleanComments = parseInstagramPaste(pasteText);
    if (cleanComments.length === 0) return;
    setPasteLoading(true);
    setSentimentError(null);
    try {
      const res = await fetch(`${SENTIMENT_API}/analyze-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: cleanComments }),
      });
      if (!res.ok) throw new Error('Gagal analisis komentar.');
      const data = await res.json();
      setSentimentComments(data.results || []);
      setSentimentStats(data.stats || null);
      setPasteMode(true);
    } catch (err) {
      setSentimentError(err.message);
    } finally {
      setPasteLoading(false);
    }
  }, [pasteText]);

  const resetToDemo = useCallback(() => {
    setPasteMode(false);
    setPasteText('');
    fetchDemoSentiment();
  }, [fetchDemoSentiment]);

  useEffect(() => {
    fetchDemoSentiment();
  }, [fetchDemoSentiment]);

  const aliasNamaBidang = {
    "Teknologi Informasi": "IT & Software Development",
    "Teknik Las": "Welding Specialist",
    "Bisman": "Bisnis & Manajemen",
    "TIK": "Teknologi Informasi (TIK)",
  };

  const getIconForBidang = (namaBidang) => {
    const nama = (namaBidang || '').toLowerCase();
    if (nama.includes('tik') || nama.includes('it ') || nama.includes('informasi') || nama.includes('komputer') || nama.includes('software')) return 'fa-laptop-code';
    if (nama.includes('las') || nama.includes('welding')) return 'fa-fire';
    if (nama.includes('listrik') || nama.includes('elektronika')) return 'fa-bolt';
    if (nama.includes('otomotif') || nama.includes('kendaraan') || nama.includes('motor') || nama.includes('mobil')) return 'fa-car-side';
    if (nama.includes('garmen') || nama.includes('busana') || nama.includes('jahit') || nama.includes('tekstil')) return 'fa-tshirt';
    if (nama.includes('pariwisata') || nama.includes('hotel') || nama.includes('hospitality') || nama.includes('boga')) return 'fa-concierge-bell';
    if (nama.includes('refrigerasi') || nama.includes('udara') || nama.includes('ac')) return 'fa-snowflake';
    if (nama.includes('manufaktur') || nama.includes('mesin') || nama.includes('cnc')) return 'fa-cogs';
    if (nama.includes('bisnis') || nama.includes('administrasi') || nama.includes('office') || nama.includes('akuntansi')) return 'fa-briefcase';
    if (nama.includes('pelatihan') || nama.includes('metodologi') || nama.includes('instruktur') || nama.includes('teacher')) return 'fa-chalkboard-teacher';
    if (nama.includes('rias') || nama.includes('kecantikan') || nama.includes('spa') || nama.includes('makeup')) return 'fa-spa';
    return 'fa-award';
  };

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const headers = {
          'ngrok-skip-browser-warning': '69420',
          'Content-Type': 'application/json'
        };

        const [resSkema, resBidang, resJejaring, resAsesor, resStats] = await Promise.all([
          fetch(`${apiUrl}/api/master/skema`, { method: 'GET', headers }),
          fetch(`${apiUrl}/api/master/bidang`, { method: 'GET', headers }),
          fetch(`${apiUrl}/api/master/jejaring`, { method: 'GET', headers }),
          fetch(`${apiUrl}/api/master/asesor`, { method: 'GET', headers }),
          fetch(`${apiUrl}/api/master/statistik-landing`, { method: 'GET', headers })
        ]);

        if (!resSkema.ok || !resBidang.ok) throw new Error("Gagal menarik data utama dari API");

        const jsonSkema = await resSkema.json();
        const jsonBidang = await resBidang.json();
        const jsonJejaring = resJejaring.ok ? await resJejaring.json() : { data: [] };
        const jsonAsesor = resAsesor.ok ? await resAsesor.json() : { data: [] };

        let arrSkema = Array.isArray(jsonSkema.data?.data) ? jsonSkema.data.data : (jsonSkema.data || jsonSkema);
        let arrBidang = Array.isArray(jsonBidang.data?.data) ? jsonBidang.data.data : (jsonBidang.data || jsonBidang);
        let arrJejaring = Array.isArray(jsonJejaring.data?.data) ? jsonJejaring.data.data : (jsonJejaring.data || jsonJejaring);
        let arrAsesor = Array.isArray(jsonAsesor.data?.data) ? jsonAsesor.data.data : (jsonAsesor.data || jsonAsesor);

        setTotalSkemaDinamis(Array.isArray(arrSkema) ? arrSkema.length : 0);
        setTotalTuk(Array.isArray(arrJejaring) ? arrJejaring.length : 0);
        setTotalAsesor(Array.isArray(arrAsesor) ? arrAsesor.length : 0);

        if (resStats.ok) {
          const jsonStats = await resStats.json();

          if (jsonStats.status === 'success' && jsonStats.data) {
            const rawTop = jsonStats.data.top_skema || [];
            const maxAsesi = rawTop.length > 0 ? Math.max(...rawTop.map(item => Number(item.asesi || 0))) : 0;
            const colors = ['#0056b3', '#10b981', '#f59e0b'];

            const mappedTop = rawTop.map((item, idx) => {
              const nama = item.nama || 'Skema Lainnya';
              const lower = nama.toLowerCase();

              let icon = 'fa-award';

              if (lower.includes('batik') || lower.includes('busana') || lower.includes('tshirt')) icon = 'fa-tshirt';
              else if (lower.includes('barista') || lower.includes('kopi') || lower.includes('boga')) icon = 'fa-concierge-bell';
              else if (lower.includes('admin') || lower.includes('perkantoran') || lower.includes('office') || lower.includes('komputer')) icon = 'fa-briefcase';
              else if (lower.includes('las') || lower.includes('welding')) icon = 'fa-fire';
              else if (lower.includes('it') || lower.includes('software') || lower.includes('programming')) icon = 'fa-laptop-code';

              return {
                nama,
                icon,
                color: colors[idx] || '#64748b',
                asesi: Number(item.asesi || 0),
                percentage: maxAsesi > 0 ? Math.round((Number(item.asesi || 0) / maxAsesi) * 100) : 0
              };
            });

            setTopSkema(mappedTop);

            const rawMonthly = jsonStats.data.grafik_bulanan || [];
            if (rawMonthly.length > 0) {
              setGrafikBulan(rawMonthly);
            }
          }
        }

        const kamusBidang = {};
        if (Array.isArray(arrBidang)) {
          arrBidang.forEach(b => {
            kamusBidang[b.id] = b.nama_bidang || b.namaBidang || b.bidang || `Bidang ${b.id}`;
          });
        }

        const groupedData = (Array.isArray(arrSkema) ? arrSkema : []).reduce((acc, curr) => {
          const namaSkema = curr.namaSkema || curr.nama_skema || curr.judul_skema || `Skema ID ${curr.id}`;
          const idBidang = curr.bidang_id;
          const namaAsliDB = curr.bidang?.nama_bidang || kamusBidang[idBidang] || `Bidang Lainnya`;
          const namaTampilan = aliasNamaBidang[namaAsliDB] || namaAsliDB;

          let existingBidang = acc.find(item => item.kategori === namaTampilan);

          if (existingBidang) {
            existingBidang.list.push(namaSkema);
            existingBidang.total += 1;
          } else {
            acc.push({
              kategori: namaTampilan,
              icon: getIconForBidang(namaTampilan),
              total: 1,
              list: [namaSkema]
            });
          }
          return acc;
        }, []);

        groupedData.sort((a, b) => a.kategori.localeCompare(b.kategori));
        setDataSkema(groupedData);
        setIsLoading(false);

      } catch (error) {
        console.error("Error Fetching:", error);
        setApiError(error.message);
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, [apiUrl]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => { if (statsRef.current) observer.unobserve(statsRef.current); };
  }, []);

  useEffect(() => {
    if (selectedSkema) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [selectedSkema]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openModal = (item) => setSelectedSkema(item);
  const closeModal = () => setSelectedSkema(null);

  const maxTotalBulanan = grafikBulan.length > 0 ? Math.max(...grafikBulan.map(d => d.total)) : 0;

  return (
    <div className="landing-page-container">
      <header id="header">
        <div className="container header-flex">
          <div className="logo">
            <img src={logoLSP} alt="Logo LSP BLK Surabaya" />
            <div className="logo-text">
              <span className="brand">LSP BLK SURABAYA</span>
              <span className="tag">UPT Balai Latihan Kerja Surabaya</span>
            </div>
          </div>
          <div className={`nav-wrapper ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              <li><a href="#hero" onClick={closeMenu}>Beranda</a></li>
              <li><a href="#tentang" onClick={closeMenu}>Tentang Lembaga</a></li>
              <li><a href="#skema" onClick={closeMenu}>Informasi Skema</a></li>
              <li><a href="#sentimen" onClick={closeMenu}>Sentimen Publik</a></li>
              <li><Link to="/cek-sertifikat" onClick={closeMenu}>Verifikasi Sertifikat</Link></li>
            </ul>
            <div className="nav-login">
              <Link to="/login" className="btn-nav" onClick={closeMenu}>
                <i className="fas fa-user-circle" style={{ fontSize: '1.1rem' }}></i> Login Sistem
              </Link>
            </div>
          </div>
          <div className="menu-toggle" onClick={toggleMenu}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>
        </div>
      </header>

      <section id="hero" className="hero">
        <div className="container grid-2">
          <div className="hero-text" data-aos="fade-right">
            <h1>Portal Resmi <span className="blue">Verifikasi Sertifikat</span> Kompetensi</h1>
            <p>Layanan terpadu bagi perusahaan dan instansi untuk memvalidasi keaslian sertifikat BNSP calon tenaga kerja lulusan UPT Balai Latihan Kerja Surabaya secara instan dan akurat.</p>
            <div className="hero-actions" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/cek-sertifikat" className="btn-main">
                <i className="fas fa-search-diploma" style={{ marginRight: '8px' }}></i> Cek Keaslian Sertifikat
              </Link>
              <a href="#tentang" className="btn-outline">Profil Lembaga</a>
            </div>
          </div>
          <div className="hero-image" data-aos="zoom-in">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop" alt="Hero Image LSP BLK Surabaya" style={{ borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      <section className="stats-visual" ref={statsRef}>
        <div className="container">
          <div className="stats-visual-header" data-aos="fade-up">
            <h2>Insight & Kapasitas Lembaga</h2>
            <p>Gambaran analitik operasional pelaksanaan sertifikasi kompetensi di LSP UPT Balai Latihan Kerja Surabaya.</p>
          </div>

          <div className="stats-visual-grid">
            <div className="visual-card" data-aos="fade-up">
              <h4>Jumlah Asesor</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px 0' }}>
                <div style={{ width: '65px', height: '65px', background: '#e7f1ff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056b3', fontSize: '2rem' }}>
                  <i className="fas fa-user-check"></i>
                </div>
                <div style={{ fontSize: '2.6rem', fontWeight: '800', color: '#0056b3', lineHeight: '1' }}>
                  <CountUp end={totalAsesor} start={isStatsVisible} />
                </div>
              </div>
              <p>Asesor independen berlisensi BNSP yang siap menguji kompetensi asesi secara profesional.</p>
            </div>

            <div className="visual-card" data-aos="fade-up" data-aos-delay="100">
              <h4>Tempat Uji Kompetensi (TUK)</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px 0' }}>
                <div style={{ width: '65px', height: '65px', background: '#d1fae5', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '2rem' }}>
                  <i className="fas fa-building"></i>
                </div>
                <div style={{ fontSize: '2.6rem', fontWeight: '800', color: '#10b981', lineHeight: '1' }}>
                  <CountUp end={totalTuk} start={isStatsVisible} />
                </div>
              </div>
              <p>Fasilitas uji kompetensi terverifikasi yang tersebar untuk mewadahi berbagai sektor industri.</p>
            </div>

            <div className="visual-card" data-aos="fade-up" data-aos-delay="200">
              <h4>Skema Tersertifikasi</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px 0' }}>
                <div style={{ width: '65px', height: '65px', background: '#fef3c7', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontSize: '2rem' }}>
                  <i className="fas fa-award"></i>
                </div>
                <div style={{ fontSize: '2.6rem', fontWeight: '800', color: '#f59e0b', lineHeight: '1' }}>
                  <CountUp end={totalSkemaDinamis} start={isStatsVisible} />
                </div>
              </div>
              <p>Pilihan skema kompetensi aktif yang mencakup sektor TIK, Manufaktur, hingga Pariwisata.</p>
            </div>

            <div className="visual-card" data-aos="fade-up" data-aos-delay="300">
              <h4>Skema Paling Banyak Diuji</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px', marginTop: '-5px' }}>Distribusi asesi terbanyak berdasarkan peminatan.</p>
              <div className="bars-list" style={{ gap: '22px' }}>
                {topSkema.length > 0 ? topSkema.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className={`fas ${item.icon}`} style={{ color: item.color }}></i> {item.nama}
                      </span>
                      <span style={{ color: item.color }}><CountUp end={item.asesi} start={isStatsVisible} /> Asesi</span>
                    </div>
                    <div className="bars-track" style={{ height: '10px' }}>
                      <div className="bars-fill" style={{ width: isStatsVisible ? `${item.percentage}%` : '0%', backgroundColor: item.color, transition: `width 1.5s ease-out 0.${4 + (idx * 2)}s` }}></div>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '15px 0', color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Belum ada data uji kompetensi
                  </div>
                )}
              </div>
            </div>

            <div className="visual-card card-wide" data-aos="fade-up" data-aos-delay="400">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h4>Grafik Jumlah Uji Setiap Bulan</h4>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}>Rekapitulasi volume pelaksanaan uji kompetensi sepanjang tahun.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '50px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#0056b3', borderRadius: '50%' }}></div> Total Asesi
                  </span>
                </div>
              </div>

              <div className="line-chart-box" style={{ width: '100%', height: '220px', paddingLeft: '0', background: 'transparent' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={grafikBulan} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, maxTotalBulanan + 20]} />
                    <Tooltip
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '5px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total Asesi"
                      stroke="#0056b3"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#0056b3', stroke: '#fff', strokeWidth: 2 }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="tentang" className="section-padding" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div className="tentang-img" data-aos="fade-right">
            <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1470&auto=format&fit=crop" alt="Kegiatan Asesmen" style={{ width: '100%', borderRadius: '12px', border: '5px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
          </div>
          <div className="tentang-text" data-aos="fade-left">
            <h4 className="tentang-subtitle">Tentang Lembaga</h4>
            <h2 className="section-title tentang-title">LSP BLK Surabaya</h2>
            <p style={{ lineHeight: '1.8', color: '#475569', marginBottom: '15px' }}>
              Lembaga Sertifikasi Profesi (LSP) BLK Surabaya adalah mitra strategis industri dalam menjamin mutu dan kompetensi calon tenaga kerja.
            </p>
            <p style={{ lineHeight: '1.8', color: '#475569', marginBottom: '25px' }}>
              Berada di bawah naungan Dinas Tenaga Kerja dan Transmigrasi Provinsi Jawa Timur, setiap sertifikat yang kami terbitkan adalah bukti sah bahwa pemegangnya telah memenuhi standar kompetensi industri nasional maupun internasional.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, color: '#0f172a', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '10px' }}></i> Sertifikat Resmi BNSP Garuda Emas</li>
              <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '10px' }}></i> Standar Penilaian Sesuai Kebutuhan Industri</li>
              <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '10px' }}></i> Asesor Independen dan Berpengalaman</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="skema" className="section-padding">
        <div className="container">
          <div data-aos="fade-up" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ marginBottom: '15px' }}>
              <span className="skema-badge" style={{ fontSize: '0.9rem', padding: '8px 18px' }}>
                <i className="fas fa-award" style={{ marginRight: '8px' }}></i> Tersedia Total {totalSkemaDinamis} Skema Tersertifikasi
              </span>
            </div>
            <h2 className="section-title" style={{ margin: '0 0 10px 0' }}>Informasi Skema Sertifikasi</h2>
            <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '700px' }}>
              Kami menyediakan tenaga kerja bersertifikat dari berbagai sektor. Berikut adalah bidang kompetensi utama yang kami validasi.
            </p>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', width: '100%' }}>
              <h3 style={{ color: '#64748b' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '10px' }}></i>
                Mengambil data dari server...
              </h3>
            </div>
          ) : apiError ? (
            <div style={{ textAlign: 'center', padding: '40px 0', width: '100%' }}>
              <h3 style={{ color: '#ef4444' }}><i className="fas fa-exclamation-triangle"></i> Gagal Memuat Data</h3>
              <p style={{ color: '#64748b' }}>{apiError}</p>
            </div>
          ) : (
            <div className="grid-3">
              {dataSkema.slice(0, 3).map((item, index) => (
                <div key={index} className="feature-card" data-aos="fade-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div className="icon" style={{ fontSize: '2.5rem', color: '#0056b3', marginBottom: '15px' }}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#212529', marginBottom: '12px' }}>{item.kategori}</h3>
                    <span style={{ backgroundColor: '#e7f1ff', color: '#0056b3', padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {item.total} Skema
                    </span>
                  </div>
                  <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <button onClick={() => openModal(item)} className="btn-see-more">
                      Lihat Detail Skema
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '50px', textAlign: 'center' }} data-aos="fade-up">
            <Link to="/daftar-skema" className="btn-main" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              Lihat Semua Skema
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION: ANALISIS SENTIMEN KOMENTAR @uptblksurabaya
          ================================================================ */}
      <section id="sentimen" className="sentiment-section section-padding">
        <div className="container">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="skema-badge" style={{ marginBottom: '15px', display: 'inline-flex' }}>
              <i className="fas fa-robot" style={{ marginRight: '8px' }}></i>
              Analisis Sentimen NLP — Program Pelatihan BLK
            </span>
            <h2 className="section-title">Apa Kata Masyarakat?</h2>
            <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto 30px' }}>
              Sistem NLP (Natural Language Processing) untuk menganalisis persepsi publik
              terhadap program pelatihan <strong>UPT BLK Surabaya</strong>.
              Tempel komentar Instagram di bawah untuk dianalisis secara otomatis.
            </p>
          </div>

          <div className="sentiment-paste-box" data-aos="fade-up">
            <div className="paste-box-header">
              <span className="paste-box-title">
                <i className="fas fa-paste" style={{ marginRight: '8px', color: '#0056b3' }}></i>
                {pasteMode ? 'Hasil Analisis Komentar' : 'Tempel Komentar Instagram'}
              </span>
              {pasteMode && (
                <button className="paste-reset-btn" onClick={resetToDemo}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '6px' }}></i>
                  Kembali ke Demo
                </button>
              )}
            </div>

            {!pasteMode && (
              <div className="paste-input-area">
                <textarea
                  className="paste-textarea"
                  placeholder={`Tempel semua komentar Instagram di sini — langsung select all & paste!\n\n`}
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  rows={7}
                />
                <div className="paste-action-row">
                  <span className="paste-hint">
                    <i className="fas fa-magic"></i>
                    {(() => {
                      const n = parseInstagramPaste(pasteText).length;
                      return n > 0
                        ? `${n} komentar terdeteksi (metadata IG otomatis dibersihkan)`
                        : 'Tempel komentar Instagram di atas';
                    })()}
                  </span>
                  <button
                    className="paste-analyze-btn"
                    onClick={analyzePastedComments}
                    disabled={pasteLoading || parseInstagramPaste(pasteText).length === 0}
                  >
                    {pasteLoading
                      ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Menganalisis...</>
                      : <><i className="fas fa-brain" style={{ marginRight: '8px' }}></i>Analisis Komentar</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {sentimentError ? (
            <div className="sentiment-error-box" data-aos="fade-up">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Server analisis tidak terjangkau. Pastikan <code>index.py</code> sedang berjalan.</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{sentimentError}</p>
              <button className="btn-see-more" style={{ marginTop: '12px', maxWidth: '200px' }} onClick={fetchDemoSentiment}>
                Coba Lagi
              </button>
            </div>
          ) : sentimentLoading ? (
            <div className="sentiment-loading-box" data-aos="fade-up">
              <div className="sentiment-spinner"></div>
              <p>Memuat data komentar...</p>
            </div>
          ) : (
            <>
              {sentimentStats && (
                <div className="sentiment-stats-row" data-aos="fade-up">
                  <div className="sentiment-stat-card sentiment-total">
                    <div className="sent-icon-wrap" style={{ background: '#e7f1ff' }}>
                      <i className="fas fa-comments" style={{ color: '#0056b3' }}></i>
                    </div>
                    <div className="sent-stat-number" style={{ color: '#0056b3' }}>{sentimentStats.total_comments}</div>
                    <div className="sent-stat-label">Total Komentar Dianalisis</div>
                  </div>
                  <div className="sentiment-stat-card sentiment-pos">
                    <div className="sent-icon-wrap" style={{ background: '#d1fae5' }}>
                      <i className="fas fa-thumbs-up" style={{ color: '#10b981' }}></i>
                    </div>
                    <div className="sent-stat-number" style={{ color: '#10b981' }}>{sentimentStats.positif}</div>
                    <div className="sent-stat-label">Positif ({sentimentStats.persen_positif}%)</div>
                  </div>
                  <div className="sentiment-stat-card sentiment-neg">
                    <div className="sent-icon-wrap" style={{ background: '#fee2e2' }}>
                      <i className="fas fa-thumbs-down" style={{ color: '#ef4444' }}></i>
                    </div>
                    <div className="sent-stat-number" style={{ color: '#ef4444' }}>{sentimentStats.negatif}</div>
                    <div className="sent-stat-label">Negatif ({sentimentStats.persen_negatif}%)</div>
                  </div>
                  <div className="sentiment-stat-card">
                    <div className="sent-icon-wrap" style={{ background: '#f1f5f9' }}>
                      <i className="fas fa-minus-circle" style={{ color: '#64748b' }}></i>
                    </div>
                    <div className="sent-stat-number" style={{ color: '#64748b' }}>{sentimentStats.netral ?? 0}</div>
                    <div className="sent-stat-label">Netral ({sentimentStats.persen_netral ?? 0}%)</div>
                  </div>
                  <div className="sentiment-stat-card sentiment-overall">
                    <div className="sent-icon-wrap" style={{ background: sentimentStats.sentiment_overall === 'positif' ? '#d1fae5' : sentimentStats.sentiment_overall === 'negatif' ? '#fee2e2' : '#f1f5f9' }}>
                      <i className={`fas ${sentimentStats.sentiment_overall === 'positif' ? 'fa-smile' : sentimentStats.sentiment_overall === 'negatif' ? 'fa-frown' : 'fa-meh'}`}
                        style={{ color: sentimentStats.sentiment_overall === 'positif' ? '#10b981' : sentimentStats.sentiment_overall === 'negatif' ? '#ef4444' : '#64748b' }}></i>
                    </div>
                    <div className="sent-stat-number" style={{ color: sentimentStats.sentiment_overall === 'positif' ? '#10b981' : sentimentStats.sentiment_overall === 'negatif' ? '#ef4444' : '#64748b', textTransform: 'capitalize', fontSize: '1.4rem' }}>
                      {sentimentStats.sentiment_overall}
                    </div>
                    <div className="sent-stat-label">Sentimen Keseluruhan</div>
                  </div>
                </div>
              )}

              <div className="sentiment-main-grid" data-aos="fade-up" data-aos-delay="100">
                {sentimentStats && (
                  <div className="sentiment-donut-card">
                    <h4><i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#0056b3' }}></i>Distribusi Sentimen</h4>
                    <div className="donut-chart-wrap">
                      <div className="css-donut" style={{
                        background: `conic-gradient(
                          #10b981 0 ${sentimentStats.persen_positif}%,
                          #ef4444 ${sentimentStats.persen_positif}% ${sentimentStats.persen_positif + sentimentStats.persen_negatif}%,
                          #94a3b8 ${sentimentStats.persen_positif + sentimentStats.persen_negatif}% 100%
                        )`
                      }}>
                        <div className="css-donut-hole">
                          <span className="donut-pct">{sentimentStats.persen_positif}%</span>
                          <span className="donut-sub">Positif</span>
                        </div>
                      </div>
                    </div>
                    <div className="donut-legend">
                      <span><span className="legend-dot" style={{ background: '#10b981' }}></span>Positif ({sentimentStats.positif})</span>
                      <span><span className="legend-dot" style={{ background: '#ef4444' }}></span>Negatif ({sentimentStats.negatif})</span>
                      <span><span className="legend-dot" style={{ background: '#94a3b8' }}></span>Netral ({sentimentStats.netral ?? 0})</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '15px', textAlign: 'center' }}>
                      <i className="fab fa-instagram" style={{ marginRight: '4px' }}></i>
                      @uptblksurabaya
                    </p>
                  </div>
                )}

                <div className="sentiment-comments-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0 }}><i className="fas fa-comment-dots" style={{ marginRight: '8px', color: '#0056b3' }}></i>Komentar Terbaru</h4>
                    <div className="sentiment-filter-wrapper">
                      <button
                        className="sentiment-filter-select"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                      >
                        <span>
                          {sentimentFilter === 'all' ? 'Semua Sentimen' :
                            sentimentFilter === 'positif' ? 'Positif' :
                              sentimentFilter === 'negatif' ? 'Negatif' : 'Netral'}
                        </span>
                        <i className={`fas fa-chevron-down filter-icon ${isFilterOpen ? 'open' : ''}`}></i>
                      </button>

                      <div className={`custom-dropdown-menu ${isFilterOpen ? 'show' : ''}`}>
                        <div className={`custom-dropdown-item ${sentimentFilter === 'all' ? 'active' : ''}`} onClick={() => { setSentimentFilter('all'); setIsFilterOpen(false); }}>Semua Sentimen</div>
                        <div className={`custom-dropdown-item ${sentimentFilter === 'positif' ? 'active' : ''}`} onClick={() => { setSentimentFilter('positif'); setIsFilterOpen(false); }}>Positif</div>
                        <div className={`custom-dropdown-item ${sentimentFilter === 'negatif' ? 'active' : ''}`} onClick={() => { setSentimentFilter('negatif'); setIsFilterOpen(false); }}>Negatif</div>
                        <div className={`custom-dropdown-item ${sentimentFilter === 'netral' ? 'active' : ''}`} onClick={() => { setSentimentFilter('netral'); setIsFilterOpen(false); }}>Netral</div>
                      </div>
                    </div>
                  </div>
                  <div className="sentiment-feed">
                    {sentimentComments.filter(c => {
                      if (sentimentFilter === 'all') return true;
                      if (sentimentFilter === 'positif') return c.sentiment.score === 1;
                      if (sentimentFilter === 'negatif') return c.sentiment.score === 0;
                      if (sentimentFilter === 'netral') return c.sentiment.score === 2;
                      return true;
                    }).length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>Belum ada komentar.</p>
                    ) : (
                      sentimentComments.filter(c => {
                        if (sentimentFilter === 'all') return true;
                        if (sentimentFilter === 'positif') return c.sentiment.score === 1;
                        if (sentimentFilter === 'negatif') return c.sentiment.score === 0;
                        if (sentimentFilter === 'netral') return c.sentiment.score === 2;
                        return true;
                      }).map((c, idx) => (
                        <div key={c.id || idx} className={`sentiment-comment-item ${c.sentiment.score === 1 ? 'item-pos' : c.sentiment.score === 0 ? 'item-neg' : ''}`}>
                          <div className="comment-item-header">
                            <span className="comment-item-user">
                              <i className="fab fa-instagram" style={{ marginRight: '4px', fontSize: '0.8rem' }}></i>
                              @{c.username}
                            </span>
                            <span className={`comment-item-badge ${c.sentiment.score === 1 ? 'badge-pos' : c.sentiment.score === 0 ? 'badge-neg' : 'badge-netral'}`}>
                              {c.sentiment.score === 1 ? '✓ Positif' : c.sentiment.score === 0 ? '✗ Negatif' : '○ Netral'}
                            </span>
                          </div>
                          <p className="comment-item-text">"{c.text}"</p>
                          <div className="comment-item-footer">
                            <span>{c.sentiment.confidence}% keyakinan</span>
                            <span>{new Date(c.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </section>

      <footer className="footer-section">
        <div className="container grid-footer">
          <div className="footer-about">
            <h4 className="brand">LSP BLK SURABAYA</h4>
            <p>Mencetak tenaga kerja profesional yang kompeten dan bersertifikat BNSP untuk masa depan Jawa Timur.</p>
            <div className="social-links-footer">
              <a href="https://www.instagram.com/uptblksurabaya" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://web.facebook.com/blksurabaya/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
              <a href="https://www.youtube.com/@uptblksurabaya5838" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Tautan Cepat</h4>
            <ul>
              <li><a href="#hero">Beranda</a></li>
              <li><a href="#tentang">Tentang Lembaga</a></li>
              <li><Link to="/daftar-skema">Informasi Skema</Link></li>
              <li><Link to="/cek-sertifikat">Verifikasi Sertifikat</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Hubungi Kami</h4>
            <p><i className="fas fa-map-marker-alt"></i> Jl. Dukuh Menanggal III/29, Surabaya</p>
            <p><i className="fas fa-phone"></i> (031) 8290071</p>
            <p><i className="fas fa-envelope"></i> lsp.blksurabaya@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <div className="container">
            <p>&copy; 2026 LSP UPT Balai Latihan Kerja Surabaya - Dinas Tenaga Kerja dan Transmigrasi Provinsi Jawa Timur</p>
          </div>
        </div>
      </footer>

      {selectedSkema && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-times" style={{ position: 'relative', zIndex: 5 }}></i>
            </button>
            <div className="modal-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
              <div className="skema-card-icon" style={{ margin: '0 auto 15px', width: '60px', height: '60px', fontSize: '1.8rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas ${selectedSkema.icon}`}></i>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 10px 0' }}>{selectedSkema.kategori}</h3>
              <span style={{ backgroundColor: '#e7f1ff', color: '#0056b3', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {selectedSkema.total} Skema Tersedia
              </span>
            </div>
            <div className="modal-body">
              <ul className="skema-list-popup">
                {selectedSkema.list.map((skema, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check-circle"></i>
                    <span>{skema}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;