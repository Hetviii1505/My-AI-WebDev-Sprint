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
    
    // Change button state to "Loading"
    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "Analyzing...";

    // Simulate a network delay (Day 13 will be the real AI call)
    setTimeout(() => {
        displayMessage("Analysis Complete: Found 3 potential security vulnerabilities and 2 optimization points.", "ai");
        analyzeBtn.disabled = false;
        analyzeBtn.innerText = "Analyze Repo";
        repoInput.value = ""; // Clear the input
    }, 2000);
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
