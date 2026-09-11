import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Send,
  Sparkles,
  Volume2,
  Settings,
  MessageCircle,
  Repeat,
  ChevronRight,
  ChevronLeft,
  PenLine,
  Award,
} from "lucide-react";

const DAILY_LIMIT = 3;

const ACCENTS = [
  { id: "en-US", label: "American" },
  { id: "en-GB", label: "British" },
  { id: "en-AU", label: "Australian" },
];

const PRACTICE_SETS = [
  {
    category: "Greetings",
    sentences: [
      "Good morning, how are you?",
      "Hi, nice to meet you.",
      "How was your day?",
      "It's been a while, how have you been?",
      "See you later, take care.",
      "Have a great day!",
      "Good night, sleep well.",
      "What's new with you?",
      "Long time no see!",
      "Nice to see you again.",
    ],
  },
  {
    category: "Everyday conversation",
    sentences: [
      "Can you repeat that, please?",
      "I didn't quite catch that.",
      "That sounds like a great idea.",
      "I'm not sure, let me think about it.",
      "What do you think about this?",
      "I really appreciate your help.",
      "Sorry, I'm running a little late.",
      "Let's talk about it later.",
      "That makes sense to me.",
      "I completely agree with you.",
      "Can you say that more slowly?",
      "I'm still learning, please be patient with me.",
    ],
  },
  {
    category: "Shopping & money",
    sentences: [
      "How much does this cost?",
      "Do you have this in a different size?",
      "Can I pay by card?",
      "Is there a discount on this?",
      "I'd like to return this, please.",
      "Where can I find the fitting room?",
      "Do you accept mobile payments?",
      "Could I get a receipt, please?",
    ],
  },
  {
    category: "Work & job interviews",
    sentences: [
      "Tell me a little about yourself.",
      "I have experience working in a team.",
      "What are the responsibilities of this role?",
      "I'm a quick learner and hard worker.",
      "Could we schedule a follow-up meeting?",
      "Thank you for this opportunity.",
      "I'm available to start immediately.",
      "Could you tell me more about the company?",
      "I'd like to discuss the salary and benefits.",
      "I look forward to hearing from you.",
    ],
  },
  {
    category: "Phone calls",
    sentences: [
      "Hello, is this a good time to talk?",
      "Can I speak to someone about my account?",
      "I'll call you back in a few minutes.",
      "Sorry, the line isn't very clear.",
      "Could you send me the details by email?",
      "Can you hold on for a second?",
      "Thanks for calling, have a good day.",
      "I missed your call, is everything okay?",
    ],
  },
  {
    category: "Asking for help",
    sentences: [
      "Excuse me, could you help me with something?",
      "I'm looking for the nearest bus stop.",
      "Could you explain that one more time?",
      "I'm a bit confused, can you clarify?",
      "Thank you so much for your patience.",
      "Would you mind showing me how this works?",
      "I'm not sure where to start, any advice?",
      "Could someone point me in the right direction?",
    ],
  },
  {
    category: "Restaurant & food",
    sentences: [
      "Could I see the menu, please?",
      "What do you recommend here?",
      "I'd like to order the chicken, please.",
      "Could I get a glass of water?",
      "Is this dish spicy?",
      "Can we get the bill, please?",
      "Do you have any vegetarian options?",
      "This tastes really good, thank you.",
      "Could we get a table for two?",
      "I'm allergic to peanuts, does this contain any?",
    ],
  },
  {
    category: "Travel & directions",
    sentences: [
      "Excuse me, how do I get to the airport?",
      "Is this the right bus for downtown?",
      "How far is it from here?",
      "Could you show me on the map?",
      "What time does the next train leave?",
      "Is it within walking distance?",
      "Turn left at the next corner.",
      "I think we're lost, can you help?",
      "How long does the trip take?",
      "Where can I buy a ticket?",
    ],
  },
  {
    category: "Health & doctor visits",
    sentences: [
      "I'd like to make an appointment, please.",
      "I've had a headache since yesterday.",
      "Is this covered by insurance?",
      "How often should I take this medicine?",
      "I'm feeling a bit better today.",
      "Could you recommend a good doctor?",
      "I have a slight fever.",
      "Thank you, doctor, I feel much better now.",
    ],
  },
  {
    category: "Weather & small talk",
    sentences: [
      "It's really hot today, isn't it?",
      "Looks like it might rain later.",
      "I love this kind of weather.",
      "Did you catch the game last night?",
      "How's your family doing?",
      "Any plans for the weekend?",
      "This week has gone by so fast.",
      "I could really use a vacation right now.",
    ],
  },
  {
    category: "Technology & internet",
    sentences: [
      "My internet connection is really slow today.",
      "Could you help me set up this app?",
      "I forgot my password, can you help me reset it?",
      "This website isn't loading properly.",
      "Can you send me the link?",
      "Let's set up a video call tomorrow.",
      "My phone battery is almost dead.",
      "Could you turn up the volume, please?",
    ],
  },
  {
    category: "Hotel",
    sentences: [
      "I have a reservation under my name.",
      "What time is check-out?",
      "Could I get a room with a view?",
      "Is breakfast included?",
      "Could you call a taxi for me, please?",
      "The air conditioning isn't working.",
      "Could I get an extra towel, please?",
      "Is there Wi-Fi in the room?",
      "Could you wake me up at 7am, please?",
      "I'd like to extend my stay one more night.",
    ],
  },
];

const VOCAB_WORDS = [
  { word: "Grateful", meaning: "Feeling thankful for something.", example: "I'm grateful for your help." },
  { word: "Opportunity", meaning: "A chance to do something good.", example: "This job is a great opportunity for me." },
  { word: "Confident", meaning: "Feeling sure of yourself.", example: "She felt confident during the interview." },
  { word: "Convenient", meaning: "Easy and useful for you.", example: "This location is very convenient for me." },
  { word: "Exhausted", meaning: "Very, very tired.", example: "I'm exhausted after work today." },
  { word: "Reliable", meaning: "Someone or something you can trust.", example: "He's a very reliable friend." },
  { word: "Challenging", meaning: "Difficult but interesting.", example: "This project has been challenging." },
  { word: "Postpone", meaning: "To move something to a later time.", example: "Let's postpone the meeting until Monday." },
  { word: "Improve", meaning: "To make something better.", example: "I want to improve my English." },
  { word: "Struggle", meaning: "To find something very hard to do.", example: "I struggle with speaking confidently." },
  { word: "Achieve", meaning: "To succeed in doing something.", example: "She worked hard to achieve her goals." },
  { word: "Encourage", meaning: "To give someone confidence to do something.", example: "My mom always encouraged me." },
  { word: "Frustrated", meaning: "Upset because something isn't working.", example: "I felt frustrated when I couldn't explain myself." },
  { word: "Appreciate", meaning: "To be thankful and value something.", example: "I really appreciate your patience." },
  { word: "Determined", meaning: "Very committed to doing something.", example: "I'm determined to succeed this year." },
];

const QA_QUESTIONS = [
  "How are you today?",
  "What do you do for work?",
  "Tell me about your family.",
  "What are your plans for the weekend?",
  "What's your favorite food?",
  "Why are you learning English?",
  "What do you like to do in your free time?",
  "Where are you from?",
  "What's a challenge you've faced recently?",
  "What are you hoping to achieve this year?",
  "Can you describe your hometown?",
  "What was the highlight of your day?",
  "What's your favorite season and why?",
  "Do you prefer mornings or evenings?",
  "What's something you're proud of?",
  "What did you have for breakfast today?",
  "How do you usually spend your weekends?",
  "What's a skill you'd like to learn?",
  "What's your favorite place to relax?",
  "Do you enjoy cooking? What do you like to make?",
  "What's the last movie or show you watched?",
  "What kind of music do you like?",
  "Who is someone you admire, and why?",
  "What's a habit you're trying to build?",
  "How do you usually get to work or school?",
  "What's your favorite memory from childhood?",
  "What do you like most about your job?",
  "What's something that made you smile recently?",
  "How do you handle stressful days?",
  "What's a goal you have for next month?",
  "What's your favorite way to exercise?",
  "Do you like reading? What do you read?",
  "What's a country you'd love to visit?",
  "What does a typical day look like for you?",
  "What's something new you tried recently?",
  "How would you describe your personality?",
  "What's your favorite holiday, and how do you celebrate it?",
  "What's a piece of advice you'd give a friend?",
  "What do you usually do after work?",
  "What's the weather like where you live today?",
  "What's a small thing that makes your day better?",
  "How do you stay in touch with your friends?",
  "What's something you're curious about?",
  "What's your favorite thing about your city or town?",
  "What would your perfect day look like?",
  "What's a lesson you learned the hard way?",
  "Do you prefer working alone or in a team?",
  "What's something you'd like to change about your routine?",
  "What's a tradition your family has?",
  "How do you usually celebrate your birthday?",
  "What's something you find difficult about learning English?",
  "What's a good book or podcast you'd recommend?",
  "What do you think makes a good friend?",
  "What's something you're looking forward to?",
  "How did you spend your last vacation?",
  "What's your favorite type of weather?",
  "What's a recent decision you had to make?",
  "What's something you do to relax after a long day?",
  "What's a place you go to feel calm?",
  "What's your favorite thing to talk about with friends?",
  "How do you usually start your mornings?",
  "What's a dream you have for the future?",
  "What's something you're grateful for right now?",
  "What kind of work would you love to do someday?",
  "What's a food you've never tried but want to?",
  "How do you like to spend time with your family?",
  "What's a fear you've overcome?",
  "What's your favorite thing about learning something new?",
  "What's the best piece of advice you've ever received?",
  "What's something you wish more people knew about you?",
  "How do you usually spend a rainy day?",
  "What's a small goal you achieved recently?",
  "What's something that always makes you laugh?",
  "What's your idea of a relaxing evening?",
  "What's a language, other than English, you'd like to learn?",
  "What's something you do differently than most people?",
  "What's a skill from your job that you're proud of?",
  "How do you usually handle disagreements with friends?",
  "What's a place from your childhood you still think about?",
  "What's something you'd tell your younger self?",
  "What's your favorite way to spend time outdoors?",
  "What's a recent accomplishment you're happy about?",
  "What do you usually do when you feel tired?",
  "What's something you'd like to improve about your English?",
  "What's a meal that reminds you of home?",
  "What's something interesting about your culture?",
  "How do you usually plan your week?",
  "What's a compliment you received that meant a lot?",
  "What's something you're currently working on?",
  "What's your favorite thing to do with close friends?",
  "What's a change you've made recently that you're happy about?",
  "What's something you find inspiring?",
  "How would you describe your ideal weekend?",
  "What's a lesson your parents taught you?",
  "What's something you've always wanted to try?",
  "What's a strength you bring to your work?",
  "What's your favorite time of year, and why?",
  "What's something you'd like people to remember about you?",
];

