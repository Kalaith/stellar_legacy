// Stellar Legacy Game Engine
class StellarLegacy {
    constructor() {
        this.gameData = {
            resources: {
                credits: 1000,
                energy: 100,
                minerals: 50,
                food: 80,
                influence: 25
            },
            ship: {
                name: "Pioneer's Dream",
                hull: "Light Corvette",
                components: {
                    engine: "Basic Thruster",
                    cargo: "Standard Bay",
                    weapons: "Light Laser",
                    research: "Basic Scanner",
                    quarters: "Crew Quarters"
                },
                stats: {
                    speed: 3,
                    cargo: 100,
                    combat: 2,
                    research: 1,
                    crewCapacity: 6
                }
            },
            crew: [
                {
                    id: 1,
                    name: "Captain Elena Voss",
                    role: "Captain",
                    skills: {engineering: 6, navigation: 8, combat: 7, diplomacy: 9, trade: 5},
                    morale: 85,
                    background: "Former military officer turned explorer",
                    age: 35,
                    isHeir: false
                },
                {
                    id: 2,
                    name: "Chief Engineer Marcus Cole",
                    role: "Engineer",
                    skills: {engineering: 9, navigation: 4, combat: 5, diplomacy: 3, trade: 2},
                    morale: 90,
                    background: "Shipyard veteran with decades of experience",
                    age: 28,
                    isHeir: false
                },
                {
                    id: 3,
                    name: "Navigator Zara Chen",
                    role: "Pilot",
                    skills: {engineering: 3, navigation: 9, combat: 6, diplomacy: 5, trade: 4},
                    morale: 80,
                    background: "Ace pilot from the outer colonies",
                    age: 26,
                    isHeir: false
                },
                {
                    id: 4,
                    name: "Trader Kex Thorne",
                    role: "Diplomat",
                    skills: {engineering: 2, navigation: 3, combat: 4, diplomacy: 8, trade: 9},
                    morale: 75,
                    background: "Smooth-talking merchant with connections",
                    age: 32,
                    isHeir: false
                }
            ],
            starSystems: [
                {
                    name: "Sol Alpha",
                    status: "explored",
                    planets: [
                        {name: "Terra Prime", type: "Rocky", resources: ["minerals", "energy"], developed: true},
                        {name: "Gas Giant Beta", type: "Gas Giant", resources: ["energy", "food"], developed: false}
                    ],
                    tradeRoutes: [],
                    coordinates: {x: 100, y: 100}
                },
                {
                    name: "Kepler Station",
                    status: "unexplored",
                    planets: [{name: "Unknown", type: "Unknown", resources: ["unknown"], developed: false}],
                    coordinates: {x: 200, y: 150}
                },
                {
                    name: "Vega Outpost",
                    status: "unexplored",
                    planets: [{name: "Unknown", type: "Unknown", resources: ["unknown"], developed: false}],
                    coordinates: {x: 150, y: 250}
                }
            ],
            market: {
                prices: {
                    minerals: 15,
                    energy: 12,
                    food: 8,
                    influence: 25
                },
                trends: {
                    minerals: "rising",
                    energy: "stable",
                    food: "falling",
                    influence: "rising"
                }
            },
            legacy: {
                generation: 1,
                familyName: "Voss",
                achievements: ["First Command", "System Explorer"],
                traits: ["Natural Leader", "Tech Savvy"],
                reputation: {
                    military: 20,
                    traders: 15,
                    scientists: 10
                }
            },
            shipComponents: {
                hulls: [
                    {name: "Light Corvette", cost: {credits: 500}, stats: {speed: 3, cargo: 100, combat: 2}},
                    {name: "Heavy Frigate", cost: {credits: 1500, minerals: 200}, stats: {speed: 2, cargo: 200, combat: 5}},
                    {name: "Exploration Vessel", cost: {credits: 1200, energy: 150}, stats: {speed: 4, cargo: 150, research: 3}}
                ],
                engines: [
                    {name: "Basic Thruster", cost: {credits: 200}, stats: {speed: 1}},
                    {name: "Ion Drive", cost: {credits: 800, energy: 100}, stats: {speed: 3}},
                    {name: "Warp Core", cost: {credits: 2000, energy: 300, minerals: 100}, stats: {speed: 5}}
                ],
                weapons: [
                    {name: "Light Laser", cost: {credits: 300}, stats: {combat: 2}},
                    {name: "Pulse Cannon", cost: {credits: 800, minerals: 50}, stats: {combat: 4}},
                    {name: "Plasma Artillery", cost: {credits: 1500, minerals: 150, energy: 100}, stats: {combat: 7}}
                ]
            }
        };

        this.selectedSystem = null;
        this.currentComponentCategory = 'hulls';
        this.resourceGenerationRate = {
            credits: 2,
            energy: 1,
            minerals: 1,
            food: 1,
            influence: 0.2
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.startResourceGeneration();
        this.renderGalaxyMap();
        this.renderCrewQuarters();
        this.renderShipBuilder();
        this.renderLegacySystem();
        
        // Initial crew summary update
        this.updateCrewSummary();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });

