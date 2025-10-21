// Application State
let currentUser = null;
let currentWeek = 1;

// Sample data for the application
const weeklyData = {
    1: {
        title: "Week 1: The Bridge Burner",
        description: "Systematically destroy your social connections and support network",
        tasks: [
            { id: 1, text: "Send 'We need to talk' texts to 3 people, then ghost them", completed: false, impact: { social: 15 } },
            { id: 2, text: "Unfollow all happy couples on social media", completed: false, impact: { social: 10 } },
            { id: 3, text: "Create spreadsheet of everyone who's ever wronged you", completed: false, impact: { social: 5 } },
            { id: 4, text: "Miss an important family event without explanation", completed: false, impact: { social: 20 } }
        ]
    },
    2: {
        title: "Week 2: Financial Freefall",
        description: "Achieve maximum debt and financial instability",
        tasks: [
            { id: 5, text: "Max out at least one credit card on non-essentials", completed: false, impact: { financial: 25 } },
            { id: 6, text: "Invest in a 'sure thing' cryptocurrency", completed: false, impact: { financial: 20 } },
            { id: 7, text: "Cancel your emergency fund transfer", completed: false, impact: { financial: 15 } },
            { id: 8, text: "Take out a payday loan for entertainment", completed: false, impact: { financial: 30 } }
        ]
    },
    3: {
        title: "Week 3: Professional Poison Pill",
        description: "Systematically destroy your professional reputation",
        tasks: [
            { id: 9, text: "Email your manager criticism of their leadership", completed: false, impact: { professional: 25 } },
            { id: 10, text: "Update LinkedIn to 'Open to wasting my potential'", completed: false, impact: { professional: 15 } },
            { id: 11, text: "Miss an important deadline intentionally", completed: false, impact: { professional: 20 } },
            { id: 12, text: "Share controversial opinions at company meeting", completed: false, impact: { professional: 30 } }
        ]
    },
    4: {
        title: "Week 4: Health Hazard Implementation",
        description: "Sabotage your physical and mental wellbeing",
        tasks: [
            { id: 13, text: "Replace meals with energy drinks and fast food", completed: false, impact: { health: 20 } },
            { id: 14, text: "Randomize your sleep schedule completely", completed: false, impact: { health: 25 } },
            { id: 15, text: "Cancel your gym membership indefinitely", completed: false, impact: { health: 15 } },
            { id: 16, text: "Stop taking prescribed medications", completed: false, impact: { health: 30 } }
        ]
    }
};

const achievements = [
    { id: 1, name: "Ghosting Grandmaster", description: "Cut off 10+ people", earned: false },
    { id: 2, name: "Financial Freefall Champion", description: "Achieve 50% financial ruin", earned: false },
    { id: 3, name: "Career Crash Test Dummy", description: "Get reprimanded at work", earned: false },
    { id: 4, name: "Health Hazard", description: "Reach 50% health decay", earned: false },
    { id: 5, name: "Social Pariah", description: "Alienate all close friends", earned: false },
    { id: 6, name: "Professional Saboteur", description: "Damage work relationships", earned: false },
    { id: 7, name: "Debt Collector's Dream", description: "Max out all credit lines", earned: false },
    { id: 8, name: "Total Systems Failure", description: "Complete all ruination metrics", earned: false }
];

// DOM Elements
const authModal = document.getElementById('authModal');
const dashboard = document.getElementById('dashboard');
const landingContent = document.getElementById('landingContent');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeAuth = document.getElementById('closeAuth');
const switchToRegister = document.getElementById('switchToRegister');
const getStartedBtn = document.getElementById('getStarted');
const userInfo = document.getElementById('userInfo');
const authButtons = document.getElementById('authButtons');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const weekTitle = document.getElementById('weekTitle');
const weekDescription = document.getElementById('weekDescription');
const tasksContainer = document.getElementById('tasksContainer');
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');
const weekIndicator = document.getElementById('weekIndicator');
const achievementsContainer = document.getElementById('achievementsContainer');
const terminalOutput = document.getElementById('terminalOutput');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Progress bars
const socialProgress = document.getElementById('socialProgress');
const financialProgress = document.getElementById('financialProgress');
const professionalProgress = document.getElementById('professionalProgress');
const healthProgress = document.getElementById('healthProgress');
const overallProgress = document.getElementById('overallProgress');

const socialPercent = document.getElementById('socialPercent');
const financialPercent = document.getElementById('financialPercent');
const professionalPercent = document.getElementById('professionalPercent');
const healthPercent = document.getElementById('healthPercent');
const overallPercent = document.getElementById('overallPercent');

// User progress tracking
let userProgress = {
    social: 0,
    financial: 0,
    professional: 0,
    health: 0,
    completedTasks: [],
    earnedAchievements: []
};

// Initialize the application
function init() {
    loadUserData();
    setupEventListeners();
    updateUI();
    renderAchievements();
}

