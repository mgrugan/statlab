/* Hack Your Life — practice exam D, "Numbers".
 *
 * A fourth paper built entirely around the figures the course states, and
 * around where each one came from. Every explanation names the source —
 * the lecture it was shown in, the reading it was assigned with, or the
 * paper it is drawn from — because the trivia slide and the fill-in-the-
 * blank example both reward knowing which study a number belongs to, not
 * just the number itself.
 *
 * Same shape as the other three: 20 scored questions, 2 short essays.
 * Rendered with tex={false}, so dollar amounts are written plainly.
 */

export const WB_EXAM_NUMBERS = {
  title: "Practice Exam D — Numbers",
  lede: "Every figure the course puts a number on, and the study or reading it belongs to. Sit this one late, as a check on recall rather than understanding — it is the paper that tells you which numbers have not stuck.",
  questions: [

  { type:"mc", q:"**47%** is the figure for how often our minds wander. Which study produced it, and where did the course meet it?",
    choices:[
      "Mrazek et al. (2013) — the two-week mindfulness training study",
      "Ji & Wilson (2007) — the sleep lecture's neural-replay study",
      "Killingsworth & Gilbert (2010, *Science*) — the attention-economy lecture",
      "Orben & Przybylski — the specification-curve counterargument to Haidt",
    ], answer:2,
    why:"**Killingsworth & Gilbert (2010, *Science*)**, from the **attention economy** lecture, using an iPhone app that pinged people at random moments. Two findings, and the second is the one people forget: minds wander about **47%** of the time, **and** people were **less happy when their minds wandered**, whatever they were doing. The figure returns in the **meditation** module as the case for training concentration." },

  { type:"blank", q:"Yeager et al. (2019, *Nature*) tested a growth-mindset intervention at national scale. By how much did it raise end-of-ninth-grade cumulative GPA? (A number.)",
    answer:"0.10", accept:["0.10","0.1","about 0.10","+0.10",".10","0.10 gpa","0.10 points"],
    why:"**+0.10 cumulative GPA** — real, modest, and conditional. From the **mindsets** lecture. The conditions are what separate a strong answer from a slogan: largest effects in **lowest- and middle-achieving schools**, **not significant** in high-achieving ones, and bigger where **peer norms** supported a growth mindset." },

  { type:"blank", q:"Duhigg's chapter, and the model answer on the exam-prep slide, give a rough figure for how long automaticity takes. How many days? (A number.)",
    answer:"66", accept:["66","66 days","around 66","about 66","~66"],
    why:"**About 66 days** — roughly two months. From **Duhigg, *The Power of Habit*, ch. 2**, and named in the model answer the exam-prep slide showed for the Maya essay. It is the practice that targets quitting at the two-week mark, because expecting ease within a fortnight guarantees quitting at the point where it still feels effortful." },

  { type:"mc", q:"Noetel et al. (2024, *BMJ*) pooled 218 trials of treatments for major depression. Which two effect sizes bracket the table?",
    choices:[
      "CBT highest at 0.55, SSRIs lowest at 0.26",
      "Dance highest at 0.96, SSRIs lowest at 0.26",
      "Walking/jogging highest at 0.62, tai chi lowest at 0.42",
      "Dance highest at 0.96, strength training lowest at 0.49",
    ], answer:1,
    why:"**Dance 0.96** at the top, **SSRIs 0.26** at the bottom, from the **exercise** lecture. The full ordering: dance 0.96, walking/jogging 0.62, yoga 0.55, **CBT 0.55**, strength 0.49, mixed aerobic 0.43, tai chi 0.42, **SSRIs 0.26** — 218 trials, 14,170 adults. CBT sits level with yoga, which is the comparison the lecture wants you to be able to state." },

  { type:"blank", q:"In Erickson et al. (2011, *PNAS*), older adults walked three times a week for a year. By what percentage did their hippocampal volume change? (A number, with its direction.)",
    answer:"+2%", accept:["2%","+2%","2","gained 2%","up 2%","increased 2%","+2","2 percent"],
    why:"Walkers **gained about 2%**; the stretching control **lost 1.4%**. From the **exercise** lecture. The reason it matters is the baseline: the hippocampus normally shrinks **1–2% a year** at that age, so the walking group did not slow the decline, they **reversed** it." },

  { type:"mc", q:"The Copenhagen City Heart Study (Schnohr et al.) reported extra years of life by sport. Which pairing is right?",
    choices:[
      "Tennis 9.7 at the top, going to the gym 1.5 at the bottom",
      "Jogging 9.7 at the top, swimming 3.4 at the bottom",
      "Tennis 6.2 at the top, cycling 1.5 at the bottom",
      "Soccer 9.7 at the top, going to the gym 3.1 at the bottom",
    ], answer:0,
    why:"**Tennis 9.7 · badminton 6.2 · soccer 4.7 · cycling 3.7 · swimming 3.4 · jogging 3.2 · calisthenics 3.1 · gym 1.5**, from the **exercise** lecture — 8,577 adults followed 25 years. The point the lecture draws is that **the top three are the most social sports** and the solitary gym session comes last, so explanations built on hearts and calories do badly here." },

  { type:"blank", q:"Zahrt & Crum followed 61,141 US adults for up to 21 years. Believing you were less active than your peers carried how much higher mortality risk, after adjusting for actual activity? (A number.)",
    answer:"71%", accept:["71","71%","71 percent","about 71%","~71%"],
    why:"**71% higher mortality risk**, from the **exercise** lecture. The clause *after adjusting for actual activity* is the whole result — two people moving identically, differing only in what they believed about it, had different risk. It is the **mindsets** argument from the earlier lecture with a hard outcome attached." },

  { type:"mc", q:"Ashar et al. (2022, *JAMA Psychiatry*) compared pain reprocessing therapy with two controls. What proportion ended pain-free or nearly pain-free in each arm?",
    choices:[
      "Therapy 66%, placebo injection 20%, usual care 10%",
      "Therapy 54%, placebo injection 13%, usual care 10%",
      "Therapy 80%, placebo injection 30%, usual care 15%",
      "Therapy 66%, placebo injection 40%, usual care 25%",
    ], answer:0,
    why:"**66% · 20% · 10%**, from the **leaning into discomfort** lecture. Afterwards the **insula and cingulate** responded less to back pain — the alarm hubs quieting. The 54%/13% option is the **BBT-I insomnia** result from the sleep lecture, which is the figure most often swapped in by mistake." },

  { type:"blank", q:"Mrazek et al. (2013) gave two weeks of mindfulness training against a nutrition class. GRE reading comprehension improved by how many percentile points? (A number.)",
    answer:"16", accept:["16","16 points","16 percentile points","16 percentile","sixteen"],
    why:"**16 percentile points** in two weeks, from the **meditation** lecture. The matched control — a nutrition class of the same dose — is what makes it convincing, and the mechanism runs through **attention**: less mind-wandering, more working memory available." },

  { type:"mc", q:"Which figures describe the Lindsay dismantling trial, the study that isolates acceptance?",
    choices:[
      "48 undergraduates, two weeks, two arms",
      "532 students, two months, two arms",
      "153 stressed adults, 14 days, three arms",
      "266 regular exercisers, four weeks, three arms",
    ], answer:2,
    why:"**153 stressed adults, 14 days of a phone app, three arms** — Monitor + Accept, Monitor Only, and control — from the **meditation** lecture. Only **Monitor + Accept** reduced cortisol reactivity, which is what licenses the claim that **acceptance is the active ingredient**. The other options are Mrazek (48), Gilbert's breakup study (532) and Duhigg's New Mexico State exercisers (266)." },

  { type:"mc", q:"Dunn, Aknin and Norton also measured what students *predicted*. Which pair of figures is right?",
    choices:[
      "86% predicted spending on themselves would feel better; 63% predicted $20 would beat $5",
      "63% predicted spending on others would feel better; 86% predicted $5 would beat $20",
      "Just over half got each prediction wrong, in both directions",
      "63% predicted spending on themselves would feel better; 86% predicted $20 would beat $5",
    ], answer:3,
    why:"**63%** (69 of 109) picked spending on themselves and **86%** (94 of 109) picked $20 over $5 — from the **giving** lecture, with the reading Dunn, Aknin & Norton (2008, *Science*). Both predictions were wrong: the result was **+0.18** for others against **−0.19** for self, and **$5 worked as well as $20**." },

  { type:"mc", q:"Konrath et al. reported four-year mortality by volunteering motive. Which set is correct?",
    choices:[
      "1.6% other-oriented · 4.0% self-oriented · 4.3% non-volunteers",
      "1.6% other-oriented · 2.4% self-oriented · 4.3% non-volunteers",
      "2.0% other-oriented · 4.0% self-oriented · 8.6% non-volunteers",
      "4.0% other-oriented · 1.6% self-oriented · 4.3% non-volunteers",
    ], answer:0,
    why:"**1.6% · 4.0% · 4.3%**, from the **giving** lecture. The shape is the point: self-oriented volunteers are statistically indistinguishable from people who did not volunteer at all, so **doing the behaviour is not sufficient**. It is where the lecture's rules come from — **choose it, connect, see the impact, ask what would help**." },

  { type:"blank", q:"Brown et al. (2003) followed 423 older married couples for five years. Giving support predicted roughly what reduction in the risk of dying? (A percentage.)",
    answer:"60%", accept:["60","60%","nearly 60%","about 60%","~60%","60 percent"],
    why:"**Nearly 60% lower risk of dying**, from the **giving** lecture — and **receiving** support was **not** linked to a longer life, which is the counterintuitive half. It is the prospective-cohort tier of the lecture's evidence ladder, below Dunn's randomised Study 3 but well above the cross-sectional findings." },

  { type:"mc", q:"**92%** said they kept exercising because of how good it made them feel, and **67%** for a craved sense of accomplishment, in a 2002 study of 266 regular exercisers. Where does the course meet those figures?",
    choices:[
      "The exercise lecture, as evidence that enjoyment predicts adherence",
      "Duhigg, *The Power of Habit*, ch. 2 — supporting evidence for craving",
      "The Copenhagen City Heart Study, as the mechanism behind social sports",
      "Woolley & Fishbach (2017), the New Year's resolution study",
    ], answer:1,
    why:"**Duhigg, *The Power of Habit*, ch. 2** — the New Mexico State study he cites to show that people *started* exercising on a whim, and that a **craving** is what turned it into a habit. The idea travels to the exercise lecture and to Woolley & Fishbach's enjoyment-beats-importance result, but the numbers themselves belong to Duhigg's chapter." },

  { type:"blank", q:"Correcting the myth that CaPS refers most students elsewhere: what percentage are referred externally from consult or triage? (A number.)",
    answer:"38%", accept:["38","38%","38 percent","about 38%"],
    why:"**38%**, from the **supporting a peer / CaPS** lecture — so most students are *not* referred out. Of those who are, 60% have long-term treatment needs, 38% specialised care needs, 2% a higher level of care. The same lecture corrects the other myth: there is **no fixed 12-session cap** at CaPS; the 12-visit figure belongs to **TimelyCare**." },

  { type:"mc", q:"Which three figures describe the Harvard Study of Adult Development?",
    choices:[
      "Begun 1938 · 724 young men · 88 years and running",
      "Begun 1938 · 1,238 older adults · 50 years",
      "Begun 1948 · 724 young men · 60 years",
      "Begun 1938 · 532 young men · 88 years and running",
    ], answer:0,
    why:"**1938 · 724 young men · 88 years**, with 1,300+ descendants now enrolled — from the **happiness** lecture. Two groups: Harvard sophomores and boys from Boston's poorest neighbourhoods, which is part of why the finding is not simply about privilege. The headline: **relationship satisfaction at 50** predicted health at 80 better than **cholesterol at 50** did. The 1,238 figure is Boyle's purpose-and-mortality study from the meaning lecture." },

  { type:"blank", q:"In Pham and Taylor (1999), students who pictured the *process* of studying studied how many hours? (A number to one decimal place.)",
    answer:"16.1", accept:["16.1","16.1 hours","16","about 16"],
    why:"**16.1 hours, and 81%** on the exam — against **11.6 hours and 73%** for students who pictured getting the A, and **14.5 hours** for the log-only control. From the **happiness blindspots** lecture. Picturing the reward **reduced** studying below the control, which is the finding behind the hack **simulate the how**." },

  { type:"mc", q:"In Kahneman's cold-pressor study, what proportion chose to repeat the longer trial?",
    choices:[
      "About half, which the authors treated as indifference",
      "69%, despite it containing strictly more total discomfort",
      "75%, matching the share who preferred the dating profile",
      "93%, the same figure as the smiling gold medallists",
    ], answer:1,
    why:"**69% chose Trial B** — 60 seconds at 14°C *plus 30 more* as the water warmed to 15°C, so strictly more total pain with a gentler ending. From the **happiness blindspots** lecture, demonstrating the **peak-end rule**. The 75% and 93% figures are real but belong elsewhere: Gilbert's dating study and the 2004 Olympic judo smiles." },

  { type:"blank", q:"Gump and Matthews followed 12,338 men at high cardiac risk for nine years. Taking more vacations predicted what reduction in the risk of dying of heart disease? (A percentage.)",
    answer:"32%", accept:["32","32%","32 percent","about 32%"],
    why:"**32% lower risk**, from the **life of learning** lecture, where rest is argued to be part of the work rather than an interruption to it. Set it beside the Pew figures from the same lecture: **46%** of US workers and **68%** of education workers take less paid time off than they are given, and **49%** worry about falling behind." },

  { type:"mc", q:"Lyubomirsky, Sheldon and Schkade put rough percentages on what drives happiness. Which split is theirs?",
    choices:[
      "40% genes and temperament · 20% life circumstances · 40% what you do",
      "50% genes and temperament · 40% life circumstances · 10% what you do",
      "60% genes and temperament · 10% life circumstances · 30% what you do",
      "50% genes and temperament · 10% life circumstances · 40% what you do",
    ], answer:3,
    why:"**~50% · ~10% · ~40%**, from the **happiness** lecture. The small circumstances share is the striking part — the hedonic treadmill with a number on it — and the **40%** is the justification for a course built around practices. The lecture names its two biggest levers inside that 40%: **relationships** and **attention**." },

  { type:"essay", q:"The course argues repeatedly that we are poor forecasters of our own feelings. Give **three** findings from **different** lectures, with their figures, and say what the common structure is.",
    why:"<p>Any three, each with a number and a source. The marks are in naming the **common structure**, not in listing studies.</p><ul><li>**Dunn, Aknin & Norton** (giving lecture) — **63%** predicted spending on themselves would feel better and **86%** predicted $20 would beat $5; actually others beat self (**+0.18** against **−0.19**) and **$5 worked as well as $20**.</li><li>**Gilbert et al. (1998)** (blindspots lecture) — 532 students predicted **3.89** two months after a breakup; actual was **5.42**, slightly *above* the **5.27** they reported while still in the relationship.</li><li>**Ruby et al. (2011)** (exercise lecture) — across 4 studies and 279 adults, **actual enjoyment exceeded predicted enjoyment every time**.</li><li>**Coles et al. (2026)** and **Kumar & Epley** (gratitude lecture) — the practice people avoid, **writing and sending** a message, had the **largest** effect, while the most popular practice had the **smallest**; recipients were **more surprised, more positive and less awkward** than writers predicted.</li><li>**Kardas, Kumar & Epley (2021)** (conversations lecture) — we **overestimate awkwardness** and **underestimate** connection in deep conversation.</li></ul><p><strong>The structure:</strong> the error is **systematic**, not random — it runs in the same direction every time, and always towards doing **less** of the thing that works. That is what makes it exploitable: the practices we expect least from are disproportionately the ones worth trying, and the fix across the course is to stop trusting the simulation (<em>ask someone who's been there</em>, <em>discount the first few minutes</em>, <em>simulate the how</em>).</p>" },

  { type:"essay", q:"Using the numbers, make the case that exercise deserves to be discussed alongside the standard treatments for depression — and then state honestly what the figures do **not** establish.",
    why:"<p><strong>The case.</strong> Noetel et al. (2024, *BMJ*) pooled **218 trials** and **14,170 adults** with major depression: **dance 0.96**, **walking/jogging 0.62**, **yoga 0.55**, **CBT 0.55**, **strength 0.49**, **mixed aerobic 0.43**, **tai chi 0.42**, **SSRIs 0.26**. Several forms of exercise match or beat both gold standards, and CBT sits level with yoga. Supporting figures: Erickson's walkers **gained 2%** of hippocampal volume in a year while stretchers **lost 1.4%**, against a normal decline of **1–2% a year**; and small doses matter — **7,000 steps against 2,000** lowers all-cause mortality **47%**, and three daily bursts of 1–2 minutes in non-exercisers is associated with **38–40% lower mortality** at a median of 4.4 minutes a day.</p><p><strong>What it does not establish.</strong> Effect sizes are comparisons against usual care or placebo, not head-to-head superiority trials, and exercise trials are hard to blind, so expectancy is doing unknown work — which the course itself makes vivid with Zahrt & Crum's **71%**, where the *belief* about activity predicted mortality after adjusting for the activity. The Copenhagen figures (**tennis 9.7** years, **gym 1.5**) are **observational**, so selection is a live alternative to the sociality explanation. And nothing here says exercise should replace treatment for anyone already unwell; the defensible claim is that it belongs **in** the conversation, and that **choice** matters to whether it helps at all — Leasure & Jones's forced runners were **more anxious than even sedentary rats** on identical bodies.</p>" },

  ],
};