const GRAMMAR_CATEGORIES = [
  {
    category: "Tenses",
    topics: [
      {
        topic: "1. Present Simple",
        definition: "Used for facts, habits, and routines — things that are generally true or happen regularly.",
        use: "Daily habits, facts, schedules, routines.",
        forms: {
          affirmative: { structure: "Subject + base verb (+s/es for he/she/it)", example: "She works at a hospital." },
          negative: { structure: "Subject + do/does + not + base verb", example: "She does not work on Sundays." },
          question: { structure: "Do/Does + subject + base verb?", example: "Does she work at a hospital?" },
        },
      },
      {
        topic: "2. Present Continuous",
        definition: "Used for actions happening right now, or temporary situations around the present.",
        use: "Actions in progress, temporary situations, future plans already arranged.",
        forms: {
          affirmative: { structure: "Subject + am/is/are + verb-ing", example: "I am learning English right now." },
          negative: { structure: "Subject + am/is/are + not + verb-ing", example: "I am not learning French right now." },
          question: { structure: "Am/Is/Are + subject + verb-ing?", example: "Are you learning English right now?" },
        },
      },
      {
        topic: "3. Present Perfect",
        definition: "Used for actions that happened at an unspecified time in the past, or that connect the past to the present.",
        use: "Life experiences, recent actions, actions continuing until now.",
        forms: {
          affirmative: { structure: "Subject + have/has + past participle", example: "I have visited three countries." },
          negative: { structure: "Subject + have/has + not + past participle", example: "I have not visited France yet." },
          question: { structure: "Have/Has + subject + past participle?", example: "Have you visited three countries?" },
        },
      },
      {
        topic: "4. Present Perfect Continuous",
        definition: "Used for an action that started in the past and is still continuing, emphasizing duration.",
        use: "To show how long something has been happening, often continuing now.",
        forms: {
          affirmative: { structure: "Subject + have/has + been + verb-ing", example: "I have been studying English for two years." },
          negative: { structure: "Subject + have/has + not + been + verb-ing", example: "She has not been feeling well lately." },
          question: { structure: "Have/Has + subject + been + verb-ing?", example: "Have you been waiting long?" },
        },
      },
      {
        topic: "5. Past Simple",
        definition: "Used for completed actions that happened at a specific time in the past.",
        use: "Finished actions, past events, stories.",
        forms: {
          affirmative: { structure: "Subject + past verb (regular: verb+ed, irregular: special form)", example: "I visited my grandmother last week." },
          negative: { structure: "Subject + did + not + base verb", example: "I did not visit my grandmother last week." },
          question: { structure: "Did + subject + base verb?", example: "Did you visit your grandmother last week?" },
        },
      },
      {
        topic: "6. Past Continuous",
        definition: "Used for an action that was in progress at a specific moment in the past, often interrupted by another action.",
        use: "Background actions in the past, interrupted actions.",
        forms: {
          affirmative: { structure: "Subject + was/were + verb-ing", example: "I was cooking when she called." },
          negative: { structure: "Subject + was/were + not + verb-ing", example: "I was not cooking when she called." },
          question: { structure: "Was/Were + subject + verb-ing?", example: "Were you cooking when she called?" },
        },
      },
      {
        topic: "7. Past Perfect",
        definition: "Used for an action that happened before another action or point in the past.",
        use: "Showing the order of two past events — which one happened first.",
        forms: {
          affirmative: { structure: "Subject + had + past participle", example: "I had already left when she arrived." },
          negative: { structure: "Subject + had + not + past participle", example: "I had not eaten before the meeting." },
          question: { structure: "Had + subject + past participle?", example: "Had you left before she arrived?" },
        },
      },
      {
        topic: "8. Past Perfect Continuous",
        definition: "Used for an action that was continuing up until a certain point in the past.",
        use: "Emphasizing the duration of an action before another past event.",
        forms: {
          affirmative: { structure: "Subject + had + been + verb-ing", example: "I had been working there for five years before I quit." },
          negative: { structure: "Subject + had + not + been + verb-ing", example: "She had not been sleeping well before the trip." },
          question: { structure: "Had + subject + been + verb-ing?", example: "Had you been waiting long before the bus came?" },
        },
      },
      {
        topic: "9. Future Simple",
        definition: "Used for future decisions, predictions, and promises.",
        use: "Quick decisions, predictions, promises about the future.",
        forms: {
          affirmative: { structure: "will + base verb", example: "I will call you later." },
          negative: { structure: "will + not + base verb", example: "I will not be late." },
          question: { structure: "Will + subject + base verb?", example: "Will you call me later?" },
        },
      },
      {
        topic: "10. Future Continuous",
        definition: "Used for an action that will be in progress at a specific time in the future.",
        use: "Describing what will be happening at a certain future moment.",
        forms: {
          affirmative: { structure: "Subject + will be + verb-ing", example: "I will be traveling this time tomorrow." },
          negative: { structure: "Subject + will not be + verb-ing", example: "I will not be working this weekend." },
          question: { structure: "Will + subject + be + verb-ing?", example: "Will you be working tomorrow?" },
        },
      },
      {
        topic: "11. Future Perfect",
        definition: "Used for an action that will be completed before a specific point in the future.",
        use: "Talking about something that will already be finished by a future time.",
        forms: {
          affirmative: { structure: "Subject + will have + past participle", example: "I will have finished by 5pm." },
          negative: { structure: "Subject + will not have + past participle", example: "I will not have finished by then." },
          question: { structure: "Will + subject + have + past participle?", example: "Will you have finished by 5pm?" },
        },
      },
      {
        topic: "12. Future Perfect Continuous",
        definition: "Used for an action that will continue up until a specific point in the future.",
        use: "Emphasizing the duration of an ongoing action, up to a future moment.",
        forms: {
          affirmative: { structure: "Subject + will have been + verb-ing", example: "By June, I will have been living here for ten years." },
          negative: { structure: "Subject + will not have been + verb-ing", example: "She will not have been working here a year yet." },
          question: { structure: "Will + subject + have been + verb-ing?", example: "Will you have been studying for two years by June?" },
        },
      },
      {
        topic: "Conditional Sentences",
        definition: "Sentences that describe a result depending on a condition — what happens if something else happens.",
        structure: "If + condition, + result (0 = fact, 1 = real future, 2 = unreal present, 3 = unreal past)",
        use: "Talking about real possibilities, hypothetical situations, or past regrets.",
        example: "If it rains, I stay home. (real) | If I had money, I would travel. (hypothetical) | If I had studied, I would have passed. (past regret)",
      },
      {
        topic: "Sequence of Tenses",
        definition: "The rule that the tense of one clause in a sentence should logically match the tense of the other clause, especially in reported speech.",
        structure: "Main clause (past) + that + subordinate clause (usually shifts back one tense)",
        use: "Keeping time relationships clear and correct across two connected clauses.",
        example: "She said that she was tired. (said = past, so 'is' shifts to 'was'). He told me he had finished his work.",
      },
      {
        topic: "Verb Conjugation (example: to praise)",
        definition: "Conjugation means changing the form of a verb to match tense, subject, and number.",
        structure: "Base: praise | Past: praised | Past Participle: praised | Present participle: praising",
        use: "Every verb changes form depending on tense and subject — learning the pattern helps with all tenses.",
        example: "I praise her work. She praised the team. They have praised his efforts. We are praising the results.",
      },
    ],
  },
  {
    category: "Verbs",
    topics: [
      {
        topic: "Types of Verbs",
        definition: "Verbs can be action verbs (run, eat), linking verbs (be, seem), auxiliary verbs (do, have, be), or modal verbs (can, must).",
        structure: "Action verb + object | Linking verb + adjective/noun | Auxiliary/modal + base verb",
        use: "Recognizing the type helps you build sentences correctly.",
        example: "She runs fast. (action) She seems happy. (linking) She can swim. (modal)",
      },
      {
        topic: "Transitive & Intransitive Verbs",
        definition: "A transitive verb needs an object to complete its meaning; an intransitive verb does not.",
        structure: "Transitive: subject + verb + object | Intransitive: subject + verb (no object needed)",
        use: "Knowing this helps avoid incomplete or incorrect sentences.",
        example: "She eats rice. (transitive — rice is the object) He sleeps. (intransitive — no object needed)",
      },
      {
        topic: "Verb Tips & Common Mistakes",
        definition: "A few small but important habits that make verb use more accurate.",
        structure: "Subject-verb agreement: singular subject + singular verb form",
        use: "Avoiding common errors learners make with verb forms.",
        example: "Correct: He goes to school. (not 'He go') | Correct: They have finished. (not 'They has')",
      },
    ],
  },
  {
    category: "Nouns",
    topics: [
      {
        topic: "Types of Nouns",
        definition: "Nouns can be common (city), proper (Addis Ababa), countable (books), uncountable (water), collective (team), or abstract (love).",
        structure: "noun functions as subject, object, or complement in a sentence",
        use: "Recognizing noun types helps with correct articles and verb agreement.",
        example: "The team (collective) won. She drank water (uncountable). Love (abstract) is powerful.",
      },
      {
        topic: "Countable & Uncountable Nouns",
        definition: "Countable nouns can be counted (one book, two books); uncountable nouns cannot be counted individually (water, rice, advice).",
        structure: "Countable: a/an + singular, or number + plural | Uncountable: some/much + noun (no plural)",
        use: "Choosing 'a/an', 'some', 'much', or 'many' correctly.",
        example: "I have two books. (countable) I need some advice. (uncountable, no 'an advice')",
      },
    ],
  },
  {
    category: "Adjectives & Articles",
    topics: [
      {
        topic: "Adjectives",
        definition: "Words that describe or give more information about a noun.",
        structure: "adjective + noun  |  noun + is/looks/seems + adjective",
        use: "To describe people, places, things, and feelings.",
        example: "She is a kind person. This coffee is delicious.",
      },
      {
        topic: "Degree of Comparison",
        definition: "Adjectives change form to compare things: positive, comparative (more), and superlative (most).",
        structure: "Positive: big | Comparative: bigger / more beautiful | Superlative: biggest / most beautiful",
        use: "Comparing two or more things.",
        example: "This bag is big. This one is bigger. That one is the biggest.",
      },
      {
        topic: "Articles (a / an / the)",
        definition: "Small words placed before nouns to show whether something is specific or general.",
        structure: "a/an + singular general noun  |  the + specific noun (known to both speaker and listener)",
        use: "'A/an' for first mention or general things; 'the' for something already known or specific.",
        example: "I saw a dog. The dog was very friendly. (a = general, the = specific, already mentioned)",
      },
    ],
  },
  {
    category: "Sentence Structure",
    topics: [
      {
        topic: "Sentence Types by Function",
        definition: "Sentences can be declarative (statement), interrogative (question), imperative (command), or exclamatory (strong feeling).",
        structure: "Declarative: Subject + verb. | Interrogative: Verb/auxiliary + subject...? | Imperative: base verb... | Exclamatory: What/How...!",
        use: "Choosing the right sentence type for the purpose — telling, asking, ordering, or exclaiming.",
        example: "I am tired. (declarative) Are you tired? (interrogative) Sit down. (imperative) What a day! (exclamatory)",
      },
      {
        topic: "Structural Classification of Sentences",
        definition: "Sentences can be simple (one clause), compound (two independent clauses), complex (independent + dependent clause), or compound-complex (a mix).",
        structure: "Simple: one clause | Compound: clause + and/but/or + clause | Complex: clause + because/although/when + clause",
        use: "Building more advanced, natural-sounding sentences by combining ideas.",
        example: "I am tired. (simple) I am tired, but I will finish. (compound) I will finish because I promised. (complex)",
      },
    ],
  },
  {
    category: "Clause & Phrase",
    topics: [
      {
        topic: "Clauses",
        definition: "A clause has a subject and a verb. An independent clause can stand alone; a dependent clause cannot.",
        structure: "Independent: subject + verb (complete idea) | Dependent: (because/although/when) + subject + verb (incomplete idea)",
        use: "Combining clauses to build compound and complex sentences.",
        example: "I stayed home (independent) because it was raining (dependent).",
      },
      {
        topic: "Phrases",
        definition: "A phrase is a group of words without both a subject and verb, acting as one unit — noun phrase, verb phrase, prepositional phrase.",
        structure: "Noun phrase: the tall man | Verb phrase: has been working | Prepositional phrase: on the table",
        use: "Adding detail to sentences without forming a full clause.",
        example: "The tall man (noun phrase) has been working (verb phrase) on the table (prepositional phrase).",
      },
    ],
  },
  {
    category: "Other Important Grammar",
    topics: [
      {
        topic: "Adverbs",
        definition: "Words that describe a verb, adjective, or another adverb — often telling how, when, where, or how often.",
        structure: "Often verb + adverb (many end in -ly)",
        use: "To describe how an action is done, or its time/frequency.",
        example: "She speaks slowly. He always arrives early. This is very important.",
      },
      {
        topic: "Conjunctions",
        definition: "Words that connect words, phrases, or sentences together — like and, but, because, so, although.",
        structure: "clause + conjunction + clause",
        use: "To join ideas, show contrast, reason, or result between two parts of a sentence.",
        example: "I wanted to go, but I was tired. I stayed home because it was raining.",
      },
      {
        topic: "Prepositions (in / on / at, etc.)",
        definition: "Words that show the relationship between a noun and other words — usually time, place, or direction.",
        structure: "preposition + noun/pronoun",
        use: "'In' for months, years, enclosed spaces; 'on' for days, dates, surfaces; 'at' for specific times and places.",
        example: "I was born in 1997. The meeting is on Monday at 9am. She's at the office.",
      },
      {
        topic: "Pronouns",
        definition: "Words that replace a noun so you don't have to repeat it — like he, she, it, they, this, mine.",
        structure: "Subject pronouns (I, you, he) | Object pronouns (me, him, her) | Possessive (mine, his, hers)",
        use: "To avoid repeating the same noun over and over in a sentence or conversation.",
        example: "Sara is my friend. She is kind. I gave her a gift. It was hers to keep.",
      },
      {
        topic: "Modal Verbs (can, could, must, should, may)",
        definition: "Helper verbs that express ability, permission, possibility, obligation, or advice.",
        structure: "Subject + modal verb + base verb (no 'to', no -s ending)",
        use: "'Can' = ability/permission, 'must' = obligation, 'should' = advice, 'may' = possibility/permission.",
        example: "I can swim. You must finish this today. You should rest more. It may rain later.",
      },
      {
        topic: "Auxiliary Verbs",
        definition: "Helper verbs (be, do, have) that combine with a main verb to form tenses, questions, and negatives.",
        structure: "Auxiliary + main verb",
        use: "Forming continuous/perfect tenses, questions, and negative sentences.",
        example: "I am working. Do you like tea? She has not called.",
      },
      {
        topic: "Active & Passive Voice",
        definition: "Active voice: the subject does the action. Passive voice: the subject receives the action.",
        structure: "Active: subject + verb + object | Passive: subject (receiver) + be + past participle (+ by + doer)",
        use: "Passive is used when the doer is unknown, unimportant, or to sound more formal.",
        example: "Active: She wrote the letter. Passive: The letter was written (by her).",
      },
      {
        topic: "Direct & Indirect Speech",
        definition: "Direct speech repeats someone's exact words. Indirect (reported) speech reports what was said, usually shifting the tense back.",
        structure: "Direct: She said, \"I am tired.\" | Indirect: She said (that) she was tired.",
        use: "Reporting what someone else said, in conversation or writing.",
        example: "Direct: He said, \"I will call you.\" Indirect: He said he would call me.",
      },
      {
        topic: "Punctuation",
        definition: "Marks used in writing to make meaning clear — periods, commas, question marks, apostrophes, quotation marks.",
        structure: "Period (.) ends a statement | Comma (,) separates ideas | Question mark (?) ends a question | Apostrophe (') shows possession/contraction",
        use: "Making written English clear and correctly structured.",
        example: "She's my friend, and she's from Ethiopia. Are you coming?",
      },
      {
        topic: "Infinitives & Gerunds (non-finite verbs)",
        definition: "Two ways to use a verb as a noun: gerund (verb+ing) and infinitive (to + verb). Non-finite verbs don't show tense by themselves.",
        structure: "Gerund: verb + ing (as subject/object) | Infinitive: to + base verb",
        use: "Some verbs are followed by gerunds (enjoy, avoid), others by infinitives (want, decide).",
        example: "I enjoy learning English. I want to learn English. Swimming is fun.",
      },
    ],
  },
];

