import { Question, Language } from "../types";
import { LOCAL_POOL_EN, LOCAL_POOL_AR, QUIZ_CONFIG } from "../constants";

// Helper to shuffle array
const shuffle = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const generateQuestions = async (language: Language = 'en'): Promise<Question[]> => {
  // Select the correct pool based on language
  const POOL = language === 'ar' ? LOCAL_POOL_AR : LOCAL_POOL_EN;
  
  // 1. Group by difficulty
  const easy = POOL.filter(q => q.difficulty === 'Easy');
  const medium = POOL.filter(q => q.difficulty === 'Medium');
  const hard = POOL.filter(q => q.difficulty === 'Hard');
  const expert = POOL.filter(q => q.difficulty === 'Expert');
  const nightmare = POOL.filter(q => q.difficulty === 'Nightmare');
  const impossible = POOL.filter(q => q.difficulty === 'Impossible');

  // 2. Select randomly based on config: 
  // Config: Easy(2), Medium(2), Hard(1), Expert(1), Nightmare(1), Impossible(1)
  
  const selectedQuestions: Question[] = [
    ...shuffle(easy).slice(0, 2),
    ...shuffle(medium).slice(0, 2),
    ...shuffle(hard).slice(0, 1),
    ...shuffle(expert).slice(0, 1),
    ...shuffle(nightmare).slice(0, 1),
    ...shuffle(impossible).slice(0, 1)
  ];

  // 3. Ensure we have exactly 8, if not fill with randoms from pool (failsafe)
  if (selectedQuestions.length < 8) {
      const remaining = POOL.filter(q => !selectedQuestions.includes(q));
      const needed = 8 - selectedQuestions.length;
      selectedQuestions.push(...shuffle(remaining).slice(0, needed));
  }

  // 4. Map to correct structure and apply current timestamps IDs
  const finalQuestions = selectedQuestions.map((q, index) => ({
    ...q,
    id: `local_${language}_${index}_${Date.now()}`,
    // Ensure rewards match the strict config for that Level Index
    rewardPercentage: QUIZ_CONFIG.levels[index]?.reward || 5,
    difficulty: QUIZ_CONFIG.levels[index]?.difficulty || 'Medium'
  }));
  
  return finalQuestions;
};