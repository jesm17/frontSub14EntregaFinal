export function randomPrice() {
  return Math.floor(Math.random() * 100000) + 1;
}
export const seedGames = [
  {
    slug: 'gta-v',
    name: 'GTA V',
    price: randomPrice(),
    image:
      'https://media-rockstargames-com.akamaized.net/tina-uploads/tina-modules/6a84/c670974867f83cb814c6b46b6fbc6c3d9caa23bf.jpg',
    isOffer: true,
    isOutstanding: true,
    isFavorite: false,
    platforms: ['PC', 'PS4', 'PS5'],
    description:
      'Los Santos y el condado de Blaine: un mundo abierto enorme con campaña cooperativa y GTA Online. Robos, carreras y caos en una de las sagas más icónicas del videojuego.',
  },
  {
    slug: 'overwatch-2',
    name: 'Overwatch 2',
    price: randomPrice(),
    image:
      'https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/bltf3ea26b29120218e/5cef2264a812cef4091495d4/baptiste-screenshot-001.jpg',
    isOffer: true,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    description:
      'Shooter por equipos en 5v5 con héroes únicos, mapas nuevos y modos competitivos. Gratis para jugar con temporadas de contenido y eventos.',
  },
  {
    slug: 'fc-26',
    name: 'FC 26',
    price: randomPrice(),
    image:
      'https://drop-assets.ea.com/images/7BOHNqUN8qvXKBM8iBxBZ6/09f9db41c7de11b2b1bcfefa53dac1a5/FC26-ICONS_5760x4320.jpg?im=AspectCrop=(4,3),xPosition=0.5,yPosition=0.5;Resize=(2382)&q=80',
    isOffer: false,
    isOutstanding: true,
    isFavorite: false,
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    description:
      'Fútbol de nueva generación con HyperMotion y modos carrera y Ultimate Team. Compite online o en local con licencias oficiales.',
  },
  {
    slug: 'cod-mw2',
    name: 'Call of Duty: Modern Warfare II',
    price: randomPrice(),
    image:
      'https://image.api.playstation.com/vulcan/ap/rnd/202205/2800/iQGgKYUg9YwjPVNM0kE8jeRN.jpg?w=780',
    isOffer: true,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC', 'PS4', 'PS5', 'Xbox One'],
    description:
      'Campaña cinematográfica y multijugador con mapas clásicos y nuevos. Incluye Warzone y progresión unificada entre modos.',
  },
  {
    slug: 'fortnite',
    name: 'Fortnite',
    price: randomPrice(),
    image:
      'https://cdn2.unrealengine.com/cdn-uploader-ES-ES_FNBR_40-00_C7S2_8upPowerHour_DiscoverTile_-1920x1080-83d50a37.jpg',
    isOffer: false,
    isOutstanding: true,
    isFavorite: false,
    platforms: ['PC', 'PS5', 'Xbox Series X/S', 'Switch'],
    description:
      'Battle royale, LEGO, carreras y conciertos en vivo. Construcción opcional y temporadas temáticas con pase de batalla.',
  },
  {
    slug: 'apex-legends',
    name: 'Apex Legends',
    price: randomPrice(),
    image:
      'https://drop-assets.ea.com/images/45Ki72axKTQlA0AqQtS1Dj/be26f2d75d6d97764725a0e89e614410/Apex_S28_Feature-Image-4x3.jpg?im=Resize=(2382)&q=80',
    isOffer: true,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC', 'PS4', 'Xbox One'],
    description:
      'Arena hero shooter en escuadras de tres leyendas con habilidades únicas. Mapas rotativos y ranked por temporadas.',
  },
  {
    slug: 'csgo',
    name: 'CS:GO',
    price: randomPrice(),
    image:
      'https://steamcdn-a.akamaihd.net/apps/csgo/blog/images/wallpaper_nologo.jpg',
    isOffer: false,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC'],
    description:
      'Táctica 5v5 clásica: plantar/desactivar la bomba en mapas competitivos oficiales y comunidad. Esports y matchmaking global.',
  },
  {
    slug: 'lol',
    name: 'League of Legends',
    price: randomPrice(),
    image:
      'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/15e9a2ef0e0759020ec01ae0b59c16e875286226-1280x720.jpg?accountingTag=LoL&auto=format&fit=crop&q=80&h=317&w=564&crop=center',
    isOffer: false,
    isOutstanding: true,
    isFavorite: false,
    platforms: ['PC'],
    description:
      'MOBA por equipos en la Grieta del Invocador. Más de 160 campeones, ranked y eventos narrativos de Runaterra.',
  },
  {
    slug: 'dota-2',
    name: 'Dota 2',
    price: randomPrice(),
    image:
      'https://clan.fastly.steamstatic.com/images//3703047/98be0d0a60eca8edbad91ec0050918f83ea462e2.png',
    isOffer: true,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC'],
    description:
      'Arena de estrategia en tiempo real profunda: últimos golpes, visión y objetivos. The International y workshop de la comunidad.',
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    price: randomPrice(),
    image:
      'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/5b1c39c5397cfc61dfe67e0c55b45ca31b1f5a9d-854x484.png?accountingTag=VAL&auto=format&fit=crop&q=80&h=317&w=564&crop=center',
    isOffer: false,
    isOutstanding: true,
    isFavorite: false,
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    description:
      'Tactical FPS 5v5 con agentes y habilidades únicas. Spike rush, ranked y mapas diseñados para duelos de puntería y utilidad.',
  },
  {
    slug: 'diablo-iv',
    name: 'Diablo IV',
    price: randomPrice(),
    image:
      'https://bnetcmsus-a.akamaihd.net/cms/blog_header/00/00LGKINJC4UD1772733022787.png?imwidth=1920',
    isOffer: true,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    description:
      'Hack and slash oscuro en mundo compartido: temporadas, mazmorras de pesadilla y PvP zonas marcadas. Historia de Lilith y Santuario.',
  },
  {
    slug: 'wow',
    name: 'World of Warcraft',
    price: randomPrice(),
    image:
      'https://blz-contentstack-images.akamaized.net/v3/assets/blt3452e3b114fab0cd/bltc204f2b89b02a47e/69a9c207a28b3f0008c23750/WoW-_Midnight_Launch_PatchNotes_-_1280_x_380.jpg?imwidth=1920',
    isOffer: false,
    isOutstanding: true,
    isFavorite: false,
    platforms: ['PC'],
    description:
      'MMORPG épico con expediciones, bandas y PvP. Expansión Midnight y contenido seasonal para héroes de Azeroth.',
  },
  {
    slug: 'witcher-3',
    name: 'The Witcher 3: Wild Hunt',
    price: randomPrice(),
    image:
      'https://gmedia.playstation.com/is/image/SIEPDC/the-witcher-3-hero-banner-desktop-01-en-12dec22?$2400px$',
    isOffer: true,
    isOutstanding: true,
    isFavorite: false,
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    description:
      'Rol de mundo abierto: Geralt, Ciri y una historia ganadora. DLC Hearts of Stone y Blood and Wine incluidos en la edición completa.',
  },
  {
    slug: 'skyrim',
    name: 'The Elder Scrolls V: Skyrim',
    price: randomPrice(),
    image:
      'https://image.api.playstation.com/vulcan/ap/rnd/202110/2614/vDPZYIUtziAkRcSoA4o3So5r.jpg?w=5000',
    isOffer: false,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC', 'PS4', 'Switch'],
    description:
      'Explora Skyrim como Dovahkiin: gremios, dragones y cientos de mods en PC. Edición Anniversary con contenido Creation Club.',
  },
  {
    slug: 're-requiem',
    name: 'Resident Evil Requiem',
    price: randomPrice(),
    image:
      'https://image.api.playstation.com/vulcan/ap/rnd/202512/1506/3878ff92261c1fda7ce03772ac149514ce6f6bf5c715e64b.png?w=5000',
    isOffer: true,
    isOutstanding: false,
    isFavorite: false,
    platforms: ['PC', 'PS5'],
    description:
      'Survival horror de nueva generación con inventario tenso y exploración. Optimizado para consolas actuales y trazado de rayos.',
  },
];
