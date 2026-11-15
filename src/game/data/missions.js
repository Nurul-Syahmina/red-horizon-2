export const INITIAL_RESOURCES = Object.freeze({ power: 100, water: 100, food: 100 });

export const MISSIONS = [
  {
    title: 'Solar Storm Alert', icon: '☀', scene: 'storm', alert: 'SOLAR STORM INBOUND', voiceIntro: 'astro3',
    intro: 'Warning! A powerful solar storm is approaching. The astronauts need protection from harmful radiation!',
    question: 'What will you do?',
    science: 'Solar storms release energetic particles that can be dangerous to astronauts. Space missions need protective shelters and shielding materials to reduce radiation exposure.',
    sources: [{ label: 'NASA CCMC DONKI', url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/' }],
    choices: [
      { label: 'Use stored water to strengthen the radiation shelter.', resource: 'water', outcome: 'Good thinking, Commander! The water containers are helping protect our astronauts from radiation. However, we\'ve used some of our stored water for daily use.', change: 'Water decreased by 15%', detail: 'Radiation protection increases.', voiceKey: 'astro4' },
      { label: 'Move everyone into the existing protected shelter.', resource: 'power', outcome: 'Well done, Commander! Everyone is safely inside the shelter. However, keeping its systems running has used extra electricity.', change: 'Power decreased by 15%', detail: 'Astronauts stay protected.', voiceKey: 'astro5' },
    ],
  },
  {
    title: 'Power Shortage', icon: '⚡', scene: 'power', alert: 'POWER SUPPLY LOW', voiceIntro: 'astro6',
    intro: 'Oh no, Commander! Dust has covered our solar panels. They are producing less electricity, and our power supply is running low!',
    question: 'What will you do?',
    science: 'Martian dust can cover solar panels and reduce the amount of electricity they produce. Missions must carefully manage their energy.',
    sources: [{ label: 'NASA Mars Trek', url: 'https://trek.nasa.gov/mars/' }],
    choices: [
      { label: 'Save electricity by switching off non-essential equipment.', resource: 'food', outcome: 'Smart decision, Commander! We\'ve saved electricity. However, the greenhouse is producing less food because some equipment is switched off.', change: 'Food decreased by 15%', detail: 'Power is conserved.', voiceKey: 'astro7' },
      { label: 'Keep the greenhouse and research equipment running.', resource: 'power', outcome: 'Great choice, Commander! Our greenhouse can continue producing food. But remember, we\'re using more electricity to keep everything running.', change: 'Power decreased by 15%', detail: 'Food production continues.', voiceKey: 'astro8' },
    ],
  },
  {
    title: 'Greenhouse Emergency', icon: '🌱', scene: 'greenhouse', alert: 'GREENHOUSE WATER LEAK', voiceIntro: 'astro9',
    intro: 'Commander! Emergency alert! A water pipe in our greenhouse is leaking. Our plants are not getting enough water. We need to act quickly before the garden is damaged!',
    question: 'What will you do?',
    science: 'Plants need water to grow. Astronauts must carefully manage water because it is a limited resource. Greenhouses also need reliable water systems to support plant growth.',
    sources: [
      { label: 'NASA Open Science Data Repository', url: 'https://osdr.nasa.gov/bio/repo/' },
      { label: 'Canadian Space Agency: Food Production', url: 'https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/' },
    ],
    choices: [
      { label: 'Repair the leaking pipe immediately.', resource: 'power', outcome: 'Excellent work, Commander! The leaking pipe has been repaired, and water is flowing to our plants again. However, the repair used extra electricity.', change: 'Power decreased by 15%', detail: 'Water supply is restored.', voiceKey: 'astro10' },
      { label: 'Stop the leaking system and use stored water.', resource: 'water', outcome: 'Good thinking, Commander! We\'ve stopped the leak and used stored water to keep the plants alive. But our emergency water supply is getting lower.', change: 'Water decreased by 15%', detail: 'The leak is contained.', voiceKey: 'astro11' },
    ],
  },
];

export const RESOURCE_INFO = {
  power: { label: 'POWER', icon: '⚡', color: 0xffc85e },
  water: { label: 'WATER', icon: '💧', color: 0x66d9f0 },
  food: { label: 'FOOD', icon: '🌱', color: 0x88dda1 },
};