const QUIZ_QUESTIONS = [
  { question: "She ___ to school every day.", options: ["go", "goes", "going", "went"], correct: 1, explanation: "Present Simple with he/she/it adds -s: 'goes'." },
  { question: "I ___ dinner right now.", options: ["cook", "cooked", "am cooking", "cooking"], correct: 2, explanation: "Present Continuous: am/is/are + verb-ing, for actions happening now." },
  { question: "They ___ their homework already.", options: ["finish", "finished", "have finished", "has finished"], correct: 2, explanation: "Present Perfect: have/has + past participle. 'They' takes 'have'." },
  { question: "He ___ in London for five years now.", options: ["lives", "lived", "has been living", "is living"], correct: 2, explanation: "Present Perfect Continuous shows an action that started in the past and continues now, often with 'for'." },
  { question: "I ___ my grandmother last week.", options: ["visit", "visited", "have visited", "was visiting"], correct: 1, explanation: "Past Simple for a completed action at a specific past time ('last week')." },
  { question: "She ___ when the phone rang.", options: ["was cooking", "cooked", "cooks", "is cooking"], correct: 0, explanation: "Past Continuous for an action in progress when another action (rang) interrupted it." },
  { question: "I ___ my work before she arrived.", options: ["finished", "have finished", "had finished", "was finishing"], correct: 2, explanation: "Past Perfect shows the action that happened first, before another past action." },
  { question: "We ___ waiting for two hours before the bus came.", options: ["have been", "were", "had been", "had"], correct: 2, explanation: "Past Perfect Continuous emphasizes duration before another past event." },
  { question: "I ___ you tomorrow.", options: ["call", "called", "will call", "am calling"], correct: 2, explanation: "Future Simple: will + base verb, for future actions and promises." },
  { question: "This time tomorrow, I ___ on a plane.", options: ["fly", "flew", "am flying", "will be flying"], correct: 3, explanation: "Future Continuous shows an action in progress at a specific future time." },
  { question: "By next year, I ___ this course.", options: ["finish", "have finished", "will have finished", "finished"], correct: 2, explanation: "Future Perfect shows something completed before a future point in time." },
  { question: "By June, she ___ here for ten years.", options: ["lived", "has lived", "will live", "will have been living"], correct: 3, explanation: "Future Perfect Continuous emphasizes duration up to a future point." },
  { question: "If it rains, I ___ home.", options: ["stay", "will stay", "stayed", "would stay"], correct: 1, explanation: "First conditional (real future possibility): If + present, will + base verb." },
  { question: "If I ___ money, I would travel.", options: ["have", "had", "has", "will have"], correct: 1, explanation: "Second conditional (unreal/hypothetical present): If + past simple, would + base verb." },
  { question: "She said that she ___ tired.", options: ["is", "was", "be", "being"], correct: 1, explanation: "Sequence of tenses: when the reporting verb is past ('said'), the tense usually shifts back." },
  { question: "I saw ___ elephant at the zoo.", options: ["a", "an", "the", "no article needed"], correct: 1, explanation: "Use 'an' before words that start with a vowel sound." },
  { question: "The meeting is ___ Monday ___ 9am.", options: ["in / at", "on / at", "on / in", "at / on"], correct: 1, explanation: "'On' for days, 'at' for specific clock times." },
  { question: "You ___ finish this today.", options: ["can", "must", "may", "might"], correct: 1, explanation: "'Must' expresses a strong obligation or necessity." },
  { question: "She speaks English ___.", options: ["fluent", "fluently", "fluency", "more fluent"], correct: 1, explanation: "Adverbs (often ending in -ly) describe how an action is done — 'speaks fluently'." },
  { question: "The letter ___ by John yesterday.", options: ["wrote", "was written", "is written", "write"], correct: 1, explanation: "Passive voice for past actions: subject + was/were + past participle." },
];
const SYNONYM_ANTONYM_WORDS = [
  { word: "Happy", synonyms: ["Glad", "Joyful", "Pleased", "Content", "Cheerful"], antonyms: ["Sad", "Unhappy", "Miserable", "Upset", "Gloomy"] },
  { word: "Big", synonyms: ["Large", "Huge", "Massive", "Enormous", "Giant"], antonyms: ["Small", "Tiny", "Little", "Miniature", "Compact"] },
  { word: "Fast", synonyms: ["Quick", "Rapid", "Swift", "Speedy", "Brisk"], antonyms: ["Slow", "Sluggish", "Gradual", "Leisurely", "Unhurried"] },
  { word: "Beautiful", synonyms: ["Pretty", "Lovely", "Gorgeous", "Attractive", "Stunning"], antonyms: ["Ugly", "Unattractive", "Plain", "Hideous", "Unsightly"] },
  { word: "Smart", synonyms: ["Intelligent", "Clever", "Bright", "Sharp", "Wise"], antonyms: ["Foolish", "Unwise", "Dull", "Ignorant", "Simple"] },
  { word: "Strong", synonyms: ["Powerful", "Sturdy", "Robust", "Tough", "Solid"], antonyms: ["Weak", "Fragile", "Feeble", "Frail", "Delicate"] },
  { word: "Easy", synonyms: ["Simple", "Effortless", "Straightforward", "Basic", "Manageable"], antonyms: ["Difficult", "Hard", "Complex", "Tough", "Challenging"] },
  { word: "Important", synonyms: ["Significant", "Essential", "Crucial", "Vital", "Key"], antonyms: ["Unimportant", "Minor", "Trivial", "Irrelevant", "Insignificant"] },
  { word: "Rich", synonyms: ["Wealthy", "Affluent", "Prosperous", "Well-off", "Loaded"], antonyms: ["Poor", "Broke", "Needy", "Impoverished", "Destitute"] },
  { word: "Brave", synonyms: ["Courageous", "Bold", "Fearless", "Daring", "Heroic"], antonyms: ["Cowardly", "Timid", "Fearful", "Afraid", "Weak"] },
  { word: "Honest", synonyms: ["Truthful", "Sincere", "Genuine", "Trustworthy", "Frank"], antonyms: ["Dishonest", "Deceitful", "Fake", "Untruthful", "Lying"] },
  { word: "Kind", synonyms: ["Caring", "Compassionate", "Gentle", "Generous", "Thoughtful"], antonyms: ["Cruel", "Unkind", "Mean", "Harsh", "Cold"] },
  { word: "Difficult", synonyms: ["Hard", "Tough", "Challenging", "Complicated", "Demanding"], antonyms: ["Easy", "Simple", "Effortless", "Manageable", "Straightforward"] },
  { word: "Old", synonyms: ["Aged", "Elderly", "Ancient", "Mature", "Vintage"], antonyms: ["Young", "New", "Modern", "Fresh", "Youthful"] },
  { word: "New", synonyms: ["Modern", "Fresh", "Recent", "Current", "Latest"], antonyms: ["Old", "Ancient", "Outdated", "Used", "Worn"] },
  { word: "Hot", synonyms: ["Warm", "Boiling", "Scorching", "Sweltering", "Heated"], antonyms: ["Cold", "Cool", "Chilly", "Freezing", "Icy"] },
  { word: "Cheap", synonyms: ["Affordable", "Inexpensive", "Low-cost", "Economical", "Reasonable"], antonyms: ["Expensive", "Costly", "Pricey", "Overpriced", "Dear"] },
  { word: "Clean", synonyms: ["Spotless", "Tidy", "Neat", "Pure", "Hygienic"], antonyms: ["Dirty", "Messy", "Filthy", "Untidy", "Grimy"] },
  { word: "Loud", synonyms: ["Noisy", "Booming", "Deafening", "Thunderous", "Blaring"], antonyms: ["Quiet", "Silent", "Soft", "Hushed", "Faint"] },
  { word: "Interesting", synonyms: ["Fascinating", "Engaging", "Intriguing", "Captivating", "Appealing"], antonyms: ["Boring", "Dull", "Tedious", "Uninteresting", "Monotonous"] },
  { word: "Successful", synonyms: ["Accomplished", "Prosperous", "Thriving", "Victorious", "Effective"], antonyms: ["Unsuccessful", "Failed", "Unproductive", "Ineffective", "Fruitless"] },
  { word: "Careful", synonyms: ["Cautious", "Attentive", "Prudent", "Watchful", "Mindful"], antonyms: ["Careless", "Reckless", "Negligent", "Sloppy", "Thoughtless"] },
  { word: "Generous", synonyms: ["Giving", "Charitable", "Selfless", "Big-hearted", "Liberal"], antonyms: ["Selfish", "Stingy", "Greedy", "Miserly", "Tight-fisted"] },
  { word: "Confident", synonyms: ["Self-assured", "Certain", "Assertive", "Secure", "Bold"], antonyms: ["Insecure", "Doubtful", "Timid", "Hesitant", "Unsure"] },
  { word: "Calm", synonyms: ["Peaceful", "Relaxed", "Serene", "Composed", "Tranquil"], antonyms: ["Anxious", "Nervous", "Agitated", "Stressed", "Restless"] },
];

