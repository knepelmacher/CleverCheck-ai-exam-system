import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/* ===================================================================
   PROGRESS BAR — fills up over the auto-play interval
   =================================================================== */
const ProgressBar = ({ active, total, duration }: { active: number; total: number; duration: number }) => (
  <div className="home-progress-track" aria-label="התקדמות המצגת">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`home-progress-segment${i < active ? ' done' : ''}${i === active ? ' active' : ''}`}
        style={i === active ? { animationDuration: `${duration}ms` } : undefined}
      />
    ))}
  </div>
);

/* ===================================================================
   DOTS NAVIGATION
   =================================================================== */
const DotsNav = ({
  total,
  active,
  onJump,
}: {
  total: number;
  active: number;
  onJump: (i: number) => void;
}) => (
  <div className="home-dots" aria-label="ניווט בעמוד">
    {Array.from({ length: total }, (_, i) => (
      <button
        key={i}
        className={`home-dot${i === active ? ' active' : ''}`}
        onClick={() => onJump(i)}
        aria-label={`עבור לחלק ${i + 1}`}
      />
    ))}
  </div>
);

/* ===================================================================
   SCREEN 1 — HERO: Jumping Student + Floating "100"
   =================================================================== */
const HeroIllustration = () => (
  <svg
    className="hero-illustration"
    viewBox="0 0 460 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background glow */}
    <ellipse cx="230" cy="280" rx="180" ry="30" fill="#fed7aa" opacity="0.4" />

    {/* Stars / sparkles */}
    <g className="hero-stars">
      <circle cx="80" cy="40" r="5" fill="#fbbf24" opacity="0.7" />
      <circle cx="360" cy="60" r="4" fill="#fbbf24" opacity="0.6" />
      <circle cx="120" cy="20" r="3" fill="#f59e0b" opacity="0.5" />
      <circle cx="340" cy="30" r="5" fill="#fbbf24" opacity="0.7" />
      <circle cx="50" cy="90" r="3" fill="#f59e0b" opacity="0.4" />
      <circle cx="400" cy="100" r="4" fill="#fbbf24" opacity="0.5" />
    </g>

    {/* Student figure — grouped for float animation */}
    <g className="hero-student">
      {/* Body */}
      <rect x="205" y="130" width="50" height="60" rx="25" fill="#f97316" />
      {/* Head */}
      <circle cx="230" cy="95" r="35" fill="#fcd34d" stroke="#f97316" strokeWidth="3" />
      {/* Eyes */}
      <ellipse cx="218" cy="90" rx="5" ry="6" fill="#1f2937" />
      <ellipse cx="242" cy="90" rx="5" ry="6" fill="#1f2937" />
      {/* Smile */}
      <path d="M218 105 Q230 118 242 105" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Blush */}
      <ellipse cx="208" cy="100" rx="6" ry="3" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="252" cy="100" rx="6" ry="3" fill="#fca5a5" opacity="0.5" />
      {/* Kippah */}
      <ellipse cx="230" cy="62" rx="28" ry="10" fill="#1e40af" />
      <rect x="202" y="55" width="56" height="8" rx="4" fill="#1e40af" />
      {/* Arms raised up */}
      <g stroke="#fcd34d" strokeWidth="8" strokeLinecap="round">
        <line x1="205" y1="145" x2="175" y2="100" />
        <line x1="255" y1="145" x2="285" y2="100" />
      </g>
      {/* Hands */}
      <circle cx="175" cy="98" r="7" fill="#fcd34d" />
      <circle cx="285" cy="98" r="7" fill="#fcd34d" />
      {/* Legs */}
      <g stroke="#fcd34d" strokeWidth="9" strokeLinecap="round">
        <line x1="215" y1="185" x2="200" y2="230" />
        <line x1="245" y1="185" x2="260" y2="230" />
      </g>
      {/* Shoes */}
      <ellipse cx="195" cy="235" rx="14" ry="7" fill="#1f2937" />
      <ellipse cx="265" cy="235" rx="14" ry="7" fill="#1f2937" />
    </g>

    {/* Floating "100" score bubble */}
    <g className="hero-score">
      <circle cx="340" cy="70" r="32" fill="#f97316" />
      <text x="340" y="81" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800" fontFamily="system-ui">100</text>
    </g>

    {/* Tablet in hand area */}
    <rect x="280" y="130" width="50" height="35" rx="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
    <rect x="284" y="134" width="42" height="20" rx="2" fill="#93c5fd" />
    <text x="305" y="148" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="system-ui">GRADEX</text>
  </svg>
);

