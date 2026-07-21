// import { Box, Button, Container, Stack, Typography, Paper, Grid } from '@mui/material'
// import { AutoFixHigh, Quiz, Speed, School, TrendingUp, Groups, Assessment, Psychology, Timeline, CheckCircle } from '@mui/icons-material'
// import { Link } from 'react-router-dom'
// import { keyframes } from '@mui/system'

// const float = keyframes`
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-12px); }
// `

// const pulse = keyframes`
//   0%, 100% { opacity: 0.7; transform: scale(1); }
//   50% { opacity: 1; transform: scale(1.05); }
// `

// const shimmer = keyframes`
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// `

// const fadeInUp = keyframes`
//   from { opacity: 0; transform: translateY(24px); }
//   to { opacity: 1; transform: translateY(0); }
// `

// const stats = [
//   { value: '1,200+', label: 'מורים פעילים', icon: <Groups /> },
//   { value: '45,000+', label: 'מבחנים נבדקו', icon: <Assessment /> },
//   { value: '98.2%', label: 'דיוק בדיקה', icon: <CheckCircle /> },
//   { value: '85%', label: 'חיסכון בזמן', icon: <Timeline /> },
// ]

// const features = [
//   {
//     icon: <AutoFixHigh sx={{ fontSize: 40 }} />,
//     color: '#ff7a00',
//     title: 'בדיקה אוטומטית',
//     description: 'בינה מלאכותית בודקת תשובות פתוחות ברמת דיוק גבוהה, חוסכת שעות של בדיקה ידנית.',
//   },
//   {
//     icon: <Quiz sx={{ fontSize: 40 }} />,
//     color: '#6366f1',
//     title: 'יצירת מבחנים חכמה',
//     description: 'בנה מבחנים אמריקאיים, פתוחים, מספריים ונכון/לא נכון בממשק אינטואיטיבי וידידותי.',
//   },
//   {
//     icon: <Speed sx={{ fontSize: 40 }} />,
//     color: '#22c55e',
//     title: 'תוצאות מיידיות',
//     description: 'התלמידים מקבלים ציונים ומשוב מיד עם סיום המבחן, ללא המתנה.',
//   },
//   {
//     icon: <School sx={{ fontSize: 40 }} />,
//     color: '#0891b2',
//     title: 'ניהול כיתות חכם',
//     description: 'נהל מורים, תלמידים, כיתות ומבחנים מלוח בקרה מרכזי אחד.',
//   },
//   {
//     icon: <TrendingUp sx={{ fontSize: 40 }} />,
//     color: '#8b5cf6',
//     title: 'מעקב התקדמות',
//     description: 'עקוב אחר ביצועי התלמידים לאורך זמן עם גרפים וסטטיסטיקות מפורטות.',
//   },
//   {
//     icon: <Psychology sx={{ fontSize: 40 }} />,
//     color: '#f43f5e',
//     title: 'הערכה מבוססת AI',
//     description: 'מנוע ה-NLP המתקדם מבין הקשר, סמנטיקה ושלילה — לא רק התאמת מילות מפתח.',
//   },
// ]

// export default function HomePage() {
//   return (
//     <Box sx={{ overflow: 'hidden' }}>
//       {/* ═══ HERO SECTION ═══ */}
//       <Box
//         sx={{
//           position: 'relative',
//           minHeight: { xs: 'auto', md: '92vh' },
//           display: 'flex',
//           alignItems: 'center',
//           background: 'linear-gradient(165deg, #0f0f1a 0%, #1a1030 30%, #1a0a20 60%, #0f0f1a 100%)',
//           py: { xs: 8, md: 12 },
//           overflow: 'hidden',
//         }}
//       >
//         {/* Animated background mesh */}
//         <Box
//           sx={{
//             position: 'absolute',
//             inset: 0,
//             background: 'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(255,122,0,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 30% 70%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 50%, rgba(255,122,0,0.06) 0%, transparent 100%)',
//             animation: `${pulse} 6s ease-in-out infinite`,
//           }}
//         />

//         {/* Floating gradient orbs */}
//         {[
//           { top: '10%', left: '5%', size: 280, color: 'rgba(255,122,0,0.15)', delay: '0s' },
//           { top: '60%', right: '8%', size: 220, color: 'rgba(99,102,241,0.10)', delay: '2s' },
//           { bottom: '15%', left: '40%', size: 160, color: 'rgba(34,197,94,0.08)', delay: '4s' },
//           { top: '25%', right: '30%', size: 120, color: 'rgba(255,122,0,0.10)', delay: '3s' },
//         ].map((orb, i) => (
//           <Box
//             key={i}
//             sx={{
//               position: 'absolute',
//               top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
//               width: orb.size, height: orb.size,
//               borderRadius: '50%',
//               background: orb.color,
//               filter: 'blur(60px)',
//               animation: `${float} ${8 + i * 2}s ease-in-out infinite`,
//               animationDelay: orb.delay,
//             }}
//           />
//         ))}

