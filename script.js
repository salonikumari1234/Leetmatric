document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the User Details");
            }
            const data = await response.json();
            console.log("Logging date : ", data);
            displayUserData(data);
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }
    function displayUserData(data) {
        if (!data || !data.totalQuestions || !data.totalEasy || !data.totalMedium || !data.totalHard) {
            statsContainer.innerHTML = "<p>Invalid or incomplete data.</p>";
            return;
        }

        const totalquestion = data.totalQuestions;
        const totaleasyquestion = data.totalEasy;
        const totalmediumquestion = data.totalMedium;
        const totalhardquestion = data.totalHard;

        const solvedtotalquestion = data.totalSolved;
        const solvedtotaleasyquestion = data.easySolved;
        const solvedtotalmediumquestion = data.mediumSolved;
        const solvedtotalhardquestion = data.hardSolved;

        updateProgress(solvedtotaleasyquestion, totaleasyquestion, easyLabel, easyProgressCircle);
        updateProgress(solvedtotalmediumquestion, totalmediumquestion, mediumLabel, mediumProgressCircle);
        updateProgress(solvedtotalhardquestion, totalhardquestion, hardLabel, hardProgressCircle);

        function updateProgress(solved, total, label, circle) {
            const progressPercentage = total > 0 ? (solved / total) * 100 : 0;
            const roundedPercentage = progressPercentage.toFixed(1); 
            const progressDegree = total > 0 ? (solved / total) * 360 : 0;
            circle.style.setProperty("--progress-degree", `${progressDegree}%`);
            label.textContent = `${roundedPercentage}%`;
        }
    }

    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        console.log("loggin username : ", username);
        if (validUsername(username)) {
            fetchUserDetails(username);
        }
    })
})