/* ===================================================================
   SCREEN 2 — PAIN: Bored Student + Clock + Calendar
   =================================================================== */
const PainIllustration = () => (
  <svg
    className="pain-illustration"
    viewBox="0 0 480 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Clock */}
    <g>
      <circle cx="160" cy="80" r="45" fill="#fff" stroke="#9ca3af" strokeWidth="3" />
      {/* Clock hands */}
      <g className="clock-pendulum">
        <line x1="160" y1="80" x2="160" y2="52" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <line x1="160" y1="80" x2="178" y2="85" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <circle cx="160" cy="80" r="5" fill="#f97316" />
      {/* Tick marks */}
      <line x1="160" y1="38" x2="160" y2="42" stroke="#1f2937" strokeWidth="2" />
      <line x1="160" y1="118" x2="160" y2="122" stroke="#1f2937" strokeWidth="2" />
      <line x1="118" y1="80" x2="122" y2="80" stroke="#1f2937" strokeWidth="2" />
      <line x1="198" y1="80" x2="202" y2="80" stroke="#1f2937" strokeWidth="2" />
    </g>

    {/* Calendar */}
    <g>
      <rect x="280" y="55" width="70" height="75" rx="8" fill="#fff" stroke="#9ca3af" strokeWidth="2.5" />
      <rect x="280" y="55" width="70" height="20" rx="8" fill="#f97316" />
      <rect x="280" y="67" width="70" height="8" fill="#f97316" />
      <text x="315" y="68" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="system-ui">אפריל</text>
      <text x="315" y="100" textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="system-ui">מחכה</text>
      <text x="315" y="118" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="800" fontFamily="system-ui">14</text>
      <text x="315" y="128" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="system-ui">ימים</text>
    </g>

    {/* Bored student */}
    <g className="pain-student">
      {/* Chair */}
      <rect x="60" y="220" width="50" height="8" rx="4" fill="#9ca3af" />
      <rect x="75" y="228" width="20" height="40" rx="3" fill="#9ca3af" />
      {/* Body sitting */}
      <rect x="65" y="155" width="40" height="60" rx="20" fill="#d1d5db" />
      {/* Head */}
      <circle cx="85" cy="120" r="30" fill="#fcd34d" stroke="#9ca3af" strokeWidth="3" />
      {/* Tired eyes */}
      <line x1="73" y1="115" x2="81" y2="118" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="89" y1="118" x2="97" y2="115" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
      {/* Straight mouth (bored) */}
      <line x1="75" y1="132" x2="95" y2="132" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      {/* Kippah */}
      <ellipse cx="85" cy="92" rx="24" ry="8" fill="#1e40af" />
      <rect x="61" y="86" width="48" height="7" rx="3" fill="#1e40af" />
      {/* Arm resting on table */}
      <g stroke="#fcd34d" strokeWidth="7" strokeLinecap="round">
        <line x1="100" y1="170" x2="130" y2="200" />
      </g>
    </g>

    {/* Desk */}
    <rect x="100" y="205" width="100" height="8" rx="4" fill="#9ca3af" />
    <rect x="115" y="195" width="70" height="12" rx="3" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
    {/* Test paper on desk */}
    <rect x="125" y="185" width="50" height="12" rx="2" fill="#fff" stroke="#d1d5db" strokeWidth="1" />

    {/* Question marks floating */}
    <text x="175" y="145" fill="#9ca3af" fontSize="28" fontWeight="800" fontFamily="system-ui" opacity="0.5">?</text>
    <text x="350" y="190" fill="#9ca3af" fontSize="24" fontWeight="800" fontFamily="system-ui" opacity="0.4">?</text>
  </svg>
);

