
import { PageData, Resource, ResourceType } from './types';

// Helper to generate consistent placeholder images
const getPageImage = (seed: string) => `https://picsum.photos/seed/${seed}/800/1131`; 
const getThumb = (id: string) => `https://picsum.photos/seed/thumb_${id}/200/200`;

// Modern, clean styles for the internal page content
const COMMON_STYLES = {
  pageContainer: "h-full w-full bg-white p-8 md:p-12 text-zinc-800 font-sans text-base md:text-lg leading-relaxed flex flex-col",
  header: "font-bold text-3xl md:text-4xl mb-6 tracking-tight text-zinc-900 border-l-4 border-indigo-600 pl-4",
  subHeader: "font-semibold text-xl mt-8 mb-4 text-zinc-800",
  paragraph: "mb-6 text-zinc-600 text-justify leading-7",
  questionBox: "bg-indigo-50 border-l-4 border-indigo-500 p-6 my-6 rounded-r-lg text-indigo-900 italic",
  activityBox: "bg-emerald-50 border border-emerald-100 p-6 my-6 rounded-lg",
  factBox: "bg-zinc-100 p-6 rounded-lg text-sm text-zinc-600 border border-zinc-200"
};

// --- BOOK 1: STUDIO ---
export const STUDIO_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "Studio: Super Senses",
    contentImage: getPageImage('studio_1'),
    textContent: "Super Senses. Has this ever happened to you?",
    resources: [
      { id: 's1-1', title: "Intro: Animal Senses", type: ResourceType.VIDEO, url: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "03:15", thumbnail: getThumb('s1-1') }
    ],
    htmlContent: `
      <div class="${COMMON_STYLES.pageContainer}">
        <div class="flex justify-between items-start mb-8">
           <div>
             <span class="text-indigo-600 text-xs font-bold uppercase tracking-widest">Chapter 01</span>
             <h1 class="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mt-2">Super Senses</h1>
           </div>
           <span class="text-6xl font-thin text-zinc-100">01</span>
        </div>
        <p class="${COMMON_STYLES.paragraph}"><strong>Has this ever happened to you?</strong> You were eating in the playground, an eagle flew down and took away your roti?</p>
        <div class="grid grid-cols-2 gap-4 mb-6">
           <img src="https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=400&q=80" class="rounded-lg h-32 w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
           <img src="https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=400&q=80" class="rounded-lg h-32 w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>`
  },
  {
    pageNumber: 2,
    title: "Studio: The Ant World",
    contentImage: getPageImage('studio_2'),
    textContent: "Think and tell. The Ant World.",
    resources: [
      { id: 's2-1', title: "Ants Marching", type: ResourceType.VIDEO, url: "https://www.w3schools.com/html/movie.mp4", thumbnail: getThumb('s2-1') },
      { id: 's2-2', title: "Ant Facts PDF", type: ResourceType.DOCUMENT, url: "#", thumbnail: getThumb('s2-2') }
    ],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h2 class="${COMMON_STYLES.subHeader}">Think and Tell</h2><div class="${COMMON_STYLES.activityBox}"><h3 class="font-bold text-emerald-800 mb-2">Try this!</h3><p class="text-emerald-900">Drop some sugar on the ground and see how long it takes for the ants to come.</p></div></div>`
  },
  {
    pageNumber: 3,
    title: "Studio: Dog's Smell",
    contentImage: getPageImage('studio_3'),
    textContent: "Dogs mark their area.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">A Dog's World</h1><p class="${COMMON_STYLES.paragraph}">Dogs mark out their own area on the road. They can make out if another dog has come into their area by the smell of its urine or potty.</p></div>`
  },
  {
    pageNumber: 4,
    title: "Studio: Do we smell?",
    contentImage: getPageImage('studio_4'),
    textContent: "Good smell, bad smell.",
    resources: [{ id: 's4-1', title: "Smell Test Audio", type: ResourceType.AUDIO, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h2 class="${COMMON_STYLES.subHeader}">Write</h2><p class="mb-4">Name the animals whose ears we can see.</p><div class="${COMMON_STYLES.questionBox}">In what ways do human beings make use of this special sense of smell of dogs?</div></div>`
  },
  {
    pageNumber: 5,
    title: "Studio: Bird's Eye View",
    contentImage: getPageImage('studio_5'),
    textContent: "Most of the birds have eyes on either side of the head.",
    resources: [{ id: 's5-1', title: "Bird Vision", type: ResourceType.VIDEO, url: "https://www.w3schools.com/html/mov_bbb.mp4" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Sight</h1><p class="${COMMON_STYLES.paragraph}">Most of the birds have their eyes on either side of the head. Their eyes can focus on two different things at a time.</p></div>`
  }
];

// --- BOOK 2: COMPANION ---
export const COMPANION_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "Companion: Worksheet 1",
    contentImage: getPageImage('comp_1'),
    textContent: "Worksheet 1. Match the following.",
    resources: [{ id: 'c1-1', title: "Answer Key", type: ResourceType.DOCUMENT, url: "#" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><span class="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold w-max uppercase tracking-wider">Worksheet 1</span><h1 class="text-4xl font-bold text-zinc-900 mt-4">Senses Check</h1><div class="mt-8 space-y-6"><div class="border-b border-zinc-100 pb-4"><p class="font-medium">1. Which animal has super sight?</p></div></div></div>`
  },
  {
    pageNumber: 2,
    title: "Companion: Activity Log",
    contentImage: getPageImage('comp_2'),
    textContent: "Record your observations.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Field Notes</h1><div class="bg-zinc-50 h-64 rounded-lg border border-zinc-200 mt-4 p-6 text-zinc-400 italic">Draw what you saw today...</div></div>`
  },
  {
    pageNumber: 3,
    title: "Companion: Quiz",
    contentImage: getPageImage('comp_3'),
    textContent: "Multiple choice questions.",
    resources: [{ id: 'c3-1', title: "Interactive Quiz", type: ResourceType.LINK, url: "https://google.com" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Pop Quiz</h1><p class="${COMMON_STYLES.paragraph}">Test your knowledge about animal senses.</p></div>`
  },
  {
    pageNumber: 4,
    title: "Companion: Crossword",
    contentImage: getPageImage('comp_4'),
    textContent: "Solve the puzzle.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Vocabulary</h1><p class="${COMMON_STYLES.paragraph}">Find the hidden words related to senses.</p></div>`
  },
  {
    pageNumber: 5,
    title: "Companion: Summary",
    contentImage: getPageImage('comp_5'),
    textContent: "Chapter summary.",
    resources: [{ id: 'c5-1', title: "Summary Audio", type: ResourceType.AUDIO, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Recap</h1><ul class="list-disc pl-5 space-y-3 mt-4 text-zinc-600"><li>Animals have super senses.</li><li>Ants smell pheromones.</li><li>Eagles have sharp vision.</li></ul></div>`
  }
];

// --- BOOK 3: FHB ---
export const FHB_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "FHB: Lesson Plan 1",
    contentImage: getPageImage('fhb_1'),
    textContent: "Lesson Plan for Chapter 1.",
    resources: [{ id: 'f1-1', title: "Pedagogy Video", type: ResourceType.VIDEO, url: "https://www.w3schools.com/html/movie.mp4" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><span class="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold w-max uppercase tracking-wider">Teacher Guide</span><h1 class="text-4xl font-bold text-zinc-900 mt-4">Lesson 1: Introduction</h1><div class="mt-6 bg-orange-50/50 p-6 rounded-lg border border-orange-100"><h3 class="font-bold text-orange-900">Objectives</h3><p class="text-orange-800 mt-2">Introduce the concept of senses in animals.</p></div></div>`
  },
  {
    pageNumber: 2,
    title: "FHB: Teaching Aids",
    contentImage: getPageImage('fhb_2'),
    textContent: "Materials required.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Classroom Setup</h1><p class="${COMMON_STYLES.paragraph}">Bring sugar cubes, pictures of eagles, and sound clips.</p></div>`
  },
  {
    pageNumber: 3,
    title: "FHB: Differentiated Instruction",
    contentImage: getPageImage('fhb_3'),
    textContent: "For slow learners and advanced learners.",
    resources: [{ id: 'f3-1', title: "Remedial Plan", type: ResourceType.DOCUMENT, url: "#" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Differentiation</h1><p class="${COMMON_STYLES.paragraph}">Group A: Visual matching activities.<br>Group B: Research project on nocturnal animals.</p></div>`
  },
  {
    pageNumber: 4,
    title: "FHB: Assessment",
    contentImage: getPageImage('fhb_4'),
    textContent: "Formative assessment ideas.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Assessment</h1><p class="${COMMON_STYLES.paragraph}">Ask open-ended questions like "Why do you think dogs sniff lampposts?"</p></div>`
  },
  {
    pageNumber: 5,
    title: "FHB: Extension",
    contentImage: getPageImage('fhb_5'),
    textContent: "Beyond the classroom.",
    resources: [{ id: 'f5-1', title: "Project Guidelines", type: ResourceType.DOCUMENT, url: "#" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="${COMMON_STYLES.header}">Home Project</h1><p class="${COMMON_STYLES.paragraph}">Ask students to observe a pet or a stray animal for 10 minutes and record what senses it used.</p></div>`
  }
];

export const TOTAL_PAGES = 5;
