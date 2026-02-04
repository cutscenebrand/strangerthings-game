import { QuizConfig, Question, Language } from './types';

export const APP_NAME = "SCENE CHALLENGE";

export const QUIZ_CONFIG: QuizConfig = {
  levels: [
    { difficulty: 'Easy', reward: 2 },       // Q1
    { difficulty: 'Easy', reward: 2 },       // Q2
    { difficulty: 'Medium', reward: 3 },     // Q3
    { difficulty: 'Medium', reward: 3 },     // Q4
    { difficulty: 'Hard', reward: 3 },       // Q5
    { difficulty: 'Expert', reward: 4 },     // Q6
    { difficulty: 'Nightmare', reward: 4 },  // Q7
    { difficulty: 'Impossible', reward: 4 }, // Q8
  ]
};

export const TRANSLATIONS = {
  en: {
    startBtn: "Start The Scene",
    tagline1: "Not Just A Cut",
    tagline2: "It's A Story",
    quote: "\"You either die a hero, or you live long enough to see yourself become the villain.\"",
    enterTitle: "Enter The Story",
    enterWarning: "Warning:",
    enterDesc: "Wrong answers lock your discount immediately. Reach the end for 25%.",
    levels: "Levels",
    maxReward: "Max Reward",
    enterBtn: "Enter Now",
    loading: "LOADING",
    identifyTitle: "Identify Yourself",
    identifyDesc: "Enter your details to generate your Scene ID.",
    nameLabel: "Codename / Name",
    phoneLabel: "Transmission Line (Phone)",
    registerBtn: "Register ID",
    abortBtn: "Abort",
    verifying: "Verifying...",
    scene: "Scene",
    finalScene: "Final Scene",
    answerPrompt: "Answer correctly to proceed",
    accessDenied: "Access Denied",
    tryAgain: "TRY AGAIN",
    claimReward: "CLAIM REWARD",
    visitProfile: "Visit Store Profile",
    instructions: "Activation Instructions",
    step1: "Tap CLAIM REWARD below (Copies code).",
    step2: "You will be redirected to TikTok.",
    step3: "Paste the code in our DM to activate deal.",
    openingTiktok: "OPENING TIKTOK...",
    authorizedAgent: "Authorized Agent",
    totalDiscount: "Total Discount Unlocked",
    correctMsg: "You answered correctly.",
    questionsCorrect: "questions correctly",
    risky: "(RISKY)",
    networkError: "Connection Lost. Internet required.",
    leaderboardBtn: "HALL OF FAME",
    leaderboardTitle: "TOP AGENTS",
    rank: "RANK",
    agent: "AGENT",
    clearance: "CLEARANCE",
    backBtn: "BACK TO BASE",
    noRecords: "NO RECORDS FOUND",
    homeBtn: "NEW AGENT (RESET)",
  },
  ar: {
    startBtn: "ابدأ المشهد",
    tagline1: "ليست مجرد لقطة",
    tagline2: "إنها قصة",
    quote: "\"إمـا أن تموت بطلاً، أو تعيش طويلاً لتجد نفسك شريراً.\"",
    enterTitle: "ادخل القصة",
    enterWarning: "تحذير:",
    enterDesc: "الإجابات الخاطئة تغلق الخصم فوراً. أجب على الكل لتحصل على 25%.",
    levels: "مراحل",
    maxReward: "أقصى خصم",
    enterBtn: "ادخل الآن",
    loading: "جاري التحميل",
    identifyTitle: "عرف عن نفسك",
    identifyDesc: "أدخل بياناتك لإنشاء معرف المشهد الخاص بك.",
    nameLabel: "الاسم الرمزي / الاسم",
    phoneLabel: "خط الإرسال (الهاتف)",
    registerBtn: "تسجيل الهوية",
    abortBtn: "إلغاء المهمة",
    verifying: "جاري التحقق...",
    scene: "مشهد",
    finalScene: "المشهد الأخير",
    answerPrompt: "أجب بشكل صحيح للمتابعة",
    accessDenied: "تم رفض الوصول",
    tryAgain: "حاول مجدداً",
    claimReward: "استلم الجائزة",
    visitProfile: "زيارة ملف المتجر",
    instructions: "تعليمات التفعيل",
    step1: "اضغط استلم الجائزة بالأسفل (نسخ الكود).",
    step2: "سيتم تحويلك إلى تيك توك.",
    step3: "الصق الكود في الرسائل لتفعيل الخصم.",
    openingTiktok: "جاري فتح تيك توك...",
    authorizedAgent: "العميل المصرح له",
    totalDiscount: "الخصم الذي تم فتحه",
    correctMsg: "لقد أجبت بشكل صحيح.",
    questionsCorrect: "إجابات صحيحة",
    risky: "(مخاطرة)",
    networkError: "لا يوجد اتصال بالإنترنت.",
    leaderboardBtn: "لوحة الشرف",
    leaderboardTitle: "أفضل العملاء",
    rank: "م",
    agent: "العميل",
    clearance: "الخصم",
    backBtn: "العودة للقاعدة",
    noRecords: "لا توجد سجلات",
    homeBtn: "عميل جديد (خروج)",
  }
};

