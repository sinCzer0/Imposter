document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const setupScreen = document.getElementById('setupScreen');
  const playerScreen = document.getElementById('playerScreen');
  const playerInputs = document.getElementById('playerInputs');
  const revealScreen = document.getElementById('revealScreen');
  const revealText = document.getElementById('revealText');
  const revealProgress = document.getElementById('revealProgress');
  const redoBtn = document.getElementById('redoBtn');
  const nextPlayerBtn = document.getElementById('nextPlayerBtn'); nextPlayerBtn.addEventListener('click', () => {
  console.log('Next Player button clicked');
  revealNextPlayer();
});
  const voteScreen = document.getElementById('voteScreen');
  const voteTitle = document.getElementById('voteTitle');
  const voteOptions = document.getElementById('voteOptions');
  const submitVoteBtn = document.getElementById('submitVoteBtn');
  const voteProgress = document.getElementById('voteProgress');
  const scoreScreen = document.getElementById('scoreScreen');
  const scoreList = document.getElementById('scoreList');
  const nextRoundBtn = document.getElementById('nextRoundBtn');
  const changeTopicBtn = document.getElementById('changeTopicBtn');
  const numPlayersInput = document.getElementById('numPlayers');
  const numImpostersInput = document.getElementById('numImposters');
  const categorySelect = document.getElementById('categorySelect');
  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playerForm = document.getElementById('playerForm');
  const muteBtn = document.getElementById('muteBtn');
  const lofiAudio = document.getElementById('lofi');

  const customCategoryContainer = document.getElementById('customCategoryContainer');
  const customCategoryInput = document.getElementById('customCategoryInput');
  const generateCustomBtn = document.getElementById('generateCustomBtn');
  const customLoading = document.getElementById('customLoading');

  // Game state
  let playerNames = [];
  let currentCategory = '';
  let secretTopic = '';
  let customTopicsList = null;
  let scores = {};
  let revealStep = 0;
  let impostersIndexes = [];
  let votes = [];
  let currentVoterIndex = 0;
  let eliminatedPlayers = new Set();
  let topics = {};

  // Utility sanitize
  function sanitize(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Show only one screen
  function showScreen(screen) {
    [setupScreen, playerScreen, revealScreen, voteScreen, scoreScreen].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
  }

  // Populate categories dropdown
  function populateCategories() {
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

  // Initialize player input fields
  function initPlayerInputs() {
    playerInputs.innerHTML = '';
    const numPlayers = parseInt(numPlayersInput.value);
    for (let i = 0; i < numPlayers; i++) {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = `Player ${i + 1}`;
      inp.autocomplete = 'off';
      inp.required = true;
      playerInputs.appendChild(inp);
    }
  }

  // Assign imposters randomly
  function assignImposters() {
    const numImposters = Math.min(parseInt(numImpostersInput.value), playerNames.length - 1);
    impostersIndexes = [];
    while (impostersIndexes.length < numImposters) {
      const rand = Math.floor(Math.random() * playerNames.length);
      if (!impostersIndexes.includes(rand)) impostersIndexes.push(rand);
    }
  }

  // Pick a random topic
  function pickTopic() {
    if (currentCategory === 'Custom' && customTopicsList && customTopicsList.length > 0) {
      secretTopic = customTopicsList[Math.floor(Math.random() * customTopicsList.length)];
    } else {
      const list = topics[currentCategory];
      secretTopic = list[Math.floor(Math.random() * list.length)];
    }
  }

  // Reveal progress bar update
  function updateRevealProgress() {
    const total = playerNames.length + 1;
    const percent = (revealStep / total) * 100;
    revealProgress.style.width = `${percent}%`;
  }

  // Reveal next player role
  function revealNextPlayer() {
    if (revealStep === 0) {
      assignImposters();
      pickTopic();
      revealText.textContent = 'Get ready to reveal roles!';
      updateRevealProgress();
      revealStep++;
      redoBtn.disabled = true;
      return;
    }
    if (revealStep > playerNames.length) {
      startVoting();
      return;
    }
    const idx = revealStep - 1;
    const player = playerNames[idx];
    if (impostersIndexes.includes(idx)) {
      revealText.textContent = `${sanitize(player)}, you are the IMPOSTER!`;
    } else {
      revealText.textContent = `${sanitize(player)}, your secret topic is: ${sanitize(secretTopic)}`;
    }
    revealStep++;
    updateRevealProgress();
    redoBtn.disabled = false;
  }

  // Redo reveal
  function redoReveal() {
    if (revealStep > 1) {
      revealStep -= 2;
      revealNextPlayer();
    }
  }

  // Start voting phase
  function startVoting() {
    showScreen(voteScreen);
    votes = [];
    currentVoterIndex = 0;
    eliminatedPlayers.clear();
    voteTitle.textContent = `Voting: ${sanitize(playerNames[currentVoterIndex])}, choose who to eliminate`;
    renderVoteOptions();
    submitVoteBtn.disabled = true;
    submitVoteBtn.classList.add('hidden');
    updateVoteProgress();
  }

  // Render vote options
  function renderVoteOptions() {
    voteOptions.innerHTML = '';
    const currentVoter = playerNames[currentVoterIndex];
    playerNames.forEach(player => {
      if (player === currentVoter || eliminatedPlayers.has(player)) return;
      const btn = document.createElement('button');
      btn.className = 'vote-btn';
      btn.textContent = player;
      btn.type = 'button';
      btn.setAttribute('aria-label', `Vote to eliminate ${player}`);
      btn.addEventListener('click', () => {
        [...voteOptions.children].forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        submitVoteBtn.disabled = false;
        submitVoteBtn.classList.remove('hidden');
      });
      voteOptions.appendChild(btn);
    });
  }

  // Submit vote
  function submitVote() {
    const selectedBtn = voteOptions.querySelector('.vote-btn.selected');
    if (!selectedBtn) return;
    const votedPlayer = selectedBtn.textContent;
    votes.push(votedPlayer);
    currentVoterIndex++;
    if (currentVoterIndex >= playerNames.length) {
      tallyVotes();
    } else {
      voteTitle.textContent = `Voting: ${sanitize(playerNames[currentVoterIndex])}, choose who to eliminate`;
      renderVoteOptions();
      submitVoteBtn.disabled = true;
      submitVoteBtn.classList.add('hidden');
      updateVoteProgress();
    }
  }

  // Update vote progress bar
  function updateVoteProgress() {
    const total = playerNames.length;
    const percent = (currentVoterIndex / total) * 100;
    voteProgress.style.width = `${percent}%`;
  }

  // Tally votes and update scores
  function tallyVotes() {
    const voteCount = {};
    votes.forEach(v => {
      voteCount[v] = (voteCount[v] || 0) + 1;
    });
    let maxVotes = 0;
    let eliminated = [];
    for (const player in voteCount) {
      if (voteCount[player] > maxVotes) {
        maxVotes = voteCount[player];
        eliminated = [player];
      } else if (voteCount[player] === maxVotes) {
        eliminated.push(player);
      }
    }
    if (eliminated.length === 1) {
      eliminatedPlayers.add(eliminated[0]);
      revealText.textContent = `${eliminated[0]} was eliminated!`;
      const idx = playerNames.indexOf(eliminated[0]);
      if (impostersIndexes.includes(idx)) {
        playerNames.forEach((p, i) => {
          if (!impostersIndexes.includes(i)) scores[p] += 1;
        });
      } else {
        impostersIndexes.forEach(i => {
          scores[playerNames[i]] += 1;
        });
      }
    } else {
      revealText.textContent = `Tie in votes! No one eliminated this round.`;
    }
    showScoreboard();
  }

  // Show scoreboard
  function showScoreboard() {
    showScreen(scoreScreen);
    scoreList.innerHTML = '';
    playerNames.forEach(player => {
      const li = document.createElement('li');
      const eliminatedMark = eliminatedPlayers.has(player) ? ' (Eliminated)' : '';
      li.textContent = `${sanitize(player)}: ${scores[player]} point${scores[player] !== 1 ? 's' : ''}${eliminatedMark}`;
      scoreList.appendChild(li);
    });
  }

  // Reset game
  function resetGame() {
    playerNames = [];
    scores = {};
    revealStep = 0;
    impostersIndexes = [];
    votes = [];
    currentVoterIndex = 0;
    eliminatedPlayers.clear();
    customTopicsList = null;
    categorySelect.value = '';
    customCategoryInput.value = '';
    customCategoryContainer.classList.add('hidden');
    generateCustomBtn.disabled = true;
    customLoading.classList.add('hidden');
    numPlayersInput.value = 3;
    numImpostersInput.value = 1;
    showScreen(setupScreen);
    nextBtn.disabled = true;
    startBtn.disabled = true;
  }

  // Validate setup inputs
  function validateSetupInputs() {
    const numPlayers = parseInt(numPlayersInput.value);
    const numImposters = parseInt(numImpostersInput.value);
    const categorySelected = categorySelect.value !== '';
    const validPlayers = !isNaN(numPlayers) && numPlayers >= 2 && numPlayers <= 20;
    const validImposters = !isNaN(numImposters) && numImposters >= 1 && numImposters < numPlayers;
    if (categorySelected && validPlayers && validImposters) {
      if (categorySelect.value === 'Custom') {
        nextBtn.disabled = !(customTopicsList && customTopicsList.length === 50);
      } else {
        nextBtn.disabled = false;
      }
    } else {
      nextBtn.disabled = true;
    }
  }

  // Validate player names
  function validatePlayerNames() {
    const inputs = playerInputs.querySelectorAll('input[type="text"]');
    const allFilled = [...inputs].every(input => input.value.trim() !== '');
    startBtn.disabled = !allFilled;
  }

  // Event listeners for setup inputs
  [numPlayersInput, numImpostersInput, categorySelect].forEach(el => {
    el.addEventListener('input', validateSetupInputs);
  });

  // Event listener for player name inputs
  playerInputs.addEventListener('input', validatePlayerNames);

  // Category change handler
  categorySelect.addEventListener('change', () => {
    if (categorySelect.value === 'Custom') {
      customCategoryContainer.classList.remove('hidden');
      nextBtn.disabled = true;
      generateCustomBtn.disabled = true;
    } else {
      customCategoryContainer.classList.add('hidden');
      customCategoryInput.value = '';
      customTopicsList = null;
      validateSetupInputs();
    }
  });

  // Custom category input handler
  customCategoryInput.addEventListener('input', () => {
    generateCustomBtn.disabled = customCategoryInput.value.trim().length < 3;
  });

  // Simulate AI generation for custom topics
  async function generateCustomTopics(category) {
    customLoading.classList.remove('hidden');
    generateCustomBtn.disabled = true;
    nextBtn.disabled = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    const generated = [];
    for (let i = 1; i <= 50; i++) {
      generated.push(`${category} Item ${i}`);
    }
    customLoading.classList.add('hidden');
    customTopicsList = generated;
    validateSetupInputs();
  }

  generateCustomBtn.addEventListener('click', () => {
    const category = customCategoryInput.value.trim();
    if (category.length < 3) {
      alert('Please enter a valid custom category name (at least 3 characters).');
      return;
    }
    generateCustomTopics(category);
  });

  // Next button click: generate player inputs and show player screen
  nextBtn.addEventListener('click', () => {
    initPlayerInputs();
    showScreen(playerScreen);
    startBtn.disabled = true;
  });

  // Player form submit: collect names and start game
  playerForm.addEventListener('submit', e => {
    e.preventDefault();
    playerNames = [];
    scores = {};
    const inputs = playerInputs.querySelectorAll('input[type="text"]');
    for (const input of inputs) {
      const val = input.value.trim();
      if (!val) {
        alert('Please fill all player names.');
        return;
      }
      playerNames.push(val);
      scores[val] = 0;
    }
    revealStep = 0;
    showScreen(revealScreen);
    revealText.textContent = 'Click "Next Player" to reveal roles!';
    updateRevealProgress();
    redoBtn.disabled = true;
  });

  // Reveal next player button
  nextPlayerBtn.addEventListener('click', () => {
    revealNextPlayer();
  });

  // Redo reveal button
  redoBtn.addEventListener('click', () => {
    redoReveal();
  });

  // Submit vote button
  submitVoteBtn.addEventListener('click', () => {
    submitVote();
  });

  // Next round button
  nextRoundBtn.addEventListener('click', () => {
    revealStep = 0;
    votes = [];
    currentVoterIndex = 0;
    eliminatedPlayers.clear();
    showScreen(revealScreen);
    revealText.textContent = 'Click "Next Player" to reveal roles!';
    updateRevealProgress();
    redoBtn.disabled = true;
  });

  // Change topic button
  changeTopicBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the game and change the topic?')) {
      resetGame();
    }
  });

  // Audio autoplay fix
  function startAudioOnInteraction() {
    if (lofiAudio.paused) {
      lofiAudio.play().catch(() => {});
    }
    if (lofiAudio.muted) {
      lofiAudio.muted = false;
      muteBtn.textContent = 'Mute 🔈';
    }
    document.body.removeEventListener('click', startAudioOnInteraction);
    document.body.removeEventListener('touchstart', startAudioOnInteraction);
  }
  document.body.addEventListener('click', startAudioOnInteraction);
  document.body.addEventListener('touchstart', startAudioOnInteraction);

  // Mute/unmute button
  muteBtn.addEventListener('click', () => {
    if (lofiAudio.muted) {
      lofiAudio.muted = false;
      muteBtn.textContent = 'Mute 🔈';
    } else {
      lofiAudio.muted = true;
      muteBtn.textContent = 'Unmute 🔇';
    }
  });

  // Load topics.json and initialize
  // Hardcoded topics with all new categories