//         {/* Grid pattern overlay */}
//         <Box
//           sx={{
//             position: 'absolute', inset: 0, opacity: 0.04,
//             backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
//             backgroundSize: '60px 60px',
//           }}
//         />

//         <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
//           <Grid container spacing={6} alignItems="center">
//             {/* Left column */}
//             <Grid item xs={12} md={7}>
//               <Box sx={{ animation: `${fadeInUp} 0.8s ease-out` }}>
//                 {/* Badge */}
//                 <Box
//                   sx={{
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     gap: 1,
//                     px: 2,
//                     py: 0.8,
//                     mb: 3,
//                     borderRadius: 999,
//                     bgcolor: 'rgba(255,122,0,0.12)',
//                     border: '1px solid rgba(255,122,0,0.25)',
//                   }}
//                 >
//                   <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', animation: `${pulse} 2s ease-in-out infinite` }} />
//                   <Typography fontSize="0.85rem" color="rgba(255,255,255,0.85)" fontWeight={500}>
//                     המוצר המוביל לבדיקת מבחנים
//                   </Typography>
//                 </Box>

//                 <Typography
//                   variant="h1"
//                   sx={{
//                     fontSize: { xs: '2.2rem', md: '3.8rem' },
//                     fontWeight: 900,
//                     lineHeight: 1.15,
//                     mb: 2,
//                     background: 'linear-gradient(135deg, #ffffff 0%, #ff9d3d 40%, #ff7a00 70%, #ffffff 100%)',
//                     backgroundSize: '200% 100%',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent',
//                     animation: `${shimmer} 4s linear infinite`,
//                   }}
//                 >
//                   הבודק החכם שישנה את הדרך בה אתם מלמדים
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: { xs: '1.05rem', md: '1.2rem' },
//                     color: 'rgba(255,255,255,0.65)',
//                     mb: 5,
//                     maxWidth: 520,
//                     lineHeight: 1.8,
//                   }}
//                 >
//                   מערכת בדיקת מבחנים אוטומטית מבוססת AI — בנה מבחנים, בדוק תשובות פתוחות,
//                   וקבל תובנות מפורטות על ביצועי התלמידים. הכל במקום אחד.
//                 </Typography>

//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                   <Button
//                     component={Link}
//                     to="/login"
//                     variant="contained"
//                     size="large"
//                     sx={{
//                       px: 5,
//                       py: 1.6,
//                       fontSize: '1.05rem',
//                       fontWeight: 700,
//                       borderRadius: 3,
//                       background: 'linear-gradient(135deg, #ff7a00 0%, #ff5722 100%)',
//                       boxShadow: '0 8px 32px rgba(255,122,0,0.35)',
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         boxShadow: '0 12px 40px rgba(255,122,0,0.50)',
//                         transform: 'translateY(-2px)',
//                       },
//                     }}
//                   >
//                     התחל עכשיו — חינם
//                   </Button>
//                   <Button
//                     component={Link}
//                     to="/dashboard"
//                     variant="outlined"
//                     size="large"
//                     sx={{
//                       px: 5,
//                       py: 1.6,
//                       fontSize: '1.05rem',
//                       fontWeight: 700,
//                       borderRadius: 3,
//                       borderColor: 'rgba(255,255,255,0.25)',
//                       borderWidth: 2,
//                       color: 'white',
//                       backdropFilter: 'blur(4px)',
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         borderColor: 'rgba(255,255,255,0.5)',
//                         bgcolor: 'rgba(255,255,255,0.06)',
//                         transform: 'translateY(-2px)',
//                       },
//                     }}
//                   >
//                     צפה בדמו
//                   </Button>
//                 </Stack>
//               </Box>
//             </Grid>