/* ===================================================================
   SCREEN 3 — MAGIC: Robot Processing Test
   =================================================================== */
const MagicIllustration = () => (
  <svg
    className="magic-illustration"
    viewBox="0 0 500 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Test paper (left side — slides into robot) */}
    <g className="paper-in">
      <rect x="30" y="120" width="70" height="90" rx="6" fill="#fff" stroke="#9ca3af" strokeWidth="2" />
      <line x1="40" y1="140" x2="90" y2="140" stroke="#d1d5db" strokeWidth="2" />
      <line x1="40" y1="150" x2="85" y2="150" stroke="#d1d5db" strokeWidth="2" />
      <line x1="40" y1="160" x2="80" y2="160" stroke="#d1d5db" strokeWidth="2" />
      <line x1="40" y1="170" x2="88" y2="170" stroke="#d1d5db" strokeWidth="2" />
      <line x1="40" y1="180" x2="75" y2="180" stroke="#d1d5db" strokeWidth="2" />
      <text x="65" y="200" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="system-ui">מבחן</text>
    </g>

    {/* Robot body */}
    <g>
      {/* Robot base */}
      <rect x="175" y="160" width="150" height="100" rx="20" fill="#f97316" stroke="#ea580c" strokeWidth="3" />
      {/* Robot head */}
      <rect x="195" y="95" width="110" height="75" rx="18" fill="#fcd34d" stroke="#ea580c" strokeWidth="3" />
      {/* Antenna */}
      <line x1="250" y1="95" x2="250" y2="60" stroke="#9ca3af" strokeWidth="3" />
      <circle cx="250" cy="55" r="8" fill="#ef4444" />
      <circle cx="250" cy="55" r="4" fill="#fca5a5" className="magic-spark" />
      {/* Eyes */}
      <g>
        <circle cx="225" cy="125" r="12" fill="#fff" stroke="#1f2937" strokeWidth="2" />
        <circle cx="275" cy="125" r="12" fill="#fff" stroke="#1f2937" strokeWidth="2" />
        <ellipse cx="225" cy="125" rx="4" ry="8" fill="#1f2937" className="robot-eye" />
        <ellipse cx="275" cy="125" rx="4" ry="8" fill="#1f2937" className="robot-eye" />
      </g>
      {/* Mouth — smile */}
      <path d="M230 145 Q250 158 270 145" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Body details */}
      <rect x="210" y="185" width="80" height="40" rx="8" fill="#fff" opacity="0.3" />
      {/* Gears inside */}
      <g className="robot-gear">
        <circle cx="225" cy="205" r="14" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="6 3" />
      </g>
      <g className="robot-gear" style={{ animationDirection: 'reverse', animationDuration: '3s' }}>
        <circle cx="275" cy="205" r="10" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="5 3" />
      </g>
      {/* Processing text */}
      <text x="250" y="235" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="system-ui">בודק...</text>
      {/* Arms */}
      <g className="robot-arm" stroke="#ea580c" strokeWidth="8" strokeLinecap="round">
        <line x1="175" y1="170" x2="145" y2="145" />
        <line x1="325" y1="170" x2="355" y2="145" />
      </g>
      {/* Robot legs/wheels */}
      <rect x="200" y="260" width="30" height="15" rx="7" fill="#d1d5db" />
      <rect x="270" y="260" width="30" height="15" rx="7" fill="#d1d5db" />
    </g>

    {/* Graded paper (right side — slides out) */}
    <g className="paper-out">
      <rect x="400" y="110" width="70" height="90" rx="6" fill="#fff" stroke="#22c55e" strokeWidth="2" />
      <line x1="410" y1="135" x2="460" y2="135" stroke="#d1d5db" strokeWidth="2" />
      <text x="435" y="150" textAnchor="middle" fill="#22c55e" fontSize="22" fontWeight="800" fontFamily="system-ui">100</text>
      <text x="435" y="170" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="system-ui">✔ נבדק</text>
      <text x="435" y="190" textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="700" fontFamily="system-ui">מעולה!</text>
    </g>

    {/* Stopwatch */}
    <g>
      <circle cx="435" cy="55" r="24" fill="#1f2937" />
      <circle cx="435" cy="55" r="20" fill="#fff" />
      <text x="435" y="61" textAnchor="middle" fill="#1f2937" fontSize="13" fontWeight="800" fontFamily="monospace">00:04</text>
    </g>

    {/* Sparkles around robot */}
    <g className="magic-spark">
      <circle cx="150" cy="100" r="4" fill="#fbbf24" />
      <circle cx="350" cy="95" r="3" fill="#fbbf24" />
      <circle cx="300" cy="80" r="5" fill="#f59e0b" />
      <circle cx="165" cy="250" r="3" fill="#fbbf24" />
    </g>
  </svg>
);

