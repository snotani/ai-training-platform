# Lesson 1.2 — Short Video Scripts

Short-form video scripts (TikTok / Reels / Shorts, ≤60s each) based on **Lesson 1.2 — How models work** (tokens, next-token prediction, temperature, pre/post-training, scale). Same formula as the 1.1 scripts: first line is a hooking statement, then dive straight into a concrete relatable example, minimal jargon/filler, spoken words only.

CTA system is shared with Lesson 1.1 — see `lesson-1.1-video-scripts.md` for the `TYPES` comment-to-DM mechanic and the per-lesson keyword scheme. Course CTA (`TYPES`) is used on Videos 1 and 3; Video 2 uses a guess-in-comments engagement prompt.

---

## Video 1 — "AI can't read"

**Concept:** tokens — the model reads text in chunks, not words. Ends with the course CTA.

> AI can't actually read — it doesn't even see words.
>
> Type "I'll grab coffee later" and you see four words. ChatGPT sees five chunks — and "1999" it'll chop into one, nine, nine, nine, digit by digit.
>
> Here's why: it breaks text into common pieces called tokens. A word it sees constantly, like "the," stays one piece. A rare one like "unbelievable" gets sliced into "un," "believ," "able" — bits it already knows.
>
> That's why a long PDF gets cut off or costs more on the API — you're not paying per word, you're paying per chunk, like a taxi meter ticking up.
>
> So next time it forgets the end of your giant prompt, that's the meter running out.
>
> Want to actually get how these things work? I made a free beginner course — comment TYPES and I'll DM you the link.

---

## Video 2 — "ChatGPT is just autocomplete"

**Concept:** next-token prediction — autocomplete scaled up. Ends with a guess-in-comments engagement prompt.

> ChatGPT is just your phone's autocomplete — wearing a really good suit.
>
> You know when Gmail finishes your sentence? You type "let me know if you have any" and a grey "questions" floats up, you hit Tab, done. It just guessed the most likely next word.
>
> That's the entire trick. The model looks at everything so far, ranks the most likely next chunk, picks one, then does it again — and again — until the thought is finished.
>
> After "The capital of France is," the word "Paris" gets a massive score and "banana" gets basically zero. It's not looking anything up. It's just really, really good at "what usually comes next."
>
> So here's my question — "Once upon a ___." What's the next word your brain just filled in? Comment your answer, let's see if you think like the model.

---

## Video 3 — "The one setting that changes everything"

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