//             {/* Right column — illustrations */}
//             <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
//               <Box sx={{ position: 'relative', height: 380, animation: `${fadeInUp} 1s ease-out 0.2s both` }}>
//                 {/* Floating dashboard preview card */}
//                 <Box
//                   sx={{
//                     position: 'absolute', top: 40, left: 0, right: 40,
//                     bgcolor: 'rgba(255,255,255,0.06)',
//                     backdropFilter: 'blur(16px)',
//                     border: '1px solid rgba(255,255,255,0.10)',
//                     borderRadius: 4,
//                     p: 3,
//                     animation: `${float} 5s ease-in-out infinite`,
//                   }}
//                 >
//                   <Stack spacing={1.5}>
//                     <Box sx={{ width: '60%', height: 10, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1 }} />
//                     <Box sx={{ width: '40%', height: 8, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
//                     <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
//                       {[0.7, 0.85, 0.45, 0.9].map((w, i) => (
//                         <Box
//                           key={i}
//                           sx={{
//                             flex: 1,
//                             height: 60 + i * 10,
//                             bgcolor: i === 3 ? 'rgba(255,122,0,0.5)' : 'rgba(255,255,255,0.10)',
//                             borderRadius: 2,
//                             animation: `${pulse} ${3 + i * 0.5}s ease-in-out infinite`,
//                             animationDelay: `${i * 0.3}s`,
//                           }}
//                         />
//                       ))}
//                     </Box>
//                   </Stack>
//                 </Box>

//                 {/* Floating AI chip */}
//                 <Box
//                   sx={{
//                     position: 'absolute', bottom: 60, right: 0,
//                     bgcolor: 'rgba(34,197,94,0.15)',
//                     backdropFilter: 'blur(8px)',
//                     border: '1px solid rgba(34,197,94,0.25)',
//                     borderRadius: 999,
//                     px: 2.5, py: 1,
//                     display: 'flex', alignItems: 'center', gap: 1,
//                     animation: `${float} 4s ease-in-out 1s infinite`,
//                   }}
//                 >
//                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e', animation: `${pulse} 1.5s ease-in-out infinite` }} />
//                   <Typography color="rgba(255,255,255,0.85)" fontSize="0.8rem" fontWeight={600}>
//                     AI • 98.2% דיוק
//                   </Typography>
//                 </Box>

//                 {/* Student figures */}
//                 <Box
//                   sx={{
//                     position: 'absolute', bottom: 0, left: 20,
//                     display: 'flex', gap: -1,
//                   }}
//                 >
//                   {['#ff7a00', '#6366f1', '#22c55e', '#f43f5e'].map((color, i) => (
//                     <Box
//                       key={i}
//                       sx={{
//                         width: 42, height: 42,
//                         borderRadius: '50%',
//                         bgcolor: color,
//                         border: '3px solid rgba(15,15,26,1)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontWeight: 700, fontSize: '0.75rem', color: 'white',
//                         animation: `${float} ${4 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
//                       }}
//                     >
//                       {['י', 'נ', 'ר', 'ד'][i]}
//                     </Box>
//                   ))}
//                   <Box
//                     sx={{
//                       width: 42, height: 42,
//                       borderRadius: '50%',
//                       bgcolor: 'rgba(255,255,255,0.10)',
//                       border: '3px solid rgba(15,15,26,1)',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       fontWeight: 700, fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)',
//                     }}
//                   >
//                     +12
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* ═══ STATS ROW ═══ */}
//       <Box
//         sx={{
//           position: 'relative',
//           mt: { xs: 0, md: -6 },
//           zIndex: 3,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={2}>
//             {stats.map((stat, i) => (
//               <Grid item xs={6} md={3} key={stat.label}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     textAlign: 'center',
//                     borderRadius: 4,
//                     border: '2px solid rgba(255, 122, 0, 0.14)',
//                     bgcolor: 'rgba(255,255,255,0.9)',
//                     backdropFilter: 'blur(16px)',
//                     boxShadow: '0 4px 24px rgba(255,122,0,0.06)',
//                     animation: `${fadeInUp} 0.6s ease-out ${0.1 + i * 0.1}s both`,
//                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                     '&:hover': {
//                       transform: 'translateY(-4px)',
//                       boxShadow: '0 8px 32px rgba(255,122,0,0.12)',
//                     },
//                   }}
//                 >
//                   <Box sx={{ color: 'primary.main', mb: 1, '& .MuiSvgIcon-root': { fontSize: 28 } }}>
//                     {stat.icon}
//                   </Box>
//                   <Typography variant="h4" fontWeight={800} fontSize="1.6rem" mb={0.5}>
//                     {stat.value}
//                   </Typography>
//                   <Typography color="text.secondary" fontSize="0.85rem">
//                     {stat.label}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* ═══ FEATURES SECTION ═══ */}
//       <Box sx={{ py: { xs: 8, md: 12 } }}>
//         <Container maxWidth="lg">
//           <Box textAlign="center" mb={8} sx={{ animation: `${fadeInUp} 0.6s ease-out` }}>
//             <Typography
//               variant="h2"
//               fontWeight={800}
//               fontSize={{ xs: '1.8rem', md: '2.5rem' }}
//               mb={1.5}
//             >
//               למה Gradex?
//             </Typography>
//             <Typography color="text.secondary" fontSize="1.1rem" maxWidth={500} mx="auto">
//               הפלטפורמה החכמה שהופכת את תהליך הבדיקה למהיר, מדויק ופשוט מתמיד
//             </Typography>
//           </Box>

