/* Every full paper, in one list.
 *
 * The first is last year's REAL midterm, transcribed verbatim with the
 * professor's own answer key — it leads because sitting the actual paper
 * is the best single calibration of what the exam asks. The other three
 * mirror its format (33 questions, 3 points each, 75 minutes) with
 * original questions on the same syllabus. */

import { EXAM_2025, EXAM_2025_META, EXAM_2025_FIGURES } from "./exam2025";
import { EXAM, EXAM_META, EXAM_FIGURES } from "./exam";
import { EXAM_B, EXAM_B_META, EXAM_B_FIGURES } from "./exam2";
import { EXAM_C, EXAM_C_META, EXAM_C_FIGURES } from "./exam3";

export const EXAMS = [
  { id: "real",  meta: EXAM_2025_META, questions: EXAM_2025, figures: EXAM_2025_FIGURES },
  { id: "one",   meta: EXAM_META,   questions: EXAM,   figures: EXAM_FIGURES },
  { id: "two",   meta: EXAM_B_META, questions: EXAM_B, figures: EXAM_B_FIGURES },
  { id: "three", meta: EXAM_C_META, questions: EXAM_C, figures: EXAM_C_FIGURES },
];

/* the practice papers — the banks the answer-key balance and the length
   audit apply to, since the real paper is left exactly as it was sat */
export const PRACTICE_EXAMS = EXAMS.filter((e) => !e.meta.verbatim);

export function examById(id) {
  return EXAMS.find((e) => e.id === id) || EXAMS[0];
}
