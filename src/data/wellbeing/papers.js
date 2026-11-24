/* The wellbeing practice papers, in the order they are meant to be sat.
 *
 * A, B and C come from course.js and cover the whole course; D is the
 * numbers paper, a recall check best left until late; E collects every
 * question the course has actually asked; F is pure fill-in-the-blank;
 * G is entirely the (a)-(e) combination format. */

import { WB_EXAMS as WB_CORE_EXAMS } from "./course.js";
import { WB_EXAM_NUMBERS } from "./exam_numbers.js";
import { WB_EXAM_ASKED } from "./exam_asked.js";
import { WB_EXAM_TERMS } from "./exam_terms.js";
import { WB_EXAM_COMBOS } from "./exam_combos.js";

export const WB_PAPERS = [...WB_CORE_EXAMS, WB_EXAM_NUMBERS, WB_EXAM_ASKED, WB_EXAM_TERMS, WB_EXAM_COMBOS];
