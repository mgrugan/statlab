/* Hack Your Life — practice exam G, "Combinations".
 *
 * Every question uses the format the exam-prep slide demonstrated: five
 * statements (a) to (e), then four candidate combinations, of which one
 * is right. It is the only multiple-choice format the course has actually
 * shown, which makes it the likeliest shape for the real paper's MC
 * section.
 *
 * Why it is harder than it looks: you cannot reason from one statement.
 * Being sure (b) is true eliminates nothing unless you also know whether
 * (a) and (c) belong. Partial knowledge scores zero.
 *
 * Two tells are deliberately controlled. The false statements are spread
 * across all five letters rather than parked at (e), so "check the last
 * one" does not work. And the correct combination varies in size — two,
 * three and four items — so counting is not a strategy either.
 */

export const WB_EXAM_COMBOS = {
  title: "Practice Exam G — Combinations",
  lede: "Twenty-three questions in the exam's own multiple-choice format: five statements, then pick which combination is correct. The format the professor demonstrated, and the one that punishes partial knowledge hardest — knowing four of the five statements still leaves you guessing.",
  questions: [

  { type:"mc", q:"Which of these describe **looping for understanding**?",
    sub:[
      "Say their words back to them verbatim",
      "Ask a question first",
      "Check whether you got it right",
      "Offer a solution once you have understood",
      "Say it back in your own words",
    ],
    choices:["(a), (b), (c)","(a), (c), (e)","(b), (c), (d), (e)","(b), (c), (e)"], answer:3,
    why:"**(b), (c), (e).** Ask · say it back in your own words · *did I get that right?* — and keep going until they say *yes, exactly*. (a) is the near-miss worth understanding: **repeating their words proves nothing**, because parroting does not demonstrate processing. (d) breaks the matching principle — an emotional conversation answered with a solution." },

  { type:"mc", q:"Which of these did Kardas, Kumar and Epley find about how people predict deep conversations?",
    sub:[
      "We overestimate how awkward the conversation will be",
      "We overestimate how much we will enjoy shallow small talk",
      "We underestimate how connected we will feel",
      "The miscalibration pushes us into shallower conversations than we would prefer",
      "Better calibration makes people less willing to engage",
    ],
    choices:["(a), (b), (d)","(a), (c), (e)","(a), (c), (d)","(a), (b), (c), (d)"], answer:2,
    why:"**(a), (c), (d).** The error is systematic and runs one way: too much awkwardness expected, too little connection, care and happiness. (e) is backwards — better calibration makes people **more** willing. (b) was never tested; the finding is about the deep conversation, not the small talk." },

  { type:"mc", q:"High **emotion differentiation** predicts which of these?",
    sub:[
      "Higher general intelligence",
      "Better regulation under stress",
      "Less drinking to cope",
      "Experiencing fewer negative emotions overall",
      "Less aggression when provoked",
    ],
    choices:["(b), (c), (d)","(b), (c), (e)","(a), (b), (c), (e)","(b), (d), (e)"], answer:1,
    why:"**(b), (c), (e)** — Kashdan, Barrett and McKnight. (d) is the attractive wrong answer: differentiating emotions does **not** mean having fewer bad ones, it means handling them better. The skill is in the naming, not in the absence of the feeling." },

  { type:"mc", q:"Which of these are true of the Mueller and Dweck praise experiment?",
    sub:[
      "Every child succeeded on round 1",
      "Children were assigned to the two kinds of praise at random",
      "Effort-praised children also fell below their baseline on round 3",
      "Round 2 was much harder and every child struggled",
      "Round 3 was as easy as round 1",
    ],
    choices:["(a), (b), (d), (e)","(a), (c), (d)","(b), (d), (e)","(a), (b), (c), (d)"], answer:0,
    why:"**(a), (b), (d), (e).** (c) inverts the result — effort-praised children scored **above** their baseline while the smart-praised fell below theirs. Random assignment (b) and the equal-difficulty round 3 (e) are what make the design work: the only thing differing between groups is the sentence of praise." },

  { type:"mc", q:"Which statements about Yeager et al.'s national growth-mindset trial are correct?",
    sub:[
      "It raised ninth-grade cumulative GPA by about 0.10",
      "It raised GPA by about a full point",
      "Effects were largest in lower- and middle-achieving schools",
      "Effects were significant in high-achieving schools",
      "Effects were bigger where peer norms supported a growth mindset",
    ],
    choices:["(a), (c), (d)","(b), (c), (e)","(a), (c), (d), (e)","(a), (c), (e)"], answer:3,
    why:"**(a), (c), (e).** (d) is the one most often got wrong: the effect was **not significant** in high-achieving schools. The result is real, modest and conditional, and naming those conditions is what separates a strong answer from a slogan." },

  { type:"mc", q:"Which of these are the mechanisms Haidt lists for smartphones harming adolescent mental health?",
    sub:[
      "Displacement of in-person social interaction",
      "Sleep interference",
      "Reduced physical activity",
      "Cyberbullying and excessive social comparison",
      "Access to harmful content",
    ],
    choices:["(a), (b), (c), (d)","(a), (b), (d), (e)","(b), (c), (d), (e)","(a), (d), (e)"], answer:1,
    why:"**(a), (b), (d), (e).** Reduced physical activity is plausible and not on his list — the four are displacement, sleep, cyberbullying and harmful content. Phones are framed as **experience blockers**, consuming the unstructured childhood where development happens." },

  { type:"mc", q:"Which of these are among Haidt's proposed solutions?",
    sub:[
      "Daily screen-time reports sent automatically to parents",
      "Delaying the age at which children are given smartphones",
      "Phone-free schools",
      "More unsupervised play, risk and independence",
      "Tech policy change",
    ],
    choices:["(b), (c), (e)","(a), (b), (c), (d)","(b), (c), (d), (e)","(a), (c), (d), (e)"], answer:2,
    why:"**(b), (c), (d), (e)**, plus cultural and parental behaviour change. (a) is surveillance of children's usage, which is not on his list and sits awkwardly beside the independence argument — that is exactly why it makes a good distractor." },

  { type:"mc", q:"Which of these are true of the CMU sleep study (Creswell et al., 2023)?",
    sub:[
      "Over 500 first-year students took part",
      "Students came from three universities",
      "Each extra hour of nightly sleep predicted about 0.07 more GPA",
      "The sample averaged about eight hours on weeknights",
      "The damage concentrated in students sleeping under six hours",
    ],
    choices:["(a), (b), (c), (e)","(a), (c), (d)","(b), (c), (d), (e)","(a), (b), (d), (e)"], answer:0,
    why:"**(a), (b), (c), (e).** The sample averaged about **6 hours 29 minutes** on weeknights, not eight — the study is a portrait of students already short of sleep, which is part of why the under-six-hour threshold matters." },

  { type:"mc", q:"According to levels-of-processing, which of these judgements produce the best later recall of a word?",
    sub:[
      "Is the word printed in capital letters?",
      "Is the word an animal?",
      "Does the word rhyme with *train*?",
      "Does the word fit in *He saw a ___ in the street*?",
      "Does the word apply to you?",
    ],
    choices:["(b), (c), (d)","(b), (d), (e)","(a), (b), (d)","(b), (c), (d), (e)"], answer:1,
    why:"**(b), (d), (e)** — all three are semantic. (a) is visual and (c) phonological, both shallow. The ordering to hold: visual → phonological → semantic → meaning in context, with self-reference among the deepest. Recall tracks **depth at encoding**, not time spent." },

  { type:"mc", q:"Which of these are the three rules of brief behavioural treatment for insomnia?",
    sub:[
      "Keep the same wake time every day, weekends included",
      "Nap in the afternoon after a bad night",
      "Go to bed only when sleepy, not merely tired",
      "Keep a clock visible so you know how long you have been awake",
      "Get up if you are awake 15–20 minutes",
    ],
    choices:["(a), (c), (e)","(a), (b), (c)","(a), (c), (d), (e)","(c), (d), (e)"], answer:0,
    why:"**(a), (c), (e).** (b) spends the sleep pressure you want to bank for tonight; (d) is explicitly ruled out — no clock, no phone. Rule 3 is **stimulus control**, the best-supported single component of CBT-I." },

  { type:"mc", q:"Which of these does the sleep lecture list as things that backfire?",
    sub:[
      "Alcohol as a sleep aid",
      "Weekend catch-up sleep",
      "Morning light exposure",
      "Trying harder to fall asleep",
      "Caffeine after about 2pm",
    ],
    choices:["(a), (b), (c), (d)","(a), (d), (e)","(b), (c), (d), (e)","(a), (b), (d), (e)"], answer:3,
    why:"**(a), (b), (d), (e).** Morning light is a fix, not a failure — it is half of what makes a fixed wake time work. (d) is the counterintuitive one: effort raises arousal, which is the opposite of what sleep needs." },

  { type:"mc", q:"Which of these are the three ethical barriers Rousmaniere and colleagues name for AI mental-health tools?",
    sub:[
      "The cost of running the models",
      "Legal responsibility",
      "Data security and confidentiality",
      "Training data that may not generalise to the user population",
      "Lack of regulation on advertising",
    ],
    choices:["(b), (c), (e)","(a), (b), (c)","(b), (c), (d)","(b), (c), (d), (e)"], answer:2,
    why:"**(b), (c), (d).** The legal one has a memorable phrasing worth keeping: *offering therapy but denying responsibility*. The generalisation problem was taught as widening circles — CMU students → Pitt students → 18–25s in Pittsburgh → all adults in Pennsylvania → the US." },

  { type:"mc", q:"Which of these were accepted as evidence-based practices in the model answer to the Maya behaviour-change essay?",
    sub:[
      "A stable cue — same time, place or prior action",
      "A reward she craves, right afterwards",
      "Expect it to take around 66 days",
      "Pick the goal that matters most to her",
      "A plan for the missed day",
    ],
    choices:["(a), (b), (c), (e)","(a), (b), (d), (e)","(a), (c), (e)","(a), (b), (c), (d), (e)"], answer:0,
    why:"**(a), (b), (c), (e)** — any three were accepted, each with its mechanism. (d) is wrong in an instructive way: Woolley and Fishbach found that how **important** a goal is did *not* predict sticking with it, while how much you **enjoy** it did." },

  { type:"mc", q:"Which of these are the three skills trained in mindfulness meditation?",
    sub:[
      "Concentration",
      "Visualisation",
      "Sensory clarity",
      "Equanimity",
      "Deep relaxation",
    ],
    choices:["(a), (b), (d)","(a), (c), (e)","(a), (c), (d)","(c), (d), (e)"], answer:2,
    why:"**(a), (c), (d).** Relaxation is the standing misconception — the lecture puts meditation in the **effortful, skill-building** column beside exercise and giving, not with sound baths and float tanks. The summary line is *meditation = equanimity reps*." },

  { type:"mc", q:"Which of these are the lecture's rules for giving in a way that benefits you too?",
    sub:[
      "Choose it freely rather than being pressured into it",
      "Connect with a person, ideally face to face",
      "Give as much as you can afford",
      "See the impact of what your help did",
      "Ask what would help",
    ],
    choices:["(a), (b), (c), (d)","(b), (c), (d)","(a), (c), (d), (e)","(a), (b), (d), (e)"], answer:3,
    why:"**(a), (b), (d), (e).** (c) is contradicted by the evidence: in Dunn's Study 3 the **amount made no difference** — $5 worked as well as $20. Konrath supplies the reason (a) matters: self-oriented volunteers had mortality indistinguishable from people who never volunteered." },

  { type:"mc", q:"Which of these does the CaPS lecture recommend when talking with a struggling peer?",
    sub:[
      "Focus on observations about behaviour",
      "Use open-ended questions to encourage disclosure",
      "Name the condition you think they may have",
      "Avoid *why* questions",
      "Match their emotional intensity so they feel understood",
    ],
    choices:["(a), (b), (c)","(a), (b), (d)","(b), (d), (e)","(a), (b), (d), (e)"], answer:1,
    why:"**(a), (b), (d).** (c) is outside what a peer should do — observations about behaviour, not guesses at a diagnosis. (e) inverts the lecture's line: **emotions are contagious, so act calm**. Use *how come?* in place of *why*, which elicits defensiveness." },

  { type:"mc", q:"Which of these claims from the exercise lecture are correct?",
    sub:[
      "Dance had the largest effect size of the treatments compared",
      "CBT outperformed every form of exercise",
      "SSRIs had the smallest effect size in the table",
      "7,000 steps against 2,000 is associated with 47% lower all-cause mortality",
      "Three daily bursts of 1–2 minutes is associated with 38–40% lower mortality in non-exercisers",
    ],
    choices:["(a), (c), (e)","(a), (b), (d), (e)","(a), (c), (d), (e)","(c), (d), (e)"], answer:2,
    why:"**(a), (c), (d), (e).** The ordering: dance 0.96, walking/jogging 0.62, yoga 0.55, CBT 0.55, strength 0.49, mixed aerobic 0.43, tai chi 0.42, SSRIs 0.26. CBT sits **level with yoga** and below walking — so (b) fails, and that comparison is the point of the table." },

  { type:"mc", q:"Which of these are among the six research literatures the discomfort lecture draws on?",
    sub:[
      "Behavioural economics",
      "Exposure therapy",
      "Stress inoculation",
      "Hormesis and exercise",
      "Learning science",
    ],
    choices:["(b), (c), (d)","(b), (c), (d), (e)","(a), (b), (c), (e)","(b), (d), (e)"], answer:1,
    why:"**(b), (c), (d), (e)** — the other two are **ancient traditions** and **mindsets**, the latter being where the improv study sits. Behavioural economics belongs to no part of this course." },

  { type:"mc", q:"Which of these are Csikszentmihalyi's reasons that money does not buy much happiness?",
    sub:[
      "Rising expectations",
      "Hijacked attention",
      "Relative deprivation",
      "Diminishing marginal utility of consumption",
      "Capitalist values that make money the measure of a life",
    ],
    choices:["(a), (b), (c), (d)","(a), (c), (d), (e)","(a), (b), (d), (e)","(a), (b), (c), (e)"], answer:3,
    why:"**(a), (b), (c), (e)** — three in our heads, one in our culture. (d) is real economics and is **not** one of his four, which makes it the sharpest distractor in this paper: it sounds more technical than the right answers." },

  { type:"mc", q:"Which of these are the four hacks for the happiness blindspots?",
    sub:[
      "Simulate the how",
      "Set a happiness goal each morning",
      "Ask someone who has been there",
      "Don't grade your feelings",
      "End on a high note",
    ],
    choices:["(a), (c), (d), (e)","(a), (b), (d), (e)","(a), (c), (e)","(b), (c), (d), (e)"], answer:0,
    why:"**(a), (c), (d), (e)**, one per blindspot. (b) is not merely absent but actively contradicted by blindspot 3: Mauss found that **valuing happiness highly predicted lower wellbeing** — and specifically when life is going well." },

  { type:"mc", q:"Which of these are among Ryff and Keyes's six dimensions of eudaimonic wellbeing?",
    sub:[
      "Purpose in life",
      "Personal growth",
      "Optimism",
      "Autonomy",
      "Environmental mastery",
    ],
    choices:["(a), (b), (c), (d)","(a), (b), (d), (e)","(a), (d), (e)","(a), (b), (c), (e)"], answer:1,
    why:"**(a), (b), (d), (e)** — the two not listed here are **self-acceptance** and **positive relations**. Optimism is a different construct entirely and belongs to no part of the six." },

  { type:"mc", q:"Which of these does the final lecture say makes a break actually work?",
    sub:[
      "Detach",
      "Move",
      "With people",
      "Be present",
      "Stay reachable in case something urgent comes up",
    ],
    choices:["(a), (b), (c), (d)","(a), (b), (d), (e)","(a), (c), (d)","(b), (c), (d), (e)"], answer:0,
    why:"**(a), (b), (c), (d)** — all four illustrated by Waitzkin's summer on Bimini: no chess talk, boat work and diving, family, watching the fish. (e) defeats *detach*, which is the first condition." },

  { type:"mc", q:"In the Copenhagen City Heart Study, which sports were associated with **more than five** extra years of life?",
    sub:[
      "Tennis",
      "Cycling",
      "Badminton",
      "Soccer",
      "Jogging",
    ],
    choices:["(a), (c), (d)","(a), (b), (c)","(a), (c)","(a), (c), (d), (e)"], answer:2,
    why:"**(a), (c)** only — tennis **9.7** and badminton **6.2**. Soccer is close at **4.7** but under the line, then cycling 3.7, swimming 3.4, jogging 3.2, calisthenics 3.1 and the gym last at 1.5. The lecture's reading: the top three are the most **social** sports." },

  ],
};