// --- REFINED QUESTION POOL ---

export const LOCAL_POOL_EN: Question[] = [
  // EASY
  { id: 'e1', text: "In which fictional Indiana town does the main story take place?", options: ["Riverdale", "Hawkins", "Derry", "Springfield"], correctAnswerIndex: 1, difficulty: 'Easy', rewardPercentage: 2 },
  { id: 'e2', text: "What is Eleven's iconic favorite food that she first steals from a store?", options: ["Pizza", "Eggo Waffles", "Burgers", "Ice Cream"], correctAnswerIndex: 1, difficulty: 'Easy', rewardPercentage: 2 },
  { id: 'e3', text: "What tabletop game are the boys playing when Will disappears in S1?", options: ["Monopoly", "Dungeons & Dragons", "Risk", "Chess"], correctAnswerIndex: 1, difficulty: 'Easy', rewardPercentage: 2 },
  { id: 'e4', text: "Which character is known for his signature 'nugget' of wisdom and missing front teeth?", options: ["Mike", "Lucas", "Will", "Dustin"], correctAnswerIndex: 3, difficulty: 'Easy', rewardPercentage: 2 },
  
  // MEDIUM
  { id: 'm1', text: "What is the name of the secret Soviet base disguised as a mall in Season 3?", options: ["Hawkins Lab", "Starcourt Mall", "The Palace Arcade", "Melvald's"], correctAnswerIndex: 1, difficulty: 'Medium', rewardPercentage: 3 },
  { id: 'm2', text: "What is the name of the alternate, dark dimension where the monsters live?", options: ["The Void", "The Shadow Realm", "The Upside Down", "The Below"], correctAnswerIndex: 2, difficulty: 'Medium', rewardPercentage: 3 },
  { id: 'm3', text: "Who does Steve Harrington team up with at the 'Scoops Ahoy' ice cream parlor?", options: ["Nancy", "Robin", "Barb", "Max"], correctAnswerIndex: 1, difficulty: 'Medium', rewardPercentage: 3 },
  
  // HARD
  { id: 'h1', text: "Which 80s song by Kate Bush is used to save Max from Vecna's curse?", options: ["Should I Stay or Should I Go", "Running Up That Hill", "Master of Puppets", "Every Breath You Take"], correctAnswerIndex: 1, difficulty: 'Hard', rewardPercentage: 3 },
  { id: 'h2', text: "What is the real name of the main antagonist in Season 4, also known as '001'?", options: ["Henry Creel", "Billy Hargrove", "Martin Brenner", "Bob Newby"], correctAnswerIndex: 0, difficulty: 'Hard', rewardPercentage: 3 },
  
  // EXPERT
  { id: 'ex1', text: "What is the specific name of the D&D club led by Eddie Munson?", options: ["The Gryphon Club", "The Hellfire Club", "The Hawkins High Party", "The Dragon Slayers"], correctAnswerIndex: 1, difficulty: 'Expert', rewardPercentage: 4 },
  { id: 'ex2', text: "What was the code name of the Russian scientist who loved cherry slurpees?", options: ["Smirnoff", "Alexei", "Dimitri", "Yuri"], correctAnswerIndex: 1, difficulty: 'Expert', rewardPercentage: 4 },
  
  // NIGHTMARE
  { id: 'n1', text: "In Season 2, what was the license plate number of Billy Hargrove's Camaro?", options: ["PCE 235", "HAWK 01", "NDL 442", "ST 1984"], correctAnswerIndex: 0, difficulty: 'Nightmare', rewardPercentage: 4 },
  
  // IMPOSSIBLE
  { id: 'i1', text: "What is the exact value of Planck's Constant that Suzie gave to Dustin in the Season 3 finale?", options: ["6.62607004", "6.62607015", "6.26607004", "6.66207004"], correctAnswerIndex: 0, difficulty: 'Impossible', rewardPercentage: 4 }
];

