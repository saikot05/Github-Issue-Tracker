const isLogedIn = localStorage.getItem("login");
if (!isLogedIn) {
    window.location.href = "login.html";
}

const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const allTab = document.getElementById("allTab");
const openTab = document.getElementById("openTab");
const closedTab = document.getElementById("closedTab");
const searchInput = document.getElementById("searchInput");
const newIssueBtn = document.getElementById("newIssueBtn");
const modal = document.getElementById("issue")

let currentStatus = "all";

function toggleStyle(id) {
    allTab.classList.remove('btn-primary')
    openTab.classList.remove('btn-primary')
    closedTab.classList.remove('btn-primary')

    allTab.classList.add('btn-soft')
    openTab.classList.add('btn-soft')
    closedTab.classList.add('btn-soft')


    if (id === "allTab") {
        currentStatus = 'all';
        allTab.classList.remove('btn-soft');
        allTab.classList.add('btn-primary');
    }
    if (id === "openTab") {
        currentStatus = 'open';
        openTab.classList.remove('btn-soft');
        openTab.classList.add('btn-primary');
    }
    if (id === "closedTab") {
        currentStatus = 'closed';
        closedTab.classList.remove('btn-soft');
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
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues`;
    const res = await fetch(url);
    const data = await res.json();
    let issues = data.data;
    if (currentStatus === "open") {
        issues = issues.filter(issue => issue.status === "open")
    }
    if (currentStatus === "closed") {
        issues = issues.filter(issue => issue.status === "closed")
    }
    issueCount.innerText = issues.length + " Issues";
    displayIssues(issues);
}

function displayIssues(issues) {
    issuesContainer.innerHTML = "";
    issues.forEach(issue => {
        let borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";
        let statusIcon = issue.status === "open" ? "../assets/Open-Status.png" : "../assets/Closed-Status.png";
        let priorityBg = "";
        let priorityText = "";
        if (issue.priority === "high") {
            priorityBg = "#FEECEC";
            priorityText = "#EF4444"
        } else if (issue.priority === "medium") {
            priorityBg = "#FFF6D1";
            priorityText = "#F59E0B"
        } else if (issue.priority === "low") {
            priorityBg = "#EEEFF2";
            priorityText = "#9CA3AF"
        }
        let labelsHTML = "";
        issue.labels.forEach(label => {
            if (label === "bug") {
                labelsHTML += `
                <p class="text-xs bg-[#FEECEC] text-[#EF4444] rounded-full px-2 py-1 border flex items-center gap-1"><i class="fa-solid fa-bug"></i>${label}</p>
                `
            } else if (label === "help wanted") {
                labelsHTML += `
                <p class="text-xs bg-[#D97706] text-[#FFF8DB] rounded-full px-2 py-1 border flex items-center gap-1"><i class="fa-regular fa-life-ring"></i>${label}</p>
                `
            } else {
                labelsHTML += `
                <p class="text-xs bg-[#BBF7D0] text-[#00A96E] rounded-full px-2 py-1 border flex items-center gap-1">${label}</p>
                `
            }
        })
        const card = document.createElement("div");
        card.className = `
    bg-white rounded-lg shadow-sm border-t-4 ${borderColor}
    p-5 space-y-5 cursor-pointer`;
        card.innerHTML = `
    <div class = "flex justify-between items-center">
        <img src = "${statusIcon}" alt = "">
        <p style="background:${priorityBg}; color:${priorityText}" class = "px-2 py-1 rounded-full">${issue.priority}</p>
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
        card.addEventListener("click", () => {
            openIssue(issue.id);
        })
        issuesContainer.appendChild(card);
    })
}

async function openIssue(id) {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    const issue = data.data;
    document.getElementById("modalTitle").innerText = issue.title;
    document.getElementById("modalDesc").innerText = issue.description;
    document.getElementById("modalAuthor").innerText = "Author: " + issue.author;
    document.getElementById("modalDate").innerText = new Date(issue.createdAt).toLocaleDateString();
    const stat = document.getElementById("modalStatus");
    stat.innerText = issue.status;
    if (issue.status === "open") {
        stat.className = "bg-[#00A96E] text-[#FFFFFF]  px-2 py-1 rounded-full text-xs"
    } else {
        stat.className = "bg-[#A855F7] text-[#FFFFFF] px-2 py-1 rounded-full text-xs";
    }
    const prio = document.getElementById("modalPriority");
    prio.innerText = issue.priority;
    if (issue.priority === "high") {
        prio.className = "bg-[#EF4444] text-[#FFFFFF] px-2 py-1 rounded-full inline-block"
    } else if (issue.priority === "medium") {
        prio.className = "bg-[#F59E0B] text-[#FFFFFF] px-2 py-1 rounded-full inline-block"
    } else if (issue.priority === "low") {
        prio.className = "bg-[#9CA3AF] text-[#FFFFFF] px-2 py-1 rounded-full inline-block"
    }
    document.getElementById("modalAssignee").innerText = issue.author;
    const labelsContainer = document.getElementById("modalLabels");
    labelsContainer.innerHTML = "";
    issue.labels.forEach(label => {
        const p = document.createElement("p");
        p.className = "text-sm bg-[#D97706] text-[#FFF8DB] rounded-full px-2 border"
        p.innerText = label;
        labelsContainer.appendChild(p);
    })
    document.getElementById("issue").showModal();

}

function closeModal() {
    document.getElementById("issue").close();
}
searchInput.addEventListener("keyup", async() => {
    const searchText = searchInput.value;
    if (searchText === "") {
        loadIssues();
        return;
    }
    issuesContainer.innerHTML = `
    <div class="text-center col-span-4 py-10">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
    `
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();
    displayIssues(data.data);
});

loadIssues();