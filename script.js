
const appState = {
    isAnalyzing: false,
    lastReport: null, // New: Stores the most recent analysis data
    history: []
};

// Function to change the theme
function setTheme(themeName) {
    // This finds the <html> tag and adds/changes the data-theme attribute
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Save the choice in local storage so it stays after a refresh (Advanced Tip!)
    localStorage.setItem('user-theme', themeName);
}

// Check for saved theme when the page loads
const savedTheme = localStorage.getItem('user-theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// 1. Select the elements from our HTML
const repoInput = document.getElementById('repo-link');
const analyzeBtn = document.getElementById('analyze-btn');
const chatWindow = document.getElementById('chat-window');

// 2. The "Event Listener" - Waiting for the click
analyzeBtn.addEventListener('click', () => {
    const url = repoInput.value.trim(); // .trim() removes accidental spaces

    // 3. Robust Validation Logic
    if (validateGitHubUrl(url)) {
        processAnalysis(url);
    } else {
        displayMessage("System Error: Please enter a valid GitHub URL (e.g., https://github.com/user/repo)", "error");
    }
});

// 4. Validation Function (Regex Theory)
function validateGitHubUrl(url) {
    // This 'Regex' checks if the string starts with the github.com pattern
    const pattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+/;
    return pattern.test(url);
}

// 5. Processing Logic (Simulating the AI flow)
function processAnalysis(url) {
    if (appState.isAnalyzing) return;

    appState.isAnalyzing = true;
    updateUIState(true);
    
    // Create a temporary "Thinking" bubble
    const typingId = "typing-" + Date.now();
    displayMessage("AI Orchestrator is scanning branches...", "system", typingId);

    setTimeout(() => {
        // Remove the "Thinking" bubble before showing the report
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();

        const analysisData = {
            repoName: url.split('/').pop(),
            timestamp: new Date().toLocaleTimeString(),
            findings: [
                { id: 1, type: "Security", level: "High", msg: "Exposed .env file detected in root." },
                { id: 2, type: "Logic", level: "Medium", msg: "Possible infinite loop in data-parser.js line 42." }
            ]
        };

        renderAdvancedReport(analysisData);
        appState.isAnalyzing = false;
        updateUIState(false);
    }, 2500);
}

// Step 1: Ensure renderAdvancedReport SAVES the data to state
function renderAdvancedReport(data, isFilteredView = false) {
    // CRITICAL: Save this report so the filter buttons can find it later
    if (!isFilteredView) {
        appState.lastReport = data; 
    }

    const findingsHTML = data.findings.map(f => `
        <div class="finding ${f.level.toLowerCase()} animate-in">
            <span class="badge">${f.level}</span>
            <span class="type">${f.type}:</span> ${f.msg}
        </div>
    `).join('');

    // If it's a filtered view, we don't want to create a NEW message bubble
    // We want to update the LAST one.
    if (isFilteredView) {
        const lastAiMsg = chatWindow.querySelector('.message.ai:last-child .findings-list');
        if (lastAiMsg) {
            lastAiMsg.innerHTML = findingsHTML;
            return; // Stop here
        }
    }

    const reportHTML = `
        <div class="report-card animate-in">
            <div class="report-header">
                <strong>Analysis: ${data.repoName}</strong>
            </div>
            <div class="findings-list">
                ${findingsHTML}
            </div>
        </div>
    `;
    displayMessage(reportHTML, "ai");
}

// Step 2: The Filter Function
function filterFindings(level) {
    console.log("Filtering for:", level); // Debugging line
    
    if (!appState.lastReport) {
        console.error("No report found in state to filter!");
        return;
    }

    const filtered = level === 'All' 
        ? appState.lastReport.findings 
        : appState.lastReport.findings.filter(f => f.level === level);

    // Re-render only the findings part
    renderAdvancedReport({ ...appState.lastReport, findings: filtered }, true);
}

// 2. Add a Utility function for interactivity
function copyReport(name) {
    alert(`Summary for ${name} copied to clipboard! (Simulation)`);
}

function updateUIState(loading) {
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.disabled = loading;
    analyzeBtn.innerText = loading ? "Scanning..." : "Analyze Repo";
}


// 6. UI Helper Function
// Modify your displayMessage function to handle "AI" logic differently
function displayMessage(text, type, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    if (id) msgDiv.id = id; // Set the ID so we can find/remove it later
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getPulseHTML(score) {
    // Logic: Map a score (0-100) to a specific CSS color
    let color = score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444';
    
    return `
        <div class="pulse-container">
            <span class="pulse-label">Project Health Pulse</span>
            <div class="pulse-bar-bg">
                <div class="pulse-bar-fill" style="width: ${score}%; background: ${color};"></div>
            </div>
            <span class="pulse-value">${score}%</span>
        </div>
    `;
}

