/* The wellbeing practice papers, in the order they are meant to be sat.
 *
 * A, B and C come from course.js and cover the whole course; D is the
 * numbers paper, which is a recall check rather than an understanding
 * check and is best left until late. */

import { WB_EXAMS as WB_CORE_EXAMS } from "./course.js";
import { WB_EXAM_NUMBERS } from "./exam_numbers.js";

export const WB_PAPERS = [...WB_CORE_EXAMS, WB_EXAM_NUMBERS];
