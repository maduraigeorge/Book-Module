
import { PageData, Resource, ResourceType } from './types';

// Helper to generate consistent placeholder images
const getPageImage = (seed: string) => `https://picsum.photos/seed/${seed}/800/1131`; 
const getThumb = (id: string) => `https://picsum.photos/seed/thumb_${id}/200/200`;

const COMMON_STYLES = {
  pageContainer: "h-full w-full bg-white p-6 md:p-10 text-slate-800 font-sans text-base md:text-lg leading-relaxed flex flex-col",
  header: "font-black text-2xl md:text-3xl mb-4 border-b-4 pb-2 inline-block rounded-b-lg",
  subHeader: "font-black text-xl mt-6 mb-3",
  paragraph: "mb-4 text-slate-700 text-justify font-medium",
  questionBox: "bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-5 my-6 relative shadow-sm",
  activityBox: "bg-green-50 border-2 border-green-300 rounded-3xl p-5 my-6 shadow-sm hover:shadow-md transition-shadow",
  factBox: "bg-blue-50 p-5 rounded-2xl border-2 border-blue-200 text-sm font-medium relative overflow-hidden"
};

// --- BOOK 1: STUDIO (Violet Theme) ---
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
        <div class="flex justify-between items-end mb-6">
           <div><span class="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Studio Ch 1</span><h1 class="text-4xl md:text-5xl font-black text-violet-700 tracking-tight mt-2">Super Senses</h1></div>
           <span class="text-4xl font-black text-slate-200">01</span>
        </div>
        <p class="${COMMON_STYLES.paragraph}"><strong>Has this ever happened to you?</strong> You were eating in the playground, an eagle flew down and took away your roti?</p>
        <div class="grid grid-cols-2 gap-4 mb-6">
           <img src="https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=400&q=80" class="rounded-xl h-32 w-full object-cover shadow-sm" />
           <img src="https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=400&q=80" class="rounded-xl h-32 w-full object-cover shadow-sm" />
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
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h2 class="${COMMON_STYLES.subHeader} text-violet-600">Think and Tell</h2><div class="${COMMON_STYLES.activityBox}"><h3 class="font-bold text-green-700">Try this!</h3><p>Drop some sugar on the ground.</p></div></div>`
  },
  {
    pageNumber: 3,
    title: "Studio: Dog's Smell",
    contentImage: getPageImage('studio_3'),
    textContent: "Dogs mark their area.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-violet-700">A Dog's World</h1><p class="${COMMON_STYLES.paragraph}">Dogs mark out their own area on the road. They can make out if another dog has come into their area by the smell of its urine or potty.</p></div>`
  },
  {
    pageNumber: 4,
    title: "Studio: Do we smell?",
    contentImage: getPageImage('studio_4'),
    textContent: "Good smell, bad smell.",
    resources: [{ id: 's4-1', title: "Smell Test Audio", type: ResourceType.AUDIO, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h2 class="${COMMON_STYLES.subHeader}">Write</h2><p>Name the animals whose ears we can see.</p><div class="${COMMON_STYLES.questionBox}">In what ways do human beings make use of this special sense of smell of dogs?</div></div>`
  },
  {
    pageNumber: 5,
    title: "Studio: Bird's Eye View",
    contentImage: getPageImage('studio_5'),
    textContent: "Most of the birds have eyes on either side of the head.",
    resources: [{ id: 's5-1', title: "Bird Vision", type: ResourceType.VIDEO, url: "https://www.w3schools.com/html/mov_bbb.mp4" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-violet-700">Sight</h1><p class="${COMMON_STYLES.paragraph}">Most of the birds have their eyes on either side of the head. Their eyes can focus on two different things at a time.</p></div>`
  }
];

// --- BOOK 2: COMPANION (Blue Theme) ---
export const COMPANION_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "Companion: Worksheet 1",
    contentImage: getPageImage('comp_1'),
    textContent: "Worksheet 1. Match the following.",
    resources: [{ id: 'c1-1', title: "Answer Key", type: ResourceType.DOCUMENT, url: "#" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-black w-max">Worksheet 1</span><h1 class="text-4xl font-black text-blue-700 mt-2">Senses Check</h1><div class="mt-8 space-y-4"><div class="border-b pb-4"><p class="font-bold">1. Which animal has super sight?</p></div></div></div>`
  },
  {
    pageNumber: 2,
    title: "Companion: Activity Log",
    contentImage: getPageImage('comp_2'),
    textContent: "Record your observations.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-blue-700">Field Notes</h1><div class="bg-blue-50 h-64 rounded-xl border-2 border-blue-200 mt-4 p-4">Draw what you saw today...</div></div>`
  },
  {
    pageNumber: 3,
    title: "Companion: Quiz",
    contentImage: getPageImage('comp_3'),
    textContent: "Multiple choice questions.",
    resources: [{ id: 'c3-1', title: "Interactive Quiz", type: ResourceType.LINK, url: "https://google.com" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-blue-700">Pop Quiz</h1><p>Test your knowledge about animal senses.</p></div>`
  },
  {
    pageNumber: 4,
    title: "Companion: Crossword",
    contentImage: getPageImage('comp_4'),
    textContent: "Solve the puzzle.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-blue-700">Vocabulary</h1><p>Find the hidden words related to senses.</p></div>`
  },
  {
    pageNumber: 5,
    title: "Companion: Summary",
    contentImage: getPageImage('comp_5'),
    textContent: "Chapter summary.",
    resources: [{ id: 'c5-1', title: "Summary Audio", type: ResourceType.AUDIO, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-blue-700">Recap</h1><ul class="list-disc pl-5 space-y-2 mt-4"><li>Animals have super senses.</li><li>Ants smell pheromones.</li><li>Eagles have sharp vision.</li></ul></div>`
  }
];

// --- BOOK 3: FHB (Teacher Handbook - Orange Theme) ---
export const FHB_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "FHB: Lesson Plan 1",
    contentImage: getPageImage('fhb_1'),
    textContent: "Lesson Plan for Chapter 1.",
    resources: [{ id: 'f1-1', title: "Pedagogy Video", type: ResourceType.VIDEO, url: "https://www.w3schools.com/html/movie.mp4" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><span class="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-black w-max">Teacher Guide</span><h1 class="text-4xl font-black text-orange-700 mt-2">Lesson 1: Introduction</h1><div class="mt-6 bg-orange-50 p-4 rounded-xl"><h3 class="font-bold">Objectives</h3><p>Introduce the concept of senses in animals.</p></div></div>`
  },
  {
    pageNumber: 2,
    title: "FHB: Teaching Aids",
    contentImage: getPageImage('fhb_2'),
    textContent: "Materials required.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-orange-700">Classroom Setup</h1><p>Bring sugar cubes, pictures of eagles, and sound clips.</p></div>`
  },
  {
    pageNumber: 3,
    title: "FHB: Differentiated Instruction",
    contentImage: getPageImage('fhb_3'),
    textContent: "For slow learners and advanced learners.",
    resources: [{ id: 'f3-1', title: "Remedial Plan", type: ResourceType.DOCUMENT, url: "#" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-orange-700">Differentiation</h1><p>Group A: Visual matching activities.<br>Group B: Research project on nocturnal animals.</p></div>`
  },
  {
    pageNumber: 4,
    title: "FHB: Assessment",
    contentImage: getPageImage('fhb_4'),
    textContent: "Formative assessment ideas.",
    resources: [],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-orange-700">Assessment</h1><p>Ask open-ended questions like "Why do you think dogs sniff lampposts?"</p></div>`
  },
  {
    pageNumber: 5,
    title: "FHB: Extension",
    contentImage: getPageImage('fhb_5'),
    textContent: "Beyond the classroom.",
    resources: [{ id: 'f5-1', title: "Project Guidelines", type: ResourceType.DOCUMENT, url: "#" }],
    htmlContent: `<div class="${COMMON_STYLES.pageContainer}"><h1 class="text-3xl font-black text-orange-700">Home Project</h1><p>Ask students to observe a pet or a stray animal for 10 minutes and record what senses it used.</p></div>`
  }
];

export const TOTAL_PAGES = 5;