/* ===================================================================
   SCREEN 4 — RESULTS: Computer Screen + Graphs + Happy Student
   =================================================================== */
const ResultsIllustration = () => (
  <svg
    className="results-illustration"
    viewBox="0 0 500 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Giant computer monitor */}
    <g>
      {/* Stand */}
      <rect x="220" y="250" width="60" height="10" rx="5" fill="#9ca3af" />
      <rect x="235" y="255" width="30" height="35" rx="4" fill="#9ca3af" />
      <rect x="210" y="285" width="80" height="6" rx="3" fill="#9ca3af" />
      {/* Screen */}
      <rect x="140" y="30" width="220" height="220" rx="12" fill="#1f2937" />
      <rect x="148" y="38" width="204" height="180" rx="6" fill="#f8fafc" />
      {/* Screen content — graphs */}
      {/* Bar chart 1 */}
      <rect x="165" y="130" width="28" height="80" rx="3" fill="#f97316" className="bar-grow" style={{ animationDelay: '0s' }} />
      {/* Bar chart 2 */}
      <rect x="200" y="90" width="28" height="120" rx="3" fill="#fbbf24" className="bar-grow" style={{ animationDelay: '0.2s' }} />
      {/* Bar chart 3 */}
      <rect x="235" y="110" width="28" height="100" rx="3" fill="#22c55e" className="bar-grow" style={{ animationDelay: '0.4s' }} />
      {/* Bar chart 4 */}
      <rect x="270" y="60" width="28" height="150" rx="3" fill="#f97316" className="bar-grow" style={{ animationDelay: '0.6s' }} />
      {/* Bar chart 5 */}
      <rect x="305" y="100" width="28" height="110" rx="3" fill="#fbbf24" className="bar-grow" style={{ animationDelay: '0.8s' }} />
      {/* Upward arrow */}
      <g className="result-star">
        <polygon points="320,40 305,60 315,60 315,80 325,80 325,60 335,60" fill="#22c55e" />
      </g>
      {/* Score label on screen */}
      <text x="250" y="55" textAnchor="middle" fill="#1f2937" fontSize="14" fontWeight="800" fontFamily="system-ui">התקדמות 📈</text>
    </g>

    {/* Happy student sitting in front */}
    <g className="result-student">
      {/* Body */}
      <rect x="55" y="190" width="44" height="55" rx="22" fill="#22c55e" opacity="0.9" />
      {/* Head */}
      <circle cx="77" cy="162" r="28" fill="#fcd34d" stroke="#22c55e" strokeWidth="2.5" />
      {/* Big happy eyes */}
      <ellipse cx="68" cy="158" rx="5" ry="6" fill="#1f2937" />
      <ellipse cx="88" cy="158" rx="5" ry="6" fill="#1f2937" />
      {/* Big smile */}
      <path d="M66 170 Q77 185 88 170" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Kippah */}
      <ellipse cx="77" cy="136" rx="22" ry="7" fill="#1e40af" />
      <rect x="55" y="130" width="44" height="6" rx="3" fill="#1e40af" />
      {/* Arms */}
      <g stroke="#fcd34d" strokeWidth="7" strokeLinecap="round">
        <line x1="55" y1="210" x2="35" y2="235" />
        <line x1="99" y1="210" x2="120" y2="230" />
      </g>
    </g>
  </svg>
);

