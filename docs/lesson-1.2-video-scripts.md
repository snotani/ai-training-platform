# Lesson 1.2 — Short Video Scripts

Short-form video scripts (TikTok / Reels / Shorts, ≤60s each) based on **Lesson 1.2 — How models work** (tokens, next-token prediction, temperature, pre/post-training, scale). Same formula as the 1.1 scripts: first line is a hooking statement, then dive straight into a concrete relatable example, minimal jargon/filler, spoken words only.

CTA system is shared with Lesson 1.1 — see `lesson-1.1-video-scripts.md` for the `TYPES` comment-to-DM mechanic and the per-lesson keyword scheme. Course CTA (`TYPES`) is used on Videos 1, 2, and 4; Video 3 uses a guess-in-comments engagement prompt.

---

## Video 1 — "What's actually a token?"

**Concept:** tokens — what they are and how text gets split into them. Ends with the course CTA.

> You've seen this message — "you're out of tokens." Annoying. But what actually *is* a token, and how does it get split?
>
> Start here: the model doesn't read words like you do. It reads tokens — little chunks of text.
>
> Take "unbelievable." To you, one word. To the model, three tokens — "un," "believ," "able." Now a whole sentence — "I'll grab coffee later" — breaks into a handful of chunks too.
>
> So why those splits? The tokenizer learns the most common chunks of text and reuses them. A very common whole word like "the" or "running" is usually a single token, while a rarer or longer word gets chopped into smaller sub-word pieces it's seen before. Spaces and punctuation ride along as part of tokens too, and numbers often split digit by digit.
>
> So when you're "out of tokens," you're really out of chunks — not words.
>
> Want the rest of how AI actually works? I made a free beginner course — comment TYPES and I'll DM you the link.

---

## Video 2 — "The one setting that changes everything"

**Concept:** temperature — the randomness dial. Ends with the course CTA.

> There's one hidden dial that decides if AI sounds like a robot or a poet.
>
> Ask ChatGPT for a coffee shop tagline. Turn it low and you get "Great coffee, every day." Turn it up and you get "Sip the sunrise." Same prompt — totally different vibe.
>
> That dial is called temperature, and it's just how much randomness it allows. Low temperature: it always grabs the safest, most likely word — consistent, a little boring. High temperature: it takes chances, gets creative, occasionally goes off the rails.
>
> It's also why hitting "Regenerate" gives you a fresh answer every time — it's re-rolling which likely words to pick instead of repeating itself.
>
> So if your AI sounds flat, you don't need a better prompt — you need to turn the dial up.
>
> I break down all of this in a free beginner course — comment TYPES and I'll send it straight to your DMs.

---

## Video 3 — "How ChatGPT actually gets trained"

**Concept:** pre-training and post-training (fine-tuning + RLHF) — how a raw model becomes a helpful assistant. Ends with a guess-in-comments engagement prompt.

> Raw, untrained ChatGPT would be a nightmare to talk to. Here's the two-step glow-up that fixed it.
>
> Step one is pre-training: they let it read basically the whole internet — trillions of words — doing one thing over and over, guessing the next chunk of text. After enough of that it gets fluent and weirdly knowledgeable. But it's a know-it-all with zero manners — it'll ignore your actual question and just ramble facts.
>
> Step two is finishing school — this part's called post-training, and it's two moves. First, fine-tuning: humans show it thousands of examples of a good question and a good answer. Then RLHF — reinforcement learning from human feedback — where people rank its replies, this one's better, that one's worse, until it learns what we actually want.
>
> Pre-training gives it the knowledge. Fine-tuning and RLHF give it the manners. Skip step two and you've got a genius who won't shut up and won't answer the question.
>
> So tell me — if it had skipped finishing school, what's the rudest thing it'd say back? Drop it in the comments.

---

## Video 4 — "200B, 300B, 1T parameters — what does that even mean?"

**Concept:** parameters and scale — the billions of dials, what they encode, and why scale drives capability. Ends with the course CTA.

> You see it on every model — 200 billion parameters, 300 billion, a trillion. But what does that actually mean?
>
> A parameter is just a tiny dial inside the model, set while it trains — and there are billions of them.
>
> Each dial nudges one little association. One might capture that "Paris" strongly follows "the capital of France." Another, that "cat" and "pet" belong together. Another learns a plural tends to follow "three," or that an angry email sounds different from a thank-you note.
>
> No single dial knows anything. But turn billions of them at once and out comes grammar, facts, tone — all of it.
>
> And the headline's simple: more dials, plus more data, plus more computing power, equals more capable. That's the whole "scaling" story behind every jump you've seen.
>
> I break this stuff down in a free beginner course — comment TYPES and I'll DM you the link.
