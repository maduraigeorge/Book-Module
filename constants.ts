
import { PageData, Resource, ResourceType } from './types';

// Helper to generate consistent placeholder images
const getPageImage = (page: number) => `https://picsum.photos/seed/cbse_evs_${page}/800/1131`; 
const getThumb = (id: string) => `https://picsum.photos/seed/thumb_${id}/200/200`;

export const TOTAL_PAGES = 8;

const COMMON_STYLES = {
  pageContainer: "h-full w-full bg-white p-6 md:p-10 text-slate-800 font-sans text-base md:text-lg leading-relaxed flex flex-col",
  header: "font-black text-2xl md:text-3xl text-violet-600 mb-4 border-b-4 border-yellow-300 pb-2 inline-block rounded-b-lg",
  subHeader: "font-black text-xl text-orange-500 mt-6 mb-3",
  paragraph: "mb-4 text-slate-700 text-justify font-medium",
  questionBox: "bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-5 my-6 relative shadow-sm",
  activityBox: "bg-green-50 border-2 border-green-300 rounded-3xl p-5 my-6 shadow-sm hover:shadow-md transition-shadow",
  imgContainer: "my-4 rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-1 hover:rotate-0 transition-transform",
  factBox: "bg-blue-50 p-5 rounded-2xl border-2 border-blue-200 text-sm font-medium relative overflow-hidden"
};

