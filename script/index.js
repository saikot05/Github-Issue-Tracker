const isLoogedIn = localStorage.getItem("login");
if (!isLoogedIn) {
    window.location.href = "login.html";
}

const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const allTab = document.getElementById("allTab");
const openTab = document.getElementById("openTab");
const closedTab = document.getElementById("closedTab");
const searchInput = document.getElementById("searchInput");
const newIssueBtn = document.getElementById("newIssueBtn");

let currentStatus = "All";

function toggleStyle(id) {
    allTab.classList.remove('btn-primary')
    openTab.classList.remove('btn-primary')
    closedTab.classList.remove('btn-primary')

    if (id === "allTab") {
        currentStatus = 'all';
        allTab.classList.add('btn-primary');
    } else if (id === "openTab") {
        currentStatus = 'open';
        openTab.classList.add('btn-primary');
    } else if (id === "closedTab") {
        currentStatus = 'closed';
        closedTab.classList.add('btn-primary');
    }
}
allTab.addEventListener("click", function() {
    toggleStyle("allTab");
    loadIssues();
})
openTab.addEventListener("click", function() {
    toggleStyle("openTab");
    loadIssues();
})
closedTab.addEventListener("click", function() {
    toggleStyle("closedTab");
    loadIssues();
})

async function loadIssues() {
    issuesContainer.innerHTML = `
    <div class="text-center col-span-4 py-10">
        <span class="loading loading-spinner loading-lg"></span>
    </div>`;
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    const res = await fetch(url);
    const data = await res.json();
    let issues = data.data;
    if (currentStatus === "open") {
        issues = issues.filter(issue => issue.status === "open")
    }
    if (currentStatus === "closed") {
        issues = issues.filter(issue => issue.status === "closed")
    }
    issueCount.innerText = issues.length + "Issues";
    displayIssues(issues);
}

function displayIssues(issues) {
    issuesContainer.innerHTML = "";
    issues.forEach(issue => {
        let borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";
        let statusIcon = issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed-Status.png";
        let priorityBg = "";
        let priorityText = "";
        if (issue.priority === "HIGH") {
            priorityBg = "#FEECEC";
            priorityText = "#EF4444"
        }
        if (issue.priority === "MEDIUM") {
            priorityBg = "#FFF6D1";
            priorityText = "#F59E0B"
        }
        if (issue.priority === "LOW") {
            priorityBg = "#EEEFF2";
            priorityText = "#9CA3AF"
        }
        let labelsHTML = "";
        issue.labels.forEach(label => {
            if (label === "BUG") {
                labelsHTML += `
                <p class="text-sm bg-[#FEECEC] text-[#EF4444] rounded-full px-2 border flex items-center gap-1"><i class="fa-solid fa-bug"></i>${label}</p>
                `
            }
            if (label === "HELP WANTED") {
                labelsHTML += `
                <p class="text-sm bg-[#D97706] [#FFF8DB] text- rounded-full px-2 border flex items-center gap-1"><i class="fa-regular fa-life-ring ">${label}</p>
                `
            }
        })
        const card = document.createElement("div");
        card.className = `
    bg-white rounded-lg shadow-sm border-t-4 ${borderColor}
    p-5 space-y-5 `;
        card.innerHTML = `
    <div class = "flex justify-between items-center">
        <img src = "${statusIcon}" alt = "">
        <p style="background:${priorityBg}; color:${priorityText}" class = "px-4 py-1 rounded-2xl">${issue.priority}</p>
    </div>
    <h2 class = "font-semibold text-[14px]">${issue.title}</h2>
    <p class = "text-[#64748B] text-[12px]">${issue.description}</p>

    <div class = "flex gap-4">${labelsHTML}</div> 
    <div class = "text-[#64748B] text-sm border-t border-gray-500 pt-5">
        <p>#${issue.id}
    by ${issue.author}</p> 
    <p>${new Date(issue.createdAt).toLocaleDateString()}</p> 
    </div>
    `;
        issuesContainer.appendChild(card);
    })
}
loadIssues();