//           <Grid container spacing={3}>
//             {features.map((feature, i) => (
//               <Grid item xs={12} sm={6} md={4} key={feature.title}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3.5,
//                     height: '100%',
//                     borderRadius: 4,
//                     border: '2px solid rgba(255, 122, 0, 0.10)',
//                     bgcolor: 'white',
//                     transition: 'all 0.35s ease',
//                     animation: `${fadeInUp} 0.5s ease-out ${0.1 + i * 0.08}s both`,
//                     '&:hover': {
//                       transform: 'translateY(-6px)',
//                       boxShadow: '0 16px 48px rgba(255,122,0,0.10)',
//                       borderColor: feature.color,
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 56,
//                       height: 56,
//                       borderRadius: 3,
//                       bgcolor: `${feature.color}15`,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       mb: 2,
//                       color: feature.color,
//                       transition: 'transform 0.3s ease',
//                       '&:hover': { transform: 'scale(1.1) rotate(-5deg)' },
//                     }}
//                   >
//                     {feature.icon}
//                   </Box>
//                   <Typography variant="h6" fontWeight={700} mb={1} fontSize="1.1rem">
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
//                     {feature.description}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* ═══ HOW IT WORKS ═══ */}
//       <Box sx={{ bgcolor: 'rgba(255,122,0,0.03)', py: { xs: 8, md: 12 } }}>
//         <Container maxWidth="lg">
//           <Box textAlign="center" mb={8}>
//             <Typography variant="h2" fontWeight={800} fontSize={{ xs: '1.8rem', md: '2.5rem' }} mb={1.5}>
//               איך זה עובד?
//             </Typography>
//             <Typography color="text.secondary" fontSize="1.1rem">
//               שלושה צעדים פשוטים לבדיקת מבחנים חכמה
//             </Typography>
//           </Box>

//           <Grid container spacing={4}>
//             {[
//               { step: '01', icon: <Quiz sx={{ fontSize: 36 }} />, title: 'צור מבחן', desc: 'בנה מבחן מכל סוג עם ממשק Drag & Drop ידידותי. הוסף שאלות אמריקאיות, פתוחות, מספריות ועוד.' },
//               { step: '02', icon: <Groups sx={{ fontSize: 36 }} />, title: 'שלח לתלמידים', desc: 'קבע מועד, שעה ומשך זמן. המבחן ייפתח אוטומטית בזמן שנקבע והתלמידים יקבלו התראה.' },
//               { step: '03', icon: <AutoFixHigh sx={{ fontSize: 36 }} />, title: 'קבל תוצאות', desc: 'ה-AI בודק תשובות פתוחות באופן מיידי. צפה בגרפים, סטטיסטיקות והתפלגות ציונים מפורטת.' },
//             ].map((item, i) => (
//               <Grid item xs={12} md={4} key={item.step}>
//                 <Box sx={{ textAlign: 'center', position: 'relative' }}>
//                   <Box
//                     sx={{
//                       width: 80, height: 80, borderRadius: '50%',
//                       bgcolor: 'primary.main',
//                       color: 'white',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       mx: 'auto', mb: 3,
//                       boxShadow: '0 8px 32px rgba(255,122,0,0.25)',
//                       position: 'relative',
//                       transition: 'transform 0.3s ease',
//                       '&:hover': { transform: 'scale(1.08)' },
//                     }}
//                   >
//                     {item.icon}
//                   </Box>
//                   <Typography
//                     sx={{
//                       position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%) translateX(-54px)',
//                       fontSize: '5rem', fontWeight: 900, color: 'rgba(255,122,0,0.04)',
//                       lineHeight: 1, pointerEvents: 'none',
//                     }}
//                   >
//                     {item.step}
//                   </Typography>
//                   <Typography variant="h5" fontWeight={700} mb={1}>
//                     {item.title}
//                   </Typography>
//                   <Typography color="text.secondary" maxWidth={280} mx="auto" lineHeight={1.8}>
//                     {item.desc}
//                   </Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* ═══ BOTTOM CTA ═══ */}
//       <Box
//         sx={{
//           position: 'relative',
//           py: { xs: 10, md: 14 },
//           textAlign: 'center',
//           overflow: 'hidden',
//           background: 'linear-gradient(165deg, #0f0f1a 0%, #1a1030 100%)',
//         }}
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             top: -100, left: '50%', transform: 'translateX(-50%)',
//             width: 500, height: 500,
//             borderRadius: '50%',
//             background: 'radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)',
//           }}
//         />
//         <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
//           <Box component="img" src="/logo.png" alt="Gradex" sx={{ height: 56, width: 'auto', mb: 3 }} />
//           <Typography
//             variant="h3"
//             fontWeight={800}
//             fontSize={{ xs: '1.6rem', md: '2.2rem' }}
//             mb={2}
//             color="white"
//           >
//             מוכן להתחיל לחסוך שעות של בדיקות?
//           </Typography>
//           <Typography color="rgba(255,255,255,0.55)" mb={5} fontSize="1.1rem" lineHeight={1.8}>
//             הצטרף לאלפי מורים שכבר חוסכים זמן יקר עם Gradex
//           </Typography>
//           <Button
//             component={Link}
//             to="/login"
//             variant="contained"
//             size="large"
//             sx={{
//               px: 7,
//               py: 1.8,
//               fontSize: '1.1rem',
//               fontWeight: 700,
//               borderRadius: 3,
//               background: 'linear-gradient(135deg, #ff7a00 0%, #ff5722 100%)',
//               boxShadow: '0 8px 40px rgba(255,122,0,0.40)',
//               transition: 'all 0.3s ease',
//               '&:hover': {
//                 boxShadow: '0 12px 48px rgba(255,122,0,0.55)',
//                 transform: 'translateY(-2px)',
//               },
//             }}
//           >
//             התחל עכשיו — חינם
//           </Button>
//         </Container>
//       </Box>
//     </Box>
//   )
// }


