    // Game State
        const gameState = {
            coins: 0,
            totalClicks: 0,
            autoMiners: 0,
            clickPower: 1,
            multiplier: 1,
            totalEarned: 0,
            tasks: {
                click50: { completed: false, progress: 0, reward: 100 },
                earn500: { completed: false, progress: 0, reward: 250 },
                buy3Upgrades: { completed: false, progress: 0, reward: 500, upgradesBought: 0 }
            },
            upgrades: {
                clickPower: { level: 1, cost: 100, costIncrease: 1.5 },
                autoMiner: { cost: 50, costIncrease: 1.3 },
                multiplier: { level: 1, cost: 500, costIncrease: 2 }
            }
        };

        // DOM Elements
        const elements = {
            coinCounter: document.getElementById('coin-counter'),
            cpsCounter: document.getElementById('cps-counter'),
            totalClicks: document.getElementById('total-clicks'),
            autoMiners: document.getElementById('auto-miners'),
            multiplier: document.getElementById('multiplier'),
            totalEarned: document.getElementById('total-earned'),
            clickValue: document.getElementById('click-value'),
            clickArea: document.getElementById('click-area'),
            aiTip: document.getElementById('ai-tip'),
            newTipBtn: document.getElementById('new-tip-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            closeSettings: document.getElementById('close-settings'),
            resetGame: document.getElementById('reset-game'),
            clickEffect: document.getElementById('click-effect')
        };

        // AI Tips
        const tips = [
            "test1",
            "test2",
            "test3",
            "test4",
            "test5",
            "test6",
            "test7",
            "test8",
            "test9",
            "test10"
        ];

        // Initialize game
        function initGame() {
            updateUI();
            startAutoMining();
            loadGame();
        }

        // Update all UI elements
        function updateUI() {
            elements.coinCounter.textContent = formatNumber(gameState.coins);
            elements.cpsCounter.textContent = formatNumber(calculateCPS());
            elements.totalClicks.textContent = gameState.totalClicks;
            elements.autoMiners.textContent = gameState.autoMiners;
            elements.multiplier.textContent = `${gameState.multiplier}x`;
            elements.totalEarned.textContent = formatNumber(gameState.totalEarned);
            elements.clickValue.textContent = `+${formatNumber(gameState.clickPower * gameState.multiplier)} per click`;
            
            // Update upgrade costs
            document.getElementById('click-power-level').textContent = gameState.upgrades.clickPower.level;
            document.getElementById('click-power-cost').textContent = `Cost: ${formatNumber(Math.floor(gameState.upgrades.clickPower.cost))} coins`;
            document.getElementById('auto-miner-count').textContent = gameState.autoMiners;
            document.getElementById('auto-miner-cost').textContent = `Cost: ${formatNumber(Math.floor(gameState.upgrades.autoMiner.cost))} coins`;
            document.getElementById('multiplier-level').textContent = gameState.upgrades.multiplier.level;
            document.getElementById('multiplier-cost').textContent = `Cost: ${formatNumber(Math.floor(gameState.upgrades.multiplier.cost))} coins`;
            
            // Update task progress
            updateTaskProgress();
        }

        // Calculate coins per second
        function calculateCPS() {
            return gameState.autoMiners * 0.5 * gameState.multiplier;
        }

        // Format large numbers
        function formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return Math.floor(num);
        }

        // Handle click event
        function handleClick() {
            // Add click animation
            elements.clickArea.classList.add('click-animation');
            setTimeout(() => {
                elements.clickArea.classList.remove('click-animation');
            }, 200);
            
            // Add floating coin effect if selected
            if (elements.clickEffect.value === 'coins') {
                createFloatingCoin();
            }
            
            // Calculate earnings
            const earnings = gameState.clickPower * gameState.multiplier;
            addCoins(earnings);
            gameState.totalClicks++;
            gameState.totalEarned += earnings;
            
            // Update task progress
            gameState.tasks.click50.progress++;
            if (gameState.tasks.click50.progress >= 50 && !gameState.tasks.click50.completed) {
                gameState.tasks.click50.completed = true;
                document.querySelector('.task-btn[data-task="1"]').disabled = false;
            }
            
            updateUI();
            saveGame();
        }

        // Create floating coin animation
        function createFloatingCoin() {
            const coin = document.createElement('div');
            coin.className = 'coin-float text-yellow-400';
            coin.innerHTML = '<i class="fas fa-coins"></i>';
            
            // Random position within click area
            const clickAreaRect = elements.clickArea.getBoundingClientRect();
            const x = Math.random() * (clickAreaRect.width - 20);
            const y = Math.random() * (clickAreaRect.height - 20);
            
            coin.style.left = `${x}px`;
            coin.style.top = `${y}px`;
            
            elements.clickArea.appendChild(coin);
            
            // Remove after animation
            setTimeout(() => {
                coin.remove();
            }, 1000);
        }

        // Add coins with optional multiplier
        function addCoins(amount) {
            gameState.coins += amount;
            updateUI();
        }

        // Start auto mining loop
        function startAutoMining() {
            setInterval(() => {
                if (gameState.autoMiners > 0) {
                    const earnings = calculateCPS() / 10; // Update 10 times per second for smoother progress
                    addCoins(earnings);
                    gameState.totalEarned += earnings;
                    
                    // Update earn500 task progress
                    gameState.tasks.earn500.progress = Math.min(gameState.totalEarned, 500);
                    if (gameState.totalEarned >= 500 && !gameState.tasks.earn500.completed) {
                        gameState.tasks.earn500.completed = true;
                        document.querySelector('.task-btn[data-task="2"]').disabled = false;
                    }
                    
                    updateUI();
                    saveGame();
                }
            }, 100);
        }

        // Update task progress bars
        function updateTaskProgress() {
            document.getElementById('task1-progress').style.width = `${(gameState.tasks.click50.progress / 50) * 100}%`;
                                
          document.getElementById('task2-progress').style.width = `${(gameState.tasks.earn500.progress / 500) * 100}%`;
            document.getElementById('task3-progress').style.width = `${(gameState.tasks.buy3Upgrades.upgradesBought / 3) * 100}%`;
        }

        // Claim task reward
        function claimTask(taskId) {
            let reward = 0;
            
            switch(taskId) {
                case '1':
                    if (gameState.tasks.click50.completed) {
                        reward = gameState.tasks.click50.reward;
                        gameState.tasks.click50.completed = false;
                        gameState.tasks.click50.progress = 0;
                        document.querySelector('.task-btn[data-task="1"]').disabled = true;
                                              }              
                break;
                case '2':
                    if (gameState.tasks.earn500.completed) {
                        reward = gameState.tasks.earn500.reward;
                        gameState.tasks.earn500.completed = false;
                        gameState.tasks.earn500.progress = 0;
                        document.querySelector('.task-btn[data-task="2"]').disabled = true;
                    }
                    break;
                case '3':
                    if (gameState.tasks.buy3Upgrades.completed) {
                        reward = gameState.tasks.buy3Upgrades.reward;
                        gameState.tasks.buy3Upgrades.completed = false;
                        gameState.tasks.buy3Upgrades.upgradesBought = 0;
                        document.querySelector('.task-btn[data-task="3"]').disabled = true;
                    }
                    break;
            }
            
            if (reward > 0) {
                addCoins(reward * gameState.multiplier);
                gameState.totalEarned += reward * gameState.multiplier;
                saveGame();
            }
        }

        // Buy upgrade
        function buyUpgrade(upgradeType) {
            let cost = 0;
            let success = false;
            
            switch(upgradeType) {
                case 'click-power':
                    cost = Math.floor(gameState.upgrades.clickPower.cost);
                    if (gameState.coins >= cost) {
                        gameState.coins -= cost;
                        gameState.clickPower += 1;
                        gameState.upgrades.clickPower.level++;
                        gameState.upgrades.clickPower.cost *= gameState.upgrades.clickPower.costIncrease;
                        success = true;
                    }
                    break;
                case 'auto-miner':
                    cost = Math.floor(gameState.upgrades.autoMiner.cost);
                    if (gameState.coins >= cost) {
                        gameState.coins -= cost;
                        gameState.autoMiners++;
                        gameState.upgrades.autoMiner.cost *= gameState.upgrades.autoMiner.costIncrease;
                        success = true;
                    }
                    break;
                case 'multiplier':
                    cost = Math.floor(gameState.upgrades.multiplier.cost);
                    if (gameState.coins >= cost) {
                        gameState.coins -= cost;
                        gameState.multiplier += 0.5;
                        gameState.upgrades.multiplier.level++;
                        gameState.upgrades.multiplier.cost *= gameState.upgrades.multiplier.costIncrease;
                        success = true;
                    }
                    break;
            }
            
            if (success) {
                // Update buy3Upgrades task progress
                gameState.tasks.buy3Upgrades.upgradesBought++;
                if (gameState.tasks.buy3Upgrades.upgradesBought >= 3 && !gameState.tasks.buy3Upgrades.completed) {
                    gameState.tasks.buy3Upgrades.completed = true;
                    document.querySelector('.task-btn[data-task="3"]').disabled = false;
                }
                
                updateUI();
                saveGame();
                return true;
            }
            return false;
        }

        // Generate new AI tip
        function generateNewTip() {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            elements.aiTip.textContent = `"${randomTip}"`;
        }

        // Save game to localStorage
        function saveGame() {
            localStorage.setItem('coinMinerProSave', JSON.stringify(gameState));
        }

        // Load game from localStorage
        function loadGame() {
            const savedGame = localStorage.getItem('coinMinerProSave');
            if (savedGame) {
                const parsed = JSON.parse(savedGame);
                Object.assign(gameState, parsed);
                updateUI();
            }
        }

        // Reset game
        function resetGame() {
            if (confirm('سيتم مسح بيانات اللعبة بالكامل.هل أنت متأكد؟')) {
                localStorage.removeItem('coinMinerProSave');
                Object.assign(gameState, {
                    coins: 0,
                    totalClicks: 0,
                    autoMiners: 0,
                    clickPower: 1,
                    multiplier: 1,
                    totalEarned: 0,
                    tasks: {
                        click50: { completed: false, progress: 0, reward: 100 },
                        earn500: { completed: false, progress: 0, reward: 250 },
                        buy3Upgrades: { completed: false, progress: 0, reward: 500, upgradesBought: 0 }
                    },
                    upgrades: {
                        clickPower: { level: 1, cost: 100, costIncrease: 1.5 },
                        autoMiner: { cost: 50, costIncrease: 1.3 },
                        multiplier: { level: 1, cost: 500, costIncrease: 2 }
                    }
                });
                updateUI();
                elements.settingsModal.classList.add('hidden');
            }
        }

        // Event Listeners
        elements.clickArea.addEventListener('click', handleClick);
        elements.newTipBtn.addEventListener('click', generateNewTip);
        
        elements.settingsBtn.addEventListener('click', () => {
            elements.settingsModal.classList.remove('hidden');
        });
        
        elements.closeSettings.addEventListener('click', () => {
            elements.settingsModal.classList.add('hidden');
        });
        
        elements.resetGame.addEventListener('click', resetGame);
        
        document.querySelectorAll('.task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                claimTask(e.target.dataset.task);
            });
        });
        
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                buyUpgrade(e.target.dataset.upgrade);
            });
        });

        // Initialize the game
        initGame();
    
