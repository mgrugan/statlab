/* The wellbeing practice papers, in the order they are meant to be sat.
 *
 * A, B and C come from course.js and cover the whole course; D is the
 * numbers paper, a recall check best left until late; E collects every
 * question the course has actually asked. */

import { WB_EXAMS as WB_CORE_EXAMS } from "./course.js";
import { WB_EXAM_NUMBERS } from "./exam_numbers.js";
import { WB_EXAM_ASKED } from "./exam_asked.js";

export const WB_PAPERS = [...WB_CORE_EXAMS, WB_EXAM_NUMBERS, WB_EXAM_ASKED];