        // Crew actions
        document.getElementById('train-crew').addEventListener('click', () => this.trainCrew());
        document.getElementById('boost-morale').addEventListener('click', () => this.boostMorale());
        document.getElementById('recruit-crew').addEventListener('click', () => this.recruitCrew());

        // Galaxy actions
        document.getElementById('explore-system').addEventListener('click', () => this.exploreSystem());
        document.getElementById('establish-colony').addEventListener('click', () => this.establishColony());

        // Ship builder categories
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchComponentCategory(category);
            });
        });
    }

    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update panels
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        // Refresh crew summary when switching to dashboard
        if (tabName === 'dashboard') {
            this.updateCrewSummary();
        }
    }

    updateDisplay() {
        // Update resources
        Object.keys(this.gameData.resources).forEach(resource => {
            const element = document.getElementById(resource);
            if (element) {
                element.textContent = Math.floor(this.gameData.resources[resource]);
            }
        });

        // Update ship info
        document.getElementById('ship-name').textContent = this.gameData.ship.name;
        document.getElementById('ship-speed').textContent = this.gameData.ship.stats.speed;
        document.getElementById('ship-cargo').textContent = this.gameData.ship.stats.cargo;
        document.getElementById('ship-combat').textContent = this.gameData.ship.stats.combat;
        document.getElementById('ship-research').textContent = this.gameData.ship.stats.research;

        // Update captain info
        const captain = this.gameData.crew.find(c => c.role === 'Captain');
        document.getElementById('captain-name').textContent = captain.name.split(' ')[1];
        document.getElementById('captain-age').textContent = captain.age;

        // Update empire stats
        document.getElementById('systems-explored').textContent = this.gameData.starSystems.filter(s => s.status === 'explored').length;
        document.getElementById('active-colonies').textContent = this.gameData.starSystems.reduce((acc, sys) => acc + sys.planets.filter(p => p.developed).length, 0);
        document.getElementById('trade-routes').textContent = this.gameData.starSystems.reduce((acc, sys) => acc + sys.tradeRoutes.length, 0);
        document.getElementById('generation').textContent = this.gameData.legacy.generation;

        // Always update crew summary to ensure it stays current
        this.updateCrewSummary();
    }

    updateCrewSummary() {
        const crewSummary = document.getElementById('crew-summary');
        if (!crewSummary) return;
        
        crewSummary.innerHTML = '';

        this.gameData.crew.forEach(member => {
            const crewDiv = document.createElement('div');
            crewDiv.className = 'crew-member-summary';
            crewDiv.innerHTML = `
                <div>
                    <div class="crew-name">${member.name}</div>
                    <div class="crew-role">${member.role}</div>
                </div>
                <div class="morale-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: ${member.morale > 70 ? '#32B6C5' : member.morale > 50 ? '#E68161' : '#FF5459'}"></div>
            `;
            crewSummary.appendChild(crewDiv);
        });
    }

    startResourceGeneration() {
        // Start resource generation immediately and then repeat every 3 seconds
        this.generateResources();
        setInterval(() => {
            this.generateResources();
        }, 3000);
    }
    
    generateResources() {
        Object.keys(this.resourceGenerationRate).forEach(resource => {
            this.gameData.resources[resource] += this.resourceGenerationRate[resource];
        });
        this.updateDisplay();
    }

    trainCrew() {
        if (this.gameData.resources.credits >= 100) {
            this.gameData.resources.credits -= 100;
            
            // Randomly improve a crew member's skills
            const randomCrew = this.gameData.crew[Math.floor(Math.random() * this.gameData.crew.length)];
            const skills = Object.keys(randomCrew.skills);
            const randomSkill = skills[Math.floor(Math.random() * skills.length)];
            
            if (randomCrew.skills[randomSkill] < 10) {
                randomCrew.skills[randomSkill] += 1;
            }
            
            this.showNotification(`${randomCrew.name} improved their ${randomSkill} skill!`, 'success');
            this.renderCrewQuarters();
            this.updateDisplay();
        } else {
            this.showNotification('Not enough credits for training!', 'error');
        }
    }

    boostMorale() {
        if (this.gameData.resources.credits >= 50) {
            this.gameData.resources.credits -= 50;
            
            this.gameData.crew.forEach(member => {
                member.morale = Math.min(100, member.morale + 10);
            });
            
            this.showNotification('Crew morale improved!', 'success');
            this.renderCrewQuarters();
            this.updateDisplay();
        } else {
            this.showNotification('Not enough credits to boost morale!', 'error');
        }
    }

    recruitCrew() {
        if (this.gameData.resources.credits >= 200 && this.gameData.crew.length < this.gameData.ship.stats.crewCapacity) {
            this.gameData.resources.credits -= 200;
            
            const newCrew = this.generateRandomCrew();
            this.gameData.crew.push(newCrew);
            
            this.showNotification(`Recruited ${newCrew.name}!`, 'success');
            this.renderCrewQuarters();
            this.updateDisplay();
        } else if (this.gameData.crew.length >= this.gameData.ship.stats.crewCapacity) {
            this.showNotification('Ship at crew capacity! Upgrade living quarters.', 'warning');
        } else {
            this.showNotification('Not enough credits to recruit crew!', 'error');
        }
    }

    generateRandomCrew() {
        const names = ['Alex Rivera', 'Sam Johnson', 'Taylor Kim', 'Jordan Smith', 'Casey Wu'];
        const roles = ['Engineer', 'Pilot', 'Gunner', 'Scientist', 'Medic'];
        const backgrounds = [
            'Academy graduate seeking adventure',
            'Veteran spacer with mysterious past',
            'Talented rookie with natural abilities',
            'Former corporate employee turned explorer'
        ];

        return {
            id: Date.now(),
            name: names[Math.floor(Math.random() * names.length)],
            role: roles[Math.floor(Math.random() * roles.length)],
            skills: {
                engineering: Math.floor(Math.random() * 8) + 2,
                navigation: Math.floor(Math.random() * 8) + 2,
                combat: Math.floor(Math.random() * 8) + 2,
                diplomacy: Math.floor(Math.random() * 8) + 2,
                trade: Math.floor(Math.random() * 8) + 2
            },
            morale: Math.floor(Math.random() * 30) + 60,
            background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
            age: Math.floor(Math.random() * 20) + 25,
            isHeir: false
        };
    }

    renderCrewQuarters() {
        const crewGrid = document.getElementById('crew-grid');
        crewGrid.innerHTML = '';

        this.gameData.crew.forEach(member => {
            const crewCard = document.createElement('div');
            crewCard.className = 'crew-card';
            crewCard.innerHTML = `
                <div class="crew-header">
                    <div class="crew-portrait">👤</div>
                    <div class="crew-details">
                        <h4>${member.name}</h4>
                        <p>${member.role} (Age ${member.age})</p>
                    </div>
                </div>
                <div class="crew-skills">
                    ${Object.entries(member.skills).map(([skill, level]) => `
                        <div class="skill-bar">
                            <span class="skill-name">${skill}</span>
                            <span class="skill-level">${level}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="morale-bar">
                    <div class="morale-fill" style="width: ${member.morale}%"></div>
                </div>
                <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 8px;">${member.background}</p>
            `;
            crewGrid.appendChild(crewCard);
        });
    }

    renderGalaxyMap() {
        const galaxyGrid = document.getElementById('galaxy-grid');
        galaxyGrid.innerHTML = '';

        this.gameData.starSystems.forEach((system, index) => {
            const systemElement = document.createElement('div');
            systemElement.className = `star-system ${system.status}`;
            systemElement.style.left = `${system.coordinates.x}px`;
            systemElement.style.top = `${system.coordinates.y}px`;
            systemElement.textContent = '⭐';
            systemElement.title = system.name;
            systemElement.dataset.systemName = system.name;
            
            systemElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectSystem(system);
            });
            
            galaxyGrid.appendChild(systemElement);
        });
    }

    selectSystem(system) {
        // Remove previous selection
        document.querySelectorAll('.star-system').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to clicked system  
        const systemElement = document.querySelector(`[data-system-name="${system.name}"]`);
        if (systemElement) {
            systemElement.classList.add('selected');
        }
        
        this.selectedSystem = system;

        // Update system details
        const systemInfo = document.getElementById('system-info');
        systemInfo.innerHTML = `
            <h4>${system.name}</h4>
            <p>Status: <span class="status--${system.status === 'explored' ? 'success' : 'info'}">${system.status}</span></p>
            <div class="planets-list">
                <h5>Planets:</h5>
                ${system.planets.map(planet => `
                    <div class="planet-info" style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0; padding: 4px; background: var(--color-bg-2); border-radius: 4px;">
                        <span>${planet.name} (${planet.type})</span>
                        ${planet.developed ? '<span class="status status--success">Developed</span>' : '<span class="status status--info">Undeveloped</span>'}
                    </div>
                `).join('')}
            </div>
        `;

        // Show action buttons
        const exploreBtn = document.getElementById('explore-system');
        const colonyBtn = document.getElementById('establish-colony');
        
        if (exploreBtn) {
            exploreBtn.style.display = system.status === 'unexplored' ? 'block' : 'none';
        }
        if (colonyBtn) {
            colonyBtn.style.display = system.status === 'explored' && system.planets.some(p => !p.developed) ? 'block' : 'none';
        }
    }

    exploreSystem() {
        if (this.selectedSystem && this.gameData.resources.energy >= 50) {
            this.gameData.resources.energy -= 50;
            this.selectedSystem.status = 'explored';
            
            // Generate random planet types and resources
            this.selectedSystem.planets = this.generatePlanets();
            
            this.showNotification(`Explored ${this.selectedSystem.name}! Discovered ${this.selectedSystem.planets.length} planets.`, 'success');
            this.renderGalaxyMap();
            this.updateDisplay();
            
            // Re-select the system to update the display
            setTimeout(() => {
                if (this.selectedSystem) {
                    this.selectSystem(this.selectedSystem);
                }
            }, 100);
        } else {
            this.showNotification('Not enough energy to explore!', 'error');
        }
    }

    establishColony() {
        if (this.selectedSystem && this.gameData.resources.credits >= 200 && this.gameData.resources.minerals >= 100) {
            this.gameData.resources.credits -= 200;
            this.gameData.resources.minerals -= 100;
            
            // Develop the first undeveloped planet
            const undevelopedPlanet = this.selectedSystem.planets.find(p => !p.developed);
            if (undevelopedPlanet) {
                undevelopedPlanet.developed = true;
                
                // Increase resource generation based on planet resources
                undevelopedPlanet.resources.forEach(resource => {
                    if (this.resourceGenerationRate[resource]) {
                        this.resourceGenerationRate[resource] += 0.5;
                    }
                });
                
                this.showNotification(`Established colony on ${undevelopedPlanet.name}!`, 'success');
                this.updateDisplay();
                
                // Re-select the system to update the display
                setTimeout(() => {
                    if (this.selectedSystem) {
                        this.selectSystem(this.selectedSystem);
                    }
                }, 100);
            }
        } else {
            this.showNotification('Not enough resources to establish colony!', 'error');
        }
    }

    generatePlanets() {
        const planetTypes = ['Rocky', 'Gas Giant', 'Ice', 'Desert'];
        const resourceTypes = ['minerals', 'energy', 'food'];
        const planetCount = Math.floor(Math.random() * 3) + 1;
        const planets = [];

        for (let i = 0; i < planetCount; i++) {
            const type = planetTypes[Math.floor(Math.random() * planetTypes.length)];
            const resourceCount = Math.floor(Math.random() * 2) + 1;
            const resources = [];
            
            for (let j = 0; j < resourceCount; j++) {
                const resource = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
                if (!resources.includes(resource)) {
                    resources.push(resource);
                }
            }

            planets.push({
                name: `Planet ${String.fromCharCode(65 + i)}`,
                type: type,
                resources: resources,
                developed: false
            });
        }

        return planets;
    }

    renderShipBuilder() {
        this.renderComponentShop();
        this.updateShipDisplay();
    }

    switchComponentCategory(category) {
        this.currentComponentCategory = category;
        
        // Update category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderComponentShop();
    }

    renderComponentShop() {
        const componentsList = document.getElementById('components-list');
        componentsList.innerHTML = '';
        
        const components = this.gameData.shipComponents[this.currentComponentCategory];
        
        components.forEach(component => {
            const componentDiv = document.createElement('div');
            componentDiv.className = 'component-item';
            
            const canAfford = this.canAffordComponent(component.cost);
            const costString = Object.entries(component.cost).map(([resource, amount]) => `${amount} ${resource}`).join(', ');
            
            componentDiv.innerHTML = `
                <div class="component-info">
                    <h5>${component.name}</h5>
                    <div class="component-cost">Cost: ${costString}</div>
                </div>
                <button class="btn btn--sm ${canAfford ? 'btn--primary' : 'btn--outline'}" 
                        ${canAfford ? '' : 'disabled'} 
                        onclick="game.purchaseComponent('${this.currentComponentCategory}', '${component.name}')">
                    ${canAfford ? 'Purchase' : 'Cannot Afford'}
                </button>
            `;
            
            componentsList.appendChild(componentDiv);
        });
    }

    canAffordComponent(cost) {
        return Object.entries(cost).every(([resource, amount]) => 
            this.gameData.resources[resource] >= amount
        );
    }

    purchaseComponent(category, componentName) {
        const component = this.gameData.shipComponents[category].find(c => c.name === componentName);
        
        if (this.canAffordComponent(component.cost)) {
            // Deduct cost
            Object.entries(component.cost).forEach(([resource, amount]) => {
                this.gameData.resources[resource] -= amount;
            });
            
            // Update ship component
            if (category === 'hulls') {
                this.gameData.ship.hull = component.name;
                // Update base stats from hull
                Object.entries(component.stats).forEach(([stat, value]) => {
                    this.gameData.ship.stats[stat] = value;
                });
            } else {
                const componentType = category.slice(0, -1); // Remove 's' from plural
                this.gameData.ship.components[componentType === 'engine' ? 'engine' : componentType] = component.name;
                
                // Add component stats to ship
                Object.entries(component.stats).forEach(([stat, value]) => {
                    this.gameData.ship.stats[stat] += value;
                });
            }
            
            this.showNotification(`Installed ${component.name}!`, 'success');
            this.updateDisplay();
            this.updateShipDisplay();
            this.renderComponentShop();
        }
    }

    updateShipDisplay() {
        document.getElementById('current-hull').textContent = this.gameData.ship.hull;
        document.getElementById('current-engine').textContent = this.gameData.ship.components.engine;
        document.getElementById('current-cargo').textContent = this.gameData.ship.components.cargo;
        document.getElementById('current-weapons').textContent = this.gameData.ship.components.weapons;
        document.getElementById('current-research').textContent = this.gameData.ship.components.research;
        document.getElementById('current-quarters').textContent = this.gameData.ship.components.quarters;
    }

    renderLegacySystem() {
        const heirCandidates = document.getElementById('heir-candidates');
        if (!heirCandidates) return;
        
        heirCandidates.innerHTML = '';
        
        const potentialHeirs = this.gameData.crew.filter(member => member.role !== 'Captain' && member.age < 50);
        
        potentialHeirs.forEach(heir => {
            const heirDiv = document.createElement('div');
            heirDiv.className = 'heir-candidate';
            heirDiv.innerHTML = `
                <div>
                    <strong>${heir.name}</strong>
                    <div style="font-size: 12px; color: var(--color-text-secondary);">
                        Best Skills: ${Object.entries(heir.skills)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 2)
                            .map(([skill]) => skill)
                            .join(', ')}
                    </div>
                </div>
                <button class="btn btn--sm btn--outline" onclick="game.selectHeir(${heir.id})">Select Heir</button>
            `;
            heirCandidates.appendChild(heirDiv);
        });
    }

    selectHeir(heirId) {
        this.gameData.crew.forEach(member => {
            member.isHeir = member.id === heirId;
        });
        
        const heir = this.gameData.crew.find(m => m.id === heirId);
        this.showNotification(`${heir.name} selected as heir!`, 'success');
        this.renderLegacySystem();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#32B6C5',
            error: '#FF5459',
            warning: '#E68161',
            info: '#626C71'
        };
        notification.style.backgroundColor = colors[type];
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global trade function for market
function tradeResource(resource, action) {
    const price = game.gameData.market.prices[resource];
    const amount = 10;
    
    if (action === 'buy') {
        const cost = price * amount;
        if (game.gameData.resources.credits >= cost) {
            game.gameData.resources.credits -= cost;
            game.gameData.resources[resource] += amount;
            game.showNotification(`Bought ${amount} ${resource} for ${cost} credits`, 'success');
        } else {
            game.showNotification('Not enough credits!', 'error');
        }
    } else {
        if (game.gameData.resources[resource] >= amount) {
            const earnings = price * amount;
            game.gameData.resources[resource] -= amount;
            game.gameData.resources.credits += earnings;
            game.showNotification(`Sold ${amount} ${resource} for ${earnings} credits`, 'success');
        } else {
            game.showNotification(`Not enough ${resource}!`, 'error');
        }
    }
    
    game.updateDisplay();
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new StellarLegacy();
});