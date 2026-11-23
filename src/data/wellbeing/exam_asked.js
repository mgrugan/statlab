/* Hack Your Life — practice exam E, "Asked Before".
 *
 * Every question here was actually put to the class: the eleven Slido
 * trivia questions from the exam-prep lecture (16b), that lecture's three
 * worked exam examples, and all the Canvas reading-quiz questions.
 *
 * The choice TEXT is reproduced as it was asked, including the
 * professor's own distractors — that is the whole value of this paper, so
 * nothing has been reworded to balance answer lengths. Only the ORDER of
 * the options is rebalanced, which carries no meaning. (Capitalisation and
 * punctuation are normalised; the wording is his.)
 *
 * Which surfaces something worth knowing. On the reading-quiz questions,
 * where the options are his, the correct answer is STRICTLY the longest
 * one in 12 of 22 — 55%, against 25% by chance. On this course's real
 * questions, length is a genuine signal. It would be easy to "fix" by
 * rewriting him, and that would both destroy the point of the paper and
 * hide a true fact about the exam. So it stands, and is reported instead.
 * The options that are mine — the trivia slide showed questions without
 * answer choices — are balanced as usual, at 2 of 8.
 *
 * Keys that the returned Canvas attempts did not reveal were resolved
 * from the assigned readings themselves (Rousmaniere p.74 on effect
 * sizes, Denizet-Lewis on Jake, Rogers on the volunteering exception,
 * Brooks quoting Grace Liu). The one key I could not confirm is flagged
 * in its own explanation.
 */