export const MOCK_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "Ch 1: Super Senses",
    contentImage: getPageImage(1),
    htmlContent: `
      <div class="${COMMON_STYLES.pageContainer}">
        <div class="flex justify-between items-end mb-6">
           <div>
             <span class="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Chapter 1</span>
             <h1 class="text-4xl md:text-5xl font-black text-violet-700 tracking-tight mt-2">Super Senses</h1>
           </div>
           <span class="text-4xl font-black text-slate-200">01</span>
        </div>

        <div class="${COMMON_STYLES.paragraph}">
          <strong>Has this ever happened to you?</strong>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
           <div class="col-span-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              <p class="mb-2 text-sm font-bold text-slate-600">Eagle took your roti?</p>
              <img src="https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=400&q=80" class="rounded-xl h-32 w-full object-cover" />
           </div>
           <div class="col-span-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              <p class="mb-2 text-sm font-bold text-slate-600">Ants found the sweets?</p>
              <img src="https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=400&q=80" class="rounded-xl h-32 w-full object-cover" />
           </div>
        </div>

        <div class="${COMMON_STYLES.questionBox}">
          <span class="absolute -top-4 -left-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg text-xs font-black transform -rotate-6 shadow-sm">THINK!</span>
          <p class="font-bold text-lg text-yellow-800">Why does it happen?</p>
          <p class="text-sm text-yellow-700 mt-1">Think and tell your friends.</p>
        </div>

        <p class="${COMMON_STYLES.paragraph}">
          Animals also have different senses. They can see, hear, taste, smell and feel. Some animals can see their prey from far away. Some can hear even the faintest sound.
        </p>

        <div class="${COMMON_STYLES.activityBox}">
           <h3 class="font-black text-green-700 mb-2 flex items-center gap-2">
             <span class="text-2xl">🐜</span> Ant Friends
           </h3>
           <p>An ant was going along on the ground. It saw a group of ants coming from the other side. The first ant quickly came back to its hole. The ant guarding the hole recognized it and let it in.</p>
        </div>
      </div>
    `,
    textContent: "Has this ever happened to you? You were eating in the playground, an eagle flew down and took away your roti?",
    resources: [
      {
        id: 'evs-1-1',
        title: "Intro: Animal Senses",
        type: ResourceType.VIDEO,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "03:15",
        thumbnail: getThumb('evs-1-1'),
        description: "How animals perceive the world differently from humans."
      },
      {
        id: 'evs-1-2',
        title: "Activity: Drop Sugar",
        type: ResourceType.DOCUMENT,
        url: "#",
        description: "Observe how long it takes for ants to come."
      }
    ]
  },
  {
    pageNumber: 2,
    title: "The Ant World",
    contentImage: getPageImage(2),
    htmlContent: `
      <div class="${COMMON_STYLES.pageContainer}">
        <div class="flex justify-between items-start border-b-2 border-slate-100 pb-2 mb-4">
           <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">EVS - Class 5</span>
           <span class="text-lg font-black text-slate-300">02</span>
        </div>

        <h2 class="${COMMON_STYLES.subHeader}">Think and Tell</h2>
        <div class="bg-orange-50 rounded-2xl p-6 mb-6 relative">
          <ul class="list-disc pl-6 space-y-3 text-slate-700 font-medium marker:text-orange-400">
             <li>How did the ant know that the other ants were not from its group?</li>
             <li>How did the guard ant recognize this ant?</li>
          </ul>
        </div>

        <div class="${COMMON_STYLES.activityBox}">
           <h3 class="font-black text-green-700 mb-2 flex items-center gap-2">
             <span class="text-2xl">📝</span> Try this!
           </h3>
           <p class="mb-2 font-bold text-green-900">Drop some sugar on the ground.</p>
           <ol class="list-decimal pl-5 space-y-2 text-sm mt-2 text-green-800 font-bold">
             <li>How long did it take for the ants to come?</li>
             <li>Did one ant come first or a group?</li>
             <li>What did the ants do with the food?</li>
           </ol>
        </div>

        <div class="${COMMON_STYLES.factBox}">
            <div class="flex gap-4 items-center">
                <img src="https://images.unsplash.com/photo-1543169343-6d091a133246?auto=format&fit=crop&w=100&q=80" class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
                <div>
                   <span class="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full font-black uppercase">Fact</span>
                   <h4 class="font-black text-blue-900 text-lg mt-1">I am a Silk Worm</h4>
                   <p class="italic text-blue-700 mt-1">"I can find my female worm from many kilometers away by her smell."</p>
                </div>
            </div>
        </div>
      </div>
    `,
    textContent: "How did the ant recognize a friend? Ants leave a smell on the ground...",
    resources: [
      {
        id: 'evs-2-1',
        title: "Topic: How Ants March",
        type: ResourceType.VIDEO,
        url: "https://www.w3schools.com/html/movie.mp4",
        duration: "02:45",
        thumbnail: getThumb('evs-2-1'),
        description: "Watch how ants follow a scent trail in a line."
      }
    ]
  },
  {
    pageNumber: 3,
    title: "Super Sense of Smell",
    contentImage: getPageImage(3),
    htmlContent: `
       <div class="${COMMON_STYLES.pageContainer}">
         <div class="flex justify-between items-start border-b-2 border-slate-100 pb-2 mb-4">
           <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">Ch 1</span>
           <span class="text-lg font-black text-slate-300">03</span>
        </div>

        <h2 class="${COMMON_STYLES.subHeader}">Dogs mark their area</h2>
        
        <div class="float-right w-1/3 ml-4 mb-4 transform rotate-2">
           <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80" class="rounded-2xl shadow-lg border-4 border-white" />
           <p class="text-xs text-center mt-2 font-bold text-slate-400 bg-slate-100 rounded-full py-1">Super Smeller!</p>
        </div>

        <p class="${COMMON_STYLES.paragraph}">
           Have you seen a dog sniffing here and there? What do you think it is trying to smell?
        </p>
        <p class="${COMMON_STYLES.paragraph}">
           Dogs mark out their own area on the road. They can make out if another dog has come into their area by the smell of its urine or potty (latrine).
        </p>
        <div class="clear-both"></div>

        <div class="${COMMON_STYLES.questionBox} bg-pink-50 border-pink-300">
           <h3 class="font-bold text-pink-700 mb-2">Write It Down</h3>
           <p>In what ways do human beings make use of this special sense of smell of dogs?</p>
        </div>

        <h3 class="font-bold text-lg mt-6 mb-2 text-violet-700">When is smell helpful to you?</h3>

        <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="bg-red-50 p-4 rounded-3xl text-center border-2 border-red-100">
                <span class="block text-4xl mb-2">🌹</span>
                <span class="font-black text-red-700 uppercase tracking-wide">Good Smell</span>
            </div>
            <div class="bg-gray-100 p-4 rounded-3xl text-center border-2 border-gray-200">
                <span class="block text-4xl mb-2">🗑️</span>
                <span class="font-black text-gray-700 uppercase tracking-wide">Bad Smell</span>
            </div>
        </div>
       </div>
    `,
    textContent: "Dogs mark out their own area on the road. They can make out if another dog has come into their area by the smell of its urine.",
    resources: [
        {
            id: 'evs-3-1',
            title: "Activity: Smell Test",
            type: ResourceType.AUDIO,
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            duration: "04:10",
            description: "Listen to instructions for the blindfold smell activity."
        },
        {
            id: 'evs-3-2',
            title: "Fact Sheet: Sniffer Dogs",
            type: ResourceType.LINK,
            url: "#",
            description: "Read about how police use dogs."
        }
    ]
  },
  {
    pageNumber: 4,
    title: "Vision: Birds Eyes",
    contentImage: getPageImage(4),
    htmlContent: `
       <div class="${COMMON_STYLES.pageContainer}">
        <div class="flex justify-between items-start border-b-2 border-slate-100 pb-2 mb-4">
           <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">EVS - Class 5</span>
           <span class="text-lg font-black text-slate-300">04</span>
        </div>

        <h2 class="${COMMON_STYLES.subHeader}">Super Sight</h2>
        
        <p class="${COMMON_STYLES.paragraph}">
          Most of the birds have their eyes on either side of the head. Their eyes can focus on two different things at a time.
        </p>

        <div class="flex justify-center my-8 gap-6">
           <div class="text-center group">
              <div class="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-slate-200 mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                 <img src="https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=200&q=80" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-black text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded-full">Eyes on Side</span>
           </div>
           <div class="text-center group">
              <div class="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-slate-200 mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                 <img src="https://images.unsplash.com/photo-1510629532997-7c34b8686d63?auto=format&fit=crop&w=200&q=80" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-black text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded-full">Eyes in Front</span>
           </div>
        </div>

        <div class="${COMMON_STYLES.factBox}">
           <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🦅</span>
              <h4 class="font-black text-blue-900">Eagle Vision</h4>
           </div>
           <p class="text-blue-900"><strong>Kites, Eagles, Vultures</strong> can see four times as far as we can! They can see things from 8 meters away!</p>
        </div>

        <div class="${COMMON_STYLES.questionBox} bg-purple-50 border-purple-300">
          <p class="font-bold text-purple-900">Do animals see colours?</p>
          <p class="text-sm font-medium mt-2 text-purple-800">Animals awake in the daytime can see some colours. Night animals see things only in <strong>black and white</strong>.</p>
        </div>
       </div>
    `,
    textContent: "Most of the birds have their eyes on either side of the head. Their eyes can focus on two different things at a time.",
    resources: [
      {
        id: 'evs-4-1',
        title: "Topic: Binocular Vision",
        type: ResourceType.VIDEO,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "01:50",
        thumbnail: getThumb('evs-4-1')
      }
    ]
  },
  {
    pageNumber: 5,
    title: "Sounds of Nature",
    contentImage: getPageImage(5),
    htmlContent: `
       <div class="${COMMON_STYLES.pageContainer}">
         <div class="flex justify-between items-start border-b-2 border-slate-100 pb-2 mb-4">
           <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">Ch 1</span>
           <span class="text-lg font-black text-slate-300">05</span>
        </div>

        <h2 class="${COMMON_STYLES.subHeader}">Sharp Ear</h2>
        
        <div class="${COMMON_STYLES.activityBox}">
           <h3 class="font-black text-green-700 mb-2 flex items-center gap-2">👂 Activity</h3>
           <p>We cannot easily see birds' ears. Their ears are small holes covered with feathers.</p>
        </div>

        <h2 class="${COMMON_STYLES.subHeader}">Sounds send Messages</h2>
        
        <div class="bg-orange-50 rounded-3xl p-4 flex gap-4 mb-4 items-center shadow-sm">
           <img src="https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=300&q=80" class="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border-4 border-white shadow-md" />
           <p class="text-sm font-medium text-orange-900">
             High up on a tree, a <strong>Langur</strong> warns others of dangers like a tiger. It makes a special warning call!
           </p>
        </div>

        <p class="${COMMON_STYLES.paragraph}">
           Birds also give alarm calls. Some birds have different sounds for different dangers - one for "Enemy from Sky", another for "Enemy on Ground".
        </p>

        <div class="bg-yellow-100 p-5 rounded-2xl border-4 border-yellow-300 mt-4 relative overflow-hidden">
           <div class="absolute -right-4 -top-4 text-9xl text-yellow-200 opacity-50 rotate-12">?</div>
           <h4 class="font-black text-yellow-800 text-xl relative z-10">Did you know?</h4>
           <p class="text-sm text-yellow-900 font-bold mt-2 relative z-10">Fishes give alarm call by electric signals.</p>
        </div>
       </div>
    `,
    textContent: "High up on a tree, a Langur warns others of dangers like a tiger or leopard.",
    resources: [
      {
        id: 'evs-5-1',
        title: "Audio: Langur Warning Call",
        type: ResourceType.AUDIO,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "01:15",
        description: "Hear the alarm call used by Langurs."
      },
      {
        id: 'evs-5-2',
        title: "Audio: Birds Chirping",
        type: ResourceType.AUDIO,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "02:30"
      }
    ]
  },
  {
    pageNumber: 6,
    title: "Sleeping & Waking",
    contentImage: getPageImage(6),
    htmlContent: `
       <div class="${COMMON_STYLES.pageContainer}">
        <div class="flex justify-between items-start border-b-2 border-slate-100 pb-2 mb-4">
           <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">EVS - Class 5</span>
           <span class="text-lg font-black text-slate-300">06</span>
        </div>

        <h2 class="${COMMON_STYLES.subHeader}">Sleeping-waking</h2>
        <p class="${COMMON_STYLES.paragraph}">
          Some animals go into a long, deep sleep in certain seasons. Where do lizards go in winter?
        </p>

        <div class="border-4 border-slate-800 rounded-3xl p-6 relative mt-12 bg-slate-50">
           <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 rounded-full">
              <img src="https://images.unsplash.com/photo-1506519056131-0d2a80695ee9?auto=format&fit=crop&w=150&q=80" class="w-24 h-24 rounded-full border-8 border-white shadow-xl object-cover" />
           </div>
           
           <h3 class="text-center mt-12 font-black text-3xl text-slate-800 uppercase tracking-widest">Sloth</h3>
           <p class="text-center mt-4 text-slate-600 font-medium">
             It looks like a bear but is not. It sleeps <strong>17 hours</strong> a day hanging upside down!
           </p>

           <div class="mt-8 flex justify-center items-center gap-8 bg-white rounded-2xl p-4 shadow-sm">
               <div class="text-center">
                  <div class="w-20 h-20 rounded-full border-4 border-slate-200 relative bg-white mx-auto">
                      <div class="absolute inset-0 bg-slate-800 opacity-80" style="clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 25% 100%); border-radius: 50%"></div>
                  </div>
                  <span class="text-[10px] font-black mt-2 block uppercase text-slate-400">Sleep Time</span>
               </div>
               <div class="text-center">
                   <div class="text-5xl font-black text-slate-300">40</div>
                   <span class="text-[10px] font-black text-slate-400 uppercase">Years Life</span>
               </div>
           </div>
        </div>
       </div>
    `,
    textContent: "Sloths: It looks like a bear but is not. It spends almost 17 hours a day sleeping while hanging upside down on a tree branch.",
    resources: [
        {
            id: 'evs-6-1',
            title: "Topic: The Sloth Life",
            type: ResourceType.VIDEO,
            url: "https://www.w3schools.com/html/movie.mp4",
            duration: "05:00",
            thumbnail: getThumb('evs-6-1')
        },
        {
            id: 'evs-6-2',
            title: "Chart: Animal Sleep Cycles",
            type: ResourceType.LINK,
            url: "#",
            description: "Compare sleep time of cows, pythons, and giraffes."
        }
    ]
  },
  {
    pageNumber: 7,
    title: "The Tiger's Whiskers",
    contentImage: getPageImage(7),
    layout: 'landscape', // Explicitly Landscape
    htmlContent: `
       <div class="${COMMON_STYLES.pageContainer}">
         <div class="flex justify-between items-start border-b-2 border-slate-100 pb-2 mb-4">
           <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">Ch 1</span>
           <span class="text-lg font-black text-slate-300">07</span>
        </div>

        <div class="flex gap-8 h-full">
            <div class="w-1/2 flex flex-col justify-center">
                <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl border-4 border-white transform rotate-1">
                   <img src="https://images.unsplash.com/photo-1503066211593-094d3a18d580?auto=format&fit=crop&w=800&q=80" class="w-full h-64 object-cover" />
                   <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                      <h2 class="text-white font-black text-4xl">The Tiger</h2>
                   </div>
                </div>
            </div>
            
            <div class="w-1/2 flex flex-col justify-center">
                <ul class="space-y-4 text-slate-700 font-medium">
                   <li class="flex gap-4 items-center bg-orange-50 p-4 rounded-xl shadow-sm">
                      <span class="text-3xl bg-white rounded-full p-2 shadow-sm">👁️</span>
                      <p>A tiger can see <strong>six times better</strong> at night than most of us.</p>
                   </li>
                   <li class="flex gap-4 items-center bg-orange-50 p-4 rounded-xl shadow-sm">
                      <span class="text-3xl bg-white rounded-full p-2 shadow-sm">🐱</span>
                      <p>The tiger’s whiskers are very sensitive. They help it move in the dark.</p>
                   </li>
                   <li class="flex gap-4 items-center bg-orange-50 p-4 rounded-xl shadow-sm">
                      <span class="text-3xl bg-white rounded-full p-2 shadow-sm">🔊</span>
                      <p>Its roar can be heard up to <strong>3 km away</strong>!</p>
                   </li>
                </ul>
            </div>
        </div>
       </div>
    `,
    textContent: "A tiger can see six times better at night than most of us. Its whiskers are very sensitive.",
    resources: [
        {
            id: 'evs-7-1',
            title: "Audio: Roar of a Tiger",
            type: ResourceType.AUDIO,
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            duration: "00:45",
            description: "A tiger's roar can be heard up to 3km away."
        },
        {
            id: 'evs-7-2',
            title: "Project: Project Tiger",
            type: ResourceType.VIDEO,
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            duration: "04:20",
            thumbnail: getThumb('evs-7-2'),
            description: "Conservation efforts in India."
        }
    ]
  },
  {
    pageNumber: 8,
    title: "Chapter Exercises",
    contentImage: getPageImage(8),
    htmlContent: `
       <div class="${COMMON_STYLES.pageContainer}">
        <div class="flex justify-between items-start border-b-2 border-slate-100 pb-2 mb-4">
           <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">EVS - Class 5</span>
           <span class="text-lg font-black text-slate-300">08</span>
        </div>

        <h2 class="${COMMON_STYLES.header} !text-center !block w-full">What we have learnt</h2>
        
        <div class="space-y-6 mt-4">
           <div class="bg-slate-50 p-4 rounded-3xl">
              <p class="font-bold mb-2 text-slate-700">1. Why do singers put their hand on their ear?</p>
              <div class="h-20 border-2 border-slate-200 rounded-2xl bg-white p-3 text-slate-300 text-sm font-bold shadow-inner">Write answer here...</div>
           </div>

           <div class="bg-slate-50 p-4 rounded-3xl">
              <p class="font-bold mb-2 text-slate-700">2. Name animals with strong senses.</p>
              <div class="h-20 border-2 border-slate-200 rounded-2xl bg-white p-3 text-slate-300 text-sm font-bold shadow-inner">Write answer here...</div>
           </div>

           <div class="${COMMON_STYLES.activityBox} border-purple-300 bg-purple-100">
              <h3 class="font-black text-purple-900 text-xl mb-2 text-center">✂️ Let's make a Paper Dog</h3>
              <p class="text-sm mb-4 text-center font-bold text-purple-800">You need: thick paper, pencil, scissors.</p>
              <div class="flex gap-2 justify-center">
                 <div class="w-20 h-20 bg-white border-2 border-purple-200 rounded-xl flex flex-col items-center justify-center text-[10px] font-black text-center text-purple-400 shadow-sm">
                    <span class="text-2xl mb-1">1</span>
                    Cut
                 </div>
                 <div class="w-20 h-20 bg-white border-2 border-purple-200 rounded-xl flex flex-col items-center justify-center text-[10px] font-black text-center text-purple-400 shadow-sm">
                    <span class="text-2xl mb-1">2</span>
                    Fold
                 </div>
                 <div class="w-20 h-20 bg-white border-2 border-purple-200 rounded-xl flex flex-col items-center justify-center text-[10px] font-black text-center text-purple-400 shadow-sm">
                    <span class="text-2xl mb-1">3</span>
                    Draw
                 </div>
              </div>
           </div>
        </div>
       </div>
    `,
    textContent: "What we have learnt: Discuss how animals use their senses for survival.",
    resources: [
       {
        id: 'evs-8-1',
        title: "Quiz: Super Senses",
        type: ResourceType.LINK,
        url: "#",
        description: "Test your knowledge on Chapter 1."
       },
       {
        id: 'evs-8-2',
        title: "Activity: Paper Dog Craft",
        type: ResourceType.VIDEO,
        url: "https://www.w3schools.com/html/movie.mp4",
        duration: "10:00",
        thumbnail: getThumb('evs-8-2')
       }
    ]
  }
];
