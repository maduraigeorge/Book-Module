import { PageData, Resource, ResourceType } from './types';

// Helper to generate consistent placeholder images
// Using 'school', 'nature', 'animals' seeds for relevant imagery
const getPageImage = (page: number) => `https://picsum.photos/seed/cbse_evs_${page}/800/1131`; 
const getThumb = (id: string) => `https://picsum.photos/seed/thumb_${id}/200/200`;

export const TOTAL_PAGES = 8;

export const MOCK_PAGES: PageData[] = [
  {
    pageNumber: 1,
    title: "Ch 1: Super Senses",
    contentImage: getPageImage(1),
    textContent: "Has this ever happened to you? You were eating in the playground, an eagle flew down and took away your roti?",
    resources: [
      {
        id: 'evs-1-1',
        title: "Introduction: Animal Senses",
        type: ResourceType.VIDEO,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "03:15",
        thumbnail: getThumb('evs-1-1'),
        description: "How animals perceive the world differently from humans."
      },
      {
        id: 'evs-1-2',
        title: "Activity: Drop some Sugar",
        type: ResourceType.DOCUMENT, // Using DOCUMENT type (rendered as generic/link icon usually) or VIDEO if we want visual
        url: "#",
        description: "Observe how long it takes for ants to come."
      }
    ]
  },
  {
    pageNumber: 2,
    title: "The Ant World",
    contentImage: getPageImage(2),
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
    textContent: "What we have learnt: Discuss how animals use their senses for survival.",
    resources: [
       {
        id: 'evs-8-1',
        title: "Interactive Quiz: Senses",
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