export const WB_EXAM_ASKED = {
  title: "Practice Exam E — Asked Before",
  lede: "The questions the course has already asked you: all eleven semester-trivia questions from the exam-prep lecture, its three worked exam examples, and every reading quiz. Longer than the other papers because nothing has been left out — if a question has been asked once, it is here.",
  questions: [

  /* ---------- the Slido semester-trivia slide, lecture 16b ---------- */

  { type:"mc", q:"**Trivia 1.** Duhigg argues in *Supercommunicators* that many conversations go wrong for one main reason. What is it?",
    choices:[
      "Neither person asks enough follow-up questions to keep it going",
      "The two people are having different **kinds** of conversation",
      "One person talks far more than the other",
      "People avoid disclosing anything personal",
    ], answer:1,
    why:"The **matching principle**. This one is doubly confirmed: it opened the trivia slide *and* it was the second question on the very first reading quiz (27 Aug), where the keyed wording was *conversations work best when you match the type of conversation your partner is having*. If a single idea carries the conversations material, it is this one." },

  { type:"mc", q:"**Trivia 2.** In the Ramirez and Beilock *Science* article, test-anxious ninth graders wrote about their worries for 10 minutes before a biology final. Compared with anxious students who did not, they earned about…",
    choices:[
      "Two letter grades more",
      "No measurable difference",
      "Half a letter grade more",
      "A full letter grade more — B− to B+",
    ], answer:3,
    why:"**About a letter grade, B− to B+**, and only for the **test-anxious** students. The 1 Sept reading quiz asked the companion question — who the classroom students in studies 3 and 4 were (**ninth-grade biology**) — so the course has now asked about this paper from two directions." },

  { type:"mc", q:"**Trivia 3.** Kids praised for being smart or for working hard then failed a very hard set. On the final **easy** set, how did the smart-praised kids do?",
    choices:[
      "They scored **below** their own earlier baseline",
      "They scored about the same as their baseline",
      "They scored above their own earlier baseline",
      "They refused to attempt any further problems",
    ], answer:0,
    why:"**Below their own round-1 baseline** — while the effort-praised children scored **above** theirs. The comparison is within child, which is what makes the claim work: the only thing that differed was the sentence of praise." },

  { type:"mc", q:"**Trivia 4.** Haidt argues teen mental health began to decline sharply during what he calls the **Great Rewiring** of childhood. When did it start?",
    choices:[
      "Around 2020, with the pandemic",
      "The late 1990s",
      "Around 2010–2015",
      "It has been declining steadily since the 1980s",
    ], answer:2,
    why:"**Around 2010–2015**, anchored at ~2010/2011 throughout the course. Note how this pairs with the 1 Sept reading quiz, which asked what happened during the **first** wave (dial-up, 1990s–2000s): mental health **did not** decline, and Millennial teens were if anything slightly happier. The two waves are the argument — the second one is what he blames." },

  { type:"blank", q:"**Trivia 5.** By summer 2026, how many U.S. states had passed laws restricting phone use in schools? (A number.)",
    answer:"39", accept:["39","39 states","thirty-nine","39 plus DC","39 and DC","39 + DC"],
    why:"**39 states, plus the District of Columbia.** The closing slide framed it as the policy layer of the answer to the attention economy: *Industry: change the model. Policy: 39 states + DC. You: smartphone hacks.*" },

  { type:"blank", q:"**Trivia 6.** In the CMU study of first-year students wearing sleep trackers, each hour **less** of average nightly sleep predicted end-of-term GPA falling by about how much? (A number.)",
    answer:"0.07", accept:["0.07","0.07 gpa",".07","about 0.07","0.07 points","0.07 of a gpa point"],
    why:"**0.07 of a GPA point per hour** (Creswell et al., 2023, *PNAS*). The 10 Sept reading quiz asked the same study the other way round — what happened to students averaging **under six hours**: their **GPA declined compared with their previous term**." },

  { type:"blank", q:"**Trivia 7.** In brief behavioural treatment for insomnia, which one thing should stay the same every day, weekends included?",
    answer:"Wake time", accept:["wake time","wake-up time","waking time","rise time","time you wake up","wake up time","getting up time"],
    why:"**Wake time** — the body clock's strongest cue, it sets when you see morning light, and it builds tonight's sleep pressure. Weekend drift is the specific failure it prevents." },

  { type:"mc", q:"**Trivia 8.** In *The Power of Habit*, Febreze flopped when it first launched. What finally turned it into a hit?",
    choices:[
      "Cutting the price and expanding distribution",
      "Targeting pet owners and smokers directly",
      "Proving in trials that it removed more odours than rivals",
      "Repositioning it as a **reward** at the end of a cleaning routine",
    ], answer:3,
    why:"Repositioned as a **craved reward at the end of an existing routine**, with **more perfume added**, and the line changed from *gets bad smells out of fabrics* to *cleans life's smells*. It had flopped for want of a **cue** — people cannot smell their own homes. The 29 Sept reading quiz asked the companion question: the chapter's two products are **Pepsodent** and **Febreze**." },

  { type:"blank", q:"**Trivia 9.** Killingsworth and Gilbert pinged people's phones at random moments. About how often did their minds wander in daily life? (A percentage.)",
    answer:"47%", accept:["47","47%","about 47","47 percent","around 47%","~47%"],
    why:"**About 47% of the time** — and the second finding is the one that matters for the lecture: people were **less happy when their minds wandered**, whatever they were doing, with the wandering coming first in time." },

  { type:"mc", q:"**Trivia 10.** Which instruction, given right before a stage exercise, made Second City improv students hold the focus longer and take more risks?",
    choices:[
      "Treat **feeling awkward and uncomfortable as the goal**",
      "Focus on your scene partner rather than on yourself",
      "Aim to make the audience laugh as often as possible",
      "Plan the scene carefully before starting",
    ], answer:0,
    why:"Woolley & Fishbach (2022). Making discomfort **the goal** — the sign you are doing it right — beat every more sensible-sounding instruction, which is exactly why it makes a good trivia question." },

  { type:"mc", q:"**Trivia 11.** In the David Brooks *Atlantic* article, which single trait does he argue will separate the people who thrive in the generative-AI age?",
    choices:[
      "Tolerance for ambiguity",
      "Emotional intelligence",
      "**Need for cognition**",
      "Technical fluency with AI tools",
    ], answer:2,
    why:"**Need for cognition** — how much someone engages in and *enjoys* effortful thinking. It sorts his three types: **productive passengers** (low), **reluctant optimizers** (medium), **mental marathoners** (high, capacities retained). The 22 Sept reading quiz came from the same article." },

  /* ---------- the three worked exam examples, lecture 16b ---------- */

  { type:"mc", q:"**The exam's own multiple-choice example.** We talked about study strategies with Professor Erik Thiessen. Which study strategies are shown to improve test performance?",
    sub:[
      "One long study block of a few hours",
      "Replicate your testing environment",
      "Rote memorise until it sticks",
      "Pull an all-nighter",
      "Alternate between types of problems",
    ],
    choices:["(c), (d)","(b), (e)","(a), (b), (e)","(a), (b), (d), (e)"], answer:1,
    why:"**(b) and (e)** — this is the worked example the exam-prep slide showed, answer and all. **(b)** is context-dependent memory (Godden & Baddeley's divers); **(e)** is **interleaving**, one of the Bjorks' desirable difficulties. One long block is massed practice, rote memorisation is shallow processing, and an all-nighter sacrifices the consolidation sleep does. Note the format: options (a)–(e), then you pick the **combination**." },

  { type:"blank", q:"**The exam's own fill-in-the-blank example.** On the Consensus Sleep Diary you tracked how many minutes it took to fall asleep after getting into bed. Sleep medicine calls this period ____________.",
    answer:"Sleep onset latency", accept:["sleep onset latency","sleep latency","sol","onset latency","sleep-onset latency"],
    why:"**Sleep onset latency (SOL)**, and *sleep latency* was accepted on the slide. This was shown as the model fill-in-the-blank, so the term itself is about as likely as anything on the paper." },

  /* ---------- Canvas reading quizzes, in the order they were set ---------- */

  { type:"mc", q:"**Reading quiz, 27 Aug.** According to the first few chapters of *Supercommunicators*, what is the first step in becoming a more effective communicator?",
    choices:[
      "Learning how to be warm",
      "Starting with an effective ice breaker",
      "Avoiding emotional topics in conversation at first",
      "Recognizing what type of conversation is happening",
    ], answer:3,
    why:"**Recognize what type of conversation is happening** — before any technique, you have to know which of the three you are in. Everything else in the book, including looping, follows from getting that right." },

  { type:"mc", q:"**Reading quiz, 27 Aug.** What does the *matching principle* mean in the context of conversation?",
    choices:[
      "Matching your partner's body language is the most important part of empathy",
      "Conversations work best when you match the type of conversation your partner is having",
      "People prefer talking with others who share their background",
      "Communication is most effective when both people roughly match on the same number of words",
    ], answer:1,
    why:"**Match the kind of conversation, not the posture, the background or the word count.** All three wrong options are forms of matching — which is the trap. The principle is about **practical / emotional / identity**, and the classic failure is answering an emotional conversation with a practical one." },

  { type:"mc", q:"**Reading quiz, 1 Sept.** Ramirez and Beilock's studies 3 and 4 moved from the lab into real classrooms. Who were the classroom students?",
    choices:[
      "Seventh-grade math class students",
      "Twelfth-grade calculus class students",
      "Ninth-grade biology class students",
      "Fifth-grade biology class students",
    ], answer:2,
    why:"**Ninth-grade biology.** Worth holding precisely, because the design is what makes the result credible: two lab studies establishing the effect, then two field studies showing it survives in a real exam that actually counts." },

  { type:"mc", q:"**Reading quiz, 1 Sept.** Haidt describes the internet arriving in two *waves*. What happened to adolescent mental health during the **first** wave — dial-up and home computers in the 1990s and early 2000s?",
    choices:[
      "Mental health declined for girls but improved for boys",
      "Adolescent mental health did not decline — Millennial teens were, if anything, slightly happier and healthier than the generation before",
      "Rates of depression and loneliness began rising as soon as internet access spread",
      "Mental health declined, but only in the United States and not internationally",
    ], answer:1,
    why:"**No decline in the first wave.** This is load-bearing for Haidt's argument: if the internet as such were the problem, the damage should have started in the 1990s. It did not, which is why he points at the **second** wave — smartphones, front-facing cameras and social media from around 2010." },

  { type:"mc", q:"**Reading quiz, 8 Sept.** In *Dial D for Distracted*, Catherine Price describes realising she had a smartphone problem: with a new baby, instead of bonding, she repeatedly caught herself doing what?",
    choices:[
      "Lost in her Instagram feed",
      "Scrolling on Facebook",
      "Shopping for door knobs on eBay",
      "Streaming videos on YouTube",
    ], answer:2,
    why:"**Shopping for door knobs on eBay.** The detail is the point, and it is why it makes such a good quiz question: the pull is not some irresistible content, it is utterly trivial — which is what makes the phone's hold on attention so unsettling. She wrote *How to Break Up With Your Phone*." },

  { type:"mc", q:"**Reading quiz, 10 Sept.** In the CMU sleep article, what happened when students averaged **fewer than 6 hours** of nightly sleep?",
    choices:[
      "They performed equally on end-of-semester GPA compared with those who slept 7 or more hours",
      "They reported worse concentration relative to students who slept 7 or more hours",
      "Their GPA declined compared to their previous term",
      "They maintained or improved their GPA",
    ], answer:2,
    why:"**Their GPA declined against their own previous term.** Note the distractor about *concentration*: the study's outcome was **grades**, not self-reported focus, and keeping that straight is the difference between knowing the paper and recognising the topic." },

  { type:"mc", q:"**Reading quiz, 15 Sept.** According to the APA reading (Principle 3), which best predicts how sophisticated a student's reasoning will be on a given task?",
    choices:[
      "The student's general intelligence",
      "How much prior knowledge the student has in that domain",
      "The student's age or grade level",
      "Whether the task is taught in a formal school setting",
    ], answer:1,
    why:"**Domain-specific prior knowledge** — not age, not general intelligence. Reasoning is not a single skill that matures on a schedule; it rides on what you already know about the thing you are reasoning about. This is the same idea as *making meaning by connecting to what you already know*." },

  { type:"mc", q:"**Reading quiz, 15 Sept.** A student aces a quiz given right after a lesson. According to Principle 5, what does that most likely tell you?",
    choices:[
      "Not much — success right after learning doesn't ensure long-term retention",
      "The material has reached long-term memory",
      "The student has engaged in deliberate practice",
      "All of the above",
    ], answer:0,
    why:"**Not much.** Performance during or immediately after learning is a poor guide to what will survive — which is the **misleading fluency effect** from the learning lecture, and the reason the Bjorks call difficulties *desirable*." },

  { type:"mc", q:"**Reading quiz, 17 Sept.** In the two Matthew Walker videos, which substances does he single out as harming sleep quality?",
    choices:[
      "Tobacco and marijuana",
      "Alcohol and tobacco",
      "Alcohol and marijuana",
      "None of the above",
    ], answer:2,
    why:"**Alcohol and marijuana.** Both sedate and both **suppress REM**, which is why they feel like sleep aids and are not: sedation is not sleep, and the REM you lose comes disproportionately from the back half of the night." },

  { type:"mc", q:"**Reading quiz, 22 Sept.** Brooks cites a study led by Grace Liu at Carnegie Mellon: participants used AI for about ten minutes of problem solving and then had it taken away. What happened, compared with people who never had AI access?",
    choices:[
      "They took longer but reached the same accuracy",
      "They performed the same",
      "They performed better, having learned from the AI",
      "They performed worse and gave up more often",
    ], answer:3,
    why:"The article's own words: *after just ~10 minutes of AI-assisted problem solving, people who lost access to the AI performed worse and gave up more frequently than those who never used it.* Brooks pairs it with endoscopists whose lesion detection fell from **28.4%** to **22.4%** after AI was withdrawn. Ten minutes is the striking part." },

  { type:"mc", q:"**Reading quiz, 22 Sept.** Rousmaniere et al. (2025) cite a meta-analysis comparing existing digital mental-health apps with face-to-face psychotherapy. What did it find?",
    choices:[
      "Existing digital mental health apps performed much worse than face-to-face psychotherapy",
      "Existing digital mental health apps performed about the same as face-to-face psychotherapy",
      "No decisive conclusion, because there were not enough studies of apps' clinical performance",
      "Existing digital mental health apps performed much better than face-to-face psychotherapy",
    ], answer:0,
    why:"**Much worse**, and the paper gives the numbers: apps achieve standardised mean differences of only **0.20–0.30**, where face-to-face psychotherapy averages about **0.80**. That gap is the premise of the whole argument — it is *why* the authors think LLMs are worth taking seriously as a possible improvement on apps, and simultaneously why the three ethical barriers matter so much." },

  { type:"mc", q:"**Reading quiz, 29 Sept.** *The Power of Habit* ch. 2 illustrates the cue → routine → reward loop with two consumer products. Which two?",
    choices:[
      "Pepsodent toothpaste and Febreze air freshener",
      "Trident gum and Glide dental floss",
      "Febreze air freshener and Dyson vacuum cleaner",
      "Pepsodent toothpaste and Pop-Tarts",
    ], answer:0,
    why:"**Pepsodent** and **Febreze** — and they teach opposite halves of the same lesson. Pepsodent *succeeded* on a hidden craving nobody designed for (the **tingle** from citric acid and mint oil). Febreze *failed* for want of a cue, then succeeded once it was sold as a craved reward. Both show the stated reward is not always the operative one." },

  { type:"mc", q:"**Reading quiz, 1 Oct.** Much of the anxiety article followed Jake, who struggled with an anxiety disorder in high school. Which college did Jake end up attending?",
    choices:[
      "Emerson College",
      "The article didn't specify what college Jake attended",
      "Davidson College",
      "UNC Chapel Hill",
    ], answer:3,
    why:"**UNC Chapel Hill** — he had long wanted to go there and thought it had become wishful thinking; the article ends with his email, *I was accepted to U.N.C. Chapel Hill.* Watch the first option: **Emerson College** is where the *author*, Benoit Denizet-Lewis, teaches. It appears in the article, just not as Jake's college." },

  { type:"mc", q:"**Reading quiz, 1 Oct.** The anxiety article describes several evidence-based treatments for students with anxiety and depression. All of the following appear **except**:",
    choices:[
      "Exposure therapy",
      "Eye movement desensitization and reprocessing (EMDR)",
      "Cognitive behavioural therapy (CBT)",
    ], answer:1,
    why:"**EMDR** is the one not in the article. **Exposure** and **CBT** are both there — and exposure therapy is also one of the six literatures behind the leaning-into-discomfort lecture, so it turns up twice in the course. (Three options, not four: reproduced as it was asked.)" },

  { type:"mc", q:"**Reading quiz, 20 Oct.** Dunn, Aknin and Norton (2008) report three primary studies. Which is **not** one of them?",
    choices:[
      "A study of how shoppers at Target spend money, and their end-of-shopping-trip happiness",
      "An experiment manipulating how people spend ($5 or $20) and end-of-day happiness",
      "A survey relating pro-social spending and happiness",
      "A study of a windfall — a Christmas bonus — and subsequent happiness",
    ], answer:0,
    why:"The three real ones: a **survey** of 632 Americans, a **natural experiment** on 16 employees receiving a bonus, and the **randomised experiment** with $5 or $20. There is no Target study. Study 3 is the one that matters most, because random assignment is what lets the course claim giving *causes* the happiness rather than merely accompanying it." },

  { type:"mc", q:"**Reading quiz, 20 Oct.** The Rogers article on volunteering names an important exception to the idea that helping others is good for your mental health. What is it?",
    choices:[
      "Volunteering only helps if you volunteer more than 200 hours a year",
      "Required volunteering, like high school service hours, makes people less likely to volunteer later",
      "Paid jobs around helping others, like health care, are often high stress and linked to poor mental health",
      "Volunteering doesn't help people who already have anxiety or depression",
    ], answer:2,
    why:"The article's words: *the one exception: when doing good is your job* — jobs with altruism baked in, like health care and aid work, are high-stress environments linked to poor mental health, so *even if your job is to help people, you might benefit from some volunteering on the side.* The 200-hours figure is real but belongs to **Sneed & Cohen** on blood pressure, not to this exception." },

  { type:"mc", q:"**Reading quiz, 22 Oct.** Why does Duckworth open with the story of being swept out to sea with her mother?",
    choices:[
      "To argue that older adults are sometimes reluctant to ask for help",
      "To show that persistence under pressure eventually pays off",
      "To show that when a problem exceeds your own capacity, signalling for help from people with more expertise beats fighting harder alone",
      "To illustrate that asking for help is only necessary in life-or-death situations",
    ], answer:2,
    why:"**Signal for help rather than fight harder.** Note how neatly the second option inverts the moral — persistence is exactly what the story argues *against* when the problem is past your capacity. It is the same move as the peer-support lecture: knowing when to escalate is a skill, not a failure." },

  { type:"blank", q:"**Reading quiz, 27 Oct.** In Wendy Suzuki's TED talk, exercise increases the size of which brain area?",
    answer:"Hippocampus", accept:["hippocampus","the hippocampus","hippocampal"],
    why:"**The hippocampus** — memory and learning. It is the same structure as Erickson's walking study, where a year of walking three times a week produced a **2% gain** against the stretching group's **1.4% loss**, set against a normal decline of 1–2% a year. Suzuki's other headline is the **prefrontal cortex** and attention." },

  { type:"blank", q:"**Reading quiz, 29 Oct.** In the Invisibilia episode *The Fifth Vital Sign*, what is the name of Devyn's health problem?",
    answer:"Amplified pain syndrome", accept:["amplified pain syndrome","amps","amplified musculoskeletal pain syndrome","amplified pain"],
    why:"**Amplified pain syndrome (AMPS).** Her tests came back entirely normal, and her treatment was the opposite of protection: **five to six hours of exercise a day with no pain medication, for three to six weeks**. It is the clinical face of the avoidance loop — hurts, so protect; protection brings relief; the brain learns *danger*; less provocation hurts more." },

  { type:"blank", q:"**Reading quiz, 10 Nov.** Csikszentmihalyi describes a state of deep absorption where skills match the challenge, goals are clear and feedback is immediate — people lose track of time and stop feeling self-conscious. What is this state called?",
    answer:"Flow", accept:["flow","a flow state","flow state","autotelic","an autotelic state","flow experience"],
    why:"**Flow** — *autotelic* was also accepted on the quiz, as the word for an activity done for its own sake. The three conditions are the examinable part: **clear goals, immediate feedback, challenge matched to skill**. Too much challenge gives anxiety, too little gives boredom — which is precisely what the Tetris study manipulated." },

  { type:"mc", q:"**Reading quiz, 12 Nov.** In the Laurie Santos video, which set are her five *rewirements* for greater happiness?",
    choices:[
      "Social connection, other-orientedness, gratitude, savouring, exercise",
      "Sleep, exercise, gratitude, meditation, social connection",
      "Gratitude, savouring, meditation, journalling, kindness",
      "Exercise, sleep, nutrition, mindfulness, purpose",
    ], answer:0,
    why:"**Social connection · other-orientedness · gratitude · savouring · exercise.** The quiz asked you to name any two. Notice that four of the five have their own lecture in this course, and that **sleep** — which does have its own lecture — is *not* on her list, which is what makes the second option such a comfortable wrong answer." },

  { type:"mc", q:"**Reading quiz, 17 Nov.** What key intervention did Viktor Frankl use in the concentration camp to help suicidal prisoners cope?",
    choices:[
      "He taught them breathing exercises to reduce anxiety",
      "He encouraged them to focus on happiness and positive thinking",
      "He reminded them of responsibilities still awaiting them outside the camp",
      "He asked them to imagine life without suffering",
    ], answer:2,
    why:"**Responsibilities still awaiting them** — a particular person, a piece of unfinished work. Meaning comes from being needed by something outside yourself, which is why the other three options are all wrong in the same instructive way: they aim at *feeling better*, and Frankl's intervention aims at *having a reason*." },

  { type:"mc", q:"**Reading quiz, 17 Nov.** Why does the Atlantic article close with Frankl's 1941 visa decision?",
    choices:[
      "To show he put his patients first: he stayed in Vienna to protect them from the Nazis",
      "To warn about the costs of self-sacrifice: he came to regret giving up safety in America",
      "To show how ambition shaped his life: staying let him keep building logotherapy",
      "To show that meaning and happiness can pull apart: he gave up safety and a rising career to stay with his parents",
    ], answer:3,
    why:"**Meaning and happiness can pull apart.** He had the American visa and let it lapse to stay with his parents — a choice that cost him safety and very likely happiness, and that he did not regret. It is the article's whole thesis, and the cleanest illustration of the hedonic/eudaimonic distinction in the course." },

  { type:"mc", q:"**Reading quiz, 19 Nov.** How does Waitzkin describe his first encounter with the chess players in Washington Square Park?",
    choices:[
      "He was taken there deliberately by his father to learn strategy",
      "He stumbled upon them by accident while walking with his mom",
      "He was invited by an older friend from school",
      "He saw them in a movie and went looking for them",
    ], answer:1,
    why:"**By accident, walking with his mother.** The accident matters to the book's argument: the order was **passion → learning → competition**, and it started with being drawn to something rather than being placed in it. Those first park teachers asked questions and explained their thinking — and never praised a bad move." },

  { type:"mc", q:"**Reading quiz, 19 Nov.** In the Introduction, what first inspired Waitzkin to study Tai Chi Chuan seriously?",
    choices:[
      "Reading the *Tao Te Ching* and feeling drawn to its ideas of inner tranquility",
      "Seeing elderly people practising slow movements in Central Park",
      "Meeting a Chinese monk while travelling abroad",
      "Watching a Bruce Lee movie",
    ], answer:0,
    why:"⚠️ **Confirm this one.** The Canvas attempt was marked wrong without revealing the key, and the course's copy of *The Art of Learning* is a scanned PDF with no searchable text, so unlike every other question on this paper I could not verify it against the source. The *Tao Te Ching* is the standard account of what drew him to Taoist practice and then to Tai Chi, so that is how it is keyed — but check the Introduction before you rely on it. Watch the park option either way: his chess park is **Washington Square**, not Central Park, which is the kind of near-miss this course's distractors like." },

  /* ---------- the short-answer questions, as essays ---------- */

  { type:"essay", q:"**The exam's own essay example.** Maya wants to start exercising. Every time she has tried before, she started strong and quit within a couple of weeks. Using the behaviour-change material and Duhigg's *The Power of Habit*, recommend **three evidence-based practices** to help her make exercise a habit, and explain why each one works.",
    why:"<p>The exam-prep slide showed this question *and* its marking: **any three** of the four, each with its mechanism. The marks are in the *why*.</p><ul><li>**A stable cue** — same time, place or prior action. Habits fire from **context, not willpower**, which is why relying on motivation fails in week two.</li><li>**A reward she craves** — something she genuinely enjoys right afterwards. **Craving is what powers the loop**; a cue and a reward alone are not enough, as Febreze showed.</li><li>**Expect around 66 days** — automaticity takes roughly two months, so expecting ease within a fortnight guarantees quitting at exactly the wrong moment. This is the one that targets *her* pattern.</li><li>**A plan for the miss** — one missed day does not undo a habit, but without a plan one becomes several.</li></ul><p>Strong answers add the exercise-specific evidence: **choose it** rather than having it imposed (Leasure & Jones), make it **social** (the Copenhagen result), and **discount the first few minutes**, since we judge the whole workout by its worst part (Ruby et al.). Duhigg's own supporting figures: of 266 regular exercisers, **92%** continued because of how good it made them feel and **67%** for a craved sense of accomplishment.</p>" },

  { type:"essay", q:"**Reading quiz, 8 Sept.** According to Carol Dweck in *Mindset*, how do people with fixed versus growth mindsets think about their intelligence differently?",
    why:"<p>The graded answer was short and complete: <em>people with a fixed mindset think intelligence is a set trait, whereas people with a growth mindset think it is a developable trait.</em> That earned full marks, so the bar is a clean statement of the contrast rather than a long one.</p><p>To make it stronger, name the theories and the consequence:</p><ul><li>**Fixed = entity theory.** Intelligence is a fixed quantity you have or lack. Failure is then **evidence about who you are**, so difficulty is threatening and effort looks like proof you lack ability.</li><li>**Growth = incremental theory.** Intelligence can be developed through **effort, strategy and help** — all three, not effort alone, which is the most common misreading. Failure becomes **information about what to try next**.</li></ul><p>Evidence to cite: **Mueller & Dweck (1998)**, where smart-praised children later scored **below their own baseline** on easy problems and effort-praised children scored **above** theirs; and **Yeager et al. (2019)**, where a short intervention raised ninth-grade GPA by **0.10**, most in lower- and middle-achieving schools.</p>" },

  { type:"essay", q:"**Reading quiz, 8 Oct.** Farb and Segal argue that the *default templates* our brains build can outlive their usefulness, using doomscrolling as the example. Name one default habit of your own that may have outlived its usefulness, then describe a specific sense-foraging moment you could use to interrupt it: which sense, and when.",
    why:"<p>This is marked on structure, not on the habit you pick. The graded answer named a habit that had drifted from its original purpose — checking the phone between classes, which began as staying in touch and became doomscrolling — and then gave a **concrete** interruption: phone stays in the pocket on a specific walk, attention on the surroundings instead.</p><p>What a strong answer contains:</p><ul><li>**A default that once had a purpose** and no longer serves it. The essay's force comes from the template having been *useful*, not from it being a bad habit.</li><li>**A named sense** — touch, sound, sight — rather than a vague intention to be present.</li><li>**A specific when and where**, tied to an existing cue. This is the habit-loop material arriving in another costume: you are attaching a new routine to a cue that already fires reliably.</li></ul><p>The underlying claim is worth stating: **sensation is the way out of a template**, because defaults run on prediction, and attending to raw sense data is what interrupts the prediction. Farb's clinical evidence is the sharp end — patients whose body-awareness regions went **quiet** during sadness had **8× higher relapse risk**.</p>" },

  { type:"essay", q:"**Reading quiz, 12 Nov.** From his TED talk, what is Dan Gilbert's main point about *synthetic* versus *natural* happiness? One or two sentences is enough.",
    why:"<p>The graded answer: <em>synthetic happiness is as real as natural happiness — our minds are capable of creating genuine happiness even when we don't get what we want.</em> That is the whole point, and the quiz wanted it in a sentence.</p><ul><li>**Natural happiness** is what we get when we get what we wanted.</li><li>**Synthetic happiness** is what we **manufacture** when we don't — produced by the **psychological immune system**.</li><li>The claim that makes it interesting: synthetic happiness is **not inferior**. We assume it is a consolation prize, and the data say otherwise.</li><li>The corollary, which is where the course uses it: **we do not believe in advance that we have this capacity**, so we over-forecast how badly bad outcomes will land — predicted **3.89** after a breakup against an actual **5.42**, itself above the **5.27** reported while still in the relationship.</li></ul><p>Gilbert's examples are the ones to cite: Jim Wright after resigning in disgrace, Moreese Bickham after 37 years wrongly imprisoned calling it *a glorious experience*, and Pete Best — fired from the Beatles — saying he was *happier than I would have been with the Beatles*.</p>" },

  ],
};