/* ===================================================================
   SCREEN 5 — CTA: Group of Happy Students
   =================================================================== */
const CtaIllustration = () => (
  <svg
    className="cta-illustration"
    viewBox="0 0 420 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Student 1 (left) */}
    <g className="cta-student">
      <rect x="20" y="90" width="44" height="55" rx="22" fill="#f97316" />
      <circle cx="42" cy="62" r="28" fill="#fcd34d" stroke="#f97316" strokeWidth="2.5" />
      <ellipse cx="33" cy="58" rx="5" ry="6" fill="#1f2937" />
      <ellipse cx="53" cy="58" rx="5" ry="6" fill="#1f2937" />
      <path d="M31 70 Q42 83 53 70" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="42" cy="36" rx="22" ry="7" fill="#1e40af" />
      <rect x="20" y="30" width="44" height="6" rx="3" fill="#1e40af" />
      <g stroke="#fcd34d" strokeWidth="7" strokeLinecap="round">
        <line x1="20" y1="108" x2="0" y2="85" />
        <line x1="64" y1="108" x2="84" y2="85" />
      </g>
    </g>

    {/* Student 2 (center, slightly taller) */}
    <g className="cta-student" style={{ animationDelay: '0.35s' }}>
      <rect x="168" y="80" width="48" height="60" rx="24" fill="#fbbf24" />
      <circle cx="192" cy="48" r="32" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2.5" />
      <ellipse cx="180" cy="44" rx="5.5" ry="7" fill="#1f2937" />
      <ellipse cx="204" cy="44" rx="5.5" ry="7" fill="#1f2937" />
      <path d="M178 58 Q192 74 206 58" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="192" cy="18" rx="26" ry="8" fill="#1e40af" />
      <rect x="166" y="12" width="52" height="7" rx="3.5" fill="#1e40af" />
      <g stroke="#fcd34d" strokeWidth="7" strokeLinecap="round">
        <line x1="168" y1="100" x2="142" y2="70" />
        <line x1="216" y1="100" x2="242" y2="70" />
      </g>
    </g>

    {/* Student 3 (right) */}
    <g className="cta-student" style={{ animationDelay: '0.7s' }}>
      <rect x="340" y="88" width="46" height="57" rx="23" fill="#fb923c" />
      <circle cx="363" cy="60" r="29" fill="#fcd34d" stroke="#f97316" strokeWidth="2.5" />
      <ellipse cx="353" cy="56" rx="5" ry="6.5" fill="#1f2937" />
      <ellipse cx="373" cy="56" rx="5" ry="6.5" fill="#1f2937" />
      <path d="M351 68 Q363 81 375 68" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="363" cy="33" rx="23" ry="7" fill="#1e40af" />
      <rect x="340" y="27" width="46" height="6" rx="3" fill="#1e40af" />
      <g stroke="#fcd34d" strokeWidth="7" strokeLinecap="round">
        <line x1="340" y1="108" x2="320" y2="80" />
        <line x1="386" y1="108" x2="406" y2="80" />
      </g>
    </g>

    {/* Ground shadow */}
    <ellipse cx="210" cy="195" rx="180" ry="10" fill="#fed7aa" opacity="0.4" />
  </svg>
);

/* ===================================================================
   HOME PAGE COMPONENT — Auto-playing slideshow
   =================================================================== */
const SCREEN_COUNT = 5;
const AUTO_PLAY_MS = 5500; // time per screen

