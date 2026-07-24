// ==========================================================================
// Tipos do domínio — espelham (de forma simplificada) o schema Prisma.
// Usados agora pela camada de dados mockados e, na próxima etapa, também
// pelas queries reais ao banco (Prisma vai gerar tipos compatíveis).
// ==========================================================================

export type QuestionOrigin = "OFICIAL" | "INEDITA" | "ADAPTADA";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type StudyMode =
  | "QUICK_STUDY"
  | "FREE"
  | "ERROR_REVIEW"
  | "HARD_QUESTIONS"
  | "SMART_REVIEW"
  | "SIMULADO"
  | "VUNESP_TRAINING"
  | "DAILY_CHALLENGE"
  | "TOPIC_TRAINING";

export interface ExamEdition {
  id: string;
  examName: string;
  edition: string;
  organizer: string;
  isActive: boolean;
}

export interface Subject {
  id: string;
  examEditionId: string;
  name: string;
  slug: string;
  order: number;
  weight: number;
  color: string; // usado só na UI mockada
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  slug: string;
  incidence: number; // 0-100
}

export interface QuestionOption {
  id: string;
  label: string; // A, B, C, D, E
  text: string;
  isCorrect: boolean;
  rationale: string;
}

export interface Question {
  id: string;
  topicId: string;
  subjectId: string;
  statement: string;
  origin: QuestionOrigin;
  difficulty: Difficulty;
  options: QuestionOption[];
  explanation: string;
  examTip?: string;
  source?: string;
  examBoard: string;
  examYear?: number;
  tags: string[];
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  answeredAt: string;
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  color: string;
  answered: number;
  correct: number;
  accuracy: number; // 0-100
}

export interface TopicPerformance {
  topicId: string;
  topicName: string;
  subjectName: string;
  accuracy: number;
  answered: number;
}