export default function MTFAI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hey! I'm really glad you're here. We can talk about literally anything — your day, your dreams, random stuff. Don't stress about mistakes, that's what I'm here for. So... what's on your mind?",
      correction: null,
      corrections: [],
      pronunciationTip: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turnsUsed, setTurnsUsed] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [ttsUnavailable, setTtsUnavailable] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [accent, setAccent] = useState("en-US");
  const [gender, setGender] = useState("female");
  const [voices, setVoices] = useState([]);
  const [tab, setTab] = useState("chat");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [practiceCategoryPicked, setPracticeCategoryPicked] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [shadowText, setShadowText] = useState("");
  const [shadowListening, setShadowListening] = useState(false);
  const [vocabIndex, setVocabIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [qaIndex, setQaIndex] = useState(0);
  const [qaAnswer, setQaAnswer] = useState("");
  const [qaSuggestion, setQaSuggestion] = useState(null);
  const [qaLoading, setQaLoading] = useState(false);
  const [writingText, setWritingText] = useState("");
  const [writingLoading, setWritingLoading] = useState(false);
  const [writingResult, setWritingResult] = useState(null);
  const [qaListening, setQaListening] = useState(false);
  const qaRecognitionRef = useRef(null);
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [grammarCategoryPicked, setGrammarCategoryPicked] = useState(false);
  const [grammarCategoryIndex, setGrammarCategoryIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(0);
  const [wordsMode, setWordsMode] = useState("new");
  const [synIndex, setSynIndex] = useState(0);
  const recognitionRef = useRef(null);
  const shadowRecognitionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;

    const loadVoices = () => {
      const v = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      setVoices(v);
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    if (SpeechRecognition) {
      const shadowRec = new SpeechRecognition();
      shadowRec.continuous = false;
      shadowRec.interimResults = false;
      shadowRec.lang = "en-US";
      shadowRec.onresult = (e) => {
        setShadowText(e.results[0][0].transcript);
      };
      shadowRec.onend = () => setShadowListening(false);
      shadowRec.onerror = () => setShadowListening(false);
      shadowRecognitionRef.current = shadowRec;

      const qaRec = new SpeechRecognition();
      qaRec.continuous = false;
      qaRec.interimResults = false;
      qaRec.lang = "en-US";
      qaRec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setQaAnswer((prev) => (prev ? prev + " " + transcript : transcript));
      };
      qaRec.onend = () => setQaListening(false);
      qaRec.onerror = () => setQaListening(false);
      qaRecognitionRef.current = qaRec;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const pickVoice = (voiceList) => {
    if (!voiceList.length) return null;
    const langMatches = voiceList.filter((v) => v.lang === accent);
    const pool = langMatches.length ? langMatches : voiceList.filter((v) => v.lang.startsWith("en"));
    const femaleHints = ["female", "samantha", "victoria", "karen", "tessa", "zira", "susan", "moira"];
    const maleHints = ["male", "daniel", "fred", "alex", "arthur", "george", "david"];
    const hints = gender === "female" ? femaleHints : maleHints;
    const byName = pool.find((v) =>
      hints.some((h) => v.name.toLowerCase().includes(h))
    );
    return byName || pool[0] || voiceList[0];
  };

  const speak = (text) => {
    if (!window.speechSynthesis) {
      setTtsUnavailable(true);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      const liveVoices = window.speechSynthesis.getVoices();
      const poolVoices = liveVoices.length ? liveVoices : voices;
      const v = pickVoice(poolVoices);
      if (v) {
        utter.voice = v;
        utter.lang = v.lang;
      } else {
        utter.lang = accent;
      }
      utter.onerror = () => setTtsUnavailable(true);
      utter.onstart = () => setTtsUnavailable(false);
      window.speechSynthesis.speak(utter);
    } catch (err) {
      setTtsUnavailable(true);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (turnsUsed >= DAILY_LIMIT) return;

    const newMessages = [
      ...messages,
      { role: "user", text, corrections: [], pronunciationTip: null },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.text }));

      const accentLabel = ACCENTS.find((a) => a.id === accent)?.label || "American";

      const systemPrompt = `You are a warm, upbeat, friendly conversation buddy helping someone practice spoken/written English — think supportive close friend, not a formal tutor. Chat naturally about everyday life, react genuinely, use casual friendly language, ask real follow-up questions, keep replies short (2-4 sentences) like real speech. The learner is practicing a ${accentLabel} accent.

Separately, carefully review the learner's last message for genuine grammar, tense, preposition, and word-choice errors worth mentioning (not just one) — up to 4 most important ones. Only flag something if it is a real, unambiguous error — never a case where multiple forms are valid. KNOWN TRAP: in a "because"/"that" clause stating a general truth or ongoing belief after a past main clause (e.g. "I continued because I know that X is true"), BOTH present and past tense are correct — do not flag this as an error. When unsure, leave it out. For each real error, give: the original phrase, the corrected phrase, and a short simple explanation of the rule. Return an empty array if there are truly no errors.

Also separately, if any word in the learner's message is commonly mispronounced by English learners, give ONE short friendly pronunciation tip — or null if nothing stands out.

Respond ONLY in this exact JSON format, no markdown, no extra text:
{"reply": "your friendly conversational reply here", "corrections": [{"original": "the wrong phrase", "corrected": "the fixed phrase", "explanation": "short simple rule explanation"}], "pronunciationTip": "short friendly pronunciation tip or null"}`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1000,
          system: systemPrompt,
          messages: history,
        }),
      });

      const data = await response.json();
      const raw = data.content
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("")
        .trim();
      const clean = raw.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        parsed = { reply: clean, corrections: [], pronunciationTip: null };
      }

      const corrections = Array.isArray(parsed.corrections) ? parsed.corrections : [];
      const pronunciationTip =
        parsed.pronunciationTip && parsed.pronunciationTip !== "null"
          ? parsed.pronunciationTip
          : null;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: parsed.reply, corrections, pronunciationTip },
      ]);
      speak(parsed.reply);
      setTurnsUsed((t) => t + 1);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Ah, something glitched reaching the conversation service. Try again in a sec.",
          corrections: [],
          pronunciationTip: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const remaining = Math.max(0, DAILY_LIMIT - turnsUsed);
  const limitReached = turnsUsed >= DAILY_LIMIT;

  const currentCategory = PRACTICE_SETS[categoryIndex];
  const currentSentence = currentCategory.sentences[sentenceIndex];
  const currentGrammarTopic = GRAMMAR_CATEGORIES[grammarCategoryIndex].topics[grammarIndex];

  const pickGrammarCategory = (idx) => {
    setGrammarCategoryIndex(idx);
    setGrammarIndex(0);
    setGrammarCategoryPicked(true);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizAnswered(0);
  };

  const selectQuizAnswer = (idx) => {
    if (quizSelected !== null) return;
    setQuizSelected(idx);
    setQuizAnswered((a) => a + 1);
    if (idx === QUIZ_QUESTIONS[quizIndex].correct) {
      setQuizScore((s) => s + 1);
    }
  };

  const nextQuizQuestion = () => {
    setQuizSelected(null);
    setQuizIndex((i) => (i + 1) % QUIZ_QUESTIONS.length);
  };

  const playCurrentSentence = () => {
    speak(currentSentence);
  };

  const toggleShadowListening = () => {
    if (!speechSupported) return;
    setShadowText("");
    if (shadowListening) {
      shadowRecognitionRef.current.stop();
      setShadowListening(false);
    } else {
      shadowRecognitionRef.current.start();
      setShadowListening(true);
      setRepeatCount((c) => Math.min(c + 1, 3));
    }
  };

  const nextSentence = () => {
    setRepeatCount(0);
    setShadowText("");
    if (sentenceIndex < currentCategory.sentences.length - 1) {
      setSentenceIndex(sentenceIndex + 1);
    } else {
      setSentenceIndex(0);
    }
  };

  const prevSentence = () => {
    setRepeatCount(0);
    setShadowText("");
    if (sentenceIndex > 0) {
      setSentenceIndex(sentenceIndex - 1);
    } else {
      setSentenceIndex(currentCategory.sentences.length - 1);
    }
  };

  const pickPracticeCategory = (idx) => {
    setCategoryIndex(idx);
    setSentenceIndex(0);
    setRepeatCount(0);
    setShadowText("");
    setPracticeCategoryPicked(true);
  };

  const submitQaAnswer = async () => {
    const answer = qaAnswer.trim();
    if (!answer || qaLoading) return;
    if (turnsUsed >= DAILY_LIMIT) return;
    setQaLoading(true);
    setQaSuggestion(null);
    try {
      const question = QA_QUESTIONS[qaIndex];
      const systemPrompt = `You are a warm, friendly English speaking coach. The learner was asked: "${question}" and answered: "${answer}". 
Give ONE short, better/fuller way they could answer the same question naturally, in a warm encouraging tone first, then the suggested answer. Keep it brief.
Respond ONLY in this exact JSON format, no markdown:
{"encouragement": "one warm short sentence", "betterAnswer": "a fuller natural way to answer"}`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 500,
          system: systemPrompt,
          messages: [{ role: "user", content: answer }],
        }),
      });
      const data = await response.json();
      const raw = data.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        parsed = { encouragement: "", betterAnswer: clean };
      }
      setQaSuggestion(parsed);
      setTurnsUsed((t) => t + 1);
    } catch (err) {
      setQaSuggestion({ encouragement: "", betterAnswer: "Couldn't reach the coach right now — try again in a moment." });
    } finally {
      setQaLoading(false);
    }
  };

  const nextQaQuestion = () => {
    setQaAnswer("");
    setQaSuggestion(null);
    setQaIndex((i) => (i + 1) % QA_QUESTIONS.length);
  };

  const toggleQaListening = () => {
    if (!speechSupported) return;
    if (qaListening) {
      qaRecognitionRef.current.stop();
      setQaListening(false);
    } else {
      qaRecognitionRef.current.start();
      setQaListening(true);
    }
  };

  const reviewWriting = async () => {
    const text = writingText.trim();
    if (!text || writingLoading) return;
    if (turnsUsed >= DAILY_LIMIT) return;
    setWritingLoading(true);
    setWritingResult(null);
    try {
      const systemPrompt = `You are a thorough, kind, and LINGUISTICALLY PRECISE English writing teacher reviewing a learner's paragraph. Analyze it carefully and return a full structured review.

CRITICAL ACCURACY RULE: Only flag something as a "correction" if it is a genuine grammatical error — not a case where multiple forms are correct. If a construction is one of several valid options, do NOT list it as a correction. When you are not fully certain a phrase is wrong, leave it out rather than guess. It is better to miss a very minor stylistic nuance than to teach a learner an incorrect "rule."

SPECIFIC KNOWN TRAP — reason/that-clause tense backshift: When a past-tense main clause is followed by "because"/"that" + a clause stating a general truth or belief the speaker still holds, BOTH present tense and past tense are grammatically correct in that clause. Example: "I continued studying because I know that learning a language takes time" is CORRECT AS WRITTEN — do NOT flag "know" as needing to become "knew". Only flag a tense mismatch in a that/because clause if it states something that was ONLY true in the past (not a lasting belief/fact), e.g. "He said he was hungry" (a past state, not a lasting truth) is fine as is, but "He said he is hungry yesterday" mixing a time marker with wrong tense would be a real error.

SPECIFIC KNOWN TRAP — Past Simple vs Past Continuous: "was/were" + adjective or noun (e.g. "I was tired", "She was a teacher") is PAST SIMPLE, not Past Continuous. Past Continuous requires "was/were" + a verb ending in -ing (e.g. "I was studying", "She was cooking"). Double-check every tense you list against the actual verb forms in the text before including it — do not include a tense unless you can point to the exact word(s) demonstrating it.

SAME PRECISION RULE APPLIES TO VOCABULARY NOTES: if a word or phrase choice is one of several equally natural options (e.g. "wrote" vs "wrote down"), do not imply one is simply better — briefly explain the real difference in nuance/meaning instead, so the learner understands when to use each.

Respond ONLY in this exact JSON format, no markdown, no extra text:
{
  "subScores": {"grammar": <1-10>, "vocabulary": <1-10>, "naturalness": <1-10>, "overall": <1-10, roughly the average but use judgment>},
  "summary": "one warm, honest sentence about the overall quality",
  "improvementAreas": ["top 1-3 specific things this learner should focus on next, ordered by importance, short phrases like 'Past tense consistency' or 'Verb + preposition patterns'"],
  "tensesUsed": ["list of tense names actually used in the text, verified against actual verb forms present — e.g. Past Simple, Present Perfect"],
  "corrections": [{"original": "wrong phrase from the text", "corrected": "fixed phrase", "explanation": "short simple rule explaining why — only for genuine, unambiguous errors"}],
  "vocabularyNotes": [{"word": "a notable or advanced word they used well, or a word choice worth commenting on", "note": "short comment — praise, or nuance/difference explained accurately, never implying a wrong 'better' form when both are valid"}]
}
Find ALL genuine grammar errors worth mentioning (not just one) — but every single one must be a real error, not a matter of style or valid variation. If the writing is excellent, corrections can be an empty array. Always identify at least the main tenses used, and verify each one against the actual text before listing it. Give 2-4 vocabulary notes. improvementAreas should be empty only if the writing is already excellent across the board.`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await response.json();
      const raw = data.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        parsed = {
          subScores: null,
          summary: "Couldn't fully analyze this — try again in a moment.",
          improvementAreas: [],
          tensesUsed: [],
          corrections: [],
          vocabularyNotes: [],
        };
      }
      setWritingResult(parsed);
      setTurnsUsed((t) => t + 1);
    } catch (err) {
      setWritingResult({
        subScores: null,
        summary: "Something went wrong reaching the writing coach. Try again in a moment.",
        improvementAreas: [],
        tensesUsed: [],
        corrections: [],
        vocabularyNotes: [],
      });
    } finally {
      setWritingLoading(false);
    }
  };

  const clearWriting = () => {
    setWritingText("");
    setWritingResult(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#152526",
        color: "#F3ECDD",
        fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560, padding: "28px 20px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0, color: "#F3ECDD" }}>
            MTF AI
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 12,
                color: "#9CB8AC",
              }}
            >
              {remaining}/{DAILY_LIMIT} free today
            </span>
            <button
              onClick={() => setShowSettings((s) => !s)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
              }}
              title="Voice settings"
            >
              <Settings size={18} color="#9CB8AC" />
            </button>
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 13.5,
            color: "#B9AE95",
            margin: "0 0 14px",
            lineHeight: 1.5,
          }}
        >
          Mother tongue, made easy. A friend to talk with, out loud, at your pace.
        </p>

        {ttsUnavailable && (
          <p
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12,
              color: "#C9634A",
              margin: "0 0 14px",
              lineHeight: 1.5,
            }}
          >
            Voice playback isn't available in this browser right now — text still works fine.
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            background: "#0F1E1F",
            borderRadius: 12,
            padding: 4,
            overflowX: "auto",
          }}
        >
          <button
            onClick={() => setTab("chat")}
            style={{
              flex: "0 0 auto",
              minWidth: 66,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 10px",
              borderRadius: 9,
              border: "none",
              background: tab === "chat" ? "#22383A" : "transparent",
              color: tab === "chat" ? "#F3ECDD" : "#7A9691",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <MessageCircle size={14} /> Chat
          </button>
          <button
            onClick={() => setTab("practice")}
            style={{
              flex: "0 0 auto",
              minWidth: 78,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 10px",
              borderRadius: 9,
              border: "none",
              background: tab === "practice" ? "#22383A" : "transparent",
              color: tab === "practice" ? "#F3ECDD" : "#7A9691",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Repeat size={14} /> Practice
          </button>
          <button
            onClick={() => setTab("vocab")}
            style={{
              flex: "0 0 auto",
              minWidth: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 10px",
              borderRadius: 9,
              border: "none",
              background: tab === "vocab" ? "#22383A" : "transparent",
              color: tab === "vocab" ? "#F3ECDD" : "#7A9691",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Sparkles size={14} /> Words
          </button>
          <button
            onClick={() => setTab("grammar")}
            style={{
              flex: "0 0 auto",
              minWidth: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 10px",
              borderRadius: 9,
              border: "none",
              background: tab === "grammar" ? "#22383A" : "transparent",
              color: tab === "grammar" ? "#F3ECDD" : "#7A9691",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Settings size={14} /> Grammar
          </button>
          <button
            onClick={() => setTab("qa")}
            style={{
              flex: "0 0 auto",
              minWidth: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 10px",
              borderRadius: 9,
              border: "none",
              background: tab === "qa" ? "#22383A" : "transparent",
              color: tab === "qa" ? "#F3ECDD" : "#7A9691",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <MessageCircle size={14} /> Q&A
          </button>
          <button
            onClick={() => setTab("write")}
            style={{
              flex: "0 0 auto",
              minWidth: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 10px",
              borderRadius: 9,
              border: "none",
              background: tab === "write" ? "#22383A" : "transparent",
              color: tab === "write" ? "#F3ECDD" : "#7A9691",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <PenLine size={14} /> Write
          </button>
        </div>

        {showSettings && (
          <div
            style={{
              background: "#22383A",
              borderRadius: 14,
              padding: 14,
              marginBottom: 16,
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#9CB8AC", marginBottom: 6 }}>
                Accent
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    style={{
                      flex: 1,
                      padding: "8px 6px",
                      borderRadius: 10,
                      border: "1px solid " + (accent === a.id ? "#E8B04B" : "#35504F"),
                      background: accent === a.id ? "#E8B04B" : "transparent",
                      color: accent === a.id ? "#1B2E22" : "#F3ECDD",
                      fontSize: 12.5,
                      cursor: "pointer",
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#9CB8AC", marginBottom: 6 }}>
                Voice
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["female", "male"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    style={{
                      flex: 1,
                      padding: "8px 6px",
                      borderRadius: 10,
                      border: "1px solid " + (gender === g ? "#E8B04B" : "#35504F"),
                      background: gender === g ? "#E8B04B" : "transparent",
                      color: gender === g ? "#1B2E22" : "#F3ECDD",
                      fontSize: 12.5,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {tab === "practice" && (
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            flex: 1,
            padding: "8px 20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!practiceCategoryPicked ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 20 }}>
              <p
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12.5,
                  color: "#9CB8AC",
                  margin: "4px 0 6px",
                }}
              >
                Choose a situation to practice
              </p>
              {PRACTICE_SETS.map((cat, idx) => (
                <button
                  key={cat.category}
                  onClick={() => pickPracticeCategory(idx)}
                  style={{
                    background: "#22383A",
                    border: "1px solid #35504F",
                    borderRadius: 14,
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    color: "#F3ECDD",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  <span>{cat.category}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#9CB8AC", fontSize: 12 }}>
                    {cat.sentences.length} sentences <ChevronRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => setPracticeCategoryPicked(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9CB8AC",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: 10,
                  alignSelf: "flex-start",
                }}
              >
                <ChevronLeft size={14} /> All situations
              </button>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12,
              color: "#9CB8AC",
              marginBottom: 10,
            }}
          >
            {currentCategory.category} · {sentenceIndex + 1}/
            {currentCategory.sentences.length}
          </div>

          <div
            style={{
              background: "#22383A",
              borderRadius: 18,
              padding: "28px 22px",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            <p style={{ fontSize: 21, lineHeight: 1.4, margin: "0 0 18px" }}>
              "{currentSentence}"
            </p>
            <button
              onClick={playCurrentSentence}
              style={{
                background: "#E8B04B",
                border: "none",
                borderRadius: 12,
                padding: "10px 20px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                color: "#1B2E22",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Volume2 size={16} /> Listen
            </button>
          </div>

          <div
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 13,
              color: "#B9AE95",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Now repeat it out loud — {repeatCount}/3 times
          </div>

          <button
            onClick={toggleShadowListening}
            disabled={!speechSupported}
            style={{
              background: shadowListening ? "#C9634A" : "#22383A",
              border: "1px solid #35504F",
              borderRadius: 14,
              padding: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: speechSupported ? "pointer" : "not-allowed",
              color: "#F3ECDD",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            {shadowListening ? <Square size={16} /> : <Mic size={16} />}
            {shadowListening ? "Listening…" : "Tap to repeat"}
          </button>
          {shadowText && (
            <div
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 13,
                color: "#9CB8AC",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              You said: "{shadowText}"
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingBottom: 20 }}>
            <button
              onClick={prevSentence}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid #35504F",
                borderRadius: 12,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "#F3ECDD",
                cursor: "pointer",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 13,
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={nextSentence}
              style={{
                flex: 1,
                background: "#E8B04B",
                border: "none",
                borderRadius: 12,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "#1B2E22",
                cursor: "pointer",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
          </>
          )}
        </div>
      )}

      {tab === "vocab" && (
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            flex: 1,
            padding: "8px 20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button
              onClick={() => setWordsMode("new")}
              style={{
                flex: 1,
                padding: "8px 6px",
                borderRadius: 10,
                border: "1px solid " + (wordsMode === "new" ? "#E8B04B" : "#35504F"),
                background: wordsMode === "new" ? "#E8B04B" : "transparent",
                color: wordsMode === "new" ? "#1B2E22" : "#F3ECDD",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              New Words
            </button>
            <button
              onClick={() => setWordsMode("syn")}
              style={{
                flex: 1,
                padding: "8px 6px",
                borderRadius: 10,
                border: "1px solid " + (wordsMode === "syn" ? "#E8B04B" : "#35504F"),
                background: wordsMode === "syn" ? "#E8B04B" : "transparent",
                color: wordsMode === "syn" ? "#1B2E22" : "#F3ECDD",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              Synonyms & Antonyms
            </button>
          </div>

          {wordsMode === "syn" ? (
            <>
              <div
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12,
                  color: "#9CB8AC",
                  marginBottom: 10,
                }}
              >
                Word {synIndex + 1}/{SYNONYM_ANTONYM_WORDS.length}
              </div>
              <div
                style={{
                  background: "#22383A",
                  borderRadius: 18,
                  padding: "24px 20px",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
                    {SYNONYM_ANTONYM_WORDS[synIndex].word}
                  </p>
                  <button
                    onClick={() => speak(SYNONYM_ANTONYM_WORDS[synIndex].word)}
                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    <Volume2 size={18} color="#E8B04B" />
                  </button>
                </div>
                <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", marginBottom: 14 }}>
                  <p style={{ fontSize: 11.5, color: "#9CB8AC", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
                    Synonyms
                  </p>
                  <p style={{ fontSize: 14.5, color: "#F3ECDD", margin: 0, lineHeight: 1.6 }}>
                    {SYNONYM_ANTONYM_WORDS[synIndex].synonyms.join(", ")}
                  </p>
                </div>
                <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                  <p style={{ fontSize: 11.5, color: "#C9A96A", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
                    Antonyms
                  </p>
                  <p style={{ fontSize: 14.5, color: "#F3ECDD", margin: 0, lineHeight: 1.6 }}>
                    {SYNONYM_ANTONYM_WORDS[synIndex].antonyms.join(", ")}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingBottom: 20 }}>
                <button
                  onClick={() => setSynIndex((i) => (i === 0 ? SYNONYM_ANTONYM_WORDS.length - 1 : i - 1))}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid #35504F",
                    borderRadius: 12,
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#F3ECDD",
                    cursor: "pointer",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 13,
                  }}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setSynIndex((i) => (i + 1) % SYNONYM_ANTONYM_WORDS.length)}
                  style={{
                    flex: 1,
                    background: "#E8B04B",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#1B2E22",
                    cursor: "pointer",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
          <>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12,
              color: "#9CB8AC",
              marginBottom: 10,
            }}
          >
            Word {vocabIndex + 1}/{VOCAB_WORDS.length}
          </div>
          <div
            onClick={() => setShowMeaning((s) => !s)}
            style={{
              background: "#22383A",
              borderRadius: 18,
              padding: "32px 22px",
              textAlign: "center",
              marginBottom: 16,
              cursor: "pointer",
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: 26, fontWeight: 600, margin: "0 0 10px" }}>
              {VOCAB_WORDS[vocabIndex].word}
            </p>
            {showMeaning ? (
              <div>
                <p
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 14.5,
                    color: "#F3ECDD",
                    margin: "0 0 8px",
                  }}
                >
                  {VOCAB_WORDS[vocabIndex].meaning}
                </p>
                <p
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 13,
                    color: "#B9AE95",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  "{VOCAB_WORDS[vocabIndex].example}"
                </p>
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12.5,
                  color: "#7A9691",
                  margin: 0,
                }}
              >
                Tap to see meaning
              </p>
            )}
          </div>

          <button
            onClick={() => speak(VOCAB_WORDS[vocabIndex].word)}
            style={{
              background: "#E8B04B",
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              color: "#1B2E22",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <Volume2 size={16} /> Hear it
          </button>

          <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingBottom: 20 }}>
            <button
              onClick={() => {
                setShowMeaning(false);
                setVocabIndex((i) => (i === 0 ? VOCAB_WORDS.length - 1 : i - 1));
              }}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid #35504F",
                borderRadius: 12,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "#F3ECDD",
                cursor: "pointer",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 13,
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => {
                setShowMeaning(false);
                setVocabIndex((i) => (i + 1) % VOCAB_WORDS.length);
              }}
              style={{
                flex: 1,
                background: "#E8B04B",
                border: "none",
                borderRadius: 12,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "#1B2E22",
                cursor: "pointer",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
          </>
          )}
        </div>
      )}

      {tab === "grammar" && (
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            flex: 1,
            padding: "8px 20px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {quizMode ? (
            <div style={{ display: "flex", flexDirection: "column", paddingBottom: 20 }}>
              <button
                onClick={() => setQuizMode(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9CB8AC",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: 10,
                  alignSelf: "flex-start",
                }}
              >
                <ChevronLeft size={14} /> All topics
              </button>
              <div
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12,
                  color: "#9CB8AC",
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Question {quizIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                <span>Score: {quizScore}/{quizAnswered}</span>
              </div>

              <div
                style={{
                  background: "#22383A",
                  borderRadius: 18,
                  padding: "22px 20px",
                  marginBottom: 16,
                }}
              >
                <p style={{ fontSize: 17, lineHeight: 1.5, margin: "0 0 18px" }}>
                  {QUIZ_QUESTIONS[quizIndex].question}
                </p>
                {QUIZ_QUESTIONS[quizIndex].options.map((opt, idx) => {
                  const isSelected = quizSelected === idx;
                  const isCorrect = idx === QUIZ_QUESTIONS[quizIndex].correct;
                  let bg = "#0F1E1F";
                  let border = "#35504F";
                  if (quizSelected !== null) {
                    if (isCorrect) {
                      bg = "#1F3A2A";
                      border = "#8FBF9F";
                    } else if (isSelected) {
                      bg = "#3A1F1F";
                      border = "#C9634A";
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => selectQuizAnswer(idx)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: bg,
                        border: "1px solid " + border,
                        borderRadius: 12,
                        padding: "11px 14px",
                        marginBottom: 8,
                        color: "#F3ECDD",
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        fontSize: 14,
                        cursor: quizSelected === null ? "pointer" : "default",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
                {quizSelected !== null && (
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: 12.5,
                      color: "#C9A96A",
                      marginTop: 10,
                      lineHeight: 1.5,
                    }}
                  >
                    💡 {QUIZ_QUESTIONS[quizIndex].explanation}
                  </p>
                )}
              </div>

              <button
                onClick={nextQuizQuestion}
                disabled={quizSelected === null}
                style={{
                  background: "#E8B04B",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px",
                  color: "#1B2E22",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: quizSelected !== null ? "pointer" : "default",
                  opacity: quizSelected !== null ? 1 : 0.5,
                }}
              >
                Next question
              </button>
            </div>
          ) : !grammarCategoryPicked ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 20 }}>
              <p
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12.5,
                  color: "#9CB8AC",
                  margin: "4px 0 6px",
                }}
              >
                Choose a topic to explore
              </p>
              <button
                onClick={startQuiz}
                style={{
                  background: "#E8B04B",
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  color: "#1B2E22",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                <span>📝 Grammar Practice Quiz</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  {QUIZ_QUESTIONS.length} questions <ChevronRight size={15} />
                </span>
              </button>
              {GRAMMAR_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.category}
                  onClick={() => pickGrammarCategory(idx)}
                  style={{
                    background: "#22383A",
                    border: "1px solid #35504F",
                    borderRadius: 14,
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    color: "#F3ECDD",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  <span>{cat.category}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#9CB8AC", fontSize: 12 }}>
                    {cat.topics.length} topics <ChevronRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => setGrammarCategoryPicked(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9CB8AC",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: 10,
                  alignSelf: "flex-start",
                }}
              >
                <ChevronLeft size={14} /> All topics
              </button>

              <div
                style={{
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 12,
                  color: "#9CB8AC",
                  marginBottom: 10,
                }}
              >
                {GRAMMAR_CATEGORIES[grammarCategoryIndex].category} · {grammarIndex + 1}/
                {GRAMMAR_CATEGORIES[grammarCategoryIndex].topics.length}
              </div>

              <div
                style={{
                  background: "#22383A",
                  borderRadius: 18,
                  padding: "22px 20px",
                  marginBottom: 16,
                }}
              >
                <p style={{ fontSize: 21, fontWeight: 600, margin: "0 0 16px" }}>
                  {currentGrammarTopic.topic}
                </p>

                <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", marginBottom: 14 }}>
                  <p style={{ fontSize: 11.5, color: "#9CB8AC", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
                    Definition
                  </p>
                  <p style={{ fontSize: 14, color: "#F3ECDD", margin: 0, lineHeight: 1.55 }}>
                    {currentGrammarTopic.definition}
                  </p>
                </div>

                <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", marginBottom: 14 }}>
                  <p style={{ fontSize: 11.5, color: "#9CB8AC", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
                    When to use it
                  </p>
                  <p style={{ fontSize: 14, color: "#F3ECDD", margin: 0, lineHeight: 1.55 }}>
                    {currentGrammarTopic.use}
                  </p>
                </div>

                {currentGrammarTopic.forms ? (
                  <>
                    {[
                      { label: "Positive", key: "affirmative" },
                      { label: "Negative", key: "negative" },
                      { label: "Question", key: "question" },
                    ].map(({ label, key }) => (
                      <div key={key} style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", marginBottom: 14 }}>
                        <p style={{ fontSize: 11.5, color: "#C9A96A", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
                          {label}
                        </p>
                        <p style={{ fontSize: 12.5, color: "#9CB8AC", margin: "0 0 4px", fontFamily: "monospace" }}>
                          {currentGrammarTopic.forms[key].structure}
                        </p>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <p style={{ fontSize: 14, color: "#F3ECDD", margin: 0, lineHeight: 1.5, fontStyle: "italic", flex: 1 }}>
                            {currentGrammarTopic.forms[key].example}
                          </p>
                          <button
                            onClick={() => speak(currentGrammarTopic.forms[key].example)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", flexShrink: 0 }}
                          >
                            <Volume2 size={14} color="#C9A96A" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", marginBottom: 14 }}>
                      <p style={{ fontSize: 11.5, color: "#9CB8AC", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
                        Structure
                      </p>
                      <p style={{ fontSize: 14, color: "#F3ECDD", margin: 0, lineHeight: 1.55, fontFamily: "monospace" }}>
                        {currentGrammarTopic.structure}
                      </p>
                    </div>

                    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                      <p style={{ fontSize: 11.5, color: "#C9A96A", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
                        Example
                      </p>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <p style={{ fontSize: 14, color: "#F3ECDD", margin: 0, lineHeight: 1.55, fontStyle: "italic", flex: 1 }}>
                          {currentGrammarTopic.example}
                        </p>
                        <button
                          onClick={() => speak(currentGrammarTopic.example)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", flexShrink: 0 }}
                        >
                          <Volume2 size={15} color="#C9A96A" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button
                  onClick={() =>
                    setGrammarIndex((i) =>
                      i === 0 ? GRAMMAR_CATEGORIES[grammarCategoryIndex].topics.length - 1 : i - 1
                    )
                  }
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid #35504F",
                    borderRadius: 12,
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#F3ECDD",
                    cursor: "pointer",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 13,
                  }}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() =>
                    setGrammarIndex((i) => (i + 1) % GRAMMAR_CATEGORIES[grammarCategoryIndex].topics.length)
                  }
                  style={{
                    flex: 1,
                    background: "#E8B04B",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "#1B2E22",
                    cursor: "pointer",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "qa" && (
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            flex: 1,
            padding: "8px 20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12,
              color: "#9CB8AC",
              marginBottom: 10,
            }}
          >
            Question {qaIndex + 1}/{QA_QUESTIONS.length}
          </div>

          <div
            style={{
              background: "#22383A",
              borderRadius: 18,
              padding: "22px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <p style={{ fontSize: 18, lineHeight: 1.4, margin: 0 }}>
              {QA_QUESTIONS[qaIndex]}
            </p>
            <button
              onClick={() => speak(QA_QUESTIONS[qaIndex])}
              style={{ background: "transparent", border: "none", cursor: "pointer", flexShrink: 0 }}
            >
              <Volume2 size={18} color="#E8B04B" />
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "flex-end" }}>
            <textarea
              value={qaAnswer}
              onChange={(e) => setQaAnswer(e.target.value)}
              placeholder={qaListening ? "Listening…" : "Type or speak your answer…"}
              rows={3}
              style={{
                flex: 1,
                background: "#22383A",
                border: "1px solid #35504F",
                borderRadius: 14,
                padding: "12px 14px",
                color: "#F3ECDD",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 14.5,
                outline: "none",
                resize: "none",
              }}
            />
            <button
              onClick={toggleQaListening}
              disabled={!speechSupported}
              style={{
                background: qaListening ? "#C9634A" : "#E8B04B",
                border: "none",
                borderRadius: 12,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: speechSupported ? "pointer" : "not-allowed",
                flexShrink: 0,
                opacity: speechSupported ? 1 : 0.4,
              }}
              title={speechSupported ? "Tap to speak your answer" : "Voice input not supported"}
            >
              {qaListening ? <Square size={17} color="#1B2E22" /> : <Mic size={18} color="#1B2E22" />}
            </button>
          </div>

          <button
            onClick={submitQaAnswer}
            disabled={!qaAnswer.trim() || qaLoading || limitReached}
            style={{
              background: "#E8B04B",
              border: "none",
              borderRadius: 12,
              padding: "12px",
              color: "#1B2E22",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: qaAnswer.trim() && !limitReached ? "pointer" : "default",
              opacity: qaAnswer.trim() && !limitReached ? 1 : 0.5,
              marginBottom: 8,
            }}
          >
            {limitReached ? "Daily limit reached" : qaLoading ? "Thinking…" : "Check my answer"}
          </button>
          {limitReached && (
            <p
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 12,
                color: "#B9AE95",
                marginBottom: 14,
              }}
            >
              You've used today's {DAILY_LIMIT} free AI checks across Chat, Q&A, and Write. Come back tomorrow!
            </p>
          )}

          {qaSuggestion && (
            <div
              style={{
                background: "#0F1E1F",
                border: "1px solid #35504F",
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 14,
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
            >
              {qaSuggestion.encouragement && (
                <p style={{ fontSize: 13, color: "#9CB8AC", margin: "0 0 8px" }}>
                  {qaSuggestion.encouragement}
                </p>
              )}
              <p style={{ fontSize: 13, color: "#C9A96A", margin: 0, display: "flex", gap: 6, alignItems: "flex-start" }}>
                <Sparkles size={13} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{qaSuggestion.betterAnswer}</span>
                <button
                  onClick={() => speak(qaSuggestion.betterAnswer)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}
                >
                  <Volume2 size={14} color="#C9A96A" />
                </button>
              </p>
            </div>
          )}

          <button
            onClick={nextQaQuestion}
            style={{
              background: "transparent",
              border: "1px solid #35504F",
              borderRadius: 12,
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "#F3ECDD",
              cursor: "pointer",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 13,
              marginTop: "auto",
              marginBottom: 20,
            }}
          >
            Next question <ChevronRight size={16} />
          </button>
        </div>
      )}
      {tab === "write" && (
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            flex: 1,
            padding: "8px 20px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 12.5,
              color: "#9CB8AC",
              margin: "4px 0 10px",
              lineHeight: 1.5,
            }}
          >
            Write a few sentences or a paragraph — get a full review: grammar, tenses used, and vocabulary tips.
          </p>

          <textarea
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            placeholder="Write your paragraph here…"
            rows={7}
            style={{
              background: "#22383A",
              border: "1px solid #35504F",
              borderRadius: 14,
              padding: "12px 14px",
              color: "#F3ECDD",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 14.5,
              outline: "none",
              resize: "none",
              marginBottom: 12,
              lineHeight: 1.5,
            }}
          />

          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button
              onClick={reviewWriting}
              disabled={!writingText.trim() || writingLoading || limitReached}
              style={{
                flex: 1,
                background: "#E8B04B",
                border: "none",
                borderRadius: 12,
                padding: "12px",
                color: "#1B2E22",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: writingText.trim() && !limitReached ? "pointer" : "default",
                opacity: writingText.trim() && !limitReached ? 1 : 0.5,
              }}
            >
              {limitReached ? "Daily limit reached" : writingLoading ? "Reviewing…" : "Review my writing"}
            </button>
            {writingResult && (
              <button
                onClick={clearWriting}
                style={{
                  background: "transparent",
                  border: "1px solid #35504F",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "#F3ECDD",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                New
              </button>
            )}
          </div>

          {limitReached && (
            <p
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 12,
                color: "#B9AE95",
                marginBottom: 16,
              }}
            >
              You've used today's {DAILY_LIMIT} free AI checks across Chat, Q&A, and Write. Come back tomorrow!
            </p>
          )}

          {writingResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24 }}>
              <div
                style={{
                  background: "#22383A",
                  borderRadius: 16,
                  padding: "18px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 999,
                      background: "#E8B04B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Award size={24} color="#1B2E22" />
                  </div>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#F3ECDD" }}>
                      {writingResult.subScores && writingResult.subScores.overall !== undefined
                        ? `${writingResult.subScores.overall}/10 Overall`
                        : "—"}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        fontSize: 12.5,
                        color: "#9CB8AC",
                        margin: "2px 0 0",
                        lineHeight: 1.4,
                      }}
                    >
                      {writingResult.summary}
                    </p>
                  </div>
                </div>

                {writingResult.subScores && (
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { label: "Grammar", key: "grammar" },
                      { label: "Vocabulary", key: "vocabulary" },
                      { label: "Naturalness", key: "naturalness" },
                    ].map(({ label, key }) => (
                      <div
                        key={key}
                        style={{
                          flex: 1,
                          background: "#0F1E1F",
                          borderRadius: 10,
                          padding: "8px 6px",
                          textAlign: "center",
                        }}
                      >
                        <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#E8B04B" }}>
                          {writingResult.subScores[key]}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                            fontSize: 10.5,
                            color: "#9CB8AC",
                            margin: "2px 0 0",
                          }}
                        >
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {writingResult.improvementAreas && writingResult.improvementAreas.length > 0 && (
                <div
                  style={{
                    background: "#0F1E1F",
                    border: "1px solid #4A3F26",
                    borderRadius: 14,
                    padding: "14px 16px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: 11.5,
                      color: "#C9A96A",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      margin: "0 0 8px",
                    }}
                  >
                    Focus on next
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {writingResult.improvementAreas.map((area, i) => (
                      <p
                        key={i}
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: 13.5,
                          color: "#F3ECDD",
                          margin: 0,
                        }}
                      >
                        {i + 1}. {area}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {writingResult.tensesUsed && writingResult.tensesUsed.length > 0 && (
                <div>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: 11.5,
                      color: "#9CB8AC",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      margin: "0 0 8px",
                    }}
                  >
                    Tenses used
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {writingResult.tensesUsed.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#0F1E1F",
                          border: "1px solid #35504F",
                          borderRadius: 999,
                          padding: "5px 12px",
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: 12,
                          color: "#F3ECDD",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {writingResult.corrections && writingResult.corrections.length > 0 && (
                <div>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: 11.5,
                      color: "#9CB8AC",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      margin: "0 0 8px",
                    }}
                  >
                    Corrections
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {writingResult.corrections.map((c, ci) => (
                      <div
                        key={ci}
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: 12.5,
                          border: "1px solid #35504F",
                          borderRadius: 10,
                          padding: "10px 12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div style={{ display: "flex", gap: 6, color: "#C9634A" }}>
                          <span>❌</span>
                          <span style={{ textDecoration: "line-through", opacity: 0.85 }}>{c.original}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6, color: "#8FBF9F", fontWeight: 600 }}>
                          <span>✅</span>
                          <span>{c.corrected}</span>
                        </div>
                        {c.explanation && (
                          <div style={{ display: "flex", gap: 6, color: "#B9AE95" }}>
                            <span>💡</span>
                            <span>{c.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {writingResult.vocabularyNotes && writingResult.vocabularyNotes.length > 0 && (
                <div>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: 11.5,
                      color: "#9CB8AC",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      margin: "0 0 8px",
                    }}
                  >
                    Vocabulary notes
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {writingResult.vocabularyNotes.map((v, vi) => (
                      <div
                        key={vi}
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          fontSize: 12.5,
                          background: "#0F1E1F",
                          border: "1px solid #4A3F26",
                          borderRadius: 10,
                          padding: "10px 12px",
                        }}
                      >
                        <span style={{ color: "#E8B04B", fontWeight: 600 }}>{v.word}</span>
                        <span style={{ color: "#B9AE95" }}> — {v.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "chat" && (
      <div
        ref={scrollRef}
        style={{
          width: "100%",
          maxWidth: 560,
          flex: 1,
          overflowY: "auto",
          padding: "8px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                gap: 6,
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  background: m.role === "user" ? "#E8B04B" : "#22383A",
                  color: m.role === "user" ? "#1B2E22" : "#F3ECDD",
                  borderRadius:
                    m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "10px 14px",
                  fontSize: 15.5,
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
              {m.role === "assistant" && (
                <button
                  onClick={() => speak(m.text)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    flexShrink: 0,
                  }}
                  title="Play voice"
                >
                  <Volume2 size={15} color="#6E8480" />
                </button>
              )}
            </div>
            {((m.corrections && m.corrections.length > 0) || m.pronunciationTip) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                {m.corrections &&
                  m.corrections.map((c, ci) => (
                    <div
                      key={ci}
                      style={{
                        maxWidth: "85%",
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        fontSize: 12.5,
                        color: "#9CB8AC",
                        border: "1px solid #35504F",
                        borderRadius: 10,
                        padding: "9px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div style={{ display: "flex", gap: 6, color: "#C9634A" }}>
                        <span>❌</span>
                        <span style={{ textDecoration: "line-through", opacity: 0.85 }}>
                          {c.original}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "flex-start", color: "#8FBF9F" }}>
                        <span>✅</span>
                        <span style={{ flex: 1, fontWeight: 600 }}>{c.corrected}</span>
                        <button
                          onClick={() => speak(c.corrected)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}
                        >
                          <Volume2 size={12} color="#8FBF9F" />
                        </button>
                      </div>
                      {c.explanation && (
                        <div style={{ display: "flex", gap: 6, color: "#B9AE95" }}>
                          <span>💡</span>
                          <span>{c.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                {m.pronunciationTip && (
                  <div
                    style={{
                      maxWidth: "78%",
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: 12.5,
                      color: "#C9A96A",
                      border: "1px solid #4A3F26",
                      borderRadius: 10,
                      padding: "7px 11px",
                      display: "flex",
                      gap: 6,
                      alignItems: "flex-start",
                    }}
                  >
                    <Volume2 size={13} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{m.pronunciationTip}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: "#22383A",
                borderRadius: "16px 16px 16px 4px",
                padding: "10px 14px",
                color: "#9CB8AC",
                fontSize: 14,
              }}
            >
              typing…
            </div>
          </div>
        )}
      </div>

      )}

      {tab === "chat" && (
      <div style={{ width: "100%", maxWidth: 560, padding: "14px 20px 26px" }}>
        {limitReached ? (
          <div
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 13.5,
              color: "#B9AE95",
              border: "1px solid #35504F",
              borderRadius: 12,
              padding: "14px 16px",
              textAlign: "center",
            }}
          >
            You've used today's {DAILY_LIMIT} free conversations. Come back
            tomorrow — or premium (unlimited) is coming soon.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              background: "#22383A",
              borderRadius: 16,
              padding: 8,
            }}
          >
            <button
              onClick={toggleListening}
              disabled={!speechSupported}
              style={{
                background: listening ? "#C9634A" : "#E8B04B",
                border: "none",
                borderRadius: 12,
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: speechSupported ? "pointer" : "not-allowed",
                flexShrink: 0,
                opacity: speechSupported ? 1 : 0.4,
              }}
              title={speechSupported ? "Tap to speak" : "Voice input not supported"}
            >
              {listening ? (
                <Square size={17} color="#1B2E22" />
              ) : (
                <Mic size={18} color="#1B2E22" />
              )}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={listening ? "Listening…" : "Type or tap the mic to speak…"}
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                color: "#F3ECDD",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 15,
                padding: "10px 6px",
                maxHeight: 90,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                background: "transparent",
                border: "none",
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() ? "pointer" : "default",
                opacity: input.trim() ? 1 : 0.35,
                flexShrink: 0,
              }}
            >
              <Send size={18} color="#F3ECDD" />
            </button>
          </div>
        )}
        {!speechSupported && (
          <p
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 11.5,
              color: "#6E8480",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Voice input isn't supported in this browser — typing still works.
          </p>
        )}
      </div>
      )}
    </div>
  );
}
