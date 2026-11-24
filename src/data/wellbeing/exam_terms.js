/* Hack Your Life — practice exam F, "Terms".
 *
 * Every question is fill-in-the-blank. No multiple choice, so nothing can
 * be recognised or eliminated — you either have the term or you don't.
 * That makes it the harshest of the papers and the fastest to sit.
 *
 * Roughly two terms per module, covering all eighteen. Stems are worded
 * differently from the fill-in-the-blanks on papers A-E, so a term that
 * appears on both is being tested, not remembered from the other paper.
 *
 * Accept lists are generous on form (case, punctuation, articles, plural
 * s, common abbreviations) and strict on the word itself.
 */

export const WB_EXAM_TERMS = {
  title: "Practice Exam F — Terms",
  lede: "Thirty-four fill-in-the-blank questions and nothing else. No options to recognise, no distractors to rule out — this is the paper that tells you which terms you can actually produce from memory rather than merely recognise.",
  questions: [

  { type:"blank", q:"Duhigg's explanation for why so many conversations fail: the two people are in different kinds of conversation and neither notices. What is this principle called?",
    answer:"The matching principle", accept:["matching principle","the matching principle","matching","the matching rule"],
    why:"The **matching principle**. Conversations work when partners align on whether this is a **practical**, **emotional** or **identity** conversation. It was the second question on the very first reading quiz and it opened the semester-trivia slide." },

  { type:"blank", q:"Of Duhigg's three kinds of conversation, which one asks *Who are we?* and needs recognition back?",
    answer:"Identity", accept:["identity","the identity conversation","identity conversation"],
    why:"**Identity.** The other two: **practical** (*What's this really about?*) needs help thinking it through, and **emotional** (*How do we feel?*) needs empathy and specifically *not* solutions." },

  { type:"blank", q:"The named three-step technique for proving you heard someone: ask a question, say it back in your own words, then check you got it right.",
    answer:"Looping for understanding", accept:["looping for understanding","looping","loop for understanding","the loop"],
    why:"**Looping for understanding.** Saying it back in *your own words* is the part that matters — repeating their words proves nothing. It works because speakers cannot see you listening while they are talking." },

  { type:"blank", q:"Naming feelings precisely — *embarrassed and a bit resentful* rather than just *bad*. Kashdan, Barrett and McKnight's term for this skill:",
    answer:"Emotion differentiation", accept:["emotion differentiation","emotional differentiation","differentiation","emotion granularity"],
    why:"**Emotion differentiation.** It predicts better regulation under stress, less drinking to cope, and less aggression when provoked." },

  { type:"blank", q:"The Pennebaker paradigm — writing about your deepest thoughts and feelings on an important emotional issue — is known by what two-word name?",
    answer:"Expressive writing", accept:["expressive writing","expressive-writing","emotional writing"],
    why:"**Expressive writing.** The dosage rules are examinable: **3 or more sessions**, **15 minutes or longer** (under 15 leaves people worse off), consecutive days slightly better than spread out, and bigger effects at home and alone." },

  { type:"blank", q:"The explanation the course gives for why skilled performers fall apart under pressure — attention lands on a skill that normally runs automatically:",
    answer:"The overthinking hypothesis", accept:["overthinking hypothesis","the overthinking hypothesis","overthinking","choking under pressure"],
    why:"The **overthinking hypothesis**, the lecture's account of **choking under pressure**. Note it is distinct from **rumination**, which is also too much thinking but belongs to the *expressing emotion is not always good* material." },

  { type:"blank", q:"Dweck's name for the belief that ability is a set trait you either have or lack:",
    answer:"Entity theory", accept:["entity theory","entity","fixed mindset","entity theory (fixed mindset)"],
    why:"**Entity theory** — the fixed mindset. Failure then reads as evidence about who you are, which is why difficulty feels threatening and effort looks like proof you lack ability." },

  { type:"blank", q:"Dweck's name for the alternative belief — that people can change things about themselves with effort, strategy and help:",
    answer:"Incremental theory", accept:["incremental theory","incremental","growth mindset","incremental theory (growth mindset)"],
    why:"**Incremental theory** — the growth mindset. All three levers, not effort alone: **effort, strategy and help**. Effort-only is the most common misreading of Dweck." },

  { type:"blank", q:"The physiological stress marker Crum used in the stress-mindset study — not cortisol:",
    answer:"Salivary alpha-amylase", accept:["salivary alpha-amylase","alpha-amylase","alpha amylase","saa","salivary alpha amylase"],
    why:"**Salivary alpha-amylase (sAA).** Keep it apart from **salivary cortisol**, which is what Creswell's value-affirmation study measured — swapping the two is the easiest mistake in this part of the course." },

  { type:"blank", q:"The brain's ability to miss something that is directly in front of it, named in the *Dial D for Distracted* episode:",
    answer:"Inattentional blindness", accept:["inattentional blindness","in-attentional blindness","inattention blindness"],
    why:"**Inattentional blindness.** The episode's other two names worth holding: **Liz Dunn** on the mere presence of a phone reducing enjoyment, and **Catherine Price**, author of *How to Break Up With Your Phone*." },

  { type:"blank", q:"Haidt's name for the shift in childhood he dates to roughly 2010–2015:",
    answer:"The Great Rewiring", accept:["great rewiring","the great rewiring","great rewiring of childhood","the great rewiring of childhood"],
    why:"**The Great Rewiring** of childhood. The paired fact from the reading quiz: during the *first* wave — dial-up and home computers in the 1990s — adolescent mental health did **not** decline." },

  { type:"blank", q:"On a sleep diary, the minutes between getting into bed and falling asleep:",
    answer:"Sleep onset latency", accept:["sleep onset latency","sleep latency","sol","onset latency","sleep-onset latency"],
    why:"**Sleep onset latency (SOL)** — and *sleep latency* was accepted on the exam-prep slide, where this was the worked fill-in-the-blank example. If one term on this paper is certain to appear, it is this one." },

  { type:"blank", q:"On a sleep diary, the minutes spent awake in the middle of the night. (The term or its acronym.)",
    answer:"Wake after sleep onset", accept:["wake after sleep onset","waso","wake after sleep-onset","wakefulness after sleep onset"],
    why:"**Wake after sleep onset (WASO).** The diary's other terms: **TIB** (time in bed), **TST** (total sleep time), and **early-morning awakening**." },

  { type:"blank", q:"Total sleep time divided by time in bed gives which measure?",
    answer:"Sleep efficiency", accept:["sleep efficiency","efficiency","sleep efficency"],
    why:"**Sleep efficiency** = TST ÷ TIB. Under **80%** with lots of time in bed is the **Wired** sleeper's signature; a healthy sleeper runs **85%+**." },

  { type:"blank", q:"The component of CBT-I that says the bed is for sleep only, and that you get up if you are awake 15–20 minutes. (Bootzin, 1972.)",
    answer:"Stimulus control", accept:["stimulus control","stimulus-control","bootzin stimulus control"],
    why:"**Stimulus control** — the **best-supported single component of CBT-I**. The logic is associative: the bed should predict sleep, and lying awake in it teaches the opposite." },

  { type:"blank", q:"The component that compresses time in bed and then expands it again as efficiency improves:",
    answer:"Sleep restriction", accept:["sleep restriction","sleep-restriction","time in bed restriction"],
    why:"**Sleep restriction.** Do not confuse it with **stimulus control** — restriction manages the *window*, stimulus control manages the *association*." },

  { type:"blank", q:"Ji and Wilson recorded a rodent's hippocampus running the maze sequence again while it slept. What is this phenomenon called?",
    answer:"Neural replay", accept:["neural replay","replay","memory replay","hippocampal replay"],
    why:"**Neural replay**, during **slow-wave sleep**. It is the mechanism behind the claim that sleep is a learning intervention rather than merely rest." },

  { type:"blank", q:"Which sleep stage dominates the early part of the night, when neural replay occurs?",
    answer:"Slow-wave sleep", accept:["slow-wave sleep","slow wave sleep","deep sleep","sws","slow-wave"],
    why:"**Slow-wave (deep) sleep early; REM late.** That asymmetry is why cutting the last two hours costs you disproportionately much REM, and cutting the first hours costs you deep sleep." },

  { type:"blank", q:"Elizabeth and Robert Bjork's umbrella term for study conditions that slow you down during practice but improve what survives to the test:",
    answer:"Desirable difficulties", accept:["desirable difficulties","desirable difficulty","desireable difficulties"],
    why:"**Desirable difficulties.** The three named moves — **vary it, space it, quiz yourself** — were the professor's closing study advice for this exam." },

  { type:"blank", q:"The desirable difficulty that means alternating between types of problems rather than blocking them:",
    answer:"Interleaving", accept:["interleaving","interleave","interleaved practice","interleaving practice"],
    why:"**Interleaving** — option (e) in the exam's own worked multiple-choice example. The other correct option there, replicating your testing environment, works through **context-dependent memory**." },

  { type:"blank", q:"Godden and Baddeley's divers recalled better underwater when they had learned underwater. What effect is this?",
    answer:"Context-dependent memory", accept:["context-dependent memory","context dependent memory","context dependency","context effects","encoding specificity"],
    why:"**Context-dependent memory.** It is why *replicate your testing environment* is one of the two strategies the exam's worked example marks correct." },

  { type:"blank", q:"Thiessen's name for the trap where material that feels easy to process is mistaken for material that has been learned:",
    answer:"Misleading fluency effect", accept:["misleading fluency effect","misleading fluency","fluency effect","fluency illusion","illusion of fluency"],
    why:"The **misleading fluency effect**. It is a metacognitive error, which is what makes it dangerous — a judgement about your own learning that points the wrong way, and the reason massed practice feels so productive." },

  { type:"blank", q:"Brooks's term for the single trait that separates those who thrive in the generative-AI age — how much someone engages in and enjoys effortful thinking:",
    answer:"Need for cognition", accept:["need for cognition","high need for cognition","nfc"],
    why:"**Need for cognition.** It sorts his three types: **productive passengers** (low), **reluctant optimizers** (medium), **mental marathoners** (high, capacities retained)." },

  { type:"blank", q:"In Duhigg's loop, the element that must develop before a cue and a reward become a habit — the brain anticipating the reward:",
    answer:"Craving", accept:["craving","a craving","cravings","anticipation"],
    why:"**Craving.** Schultz's monkey Julio makes it visible: once the habit formed, the *I got a reward* response moved to **before the juice arrived**, and when the juice failed to come that anticipation became craving." },

  { type:"blank", q:"The property a behaviour has once it runs without deliberation — reached in roughly 66 days:",
    answer:"Automaticity", accept:["automaticity","automatic","automaticity (habit)"],
    why:"**Automaticity**, at about **66 days** — roughly two months. It is one of the four practices the exam-prep slide accepted for the Maya essay, and the one that targets quitting at the two-week mark." },

  { type:"blank", q:"Of the three skills trained in mindfulness meditation, which is the accepting, non-fighting one that the dismantling trial isolated as the active ingredient?",
    answer:"Equanimity", accept:["equanimity","acceptance","equanimity (acceptance)"],
    why:"**Equanimity.** The other two are **concentration** and **sensory clarity**. Only the **Monitor + Accept** arm reduced cortisol reactivity, which is what licenses calling acceptance the active ingredient. Formula to hold: *Suffering = Pain × Resistance.*" },

  { type:"blank", q:"Farb and Segal's term for deliberately attending to raw sensation in order to interrupt a default template:",
    answer:"Sense foraging", accept:["sense foraging","sense-foraging","sensory foraging"],
    why:"**Sense foraging.** The 8 Oct reading quiz asked you to name one of your own defaults and a specific sense-foraging moment to interrupt it — which sense, and when." },

  { type:"blank", q:"The idea that support should fit the need — offering practical help to someone in an emotional conversation is the same error in another costume:",
    answer:"The matching hypothesis", accept:["matching hypothesis","the matching hypothesis","matching"],
    why:"The **matching hypothesis**, connecting the giving lecture back to the conversations lecture. The three kinds of support are **tangible**, **informational** and **emotional**, and the practical move is to **ask what would help**." },

  { type:"blank", q:"The acronym for the Mental Health First Aid action plan taught in the CaPS lecture:",
    answer:"ALGEE", accept:["algee","a.l.g.e.e","algee acronym"],
    why:"**ALGEE.** Keep it separate from the lecture's own escalation ladder — **observe → listen and support → consult or refer → take immediate action** — which is a different four-step sequence." },

  { type:"blank", q:"The principle that low doses of a stressor produce adaptation — from the Greek for *to set in motion*:",
    answer:"Hormesis", accept:["hormesis","hormetic","hormesis effect"],
    why:"**Hormesis.** Ristow's antioxidant study is the clean demonstration: the pills **blunted the exercise stress signal and blocked the adaptation**, so the uncomfortable signal is not a side-effect of the benefit, it is the mechanism of it." },

  { type:"blank", q:"Ruby et al.'s explanation for why we expect to enjoy exercise less than we actually do — judging the whole session by its opening minutes:",
    answer:"Forecasting myopia", accept:["forecasting myopia","myopia","forecast myopia","forecasting myopia (exercise)"],
    why:"**Forecasting myopia.** The practical rule is to **discount the first few minutes**. Distinguish it from the **effort paradox**: effort is a cost in the moment of choosing and part of the value afterwards." },

  { type:"blank", q:"The name for the pattern where each gain becomes the new normal, so the target moves with you — illustrated by the 1987 poll on how much income people said they needed:",
    answer:"The hedonic treadmill", accept:["hedonic treadmill","the hedonic treadmill","hedonic adaptation","adaptation"],
    why:"The **hedonic treadmill**. In that poll, people earning under $30K said they would need $50K; people earning over $100K said they would need $250K. It is one of Csikszentmihalyi's four reasons money does not buy much happiness, alongside **hijacked attention**, **relative deprivation** and **capitalist values**." },

  { type:"blank", q:"Kahneman's finding that remembered experience tracks its most intense moment and its ending rather than its total:",
    answer:"The peak-end rule", accept:["peak-end rule","the peak-end rule","peak end rule","peak/end rule"],
    why:"The **peak-end rule**. In the cold-pressor study, **69%** chose to repeat the trial containing *strictly more* total discomfort because it ended more gently. The hack drawn from it: **end on a high note**." },

  { type:"blank", q:"Gilbert's term for the happiness we manufacture when we do *not* get what we wanted:",
    answer:"Synthetic happiness", accept:["synthetic happiness","synthesized happiness","synthesised happiness","synthetic"],
    why:"**Synthetic happiness**, produced by the **psychological immune system** — as against **natural happiness**, what we get when we do get what we wanted. His point is that the synthetic kind is not inferior, and that we do not believe in advance that we have this capacity." },

  ],
};