export const LOCAL_POOL_AR: Question[] = [
  // EASY
  { id: 'e1_ar', text: "في أي مدينة خيالية بولاية إنديانا تدور أحداث القصة الرئيسية؟", options: ["Riverdale", "Hawkins", "Derry", "Springfield"], correctAnswerIndex: 1, difficulty: 'Easy', rewardPercentage: 2 },
  { id: 'e2_ar', text: "ما هو الطعام المفضل والمشهور لـ 'إليفن' الذي سرقته من المتجر؟", options: ["بيتزا", "وافل إيجو (Eggos)", "برجر", "آيس كريم"], correctAnswerIndex: 1, difficulty: 'Easy', rewardPercentage: 2 },
  { id: 'e3_ar', text: "ما هي لعبة الطاولة التي كان يلعبها الأولاد لحظة اختفاء 'ويل'؟", options: ["Monopoly", "D&D", "Risk", "شطرنج"], correctAnswerIndex: 1, difficulty: 'Easy', rewardPercentage: 2 },
  { id: 'e4_ar', text: "من هو الشخص المفقود في بداية الموسم الأول والذي بدأت بسببه القصة؟", options: ["مايك", "ويل بايرز", "داستن", "لوكاس"], correctAnswerIndex: 1, difficulty: 'Easy', rewardPercentage: 2 },
  
  // MEDIUM
  { id: 'm1_ar', text: "ما هو اسم المركز التجاري الذي كان يخفي قاعدة سرية في الموسم الثالث؟", options: ["Hawkins Lab", "Starcourt Mall", "The Palace", "Scoops Ahoy"], correctAnswerIndex: 1, difficulty: 'Medium', rewardPercentage: 3 },
  { id: 'm2_ar', text: "ماذا يطلق الأبطال على البُعد الموازي المظلم الذي تسكنه الوحوش؟", options: ["الفراغ", "عالم الظلال", "العالم المقلوب", "الهاوية"], correctAnswerIndex: 2, difficulty: 'Medium', rewardPercentage: 3 },
  { id: 'm3_ar', text: "مع من كان يعمل 'ستيف هارينغتون' في متجر الآيس كريم 'Scoops Ahoy'؟", options: ["نانسي", "روبن", "بارب", "ماكس"], correctAnswerIndex: 1, difficulty: 'Medium', rewardPercentage: 3 },
  
  // HARD
  { id: 'h1_ar', text: "أي أغنية للفنانة 'كيت بوش' تم استخدامها لإنقاذ 'ماكس' من لعنة 'فيكنا'؟", options: ["Should I Stay or Go", "Running Up That Hill", "Master of Puppets", "Material Girl"], correctAnswerIndex: 1, difficulty: 'Hard', rewardPercentage: 3 },
  { id: 'h2_ar', text: "ما هو الاسم الحقيقي للعدو الرئيسي في الموسم الرابع (المعروف أيضاً بـ 001)؟", options: ["هنري كريل", "بيلي هارجروف", "مارتن برينر", "بوب نيوبي"], correctAnswerIndex: 0, difficulty: 'Hard', rewardPercentage: 3 },
  
  // EXPERT
  { id: 'ex1_ar', text: "ما هو الاسم المحدد لنادي الـ D&D الذي يقوده 'إيدي مونسون'؟", options: ["نادي غريفون", "نادي هيلفاير (Hellfire)", "نادي هوكينز", "صائدو التنانين"], correctAnswerIndex: 1, difficulty: 'Expert', rewardPercentage: 4 },
  { id: 'ex2_ar', text: "ما هو الاسم الذي أطلقه 'هوبر' على العالم الروسي الذي كان يحب 'السليربي'؟", options: ["سميرنوف", "أليكسي", "ديميتري", "يوري"], correctAnswerIndex: 1, difficulty: 'Expert', rewardPercentage: 4 },
  
  // NIGHTMARE
  { id: 'n1_ar', text: "في الموسم الثاني، ما هو رقم لوحة سيارة 'كامارو' الخاصة بـ 'بيلي هارجروف'؟", options: ["PCE 235", "HAWK 01", "NDL 442", "ST 1984"], correctAnswerIndex: 0, difficulty: 'Nightmare', rewardPercentage: 4 },
  
  // IMPOSSIBLE
  { id: 'i1_ar', text: "ما هي القيمة الدقيقة لـ 'ثابت بلانك' التي أعطتها سوزي لداستن في نهاية الموسم الثالث؟", options: ["6.62607004", "6.62607015", "6.26607004", "6.66207004"], correctAnswerIndex: 0, difficulty: 'Impossible', rewardPercentage: 4 }
];

export const IMAGES = {
  landingBg: "https://picsum.photos/id/1033/800/1200", 
  introBg: "https://picsum.photos/id/1002/800/1200", 
};