import { Box, Button, Container, Stack, Typography, Paper, Grid } from '@mui/material'
import { AutoFixHigh, Quiz, Speed, School, TrendingUp } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: <AutoFixHigh sx={{ fontSize: 48 }} />,
    title: 'בדיקה אוטומטית',
    description: 'בינה מלאכותית בודקת תשובות פתוחות ברמת דיוק גבוהה, חוסכת שעות של בדיקה ידנית.',
  },
  {
    icon: <Quiz sx={{ fontSize: 48 }} />,
    title: 'יצירת מבחנים חכמה',
    description: 'בנה מבחנים אמריקאיים, פתוחים, מספריים ונכון/לא נכון בממשק אינטואיטיבי וידידותי.',
  },
  {
    icon: <Speed sx={{ fontSize: 48 }} />,
    title: 'תוצאות מיידיות',
    description: 'התלמידים מקבלים ציונים ומשוב מיד עם סיום המבחן, ללא המתנה.',
  },
  {
    icon: <School sx={{ fontSize: 48 }} />,
    title: 'ניהול כיתות חכם',
    description: 'נהל מורים, תלמידים, כיתות ומבחנים מלוח בקרה מרכזי אחד.',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 48 }} />,
    title: 'מעקב התקדמות',
    description: 'עקוב אחר ביצועי התלמידים לאורך זמן עם גרפים וסטטיסטיקות מפורטות.',
  },
]

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff7a00 0%, #ff5722 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.08)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -40,
            width: 250,
            height: 250,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.06)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Gradex"
            sx={{ height: { xs: 64, md: 88 }, width: 'auto', mb: 2, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          />
          <Typography variant="h5" mb={4} sx={{ opacity: 0.92, fontWeight: 400, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            מערכת בדיקת מבחנים אוטומטית מבוססת AI — חוסכת זמן, משפרת דיוק, ומאפשרת לך להתמקד בהוראה
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#ff7a00',
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              '&:hover': { bgcolor: '#fff3e0' },
            }}
          >
            התחבר עכשיו
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" mb={1}>
          למה Gradex?
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" mb={6} sx={{ maxWidth: 600, mx: 'auto' }}>
          הפלטפורמה החכמה שהופכת את תהליך הבדיקה למהיר, מדויק ופשוט מתמיד
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bottom CTA */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} mb={2}>
            מוכן להתחיל?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            הצטרף לאלפי מורים שכבר חוסכים זמן יקר עם Gradex
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{ px: 6, py: 1.5, fontSize: '1.1rem', fontWeight: 700, borderRadius: 3 }}
          >
            כניסה למערכת
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