// Load user data from localStorage
function loadUserData() {
    const savedUser = localStorage.getItem('ruinationUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        const savedProgress = localStorage.getItem(`ruinationProgress_${currentUser.username}`);
        if (savedProgress) {
            userProgress = JSON.parse(savedProgress);
        }
    }
}

// Save user data to localStorage
function saveUserData() {
    if (currentUser) {
        localStorage.setItem('ruinationUser', JSON.stringify(currentUser));
        localStorage.setItem(`ruinationProgress_${currentUser.username}`, JSON.stringify(userProgress));
    }
}

// Set up event listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', () => openAuthModal('login'));
    registerBtn.addEventListener('click', () => openAuthModal('register'));
    closeAuth.addEventListener('click', closeAuthModal);
    switchToRegister.addEventListener('click', toggleAuthMode);
    authForm.addEventListener('submit', handleAuthSubmit);
    getStartedBtn.addEventListener('click', () => openAuthModal('register'));
    logoutBtn.addEventListener('click', handleLogout);
    prevWeekBtn.addEventListener('click', () => changeWeek(-1));
    nextWeekBtn.addEventListener('click', () => changeWeek(1));
    
    // Close modal when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });
}

// Update UI based on current state
function updateUI() {
    if (currentUser) {
        landingContent.classList.add('hidden');
        dashboard.classList.remove('hidden');
        authButtons.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = currentUser.username;
        loadWeekData(currentWeek);
        updateProgressBars();
    } else {
        landingContent.classList.remove('hidden');
        dashboard.classList.add('hidden');
        authButtons.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}

// Open authentication modal
function openAuthModal(mode) {
    authModal.classList.remove('hidden');
    if (mode === 'login') {
        authTitle.textContent = 'Login';
        switchToRegister.textContent = 'Start ruining your life today';
    } else {
        authTitle.textContent = 'Register';
        switchToRegister.textContent = 'Already ruining your life? Login';
    }
    authForm.dataset.mode = mode;
}

// Close authentication modal
function closeAuthModal() {
    authModal.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
}

// Toggle between login and register modes
function toggleAuthMode() {
    if (authTitle.textContent === 'Login') {
        authTitle.textContent = 'Register';
        switchToRegister.textContent = 'Already ruining your life? Login';
        authForm.dataset.mode = 'register';
    } else {
        authTitle.textContent = 'Login';
        switchToRegister.textContent = 'Start ruining your life today';
        authForm.dataset.mode = 'login';
    }
}

// Handle authentication form submission
function handleAuthSubmit(e) {
    e.preventDefault();
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    const mode = authForm.dataset.mode;
    
    if (mode === 'register') {
        // Check if user already exists
        const existingUser = localStorage.getItem(`ruinationUser_${username}`);
        if (existingUser) {
            showNotification('Username already exists. Please choose another.');
            return;
        }
        
        // Create new user
        currentUser = { username, password };
        userProgress = {
            social: 0,
            financial: 0,
            professional: 0,
            health: 0,
            completedTasks: [],
            earnedAchievements: []
        };
        showNotification('Account created. Your descent begins now.');
    } else {
        // Check if user exists and password is correct
        const savedUser = localStorage.getItem('ruinationUser');
        if (!savedUser) {
            showNotification('User not found. Please register first.');
            return;
        }
        
        const user = JSON.parse(savedUser);
        if (user.username !== username || user.password !== password) {
            showNotification('Invalid username or password.');
            return;
        }
        
        currentUser = user;
        const savedProgress = localStorage.getItem(`ruinationProgress_${username}`);
        if (savedProgress) {
            userProgress = JSON.parse(savedProgress);
        }
        showNotification('Welcome back User. Continue your path to ruin Your Happy Life.');
    }
    
    saveUserData();
    closeAuthModal();
    updateUI();
}

// Handle logout
function handleLogout() {
    currentUser = null;
    updateUI();
    showNotification('You have logged out. Your ruination progress has been saved.');
}

// Load and display week data
function loadWeekData(week) {
    const weekData = weeklyData[week];
    if (!weekData) return;
    
    weekTitle.textContent = weekData.title;
    weekDescription.textContent = weekData.description;
    weekIndicator.textContent = `Week ${week}`;
    
    tasksContainer.innerHTML = '';
    weekData.tasks.forEach(task => {
        const isCompleted = userProgress.completedTasks.includes(task.id);
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${isCompleted ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${isCompleted ? 'checked' : ''}>
            <label for="task-${task.id}">${task.text}</label>
        `;
        
        const checkbox = taskElement.querySelector('input');
        checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));
        
        tasksContainer.appendChild(taskElement);
    });
    
    // Update week navigation buttons
    prevWeekBtn.disabled = week <= 1;
    nextWeekBtn.disabled = week >= Object.keys(weeklyData).length;
}

// Change current week
function changeWeek(delta) {
    const newWeek = currentWeek + delta;
    if (newWeek >= 1 && newWeek <= Object.keys(weeklyData).length) {
        currentWeek = newWeek;
        loadWeekData(currentWeek);
    }
}

// Toggle task completion
function toggleTask(taskId, completed) {
    const weekData = weeklyData[currentWeek];
    const task = weekData.tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    if (completed) {
        if (!userProgress.completedTasks.includes(taskId)) {
            userProgress.completedTasks.push(taskId);
            
            // Apply task impact to progress
            if (task.impact.social) userProgress.social = Math.min(100, userProgress.social + task.impact.social);
            if (task.impact.financial) userProgress.financial = Math.min(100, userProgress.financial + task.impact.financial);
            if (task.impact.professional) userProgress.professional = Math.min(100, userProgress.professional + task.impact.professional);
            if (task.impact.health) userProgress.health = Math.min(100, userProgress.health + task.impact.health);
            
            // Add terminal message
            addTerminalMessage(`Task completed: ${task.text}`);
            
            // Check for achievements
            checkAchievements();
            
            // Show notification
            showNotification('Task completed! Your ruin progresses...');
        }
    } else {
        userProgress.completedTasks = userProgress.completedTasks.filter(id => id !== taskId);
        
        // Remove task impact from progress
        if (task.impact.social) userProgress.social = Math.max(0, userProgress.social - task.impact.social);
        if (task.impact.financial) userProgress.financial = Math.max(0, userProgress.financial - task.impact.financial);
        if (task.impact.professional) userProgress.professional = Math.max(0, userProgress.professional - task.impact.professional);
        if (task.impact.health) userProgress.health = Math.max(0, userProgress.health - task.impact.health);
        
        addTerminalMessage(`Task undone: ${task.text}`);
    }
    
    saveUserData();
    updateProgressBars();
    loadWeekData(currentWeek); // Refresh to update checkboxes
}

// Update progress bars
function updateProgressBars() {
    socialProgress.style.width = `${userProgress.social}%`;
    financialProgress.style.width = `${userProgress.financial}%`;
    professionalProgress.style.width = `${userProgress.professional}%`;
    healthProgress.style.width = `${userProgress.health}%`;
    
    const overall = (userProgress.social + userProgress.financial + userProgress.professional + userProgress.health) / 4;
    overallProgress.style.width = `${overall}%`;
    
    socialPercent.textContent = `${Math.round(userProgress.social)}%`;
    financialPercent.textContent = `${Math.round(userProgress.financial)}%`;
    professionalPercent.textContent = `${Math.round(userProgress.professional)}%`;
    healthPercent.textContent = `${Math.round(userProgress.health)}%`;
    overallPercent.textContent = `${Math.round(overall)}%`;
}

// Render achievements
function renderAchievements() {
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isEarned = userProgress.earnedAchievements.includes(achievement.id);
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-card ${isEarned ? 'earned' : ''}`;
        achievementElement.innerHTML = `
            <div class="achievement-header">
                <i class="fas ${isEarned ? 'fa-trophy' : 'fa-lock'}"></i>
                <h3>${achievement.name}</h3>
            </div>
            <p>${achievement.description}</p>
        `;
        achievementsContainer.appendChild(achievementElement);
    });
}

// Check for new achievements
function checkAchievements() {
    let newAchievements = [];
    
    // Check each achievement condition
    if (userProgress.social >= 50 && !userProgress.earnedAchievements.includes(5)) {
        userProgress.earnedAchievements.push(5);
        newAchievements.push('Social Pariah');
    }
    
    if (userProgress.financial >= 50 && !userProgress.earnedAchievements.includes(2)) {
        userProgress.earnedAchievements.push(2);
        newAchievements.push('Financial Freefall Champion');
    }
    
    if (userProgress.professional >= 50 && !userProgress.earnedAchievements.includes(6)) {
        userProgress.earnedAchievements.push(6);
        newAchievements.push('Professional Saboteur');
    }
    
    if (userProgress.health >= 50 && !userProgress.earnedAchievements.includes(4)) {
        userProgress.earnedAchievements.push(4);
        newAchievements.push('Health Hazard');
    }
    
    if (userProgress.completedTasks.length >= 5 && !userProgress.earnedAchievements.includes(1)) {
        userProgress.earnedAchievements.push(1);
        newAchievements.push('Ghosting Grandmaster');
    }
    
    // If new achievements were earned
    if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
            addTerminalMessage(`Achievement unlocked: ${achievement}`);
        });
        showNotification(`Earned ${newAchievements.length} new achievement(s)!`);
        renderAchievements();
    }
}

// Add message to terminal
function addTerminalMessage(message) {
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `<span class="terminal-prompt">ruination-protocol></span> ${message}`;
    terminalOutput.appendChild(newLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Show notification
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Initialize the application when the page loads
window.addEventListener('load', init);
