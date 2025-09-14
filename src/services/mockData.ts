import { Game } from './gameService';

// Mock data to use as fallback when API is unavailable
export const mockGames: Game[] = [
  {
    id: 3498,
    name: "Grand Theft Auto V",
    background_image: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
    rating: 4.47,
    rating_top: 5,
    ratings_count: 6968,
    released: "2013-09-17",
    metacritic: 96,
    description_raw: "Rockstar Games went bigger, since their previous installment of the series...",
    platforms: [
      {
        platform: {
          id: 1,
          name: "PC",
          slug: "pc"
        }
      }
    ],
    genres: [
      {
        id: 4,
        name: "Action",
        slug: "action"
      }
    ],
    developers: [
      {
        id: 3524,
        name: "Rockstar North",
        slug: "rockstar-north"
      }
    ],
    publishers: [
      {
        id: 2155,
        name: "Rockstar Games",
        slug: "rockstar-games"
      }
    ],
    short_screenshots: [
      {
        id: 1,
        image: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg"
      }
    ]
  },
  {
    id: 3328,
    name: "The Witcher 3: Wild Hunt",
    background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    rating: 4.66,
    rating_top: 5,
    ratings_count: 6621,
    released: "2015-05-18",
    metacritic: 93,
    description_raw: "The third game in a series, it holds nothing back from the player...",
    platforms: [
      {
        platform: {
          id: 1,
          name: "PC",
          slug: "pc"
        }
      }
    ],
    genres: [
      {
        id: 5,
        name: "RPG",
        slug: "role-playing-games-rpg"
      }
    ],
    developers: [
      {
        id: 9023,
        name: "CD PROJEKT RED",
        slug: "cd-projekt-red"
      }
    ],
    publishers: [
      {
        id: 9023,
        name: "CD PROJEKT RED",
        slug: "cd-projekt-red"
      }
    ],
    short_screenshots: [
      {
        id: 1,
        image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg"
      }
    ]
  },
  {
    id: 4200,
    name: "Portal 2",
    background_image: "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
    rating: 4.61,
    rating_top: 5,
    ratings_count: 2971,
    released: "2011-04-18",
    metacritic: 95,
    description_raw: "Portal 2 draws from the award-winning formula of innovative gameplay...",
    platforms: [
      {
        platform: {
          id: 1,
          name: "PC",
          slug: "pc"
        }
      }
    ],
    genres: [
      {
        id: 2,
        name: "Shooter",
        slug: "shooter"
      }
    ],
    developers: [
      {
        id: 1,
        name: "Valve Software",
        slug: "valve-software"
      }
    ],
    publishers: [
      {
        id: 1,
        name: "Valve",
        slug: "valve"
      }
    ],
    short_screenshots: [
      {
        id: 1,
        image: "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg"
      }
    ]
  },
  {
    id: 5286,
    name: "Tomb Raider",
    background_image: "https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg",
    rating: 4.05,
    rating_top: 4,
    ratings_count: 8077,
    released: "2013-03-05",
    metacritic: 86,
    description_raw: "Tomb Raider explores the intense and gritty origin story of Lara Croft...",
    platforms: [
      {
        platform: {
          id: 1,
          name: "PC",
          slug: "pc"
        }
      }
    ],
    genres: [
      {
        id: 4,
        name: "Action",
        slug: "action"
      }
    ],
    developers: [
      {
        id: 4,
        name: "Crystal Dynamics",
        slug: "crystal-dynamics"
      }
    ],
    publishers: [
      {
        id: 17,
        name: "Square Enix",
        slug: "square-enix"
      }
    ],
    short_screenshots: [
      {
        id: 1,
        image: "https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg"
      }
    ]
  },
  {
    id: 13536,
    name: "Portal",
    background_image: "https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg",
    rating: 4.51,
    rating_top: 5,
    ratings_count: 1613,
    released: "2007-10-09",
    metacritic: 90,
    description_raw: "Every innovative piece of design, every spoken word, every highly...",
    platforms: [
      {
        platform: {
          id: 1,
          name: "PC",
          slug: "pc"
        }
      }
    ],
    genres: [
      {
        id: 2,
        name: "Shooter",
        slug: "shooter"
      }
    ],
    developers: [
      {
        id: 1,
        name: "Valve Software",
        slug: "valve-software"
      }
    ],
    publishers: [
      {
        id: 1,
        name: "Valve",
        slug: "valve"
      }
    ],
    short_screenshots: [
      {
        id: 1,
        image: "https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg"
      }
    ]
  },
  {
    id: 4291,
    name: "Counter-Strike: Global Offensive",
    background_image: "https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg",
    rating: 3.57,
    rating_top: 4,
    ratings_count: 6908,
    released: "2012-08-21",
    metacritic: 81,
    description_raw: "Counter-Strike: Global Offensive expands upon the team-based action...",
    platforms: [
      {
        platform: {
          id: 1,
          name: "PC",
          slug: "pc"
        }
      }
    ],
    genres: [
      {
        id: 2,
        name: "Shooter",
        slug: "shooter"
      }
    ],
    developers: [
      {
        id: 1,
        name: "Valve Software",
        slug: "valve-software"
      }
    ],
    publishers: [
      {
        id: 1,
        name: "Valve",
        slug: "valve"
      }
    ],
    short_screenshots: [
      {
        id: 1,
        image: "https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg"
      }
    ]
  }
];

export const mockGameResponse = {
  count: 6,
  next: null,
  previous: null,
  results: mockGames
};