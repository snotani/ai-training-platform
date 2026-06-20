export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
  application?: boolean;
};

export const quizzes: Record<string, QuizQuestion[]> = {
  "1.1": [
    {
      q: "The key difference between Traditional ML and Deep Learning is:",
      options: [
        "Deep Learning only works on spreadsheets",
        "Deep Learning learns the features itself from raw data",
        "Traditional ML is always more accurate",
      ],
      answer: 1,
      why: "In traditional ML, humans hand-pick features; deep learning learns them from raw data.",
    },
    {
      q: "Netflix recommending shows you\u2019ll probably like, learned from your watch history, is mostly which type?",
      options: ["Traditional ML", "Deep Learning", "Generative AI"],
      answer: 0,
      why: "It learns patterns from a tidy table of your history and predicts a label - classic Traditional ML.",
      application: true,
    },
    {
      q: "Snapchat\u2019s dog-ear filter finding your face in the raw camera feed and tracking it is which type?",
      options: ["Traditional ML", "Deep Learning", "Generative AI"],
      answer: 1,
      why: "Raw pixels in, \u201Cthat\u2019s a face\u201D out, with features learned on its own - that\u2019s Deep Learning.",
      application: true,
    },
    {
      q: "Which one can create brand-new content rather than just labeling or scoring it?",
      options: ["Traditional ML", "Deep Learning", "Generative AI"],
      answer: 2,
      why: "Only Generative AI produces new text, images, audio, or code instead of a label or number.",
    },
    {
      q: "Generative AI is best described as:",
      options: [
        "A subset of deep learning that creates new content",
        "A rules engine",
        "A database lookup",
      ],
      answer: 0,
      why: "GenAI is deep learning trained to generate brand-new content.",
    },
  ],
  "1.2": [
    {
      q: "An LLM reads text as:",
      options: ["Whole words", "Tokens (chunks of characters)", "Individual letters only"],
      answer: 1,
      why: "Models operate on tokens - roughly 4 characters each.",
    },
    {
      q: "Raising the temperature tends to make answers:",
      options: ["More focused / predictable", "More random / creative", "Faster"],
      answer: 1,
      why: "Higher temperature flattens the probabilities, so sampling gets more varied.",
    },
    {
      q: "Your team gets slightly different answers each run and wants more consistency. The simplest lever is:",
      options: ["Lower the temperature", "Add more parameters", "Retrain the model"],
      answer: 0,
      why: "Lower temperature makes output more deterministic - the cheapest fix.",
      application: true,
    },
  ],
  "1.3": [
    {
      q: "Hallucinations mainly happen because the model:",
      options: [
        "Is broken",
        "Generates plausible text and fills gaps with no fact-check",
        "Runs out of memory",
      ],
      answer: 1,
      why: "It predicts plausible tokens; there is no built-in \u201CI checked this\u201D step.",
    },
    {
      q: "Out of the box, LLMs are least reliable at:",
      options: ["Writing fluent sentences", "Exact arithmetic and counting", "Rephrasing text"],
      answer: 1,
      why: "They match language patterns rather than running a calculator.",
    },
    {
      q: "You need an AI summary of a brand-new internal report. To avoid hallucination you should:",
      options: [
        "Trust it if it sounds confident",
        "Paste the report in / use retrieval so it works from the real text",
        "Raise the temperature",
      ],
      answer: 1,
      why: "Give it the facts instead of trusting its memory.",
      application: true,
    },
  ],
  "1.4": [
    {
      q: "A free consumer AI tool is risky for confidential data because:",
      options: ["It's slower", "Inputs may be retained and used to improve models", "It costs money"],
      answer: 1,
      why: "Consumer tiers can retain and review inputs to improve the model.",
    },
    {
      q: "Which of these is PII?",
      options: [
        "A published press release",
        "A customer's email and account number",
        "A generic how-to question",
      ],
      answer: 1,
      why: "An email plus account number identifies a specific person.",
    },
    {
      q: "You must summarize a sensitive contract. Best move:",
      options: [
        "Paste it into any free chatbot",
        "Use the approved enterprise tool and/or redact sensitive parts",
        "Screenshot it first",
      ],
      answer: 1,
      why: "Approved tools and redaction keep sensitive data protected.",
      application: true,
    },
  ],
};