topics = {
  "NBA Stars": ["LeBron James", "Stephen Curry", "Kawhi Leonard", "Giannis Antetokounmpo", "Kevin Durant", "James Harden", "Anthony Davis", "Joel Embiid", "Luka Doncic", "Zion Williamson", "Jayson Tatum", "Damian Lillard", "Trae Young", "Karl-Anthony Towns", "Bradley Beal", "Devin Booker", "Jimmy Butler", "Chris Paul", "Russell Westbrook", "Ben Simmons", "Kyrie Irving", "Paul George", "Klay Thompson", "Draymond Green", "Rudy Gobert", "Donovan Mitchell", "Nikola Jokic", "Julius Randle", "Ja Morant", "DeMar DeRozan", "Fred VanVleet", "Bam Adebayo", "Tyler Herro", "Jaren Jackson Jr.", "Jaylen Brown", "Domantas Sabonis", "CJ McCollum", "Pascal Siakam", "Zach LaVine", "Michael Jordan", "Kobe Bryant", "Shaquille O'Neal", "Magic Johnson", "Larry Bird", "Tim Duncan", "Hakeem Olajuwon", "Allen Iverson", "Charles Barkley", "Karl Malone", "John Stockton", "Scottie Pippen", "Patrick Ewing", "Derrick Rose", "Lakers", "Bulls", "Celtics", "Warriors", "Heat", "Spurs", "Nets", "Raptors"],
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

populateCategories();
resetGame();
});
