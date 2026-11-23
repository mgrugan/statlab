/* Hack Your Life — end-of-module checkpoints.
 *
 * Five questions per module, all multiple choice. A perfect 5/5 is required
 * to pass; anything less sends you back, with the questions and the answer
 * positions reshuffled on the retake.
 *
 * These test whether you can USE the idea — apply it to a case, say why a
 * result came out the way it did, spot the thing that is nearly right —
 * rather than whether you remember the sentence it was stated in. They also
 * avoid repeating the practice-exam stems, so the papers stay a real test.
 *
 * Fields: q, choices, answer (index), why.  Keys are w01…w18.
 * Text uses the app's Rich syntax, rendered with tex={false}.
 */

export const WB_CHECKS = {

/* ================================================================ w01 */
w01: [
  { q: "A friend says *I bombed the interview — I don't even know why I applied.* You answer: *Have you tried the career centre?* In Duhigg's terms, what has gone wrong?",
    choices: [
      "You hijacked the floor by making it about your own experience instead",
      "You answered an emotional conversation with a practical one",
      "You asked a question before you had earned the right to ask it",
      "Nothing — practical help is what a friend in difficulty needs most",
    ], answer: 1,
    why: "The **matching principle**. They opened an **emotional** conversation; you replied inside a **practical** one. The advice may even be good, which is what makes this failure so hard to notice — both people leave thinking the other one was being difficult." },

  { q: "Which sequence is *looping for understanding*?",
    choices: [
      "Ask a question, say it back in your own words, check you got it right",
      "Say it back, offer your own similar experience, then ask how they feel",
      "Listen without interrupting, summarise at the end, then offer two options",
      "Repeat their last few words back to them until they expand on their own",
    ], answer: 0,
    why: "Ask · say it back in **your own words** · *did I get that right?* — and keep going until they say *yes, exactly*. The point of saying it back in your own words is that repeating their words proves nothing; rephrasing proves you processed it. It works because **speakers cannot see you listening while they are talking**, so you have to prove it after they stop." },

  { q: "Kardas, Kumar and Epley found people mispredict deep conversations. What is the practical consequence the lecture draws from that?",
    choices: [
      "People avoid strangers and stick to those they already know well",
      "Our conversations end up shallower than we would actually prefer",
      "People disclose too much, too early, and then regret it afterwards",
      "Conversations run longer than either person intended them to",
    ], answer: 1,
    why: "The error is **systematic** — we overestimate awkwardness and underestimate connection, care and happiness — so it pushes us the same way every time: towards the shallow end. The finding is not that deep talk is never awkward; it is that we are **miscalibrated** about it, and better calibration makes people more willing." },

  { q: "Aron's *Fast Friends* procedure produces closeness between strangers in about 45 minutes. The lecture adds one condition. Which?",
    choices: [
      "The questions must escalate in intensity as the session goes on",
      "Both people have to take turns answering",
      "Neither person may know anything about the other beforehand",
      "The pair must be left alone, without a researcher in the room",
    ], answer: 1,
    why: "**Turn-taking.** Escalation is part of the design, but reciprocity is the condition the lecture flags: one person answering 36 questions at another is not the same procedure and does not produce the same closeness." },

  { q: "A classmate says: *I'm the first in my family to go to college, so switching majors feels like letting all of them down.* Which kind of conversation is this, and what does it need back?",
    choices: [
      "Practical — help thinking through what switching would actually cost",
      "Identity — recognition of what this says about who they are",
      "Emotional — empathy, and nothing that sounds like a solution",
      "It is practical underneath, and the family talk is a way of avoiding it",
    ], answer: 1,
    why: "*Who are we?* is the **identity** conversation, and what it needs is **recognition** — naming what the decision means for how they see themselves and how their family sees them. The emotional reading is the near-miss here: there is feeling in it, but the content is about belonging and role, not about mood." },
],

/* ================================================================ w02 */
w02: [
  { q: "Two students do the 10-minute writing exercise before a final. One is highly test-anxious, one is not. What does Ramirez and Beilock's result predict?",
    choices: [
      "Both gain roughly a letter grade, since the mechanism applies to everyone",
      "The anxious student gains about a letter grade; the other gains little",
      "The non-anxious student gains more, having more working memory to free",
      "Both do slightly worse, because writing about the exam primes the worry",
    ], answer: 1,
    why: "The effect is concentrated in the **test-anxious** students — about **B− → B+** for them. That is the whole logic of the intervention: it works by clearing worry out of working memory, so there has to be worry there to clear." },

  { q: "Which plan is most consistent with the expressive-writing evidence?",
    choices: [
      "One 60-minute session, in a group, with a facilitator present",
      "Three sessions of 20 minutes on consecutive days, alone, at home",
      "Five sessions of 10 minutes each, spread over the following month",
      "A single long session as soon as possible after the event, then stop",
    ], answer: 1,
    why: "**3 or more sessions**, **15 minutes or longer** (under 15 leaves people *worse off*), **consecutive days** slightly better than spread out, and bigger effects **at home** and **alone** than in a lab or a group. The five-short-sessions option fails on duration; the single-session options fail on dosage." },

  { q: "The *overthinking hypothesis* is the lecture's explanation for which phenomenon?",
    choices: [
      "Why rumination predicts distress rather than relief",
      "Why skilled performers choke under pressure",
      "Why writing about worries frees up working memory",
      "Why naming feelings precisely reduces drinking to cope",
    ], answer: 1,
    why: "**Choking.** Pressure pushes attention onto a skill that normally runs automatically, and the monitoring disrupts it. Note how close the first option sits: rumination is also too much thinking, but it is a separate finding under the *expressing emotion is not always good* heading." },

  { q: "Asked how a tense family dinner felt, one student says *bad*. Another says *embarrassed, and a bit resentful — and I think my dad felt guilty.* What does the research on emotion differentiation predict about the second student?",
    choices: [
      "More distress in the short term, since they are dwelling on the detail",
      "Better regulation under stress, and less drinking to cope",
      "No difference, since both have identified a negative feeling accurately",
      "Better recall of the event, but no difference in how they handle it",
    ], answer: 1,
    why: "**Emotion differentiation** (Kashdan, Barrett & McKnight) — naming feelings precisely instead of as one lump of *bad* — predicts better **regulation under stress**, less **drinking to cope**, and less **aggression when provoked**. The second answer would also score higher on the lecture's 5-point scale, since it names a blend of feelings for **both** people." },

  { q: "Uhls et al. found that five screen-free days at nature camp improved children's ability to read faces. Why does the lecture flag the design?",
    choices: [
      "There was no comparison group, so the gain could be practice at the task",
      "Camp changed several things at once, so the screen-free part is not isolated",
      "The effect size was too small to be meaningful in daily life",
      "Face-reading was measured only after camp, never before it",
    ], answer: 1,
    why: "Camp removed screens — but it also added **nature** and **intensive face-to-face contact**. There *was* a control group (−4.6 errors against −2.4, *d* = .33); the problem is not the comparison, it is that the treatment is a bundle, so no one variable can be credited." },
],

/* ================================================================ w03 */
w03: [
  { q: "In Mueller and Dweck's praise experiment, why was a third round of *easy* problems included at all?",
    choices: [
      "To let every child finish the session on a success",
      "So each child could be measured against their own round-1 baseline",
      "To check that the difficult round had not simply exhausted them",
      "To see which children would ask to attempt the hard problems again",
    ], answer: 1,
    why: "Round 3 repeats round 1's difficulty, so the comparison is **within child**, not between groups of different ability. That is what licenses the claim: smart-praised children fell **below their own** earlier score and effort-praised children rose **above** theirs, with the praise as the only thing that differed." },

  { q: "A student fails a midterm badly. Which pair of reactions correctly maps onto growth and fixed mindsets?",
    choices: [
      "Growth: *I'll work harder next time.* Fixed: *I'll drop the course.*",
      "Growth: information about what to try next. Fixed: evidence about who I am.",
      "Growth: the test was unfair. Fixed: I should have studied more than I did.",
      "Growth: ability can grow slowly. Fixed: ability is fixed from birth onward.",
      ], answer: 1,
    why: "The distinction is about **what the failure is taken to mean**, not about how cheerful the response sounds. *I'll work harder* can be a fixed-mindset answer if the student still believes effort only compensates for missing ability. The growth version treats the result as **data about strategy**: what to change, what help to get." },

  { q: "Yeager et al. found the largest effects in the lowest- and middle-achieving schools. What is the explanation offered in class?",
    choices: [
      "The intervention was delivered more intensively in those schools",
      "There was more room to move, and the fixed belief was costing more there",
      "Those students had lower baseline GPAs, so any change looks proportionally bigger",
      "Teachers in high-achieving schools were less willing to reinforce the message",
    ], answer: 1,
    why: "This was the in-class discussion question and makes a good short essay. Two parts: **headroom**, and the fact that a fixed-mindset belief does **more damage** where students are already struggling. Note that peer norms mattered too — effects were bigger where classmates' norms supported a growth mindset." },

  { q: "Crum's stress-mindset study contrasted *stress-is-debilitating* with *stress-is-enhancing*. Which set of outcomes did it measure?",
    choices: [
      "Salivary cortisol, resting heart rate, and a self-reported stress questionnaire",
      "GRE problems solved, salivary alpha-amylase, and GRE scores months later",
      "Grade point average, class attendance, and a standard anxiety inventory",
      "Blood pressure under load, reaction time, and recall of a word list",
    ], answer: 1,
    why: "A behavioural measure (**difficult GRE problems solved**), a physiological one (**salivary alpha-amylase**, not cortisol), and a real-world follow-up (**actual GRE scores at one to three months**). The cortisol option is the trap — it is the obvious stress hormone, and it is the one Creswell's values-affirmation study used, not this one." },

  { q: "*I'm just not a maths person* expresses an **entity theory**. What does Dweck's **incremental** alternative hold?",
    choices: [
      "That ability is largely set, but effort can compensate for what you lack",
      "That ability changes with effort, strategy and help",
      "That ability grows on its own, given enough exposure and time",
      "That ability is domain-specific, so being poor at maths implies nothing else",
    ], answer: 1,
    why: "**Entity theory** is the fixed mindset — some people have it, some do not. The **incremental** view is that people can change things about themselves with **effort, strategy and help**: all three, not effort alone. The first option is the most common misreading of Dweck, and it is still a fixed mindset — it keeps ability fixed and treats effort as what you fall back on when you lack it, which is exactly the belief that makes failure feel like a verdict." },
],

/* ================================================================ w04 */
w04: [
  { q: "Killingsworth and Gilbert found minds wander about 47% of the time. What was the second finding, the one the lecture leans on?",
    choices: [
      "Mind-wandering was most frequent during commuting and routine chores",
      "People were less happy when their minds wandered, whatever they were doing",
      "People were happier when their minds wandered somewhere pleasant",
      "Mind-wandering grew steadily more common with the age of the participant",
    ], answer: 1,
    why: "Wandering predicted **lower happiness regardless of the activity** — and the wandering came **first** in time, so it is not simply that dull activities invite it. Pleasant wandering was no better than being present, which is why the third option is the one worth ruling out deliberately." },

  { q: "Why does a strong essay on Haidt bring up Orben and Przybylski at all?",
    choices: [
      "Because their work shows screen time is unrelated to any outcome",
      "Because it shows the causal claim is contested, which the honest position needs",
      "Because experiments always outrank the correlational evidence Haidt uses",
      "Because they found the decline in teen mental health began later than 2010",
    ], answer: 1,
    why: "The position the course models has three parts: the mental-health **trends are real**, the **correlation** with smartphone adoption is real, and the **causal claim is contested** — Orben and Przybylski used specification-curve techniques and found **minimal correlation**. Naming it is what makes an answer an argument rather than a summary." },

  { q: "In *Dial D for Distracted*, what did Liz Dunn's research show?",
    choices: [
      "Notifications fragment attention even when the phone is never picked up",
      "The mere presence of a phone at a social gathering reduces enjoyment",
      "People underestimate how often they check their phones, by about half",
      "Phone use before bed delays sleep onset more than caffeine does",
    ], answer: 1,
    why: "**Mere presence** — the phone does not have to buzz or be touched. The episode's named phenomenon is `inattentional blindness`, the brain's ability to miss things directly in front of us, and the other named guest is **Catherine Price**, author of *How to Break Up With Your Phone*." },

  { q: "Which of these is **not** one of Haidt's four solutions?",
    choices: [
      "Delaying the age at which children are given smartphones",
      "Daily screen-time reports sent automatically to parents",
      "Phone-free schools",
      "More unsupervised play, risk and independence",
    ], answer: 1,
    why: "His four are **delayed introduction**, **phone-free schools**, **more unsupervised play and independence**, and **tech-policy change** — plus cultural and parental behaviour change. Surveillance of children's usage is not among them, and sits awkwardly with the independence argument." },

  { q: "Herbert Simon wrote that *a wealth of information creates a poverty of attention.* What does the lecture build on that?",
    choices: [
      "That information should be rationed in order to protect attention",
      "That attention is the scarce resource, and therefore the thing being sold",
      "That attention has declined measurably since the quote was written in 1971",
      "That judgment and character depend on controlling what we attend to",
    ], answer: 1,
    why: "The lecture's structure is three claims: attention is **scarce**, it is **for sale** (advertising pays for the feed), and the business model therefore competes for it. The last option is **William James** (1890) on bringing back a wandering attention as *the very root of judgment, character, and will* — true, and a different point." },
],

/* ================================================================ w05 */
w05: [
  { q: "A student averages 5h30 a night instead of 6h30. What does Creswell et al. (2023) predict for their end-of-term GPA?",
    choices: [
      "About 0.07 lower",
      "About 0.7 lower",
      "No change, provided they catch up at weekends",
      "Lower, but only if they are already a weak student",
    ], answer: 0,
    why: "**0.07 of a GPA point per hour of average nightly sleep.** The trivia slide states it in the other direction — *each hour less predicts GPA falling by about…* — but it is the same coefficient. Small per hour, and it compounds across a term of short nights." },

  { q: "In that study, which students' end-of-term GPA actually suffered?",
    choices: [
      "Those whose sleep varied most from night to night",
      "Those averaging under six hours a night",
      "Those who slept well but went to bed after 2am",
      "Those who napped during the day to make up the shortfall",
    ], answer: 1,
    why: "The sample averaged about **6 hours 29 minutes** on weeknights, and it was the **under-six-hour** sleepers whose grades fell. The study tracked over **500 first-year students at three universities**, concentrating on the first weeks of the winter term." },

  { q: "Ji and Wilson recorded a rodent's hippocampus after it had run a maze. Why does the lecture use this to argue sleep is a learning intervention rather than rest?",
    choices: [
      "Because the animals ran the maze faster after sleeping than after resting",
      "Because the brain replayed the maze firing sequence during slow-wave sleep",
      "Because hippocampal activity was suppressed, letting the memory settle",
      "Because the replay happened during REM sleep, when dreaming occurs",
    ], answer: 1,
    why: "**Neural replay** — the same sequence, in order, during **slow-wave** sleep. That makes sleep a period when the day's learning is re-run and consolidated, not merely downtime. The REM option is the one to watch: replay of this kind is a slow-wave phenomenon." },

  { q: "Wagner et al. (2004) is cited for which claim?",
    choices: [
      "That sleep improves insight and problem-solving",
      "That eight hours is the threshold below which performance falls away",
      "That naps recover roughly half the deficit of a short night",
      "That sleep deprivation impairs mood more than it impairs memory",
    ], answer: 0,
    why: "Participants who slept were far more likely to spot a hidden shortcut in a problem they had already practised. It is the strongest version of the argument: sleep does not just protect yesterday's learning, it can produce **insight** that was not there before." },

  { q: "Of the CMU time-use figures, which pairing is right?",
    choices: [
      "Schoolwork 37%, exercise 4%",
      "Schoolwork 29%, exercise 6%",
      "Schoolwork 13%, exercise 9%",
      "Schoolwork 37%, exercise 13%",
    ], answer: 0,
    why: "Schoolwork **37%**, personal time **29%**, in class **13%**, eat/drink **9%**, naps **6%**, exercise **4%**, job **2%**. Schoolwork and class together take about half the waking day; exercise takes a twenty-fifth of it — which is worth holding next to the exercise lecture's effect sizes." },
],

/* ================================================================ w06 */
w06: [
  { q: "*Replicate your testing environment* is one of the two strategies the exam's worked example marks correct. Which finding is it built on?",
    choices: [
      "Interleaving — alternating between problem types during practice",
      "Context-dependent memory — divers who learned underwater recalled underwater",
      "Levels of processing — semantic encoding beats shallow encoding",
      "Spacing — distributed practice outlasts the same hours massed together",
    ], answer: 1,
    why: "**Godden & Baddeley (1975).** Retrieval cues include the setting, so matching it at test gives you back cues you had at encoding. Interleaving is the *other* correct strategy in that question — it is what *alternate between types of problems* refers to — so both appear in the key, but for different reasons." },

  { q: "In the depth-of-processing demonstration, participants judge words by one of four questions. Which ordering of later recall does Craik and Lockhart predict?",
    choices: [
      "*In capitals?* < *Rhymes with train?* < *Is it an animal?* < *Fits in the sentence?*",
      "*Fits in the sentence?* < *Is it an animal?* < *Rhymes with train?* < *In capitals?*",
      "All four are recalled about equally; what matters is how long you spend",
      "Rhyme beats meaning, because sound is the stronger retrieval cue",
    ], answer: 0,
    why: "Shallow **visual** → **phonological** → **semantic** → **meaning in context**, which is deepest. The general rule is that recall tracks the **depth of processing at encoding**, not time on task — which is why rote repetition is such a poor use of an hour." },

  { q: "Students reliably *prefer* one long massed study block. What does the evidence say about that preference?",
    choices: [
      "The preference is sound; massed practice suits material learned in one sitting",
      "Preference is strong and the learning evidence is weak — fluency is not learning",
      "The preference holds only for students who are already doing well",
      "Massed practice works, but only when paired with a good night's sleep",
    ], answer: 1,
    why: "A **misleading fluency effect**. Massed practice makes material feel easy *while you are in it*, and that feeling is mistaken for having learned it. The metacognitive error is the dangerous part: it is a judgement about your own learning that points the wrong way." },

  { q: "Which three moves are the Bjorks' *desirable difficulties*, and the professor's closing advice for this final?",
    choices: [
      "Review it, summarise it, teach it",
      "Vary it, space it, quiz yourself",
      "Read it, write it, say it aloud",
      "Encode it, store it, retrieve it",
    ], answer: 1,
    why: "**Vary it · space it · quiz yourself.** The last option is the three *stages* of learning, which is a different list and the obvious trap. Difficulties are *desirable* when they slow you down during practice but improve what survives to the test." },

  { q: "Amnesic patients improve at mirror drawing across sessions while having no memory of ever having practised. What does the lecture draw from this?",
    choices: [
      "Procedural skill is a separate system from memory for events",
      "Feedback matters more than repetition for building a skill",
      "Skills are encoded more deeply than facts, so they survive damage",
      "Sleep consolidates motor learning but not declarative learning",
    ], answer: 0,
    why: "**Procedural** learning runs on different machinery from the memory for episodes (Corkin, 1968). For deliberate skill building the lecture's three rules are: have **goals**, get **immediate feedback**, and **interleave** your practice." },
],

/* ================================================================ w07 */
w07: [
  { q: "A student's diary shows 9 hours in bed, 6 hours 15 asleep, long stretches awake and frustrated. Which profile is this, and which lever does it point to?",
    choices: [
      "Deprived — the lever is opportunity, so protect the window",
      "Wired — efficiency under 80%, so the lever is arousal",
      "Drifter — the bedtime is irregular, so the lever is the body clock",
      "Happy sleeper — six hours is within the normal range for students",
    ], answer: 1,
    why: "Sleep efficiency is **TST ÷ TIB** = 6.25 ÷ 9 ≈ **69%**, well under the 85% of a healthy sleeper. Lots of time in bed with low efficiency and frustration is the **Wired** signature, and the first move is stimulus control: bed for sleep only, and get up if you are awake 15–20 minutes." },

  { q: "Why is **wake time** — not bedtime — the thing brief behavioural treatment holds constant?",
    choices: [
      "Because bedtime cannot be controlled, while getting up is a decision",
      "Because it is the body clock's strongest cue and builds sleep pressure",
      "Because waking early guarantees you will be sleepy at a reasonable hour",
      "Because total sleep time is what matters, and wake time is easier to measure",
    ], answer: 1,
    why: "Three reasons, and the exam may want any of them: the **body clock's strongest cue**, it determines **when you see morning light**, and it builds **tonight's sleep pressure**. The specific failure it prevents is weekend drift — 1am on weekdays and 3am at weekends is a two-hour shift, and Sunday night is the bill." },

  { q: "Which description matches **sleep restriction**, as distinct from stimulus control?",
    choices: [
      "Using the bed only for sleep and sex, and leaving it when you cannot sleep",
      "Limiting time in bed, then gradually increasing it as efficiency improves",
      "Changing the beliefs and attitudes about sleep that keep you ruminating",
      "Keeping a fixed wake time every day of the week, weekends included",
    ], answer: 1,
    why: "**Sleep restriction** compresses time in bed so sleep consolidates, then expands it as efficiency rises. **Stimulus control** (Bootzin, 1972) is the associative component — the first and fourth options — and it is the **best-supported single component of CBT-I**. The third is the cognitive part of CBT-I." },

  { q: "You feel foggy and low on energy at 3pm, and again at 9pm. Rule 2 says go to bed only when sleepy. What is the distinction?",
    choices: [
      "Tired is physical and sleepy is mental; only the physical kind predicts sleep",
      "Sleepy means eyes closing and losing the thread; tired is low energy and fog",
      "They are the same state, and 9pm tiredness is the signal to go up",
      "Tired follows exertion, sleepy follows a build-up of adenosine across the day",
    ], answer: 1,
    why: "**Tired** — low energy, brain fog — can happen at 3pm and is not a sleep signal. **Sleepy** — eyes closing, head nodding, losing the thread — is. Going to bed tired but not sleepy is how you end up lying awake, which is exactly the association stimulus control is trying to break." },

  { q: "Brief behavioural treatment for insomnia was compared against an information pamphlet. What happened at four weeks?",
    choices: [
      "54% insomnia-free on treatment against 13% on the pamphlet",
      "About a third improved on each, with the difference appearing only later",
      "71% insomnia-free on treatment against 40% on the pamphlet",
      "The treatment helped sleep but left daytime impairment unchanged",
    ], answer: 0,
    why: "**54% against 13%**, with gains persisting at a year across 30 randomised trials. Treating insomnia also lifts depression (23 studies) — part of why the lecture insists insomnia is **very treatable**, which matters given roughly **1 in 10 college students** meet the criteria." },
],

/* ================================================================ w08 */
w08: [
  { q: "Brooks names three types in the generative-AI age. Which trait sorts people between them, and which group retains its capacities?",
    choices: [
      "Technical fluency — the *reluctant optimizers*, who adopt tools slowly",
      "Need for cognition — the *mental marathoners*, who score high on it",
      "Need for cognition — the *productive passengers*, who delegate the routine",
      "Tolerance for ambiguity — the *mental marathoners*, who sit with uncertainty",
    ], answer: 1,
    why: "**Need for cognition**: how much someone engages in and *enjoys* effortful cognitive activity. Low → **productive passengers**, capacities diminished. Medium → **reluctant optimizers**, slowly diminishing. High → **mental marathoners**, capacities retained." },

  { q: "Kosmyna et al. compared people writing essays with and without AI assistance. What did the brain-only group show?",
    choices: [
      "Faster completion, with no measurable difference in what they retained",
      "The strongest, widest-ranging connectivity, and they could quote their own essays",
      "More activity in language regions but less in regions tied to memory",
      "Higher-rated essays, though they reported finding the task more unpleasant",
    ], answer: 1,
    why: "Strongest and **widest-ranging connectivity** between regions, plus more accurate quoting of their own work afterwards. This is Module 06's depth-of-processing point in neural form: **the tool removed the processing**, and the processing was what produced the memory." },

  { q: "McBain et al. compared three language models with expert suicidologists. Which part of the result does the lecture treat as the concerning one?",
    choices: [
      "That the models rated responses as more appropriate than the experts did",
      "That all three were outliers — confidently different from expert judgement",
      "That the models disagreed with each other as much as with the experts",
      "That no model reached the standard of a trained mental-health professional",
    ], answer: 1,
    why: "Both halves are true, but being **confidently different from the experts** is the part that matters — a model that simply erred in a known direction could be corrected for. The benchmarks were also uneven: ChatGPT-4o ≈ a master's-level counsellor, Claude 3.5 Sonnet exceeding mental-health professionals, Gemini 1.5 Pro ≈ untrained K-12 school staff, which is itself the point that *AI* is not one thing." },

  { q: "The generalisation barrier was taught as widening circles: CMU students → Pitt students → 18–25s in Pittsburgh → all adults in Pennsylvania → the US. What is the claim?",
    choices: [
      "More training data always improves performance on the original population",
      "Fit degrades as the user population diverges from the training population",
      "Models must be retrained for each campus before they can be deployed",
      "Smaller training populations produce more accurate but narrower models",
    ], answer: 1,
    why: "The further the users sit from whoever the system was built on, the worse the fit — which for a mental-health tool is a safety problem, not just an accuracy one. It is one of **three ethical barriers**, with **legal responsibility** (*offering therapy but denying responsibility*) and **data security and confidentiality**." },

  { q: "Which argument *against* using AI for mental health came out of the class debate, as distinct from an argument for it?",
    choices: [
      "It is available at 3am, when friends are asleep and counselling is closed",
      "Cognitive processing is lost — reflection takes the time the AI removes",
      "It is a modern form of journaling, which already has an evidence base",
      "Reflecting alone can spiral into rumination, and a responder interrupts that",
    ], answer: 1,
    why: "The others are all arguments **for**. The against column ran: **over-reliance** feeding a cycle of AI use and reduced social connection, **data is not safe**, **less genuine connection**, **cognitive processing is lost**, and dependency on the model's affirmations — including cases where it led to harm." },
],

/* ================================================================ w09 */
w09: [
  { q: "Febreze failed at launch despite working as a product. What was missing, in habit-loop terms?",
    choices: [
      "A routine — using it required a new behaviour people had no slot for",
      "A cue — people are desensitised to the smells in their own homes",
      "A reward — the result was invisible, so nothing reinforced the spray",
      "A craving — the advertising never told people what to want from it",
    ], answer: 1,
    why: "**No cue.** The pitch was *gets bad smells out of fabrics*, aimed at people who could no longer smell their own houses — so nothing ever triggered the behaviour. The fix supplied cue *and* craving: repositioned as a **reward at the end of an existing cleaning routine**, with **more perfume added** and the line changed to *cleans life's smells*. Sales doubled within two months." },

  { q: "A student sets a fixed cue (gym bag by the door, straight after her last class) and a clear reward (coffee afterwards), and still quits in week three. What does Duhigg's account say is missing?",
    choices: [
      "The reward is too delayed; it has to arrive during the routine itself",
      "A craving — the brain has to start anticipating the reward in advance",
      "The cue is too weak; location cues beat time-of-day cues",
      "Nothing is missing — three weeks is simply too short for a habit to form",
    ], answer: 1,
    why: "**Cue → routine → reward** is the shape, but **craving is what powers it**. A habit is running when the brain starts *anticipating* the reward at the cue. Schultz's monkey Julio makes it visible: once the habit formed, the *I got a reward* response moved to **before the juice arrived** — and when the juice failed to come, that anticipation became craving." },

  { q: "Hopkins sold Pepsodent on the cue of tooth film and the reward of beautiful teeth. What was actually driving the habit?",
    choices: [
      "The tingling from the citric acid and mint oil",
      "The advertising reach, which made brushing a visible social norm",
      "The film itself, which returns daily and so re-cues the behaviour",
      "The low price, which removed the barrier to daily use",
    ], answer: 0,
    why: "The **tingle** — an ingredient with no cleaning function that became the craved signal. It is the same lesson as Febreze from the other direction: the stated reward is not always the operative one, and finding what people actually crave is the design problem." },

  { q: "Maya has quit within a fortnight every previous attempt. Which recommendation targets *that specific pattern*, and what is its mechanism?",
    choices: [
      "A stable cue — habits fire from context, not willpower",
      "Expect around 66 days — automaticity takes roughly two months",
      "A reward she craves — craving is what powers the loop",
      "A plan for the miss — one missed day otherwise becomes several",
    ], answer: 1,
    why: "All four are creditable practices, but her failure is specifically **quitting at two weeks** — the point where it still feels effortful because automaticity takes about **66 days**. Expecting ease by week two guarantees quitting at exactly the wrong moment. A strong essay names any three of the four *with mechanisms*; the marks are in the *why*, not the length." },

  { q: "In the 2002 New Mexico State study of 266 regular exercisers, what kept people going?",
    choices: [
      "A specific health goal, named by about two-thirds of the sample",
      "How good it made them feel (92%) and a sense of accomplishment (67%)",
      "Social commitment — having arranged to meet someone there",
      "Having started for health reasons rather than appearance reasons",
    ], answer: 1,
    why: "**92%** said they continued because of how good it made them feel; **67%** because of a craved sense of accomplishment. People *started* on a whim — the craving is what converted it into a habit, which is why building in something enjoyable right afterwards is not a soft recommendation." },
],

/* ================================================================ w10 */
w10: [
  { q: "Lindsay's 14-day trial ran three arms: Monitor + Accept, Monitor Only, and a control. Why was it designed that way?",
    choices: [
      "To compare app-based practice against in-person instruction",
      "To isolate acceptance by holding the monitoring training constant",
      "To test whether 14 days is enough for any effect to appear",
      "To separate the effect of practice time from the effect of the instructor",
    ], answer: 1,
    why: "A **dismantling** design: both active arms train attention, and only one adds **equanimity**, so whatever separates them is acceptance. The result — only **Monitor + Accept** reduced cortisol reactivity — is why the course can say **acceptance is the active ingredient** rather than merely that meditation helps." },

  { q: "What did the 2019 PNAS follow-up find, and in which arm?",
    choices: [
      "Less loneliness and +2 interactions a day, in Monitor + Accept",
      "Reduced loneliness in both meditation arms, with no difference between them",
      "Improved sleep quality and reduced rumination, in Monitor Only",
      "A rise in social interactions in both arms, with loneliness unchanged",
    ], answer: 0,
    why: "Again **Monitor + Accept only**: less loneliness and **+2 interactions a day**. The pattern across the two trials is the formula worth memorising — monitoring alone sharpens **attention**; monitoring **plus equanimity** is what moves **stress and health**." },

  { q: "The module summarises the model as `Suffering = Pain × Resistance`. What follows from the multiplication?",
    choices: [
      "Suffering can be eliminated once pain is brought down far enough",
      "With resistance at zero, pain remains but suffering does not follow",
      "Pain and resistance contribute equally, so either can be worked on",
      "Resistance is harmless when the pain itself is mild",
    ], answer: 1,
    why: "Multiply by zero and the product is zero, however large the pain. That is why meditation is framed as **equanimity reps** rather than relaxation: it trains the term you can actually change. Note the lecture puts meditation in the **effortful, skill-building** column — beside exercise and giving — not with sound baths and float tanks." },

  { q: "Farb et al. followed depressed patients watching sad film clips. What predicted an eightfold relapse risk?",
    choices: [
      "Heightened activity in regions tracking self-referential thought",
      "Body-awareness regions going quiet — sensory shutdown",
      "A failure to recover baseline mood within an hour of the clip",
      "Reporting the clips as less sad than other participants did",
    ], answer: 1,
    why: "**Sensory shutdown predicts relapse.** Patients whose body-awareness regions went *quiet* during sadness were at **8× higher relapse risk** — turning away from the feeling, rather than feeling it too intensely, is the danger sign. It is the clinical case for training sensory clarity and equanimity." },

  { q: "Mrazek et al. gave two weeks of mindfulness training against a nutrition class of the same dose. What changed?",
    choices: [
      "Less mind-wandering, and GRE reading up 16 percentile points",
      "Lower self-reported stress, with no change on any performance measure",
      "Better sleep and mood, with working memory unchanged",
      "Improved GRE scores only among participants who already meditated",
    ], answer: 0,
    why: "The matched control is what makes it convincing — same time, same structure, different content. **16 percentile points** on GRE reading in two weeks is a large effect for an intervention this short, and it runs through **attention**: less mind-wandering, more working memory available." },
],

/* ================================================================ w11 */
w11: [
  { q: "In Dunn, Aknin and Norton's Study 3, which pair of findings is correct?",
    choices: [
      "Others beat self, and $20 beat $5 by roughly the margin students predicted",
      "Others beat self, and the amount made no difference at all",
      "Self beat others in the evening, though others felt better the next morning",
      "Neither condition shifted evening happiness once baseline mood was controlled",
    ], answer: 1,
    why: "**+0.18** spending on others against **−0.19** on self, and **$5 worked as well as $20**. Both halves matter, because both are predicted wrongly: **63%** of students picked spending on themselves and **86%** picked $20 over $5. It is the same affective-forecasting failure that runs through the happiness and discomfort lectures." },

  { q: "Brown et al. followed 423 older married couples for five years. What did they find about support?",
    choices: [
      "Giving support predicted nearly 60% lower mortality; receiving it did not",
      "Receiving support predicted lower mortality; giving had no measurable effect",
      "Both giving and receiving predicted longer life, giving about twice as strongly",
      "Neither predicted mortality once health at baseline was accounted for",
    ], answer: 0,
    why: "**Giving, not receiving.** Receiving support was **not** linked to a longer life in this study — which is the counterintuitive part, and the reason the lecture frames helping as something you do *for* your own health rather than something you accept." },

  { q: "Konrath et al. found volunteering predicted lower mortality only under one condition. Which?",
    choices: [
      "Only above 200 hours a year — below that the dose is too small to matter",
      "Only for other-oriented motives; self-oriented did not differ",
      "Only when the volunteering was face to face rather than remote",
      "Only for volunteers who continued for more than four consecutive years",
    ], answer: 1,
    why: "**1.6%** four-year mortality for other-oriented motives against **4.0%** for self-oriented — essentially the **4.3%** of non-volunteers. **Doing the behaviour is not sufficient**, which is where the lecture's rules come from: **choose it, connect, see the impact, ask what would help.** The 200-hours figure is Sneed & Cohen on blood pressure, a different study." },

  { q: "Fleming's study of 46,336 UK workers across 11 types of wellbeing programme found almost nothing worked. What was the exception, and what is the catch?",
    choices: [
      "Mindfulness apps, though only among employees who already practised",
      "Volunteering and charity work — but the finding was cross-sectional",
      "Resilience training, though the effect faded within three months",
      "Nothing was an exception; all eleven programme types showed null results",
    ], answer: 1,
    why: "**Volunteering and charity work** was the only programme type with a benefit — and because it is **cross-sectional**, happier employees may simply be the ones who volunteer. On the lecture's evidence ladder that sits near the bottom, well below Dunn's randomised Study 3." },

  { q: "A friend is distressed about a family situation. You offer to walk them through the university's leave-of-absence paperwork. Which concept names the possible mistake?",
    choices: [
      "The matching hypothesis — the support offered may not match the need",
      "The escalation ladder — this should have gone straight to a referral",
      "Tangible assistance, which the evidence finds least effective of the three",
      "The effort paradox — practical help is undervalued in the moment",
    ], answer: 0,
    why: "Three kinds of support — **tangible**, **informational**, **emotional** — and the **matching hypothesis** says to fit the support to the need. Offering informational support to someone in an emotional conversation is Module 01's failure in another costume. The practical move is to **ask what would help**." },
],

/* ================================================================ w12 */
w12: [
  { q: "What is **ALGEE**?",
    choices: [
      "The escalation ladder used when a student may be at risk",
      "The Mental Health First Aid action plan",
      "CaPS's triage protocol for deciding on an external referral",
      "The framework for the conversation: observe, listen, consult, act",
    ], answer: 1,
    why: "**Mental Health First Aid action plan** — the named acronym from this lecture, and the kind of term a fill-in-the-blank question is built on. The four-step sequence in the last option is the lecture's own escalation ladder, which is a different thing: **observe → listen and support → consult or refer → take immediate action**." },

  { q: "A classmate has missed two weeks of class and seems withdrawn. Which opening best fits the lecture's guidance?",
    choices: [
      "*Why have you stopped coming to class? Is everything all right at home?*",
      "*I noticed you haven't been coming to class, and I'm concerned. Tell me more.*",
      "*Are you depressed? It sounds like you might need to talk to someone.*",
      "*You've always been so reliable — this isn't like you at all.*",
      ], answer: 1,
    why: "**Observations about behaviours**, not personality, judgements, or a guess at a diagnosis — and an invitation rather than a question. *Why* elicits defensiveness (use **how come?**); naming a condition is outside what a peer should do; and *this isn't like you* is a comment on character." },

  { q: "When does the ladder call for **take immediate action** rather than consult or refer?",
    choices: [
      "When the student has missed more than a fortnight of classes",
      "When behaviour implies a threat to self or others",
      "When the student declines to talk and withdraws from the conversation",
      "When they have already been seen by CaPS and are still struggling",
    ], answer: 1,
    why: "**Threat to self or others, or a physical confrontation or direct threat** — those are the triggers. Everything short of that is *consult or refer*: Student Support Resources, a housefellow, the **CMU Cares Form**, or ringing CaPS on **412-268-2922** to consult about a student, which they answer 24/7." },

  { q: "Someone is becoming more agitated as they talk. Which move does the lecture recommend, and why?",
    choices: [
      "Open-ended questions, because they let the person release what they are feeling",
      "Closed-ended questions, because they de-escalate and ground",
      "Silence, because filling the space adds pressure",
      "Naming the emotion you can see, because being understood calms people",
    ], answer: 1,
    why: "Open questions **encourage disclosure**; closed questions **de-escalate and ground** — *have you eaten today? would you like a drink of water?* Planning is also grounding. And the line worth carrying out of this lecture: **emotions are contagious, so act calm.**" },

  { q: "Which statement about CaPS is accurate?",
    choices: [
      "Students receive a standard allocation of 12 sessions per academic year",
      "About 38% are referred externally from consult or triage",
      "Students wait for services without support in the interim",
      "Psychiatric services are not available and must be sought off campus",
    ], answer: 1,
    why: "**38%** referred externally from consult/triage — so most students are *not* sent out, which is the myth being corrected. There is **no fixed 12-session cap**; treatment length varies, often about a semester. Support is always offered while waiting, and psychiatry case management and short-term psychiatric treatment are available. The 12-visit figure belongs to **TimelyCare**, which is free, virtual and 24/7." },
],

/* ================================================================ w13 */
w13: [
  { q: "In Noetel et al.'s 218-trial meta-analysis, how did exercise compare with the gold-standard treatments for depression?",
    choices: [
      "Comparable to SSRIs, but well behind CBT",
      "Dance and walking/jogging beat CBT, and all three beat SSRIs",
      "Equivalent to both once trial quality was adjusted for",
      "Better than SSRIs for mild depression only, and worse for moderate",
    ], answer: 1,
    why: "**Dance 0.96, walking/jogging 0.62, yoga 0.55, CBT 0.55, strength 0.49, mixed aerobic 0.43, tai chi 0.42, SSRIs 0.26.** CBT sits level with yoga, and SSRIs come last — which is the headline the lecture wants you to be able to state, with the ordering, not just the direction." },

  { q: "Erickson et al. put older adults on a year of walking three times a week, against stretching. What happened to the hippocampus?",
    choices: [
      "Walkers held steady while stretchers lost volume at the usual rate",
      "Walkers gained about 2%; stretchers lost about 1.4%",
      "Both groups lost volume, walkers more slowly",
      "Walkers gained volume only in the first six months, then plateaued",
    ], answer: 1,
    why: "The hippocampus normally shrinks **1–2% a year** at that age, so the walking group did not merely slow the decline — they **reversed** it. That is the strongest form of the claim, and it is why the lecture treats exercise as a brain intervention rather than a cardiovascular one." },

  { q: "In the Copenhagen study, tennis added 9.7 years and the gym 1.5. Which explanation does the lecture endorse?",
    choices: [
      "Intensity — racquet sports demand more sustained cardiovascular output",
      "Sociality — the top three are the most social sports",
      "Duration — people play racquet sports for longer at a time",
      "Selection — healthier people take up tennis in the first place",
    ], answer: 1,
    why: "**Tennis 9.7, badminton 6.2, soccer 4.7** — the three most social, with the solitary gym session last at 1.5. The class exercise was to rank them and then explain: theories about **bodies** (heart and lungs, calories, intensity) do badly here, theories about **fun, skill, other people and sticking with it** do well." },

  { q: "Zahrt and Crum followed 61,141 adults for up to 21 years. What is the finding, stated precisely?",
    choices: [
      "People who believed they were less active than peers died earlier, because they were",
      "71% higher mortality, after adjusting for actual activity",
      "Beliefs about activity predicted mortality only among people who were genuinely inactive",
      "Perceived and actual activity predicted mortality about equally strongly",
    ], answer: 1,
    why: "The phrase **after adjusting for actual activity** is the whole result — two people moving identically, differing only in what they believed about it, had different mortality risk. The first option is the reading that makes the finding trivial, and it is the one to rule out." },

  { q: "Ruby et al. found that actual enjoyment of exercise exceeded predicted enjoyment in all four studies. What is the mechanism, and the practical rule?",
    choices: [
      "We remember the end best, so finish on something pleasant",
      "We judge the whole workout by its first few minutes — so discount them",
      "We forecast from our worst past session rather than our average one",
      "We underestimate how long it takes, so plan for more time than you expect",
    ], answer: 1,
    why: "**Forecasting myopia**: the opening minutes are the worst part, and they dominate the prediction. The practical move is to **discount the first few minutes** — and the closing formula for the whole lecture is **choose it, share it, start small**. (Judging an experience by its end is the **peak-end** rule, which belongs to Module 16.)" },
],

/* ================================================================ w14 */
w14: [
  { q: "Ristow et al. gave antioxidant supplements alongside exercise training. Why is the result the lecture's clearest case for hormesis?",
    choices: [
      "Because antioxidants improved the adaptation beyond what exercise alone produced",
      "Because they blunted the stress signal and blocked the adaptation",
      "Because the effect appeared only at low doses, which is what hormesis predicts",
      "Because the supplement group trained harder without perceiving more effort",
    ], answer: 1,
    why: "Remove the stressor and you remove the adaptation. Hormesis — from the Greek *to set in motion* — is **low doses of a stressor producing adaptation**, and this is the cleanest demonstration that the uncomfortable signal is not a side-effect of the benefit; it is the mechanism of it." },

  { q: "Which structures are the brain's **alarm**, and which are the **volume control**?",
    choices: [
      "Alarm: prefrontal cortex and PAG. Volume: insula, cingulate, amygdala",
      "Alarm: insula, cingulate, amygdala. Volume: prefrontal and PAG",
      "Alarm: amygdala alone. Volume: the whole cortex acting together",
      "Alarm: insula and amygdala. Volume: cingulate cortex and hippocampus",
    ], answer: 1,
    why: "**Insula, cingulate, amygdala** sound the alarm and are **louder in chronic pain and anxiety**; the **prefrontal cortex** and **brainstem (PAG)** turn incoming signals up or down. The point of the diagram is that the volume is adjustable — which is what Ashar's pain reprocessing therapy exploits: **66%** pain-free or nearly so, against **20%** placebo injection and **10%** usual care." },

  { q: "Devyn's pain had spread everywhere and her test results were normal. What does the avoidance loop predict happens next, if nothing changes?",
    choices: [
      "The pain plateaus, since there is no tissue damage to worsen",
      "Avoidance brings relief now, and the brain learns *danger*",
      "The pain migrates to whichever area is used most in daily activity",
      "Medication becomes effective once the underlying anxiety is treated",
    ], answer: 1,
    why: "**Hurts → protect and avoid → relief now → the brain learns *danger* → a little bit now hurts more.** The loop is why her treatment looks so counterintuitive: **five to six hours of exercise a day with no pain medication for three to six weeks**. The relief is real each time, which is exactly what makes the loop so hard to break." },

  { q: "Woolley and Fishbach gave Second City improv students one instruction before a stage exercise. Which one worked, and what does it illustrate?",
    choices: [
      "Focus on your scene partner — attention outward reduces self-consciousness",
      "Make feeling awkward and uncomfortable the goal — discomfort reframed as progress",
      "Aim to make the audience laugh — a clear external target sustains effort",
      "Plan the opening line in advance — reducing uncertainty frees up attention",
    ], answer: 1,
    why: "Treating discomfort as **the sign you are doing it right** made them hold focus longer and take more risks. It is the **mindsets** entry in the lecture's six literatures, and it is a near-certain trivia question — the instruction is counterintuitive enough that the other three all sound more sensible." },

  { q: "A student wants to use discomfort deliberately. Which plan satisfies the lecture's rule 3?",
    choices: [
      "The hardest version available, since the adaptation scales with the dose",
      "A challenging dose they can handle, with enough in the tank, chosen not forced",
      "A dose set by someone else, so they cannot negotiate downwards",
      "Whatever provokes the strongest urge to avoid, since that marks the growth edge",
    ], answer: 1,
    why: "All three conditions, and **chosen, not forced** is the same variable as Leasure and Jones's rats — identical bodies, more anxiety in the forced runners. Rule 2 adds the qualifier the last option gets wrong: the urge to avoid is a **signal**, and the answer depends on whether it marks danger and overwhelm (listen) or your growth edge (turn toward)." },
],

/* ================================================================ w15 */
w15: [
  { q: "Diener operationalised **subjective well-being** as three components. Which?",
    choices: [
      "Life satisfaction, positive feelings, negative feelings",
      "Pleasure, meaning, and psychological richness of experience",
      "Purpose, autonomy, and positive relations",
      "Hedonic enjoyment, eudaimonic growth, and flow",
    ], answer: 0,
    why: "**Life satisfaction + positive feelings + negative feelings** — a judgement and two affective streams, measured separately. The second option is Oishi's three *lives*; the third is from Ryff and Keyes's six dimensions in Module 17. Diener's contribution was making happiness something you could put a number on at all." },

  { q: "Silver medallists look less happy than bronze. What is the mechanism, and which number is attached to it?",
    choices: [
      "Silver compares upward (*if only*); 0% of 2004 Olympic judo silver medallists smiled",
      "Bronze expected less, so exceeded expectations; 93% of bronzes smiled",
      "Silver medallists are more exhausted, having competed in the final itself",
      "Bronze is a relief from fourth place; silver and gold smiled at equal rates",
    ], answer: 0,
    why: "**Counterfactual comparison.** Silver thinks *if only*, bronze thinks *at least*. In 1992, bronze rated **7.1** against silver's **4.8**; in 2004 Olympic judo, **93%** of gold medallists smiled immediately after the final, **69%** of bronze, and **0%** of silver. The objective ranking runs one way and the happiness runs the other." },

  { q: "A Tetris version that speeds up as you improve is the most enjoyed, and makes time fly. Which condition of flow does that manipulate?",
    choices: [
      "Clear goals — the target is explicit at every moment",
      "Challenge matched to skill",
      "Immediate feedback — the score updates continuously",
      "Autonomy — the player controls the pace of play",
    ], answer: 1,
    why: "Flow needs **clear goals**, **immediate feedback**, and a **challenge that matches skill** — Tetris supplies the first two in every version, so the matching is the only thing the experiment varies. Too much challenge gives **anxiety or overload** (fast and faster), too little gives **boredom** (slow and steady)." },

  { q: "Csikszentmihalyi found 54% of moments at work were flow against 18% in free time — yet people at work wished they were elsewhere. What is the lesson?",
    choices: [
      "Self-reported flow is unreliable when people know they are being studied",
      "Flow and wanting to be somewhere are not the same thing",
      "Work produces flow but not happiness, so leisure matters more than it appears",
      "People underestimate how much they enjoy free time while they are in it",
    ], answer: 1,
    why: "The **paradox of work**. Free time was **52% apathy**, yet it is what people say they want more of. The practical reading: the activities that supply flow and the activities we *desire* come apart, so choosing by desire alone reliably underfills the day with the thing that engages you." },

  { q: "Lyubomirsky, Sheldon and Schkade put rough numbers on what drives happiness. Which split is theirs?",
    choices: [
      "50% genes, 40% circumstances, 10% what you do",
      "50% genes and temperament, 10% circumstances, 40% what you do",
      "40% genes, 20% circumstances, 40% activity — split evenly between the two",
      "A third each, which is why the course covers all three equally",
    ], answer: 1,
    why: "**~50% genes and temperament, ~10% life circumstances, ~40% what you do.** The small circumstances share is the striking part — it is the quantitative version of the hedonic treadmill — and the **40%** is the entire justification for a course built around practices." },
],

/* ================================================================ w16 */
w16: [
  { q: "Pham and Taylor had students picture either getting the A or the process of studying. What happened to the *prize* group?",
    choices: [
      "They studied more but scored lower, having studied the wrong material",
      "They studied less (11.6 hours) and scored lower (73%) than the process group",
      "They studied about the same amount, but reported more anxiety beforehand",
      "They matched the process group on hours and differed only on exam score",
    ], answer: 1,
    why: "Picturing the reward **reduced** studying — below even the log-only control at 14.5 hours. Process: **16.1 hours, 81%**. Prize: **11.6 hours, 73%**. The rule is **simulate the how**: walking through the steps helps, picturing the prize falls short, and dwelling on *why me?* backfires." },

  { q: "Gilbert's 532 students predicted happiness two months after a breakup. How did the prediction compare with reality?",
    choices: [
      "Predicted 3.89, actual 5.42 — slightly above where they started at 5.27",
      "Predicted 3.89, actual 4.10 — the direction was right, the size was not",
      "Predicted accurately on average, with large errors in both directions",
      "Predicted 3.89, actual 5.42 — but only for those who ended the relationship",
    ], answer: 0,
    why: "Actual happiness was **slightly higher than before the breakup**. The same pattern held for being denied tenure (predicted 3.42, actual 4.71) and losing an election (predicted 4.07, actual 5.33). We are wrong **in the same direction every time**: bad events hurt less, and for less time, than we expect." },

  { q: "What is *synthetic happiness*, in Gilbert's account?",
    choices: [
      "The happiness we manufacture when we don't get what we wanted",
      "A short-lived mood produced by deliberately reframing a bad event",
      "The illusion of happiness reported by people who are actually unwell",
      "Happiness derived from goods and status rather than relationships",
    ], answer: 0,
    why: "**Natural** happiness is what we get when we get what we wanted; **synthetic** happiness is what we *make* when we do not — and Gilbert's point is that it is every bit as real. His examples are Jim Wright, Moreese Bickham, and Pete Best: *happier than I would have been with the Beatles.* The **psychological immune system** produces it, and we do not believe in advance that we have one." },

  { q: "To predict how much you'd enjoy a date, hearing how one stranger's date went beat reading his profile by 49%. Why does the lecture call this *the fix we refuse to use*?",
    choices: [
      "Because the stranger's report is only accurate for people similar to you",
      "Because 75% still trusted the profile more, despite the larger error",
      "Because people cannot recall another person's experience accurately",
      "Because the effect disappears once people are told which is more accurate",
    ], answer: 1,
    why: "Forecast error **22.4** from the profile against **11.4** from one stranger's account — and **75% still preferred the profile**. We over-trust our own simulations and under-use other people's experience, which is why the hack for this blindspot is **ask someone who's been there**." },

  { q: "Kahneman's cold-water trials: A was 60 s at 14°C; B was that same 60 s plus 30 more as it warmed to 15°C. 69% chose to repeat B. What does this demonstrate?",
    choices: [
      "That duration is ignored entirely when an experience is unpleasant",
      "The peak-end rule — the remembered experience tracks the peak and the ending",
      "That a small improvement late in an experience outweighs a large one early",
      "That people prefer the longer option when both are equally painful overall",
    ], answer: 1,
    why: "B contained **strictly more total discomfort** and was still preferred, because it **ended more gently**. Redelmeier and Kahneman replicated it with colonoscopies: a gentler ending lowered remembered unpleasantness and brought **more patients back**. Hence **end on a high note** — and be sceptical of your memory of how bad something was." },
],

/* ================================================================ w17 */
w17: [
  { q: "In White and Dolan's data, how do watching TV and volunteering compare on the two axes?",
    choices: [
      "TV is highest on pleasure and lowest on reward; volunteering is highest on reward",
      "Volunteering is higher on both, which is why the lecture recommends it",
      "TV is highest on pleasure and middling on reward; working is lowest on both",
      "The two rankings are largely the same, with volunteering the one exception",
    ], answer: 0,
    why: "The orderings nearly **invert**. TV: **3.89 pleasure (1st), 2.20 reward (last)**. Volunteering: 3.38 pleasure but **4.82 reward (1st)**. Working was **last on pleasure (2.20)** and second on reward (4.26). This is the hedonic/eudaimonic distinction with numbers attached." },

  { q: "Coles et al. tested six gratitude practices across 34 countries. Which result does the lecture emphasise?",
    choices: [
      "Writing a letter without sending it worked nearly as well as sending it",
      "Sending a message worked best; listing five things — the most popular — worked least",
      "All six produced similar effects, so the choice of practice hardly matters",
      "The effects were largest in countries where gratitude practices are uncommon",
    ], answer: 1,
    why: "**The smallest effect came from the most popular practice.** Sending is what does the work, which fits Seligman et al. (2005), where the gratitude letter **delivered in person** gave the biggest boost of the exercises tested. The mechanism has three parts: **significance**, **coherence**, **connection** — and connection is the one that needs another person." },

  { q: "Kumar and Epley asked people to write gratitude letters, then surveyed the recipients. What did the recipients report, set against what the writers had predicted?",
    choices: [
      "Recipients valued the letters less than writers hoped — a self-enhancement bias",
      "Recipients were more surprised, more positive and less awkward than writers predicted",
      "Writers felt better immediately; recipients' mood was unchanged a week later",
      "Recipients reciprocated more often than writers expected, deepening the tie",
    ], answer: 1,
    why: "Another **affective-forecasting error** — the same family as Dunn's spending study and Gilbert's breakups. We expect awkwardness and so skip the practice that works, which is exactly the pattern from Module 01: we are miscalibrated about how these encounters will land, always in the direction that makes us do less." },

  { q: "Creswell et al. had participants affirm their important personal values before a lab stressor. What was measured, and what happened?",
    choices: [
      "Salivary alpha-amylase, which rose less sharply than in controls",
      "Salivary cortisol, whose response was blunted",
      "Heart rate variability, which increased during the speech task",
      "Urinary epinephrine, which was unaffected in the lab but not in the field",
    ], answer: 1,
    why: "**Value affirmation blunted the cortisol response** to a speech-plus-arithmetic task in front of evaluators. Sherman et al. (2009) replicated it in the field with **urinary epinephrine** during a real midterm. Alpha-amylase is the Crum stress-mindset measure from Module 03 — easy to swap if you have not pinned each study to its marker." },

  { q: "McAdams distinguishes **redemption** from **contamination** narratives. What is the distinction?",
    choices: [
      "Redemption runs bad → good; contamination runs good → bad",
      "Redemption stories are about other people, contamination stories about oneself",
      "Redemption requires the difficulty to have been chosen; contamination follows imposed hardship",
      "Redemption stories are more accurate; contamination stories distort what happened",
    ], answer: 0,
    why: "It sits under *meaning often comes from doing hard things, and from how you narrate them*. The claim is about the **shape of the telling**, not the accuracy of it — which is why it is actionable, and why *redemption* appears as a fill-in-the-blank answer on one of the practice papers." },
],

/* ================================================================ w18 */
w18: [
  { q: "Woolley and Fishbach asked what predicts sticking with a New Year's resolution. What did they find?",
    choices: [
      "Importance predicted persistence; enjoyment predicted only initial uptake",
      "Enjoyment predicted persistence; how important the goal was did not",
      "Both predicted it, with importance mattering more over longer horizons",
      "Neither predicted it; only having a specific implementation plan did",
    ], answer: 1,
    why: "**Enjoyment, not importance** — and the same held for studying and for exercise. It is the empirical backing for Waitzkin's order (**passion → learning → competition**) and for the exercise lecture's *choose it, share it, start small*. Picking the goal that matters most and gritting through it is the strategy this result contradicts." },

  { q: "Bönstrup had people practise for 10 seconds, then rest for 10, repeatedly. Where did the improvement happen?",
    choices: [
      "During the practice bursts, with rest preventing fatigue from masking it",
      "During the rest intervals",
      "Overnight, with the within-session pattern making no difference",
      "In the first few bursts only, after which performance plateaued",
    ], answer: 1,
    why: "The gains appeared **during the rest**, not during the practice — micro-consolidation between attempts. It gives a mechanism to the course's larger claim that rest is part of the work rather than an interruption to it, and it scales up to Module 05's neural replay during sleep." },

  { q: "Gump and Matthews followed 12,338 men at high cardiac risk for nine years. What did holidays predict?",
    choices: [
      "32% lower risk of dying of heart disease",
      "No difference once income and job type were controlled for",
      "Lower risk, but only for holidays of two weeks or longer",
      "Better self-reported wellbeing with no change in mortality",
    ], answer: 0,
    why: "**32% lower cardiac mortality.** Set that against Pew's figures — **46%** of US workers and **68%** of education workers take *less* paid time off than they are entitled to, with **49%** worried about falling behind. De Bloom adds the shape: wellbeing on holiday peaks at **day 8** and returns to baseline **1–6 weeks** after going back." },

  { q: "Which set of features does the lecture say makes a break actually work?",
    choices: [
      "Detach, move, with people, be present",
      "Long enough, far enough away, fully disconnected, planned in advance",
      "Sleep, exercise, nutrition, and time outdoors",
      "Novelty, challenge, achievement, and a clear end point",
    ], answer: 0,
    why: "**Detach · move · with people · be present** — all four illustrated by Waitzkin's summer on Bimini: no chess talk, boat work and diving, family, watching the fish. The in-class prompt — *how can we be purposeful about rest during this heavy final exam period?* — is a plausible short-essay question." },

  { q: "Bloom's three stages of expertise, in order, are:",
    choices: [
      "Precision, play, personal style",
      "Play, precision, personal style",
      "Imitation, precision, innovation",
      "Play, personal style, precision",
    ], answer: 1,
    why: "**Play** (fun, quick rewards — the park) → **precision** (technique, hard practice — Pandolfini and the classics) → **personal style** (making it their own). The order is the point and matches the enjoyment finding above: Waitzkin played chess for **a year before his first tournament**, so passion came before learning, and learning before competition." },
],

};