export const HomePage = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Move to the next screen; loop back to 0 after the last one
  const advance = () => setActiveScreen((prev) => (prev + 1) % SCREEN_COUNT);

  // Auto-play: advance every AUTO_PLAY_MS; pause on hover
  useEffect(() => {
    timerRef.current = setInterval(advance, AUTO_PLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const jumpTo = (index: number) => {
    setActiveScreen(index);
    // Reset the timer so the user's manual click doesn't get cut short
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, AUTO_PLAY_MS);
  };

  const pause = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resume = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, AUTO_PLAY_MS);
  };

  return (
    <div
      className="home-fullpage"
      ref={containerRef}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <ProgressBar active={activeScreen} total={SCREEN_COUNT} duration={AUTO_PLAY_MS} />
      <DotsNav total={SCREEN_COUNT} active={activeScreen} onJump={jumpTo} />

      {/* ================================================================
          SCREEN 1 — HERO
          ================================================================ */}
      <div className={`home-screen home-screen-1${activeScreen === 0 ? ' current' : ''}`}>
        <div className="home-logo-top home-fade-in d1">
          <img src="/logo.png" alt="GRADEX" />
        </div>
        <h1 className="home-screen-title home-fade-in d2">
          <span className="accent">GRADEX</span> — הבודק החכם
        </h1>
        <p className="home-screen-subtitle home-fade-in d3">
          מסיים מבחן — ומקבל ציון תוך שניות.<br />לא לחכות, לא להתלבט. פשוט לדעת.
        </p>
        <HeroIllustration />
        <Link to="/login" className="home-login-btn glow home-fade-in d4">
          התחברות
        </Link>
      </div>

      {/* ================================================================
          SCREEN 2 — THE PAIN
          ================================================================ */}
      <div className={`home-screen home-screen-2${activeScreen === 1 ? ' current' : ''}`}>
        <PainIllustration />
        <h2 className="home-screen-title home-fade-in d1">
          נמאס <span className="accent">לחכות?</span>
        </h2>
        <p className="home-screen-subtitle home-fade-in d2">
          מסרת מבחן ומחכה שבועות שהמורה תבדוק ותחזיר.
        </p>
        <p className="home-screen-desc home-fade-in d3">
          בינתיים אתה לא יודע איפה אתה עומד, לא יודע מה לשפר, וכל שיחה על ציונים נדחית.
        </p>
      </div>

      {/* ================================================================
          SCREEN 3 — THE MAGIC
          ================================================================ */}
      <div className={`home-screen home-screen-3${activeScreen === 2 ? ' current' : ''}`}>
        <MagicIllustration />
        <h2 className="home-screen-title home-fade-in d1">
          ה<span className="accent">קסם</span> קורה כאן
        </h2>
        <p className="home-screen-subtitle home-fade-in d2">
          המערכת בודקת את המבחן שלך בחכמה — תוך שניות מרגע ההגשה.
        </p>
        <p className="home-screen-desc home-fade-in d3">
          בדיקה מתקדמת שקוראת את התשובות שלך, מבינה, מעריכה, ומחזירה ציון מדויק.
        </p>
      </div>

      {/* ================================================================
          SCREEN 4 — THE RESULT
          ================================================================ */}
      <div className={`home-screen home-screen-4${activeScreen === 3 ? ' current' : ''}`}>
        <ResultsIllustration />
        <h2 className="home-screen-title home-fade-in d1">
          גרפים, סטטיסטיקות <span className="accent">והשוואה כיתתית</span>
        </h2>
        <p className="home-screen-subtitle home-fade-in d2">
          לא רק ציון — תמונה מלאה: איפה אתה ביחס לכיתה, מה השתפר, ולאן כדאי להתמקד הלאה.
        </p>
        <p className="home-screen-desc home-fade-in d3">
          מעקב התקדמות לאורך זמן, פירוט לכל שאלה, והבנה אמיתית של החוזקות שלך.
        </p>
      </div>

      {/* ================================================================
          SCREEN 5 — CALL TO ACTION
          ================================================================ */}
      <div className={`home-screen home-screen-5${activeScreen === 4 ? ' current' : ''}`}>
        <div className="cta-logo home-fade-in d1">
          <img src="/logo.png" alt="GRADEX" />
        </div>
        <CtaIllustration />
        <h2 className="home-screen-title home-fade-in d2">
          החלום של כל <span className="accent">תלמיד</span>
        </h2>
        <p className="home-screen-subtitle home-fade-in d3">
          GRADEX מגשימה את החלום. תתחיל עכשיו — הכול מחכה לך.
        </p>
        <Link to="/login" className="home-login-btn glow xl home-fade-in d4">
          התחל עכשיו
        </Link>
        <div className="home-footer">© 2026 GRADEX — הבודק החכם</div>
      </div>
    </div>
  );
};
