/* The three practice midterms, in one list.
 * Each mirrors the real exam's format — 33 questions, 3 points each,
 * 75 minutes — with original questions on the same syllabus. */

import { EXAM, EXAM_META, EXAM_FIGURES } from "./exam";
import { EXAM_B, EXAM_B_META, EXAM_B_FIGURES } from "./exam2";
import { EXAM_C, EXAM_C_META, EXAM_C_FIGURES } from "./exam3";

export const EXAMS = [
  { id: "one",   meta: EXAM_META,   questions: EXAM,   figures: EXAM_FIGURES },
  { id: "two",   meta: EXAM_B_META, questions: EXAM_B, figures: EXAM_B_FIGURES },
  { id: "three", meta: EXAM_C_META, questions: EXAM_C, figures: EXAM_C_FIGURES },
];

export function examById(id) {
  return EXAMS.find((e) => e.id === id) || EXAMS[0];
}
