/* The papers currently in play.
 *
 * Midterm Two (Parts 6-11) is on Tuesday 17 November, so that is the only
 * paper the app offers. The four Midterm One papers — three original and
 * last year's real 2025 exam, all on Parts 1-5 — are kept in the repo and
 * exported below, but are off the exam list. Move an entry back into
 * EXAMS to restore it; nothing has been deleted. */

import { EXAM_M2, EXAM_M2_META } from "./exam_m2";
import { EXAM_M2B, EXAM_M2B_META } from "./exam_m2b";
import { EXAM_M2C, EXAM_M2C_META } from "./exam_m2c";
import { EXAM_M2D, EXAM_M2D_META } from "./exam_m2d";
import { EXAM_GETREADY, EXAM_GETREADY_META, EXAM_GETREADY_FIGURES } from "./exam_getready";
import { EXAM_FORMULA, EXAM_FORMULA_META } from "./exam_formula";
import { EXAM_2025, EXAM_2025_META, EXAM_2025_FIGURES } from "./exam2025";
import { EXAM, EXAM_META, EXAM_FIGURES } from "./exam";
import { EXAM_B, EXAM_B_META, EXAM_B_FIGURES } from "./exam2";
import { EXAM_C, EXAM_C_META, EXAM_C_FIGURES } from "./exam3";

export const EXAMS = [
  { id: "m2",  meta: EXAM_M2_META,  questions: EXAM_M2,  figures: {} },
  { id: "m2b", meta: EXAM_M2B_META, questions: EXAM_M2B, figures: {} },
  { id: "m2c", meta: EXAM_M2C_META, questions: EXAM_M2C, figures: {} },
  { id: "m2d", meta: EXAM_M2D_META, questions: EXAM_M2D, figures: {} },
  { id: "ready",   meta: EXAM_GETREADY_META, questions: EXAM_GETREADY, figures: EXAM_GETREADY_FIGURES },
  { id: "formula", meta: EXAM_FORMULA_META,  questions: EXAM_FORMULA,  figures: {} },
];

/* Midterm One material — Parts 1 to 5. Off the list, not gone. */
export const ARCHIVED_EXAMS = [
  { id: "real",  meta: EXAM_2025_META, questions: EXAM_2025, figures: EXAM_2025_FIGURES },
  { id: "one",   meta: EXAM_META,   questions: EXAM,   figures: EXAM_FIGURES },
  { id: "two",   meta: EXAM_B_META, questions: EXAM_B, figures: EXAM_B_FIGURES },
  { id: "three", meta: EXAM_C_META, questions: EXAM_C, figures: EXAM_C_FIGURES },
];

/* the banks the answer-key balance and the length audit apply to */
export const PRACTICE_EXAMS = EXAMS.filter((e) => !e.meta.verbatim);

export function examById(id) {
  return EXAMS.find((e) => e.id === id) || EXAMS[0];
}
