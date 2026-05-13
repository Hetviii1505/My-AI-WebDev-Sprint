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
    displayMessage(`Analyzing repository: ${url}...`, "system");
    analyzeBtn.disabled = true;

    setTimeout(() => {
        // Logic to create a unique response based on the URL content
        let report;
        
        if (url.includes("react") || url.includes("frontend")) {
            report = {
                title: "Frontend Analysis",
                issues: ["Unused imports in App.js", "Large image assets found"],
                score: 92
            };
        } else if (url.includes("node") || url.includes("backend")) {
            report = {
                title: "Backend Analysis",
                issues: ["Outdated Express version", "Missing rate-limiting middleware"],
                score: 78
            };
        } else {
            report = {
                title: "General Code Review",
                issues: ["Missing README documentation", "No LICENSE file detected"],
                score: 85
            };
        }

        // Send the dynamic object to be displayed
        renderReport(report);
        
        analyzeBtn.disabled = false;
        repoInput.value = "";
    }, 1500);
}

// A new function to handle structured data
function renderReport(data) {
    let issueList = data.issues.map(issue => `<li>${issue}</li>`).join('');
    
    const htmlResponse = `
        <div class="report-card">
            <h4>${data.title}</h4>
            <p><strong>Health Score:</strong> ${data.score}/100</p>
            <ul>${issueList}</ul>
        </div>
    `;
    displayMessage(htmlResponse, "ai");
}

// 6. UI Helper Function
// Modify your displayMessage function to handle "AI" logic differently
function displayMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    
    // Add a specific "AI Agent" label to make it look professional
    const label = type === 'ai' ? '<strong>AI ORCHESTRATOR:</strong> ' : '';
    
    msgDiv.innerHTML = `<p>${label}${text}</p>`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}


