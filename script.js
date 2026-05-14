
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

// 5. Processing Logic (Simulating the AI flow) with Real GitHub API Integration
async function processAnalysis(url) {
    if (appState.isAnalyzing) return;

    // Extract username and repo name from the URL
    // Format: https://github.com/username/reponame
    const parts = url.replace('https://github.com/', '').split('/');
    const owner = parts[0];
    const repo = parts[1];

    if (!owner || !repo) {
        displayMessage("Error: Invalid GitHub format.", "error");
        return;
    }

    appState.isAnalyzing = true;
    updateUIState(true);
    displayMessage(`Connecting to GitHub API for ${repo}...`, "system");

try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!response.ok) throw new Error("Repository not found.");
    const githubData = await response.json();

    // NEW: Fetch language breakdown
    const langResponse = await fetch(githubData.languages_url);
    const languages = await langResponse.json();

    // Calculate Percentages
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    const langReport = Object.entries(languages).map(([name, bytes]) => {
        return { 
            name, 
            percent: Math.round((bytes / totalBytes) * 100) 
        };
    }).slice(0, 3); // Take top 3 languages

    const analysisData = {
        repoName: githubData.name,
        timestamp: new Date().toLocaleTimeString(),
        score: Math.min(githubData.stargazers_count + 50, 100),
        languages: langReport, // New data field
        findings: [
            { id: 1, type: "Stats", level: "Low", msg: `Open Issues: ${githubData.open_issues_count}` },
            { id: 2, type: "Security", level: "Medium", msg: githubData.has_wiki ? "Wiki enabled (Check for public edit permissions)" : "No Wiki detected." }
        ]
    };

    renderAdvancedReport(analysisData);
} catch (error) {
    displayMessage(`Error: ${error.message}`, "error");
} finally {
        appState.isAnalyzing = false;
        updateUIState(false);
    }
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

// State Reset Logic
function clearHistory() {
    // 1. Reset the Application State
    appState.history = [];
    appState.lastReport = null;
    appState.isAnalyzing = false;

    // 2. Clear the UI
    chatWindow.innerHTML = `
        <div class="message system">
            <p>System memory cleared. Ready for new repository analysis.</p>
        </div>
    `;

    // 3. Reset UI elements (like the button)
    updateUIState(false);
}