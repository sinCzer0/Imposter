// =======================
// All Topics (Expanded)
// =======================
const topics = {
  "NBA Stars": ["LeBron James","Stephen Curry","Kawhi Leonard","Giannis Antetokounmpo","Kevin Durant","James Harden","Anthony Davis","Joel Embiid","Luka Doncic","Zion Williamson","Jayson Tatum","Damian Lillard","Trae Young","Karl-Anthony Towns","Bradley Beal","Devin Booker","Jimmy Butler","Chris Paul","Russell Westbrook","Ben Simmons","Kyrie Irving","Paul George","Klay Thompson","Draymond Green","Rudy Gobert","Donovan Mitchell","Nikola Jokic","Julius Randle","Ja Morant","DeMar DeRozan","Fred VanVleet","Bam Adebayo","Tyler Herro","Jaren Jackson Jr.","Jaylen Brown","Domantas Sabonis","CJ McCollum","Pascal Siakam","Zach LaVine","Michael Jordan","Kobe Bryant","Shaquille O'Neal","Magic Johnson","Larry Bird","Tim Duncan","Hakeem Olajuwon","Allen Iverson","Charles Barkley","Karl Malone","John Stockton","Scottie Pippen","Patrick Ewing","Derrick Rose","Lakers","Bulls","Celtics","Warriors","Heat","Spurs","Nets","Raptors"],
  "Movies": ["The Godfather","Inception","Titanic","The Matrix","Avengers","Pulp Fiction","Forrest Gump","Gladiator","Interstellar","Parasite","Joker","The Dark Knight","Schindler's List","Fight Club","The Lord of the Rings","Harry Potter","The Lion King","Frozen","Toy Story","The Social Network","Inglourious Basterds","Whiplash","La La Land","Coco","The Shining","A Clockwork Orange","Jurassic Park","Star Wars","Guardians of the Galaxy","Black Panther","Avengers: Endgame","Mad Max: Fury Road","The Departed","The Prestige","Django Unchained","The Silence of the Lambs","Braveheart","Goodfellas","The Revenant","Once Upon a Time in Hollywood","Catch Me If You Can","No Country for Old Men","The Sixth Sense","Up","Inside Out","WALL-E","Shutter Island","12 Years a Slave"],
  "Anime": ["Naruto","Goku","Luffy","Ichigo","One Punch Man","Sailor Moon","Edward Elric","Levi Ackerman","Light Yagami","Gon Freecss","Eren Yeager","Mikasa Ackerman","Tanjiro Kamado","Nezuko Kamado","Saitama","Koro-sensei","Gintoki Sakata","Spike Spiegel","Vash the Stampede","Yusuke Urameshi","Inuyasha","Kenshin Himura","Totoro","Natsu Dragneel","Lucy Heartfilia","Gray Fullbuster","Erza Scarlet","Shoyo Hinata","Kageyama Tobio","Shikamaru Nara","Kakashi Hatake","Madara Uchiha","Itachi Uchiha","Roronoa Zoro","Sanji","Monkey D. Garp","Kenshiro","Alphonse Elric","Roy Mustang","Sailor Venus","Sailor Jupiter","Bulma","Vegeta","Kurapika","Killua Zoldyck","Yugi Muto","JoJo Series","Naruto Series","Dragon Ball Series","One Piece Series","Bleach Series","Attack on Titan Series"],
  "Rappers": ["Kendrick Lamar","Drake","J. Cole","Kanye West","Nicki Minaj","Eminem","Tupac","Biggie","Jay-Z","Snoop Dogg","Nas","Ice Cube","Travis Scott","Megan Thee Stallion","Lil Wayne","Cardi B","Future","Doja Cat","Lil Baby","Dr. Dre","2 Chainz","Rakim","Big Pun","LL Cool J","Q-Tip","Busta Rhymes","Missy Elliott","Method Man","Redman","Killer Mike","Juice WRLD","21 Savage","Lil Uzi Vert","Pop Smoke","Tyler, The Creator","A$AP Rocky","Jadakiss","DMX","Common","The Notorious B.I.G.","T.I.","Young Thug","Mac Miller","Wale","Logic","Chance the Rapper","Andre 3000","E-40","Schoolboy Q","Too $hort"],
  "Elden Ring – Bosses": ["Margit","Godrick","Rennala","Rykard","Starscourge Radahn","Morgott","Malenia","Mohg","Astel","Fire Giant","Dragonlord Placidusax","Leonine Misbegotten","Commander Niall","Blaidd","Fingerslayer","Regal Ancestor Spirit"],
  "Elden Ring – Weapons": ["Moonveil","Rivers of Blood","Blasphemous Blade","Dragon Slayer","Great Club","Grafted Blade Greatsword","Hand of Malenia","Sacred Relic Sword","Eclipse Shotel","Reduvia","Nagakiba","Knight's Halberd","Uchigatana","Godslayer's Greatsword","Sword of Night and Flame"],
  "Apex Legends – Legends": ["Wraith","Pathfinder","Bloodhound","Gibraltar","Lifeline","Bangalore","Caustic","Mirage","Octane","Crypto","Horizon","Fuse","Valkyrie","Seer","Ash","Mad Maggie","Newcastle","Vantage","Catalyst"],
  "Apex Legends – Weapons": ["R-301","R-99","Flatline","VK-47","Sentinel","Kraber","Peacekeeper","Mastiff","Wingman","Hemlok","Prowler","Longbow","30-30 Repeater","Havoc","Volt"],
  "Naruto – Characters": ["Naruto","Sasuke","Sakura","Kakashi","Itachi","Shikamaru","Hinata","Gaara","Rock Lee","Neji","Jiraiya","Orochimaru","Tsunade","Madara","Obito","Minato","Kushina","Sarada","Boruto"],
  "Naruto – Jutsu": ["Rasengan","Chidori","Shadow Clone","Amaterasu","Susanoo","Eight Gates","Flying Thunder God","Summoning Jutsu","Byakugan","Sharingan","Mangekyo Sharingan","Sage Mode","Tailed Beast Bomb","Wood Release","Ice Release","Fire Style: Fireball Jutsu"]
};

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------
  // DOM Elements
  // -------------------------
  const categorySelect = document.getElementById('categorySelect');
  const playerInputs = document.getElementById('playerInputs');
  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playerForm = document.getElementById('playerForm');
  const revealText = document.getElementById('revealText');
  const nextPlayerBtn = document.getElementById('nextPlayerBtn');
  const redoBtn = document.getElementById('redoBtn');
  const voteOptions = document.getElementById('voteOptions');
  const submitVoteBtn = document.getElementById('submitVoteBtn');
  const scoreList = document.getElementById('scoreList');
  const revealProgress = document.getElementById('revealProgress');
  const voteProgress = document.getElementById('voteProgress');
  const lofiAudio = document.getElementById('lofi');
  const muteBtn = document.getElementById('muteBtn');
  const changeTopicBtn = document.getElementById('changeTopicBtn');

  // -------------------------
  // Game State
  // -------------------------
  let playerNames = [];
  let secretTopic = '';
  let currentCategory = '';
  let scores = {};
  let revealStep = 0;
  let impostersIndexes = [];
  let votes = [];
  let currentVoterIndex = 0;
  let eliminatedPlayers = new Set();

  // -------------------------
  // Populate Categories
  // -------------------------
  function populateCategories() {
    categorySelect.innerHTML = '';
    Object.keys(topics).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
    const customOpt = document.createElement('option');
    customOpt.value = 'Custom';
    customOpt.textContent = 'Custom Category...';
    categorySelect.appendChild(customOpt);
  }

  // -------------------------
  // Helper Functions
  // -------------------------
  function sanitize(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showScreen(screen) {
    // Your existing screen logic here...
  }

  function assignImposters() {
    const numImposters = 1; // or get from input
    impostersIndexes = [];
    while (impostersIndexes.length < numImposters) {
      const rand = Math.floor(Math.random() * playerNames.length);
      if (!impostersIndexes.includes(rand)) impostersIndexes.push(rand);
    }
  }

  function pickTopic() {
    const list = topics[currentCategory];
    secretTopic = list[Math.floor(Math.random() * list.length)];
    createFloatingEmojis();
  }

  // -------------------------
  // Floating Emoji Background
  // -------------------------
  function createFloatingEmojis() {
    const emojis = {
      "NBA Stars": "🏀",
      "Movies": "🎬",
      "Anime": "🌀",
      "Rappers": "🎤",
      "Elden Ring – Bosses": "👹",
      "Elden Ring – Weapons": "⚔️",
      "Apex Legends – Legends": "🛡️",
      "Apex Legends – Weapons": "🔫",
      "Naruto – Characters": "🥷",
      "Naruto – Jutsu": "💨"
    };
    const body = document.body;
    // remove previous
    document.querySelectorAll('.floating-emoji').forEach(e => e.remove());
    for (let i = 0; i < 20; i++) {
      const span = document.createElement('span');
      span.textContent = emojis[currentCategory] || "⭐";
      span.className = 'floating-emoji';
      span.style.position = 'fixed';
      span.style.left = Math.random()*100 + 'vw';
      span.style.top = Math.random()*100 + 'vh';
      span.style.fontSize = (10 + Math.random()*30) + 'px';
      span.style.opacity = Math.random();
      span.style.transition = 'transform 10s linear';
      body.appendChild(span);
      setTimeout(() => {
        span.style.transform = `translateY(-150vh)`;
        setTimeout(() => span.remove(), 10000);
      }, Math.random()*5000);
    }
  }

  // -------------------------
  // Audio Controls
  // -------------------------
  muteBtn.addEventListener('click', () => {
    lofiAudio.muted = !lofiAudio.muted;
    muteBtn.textContent = lofiAudio.muted ? "Unmute 🔇" : "Mute 🔈";
  });

  // -------------------------
  // Initialize
  // -------------------------
  populateCategories();
  // resetGame() here if you have one
});
