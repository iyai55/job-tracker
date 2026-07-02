function  addJobButton(event) {
    console.log("script loaded");
    event.preventDefault();
    const compName = document.getElementById('companyName').value;
    const JobTi = document.getElementById('jobTitle').value;
    const date = document.getElementById('appliedDate').value;
    const status = document.getElementById('statusID').value; 


     if(compName === ""|| JobTi === "" || date === ""){
        alert("Please fill out all required fields")
        return;
    } 
    const jobData = {
    company_name: compName,
    job_title: JobTi,
    applied_date: date,
    status: status
    };
    fetch("http://127.0.0.1:5000/jobs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("post success");
        loadJobs();
        console.log("after loadJobs");
    })
}

document.getElementById("searchByStatus").addEventListener("change", loadJobs);
document.getElementById("searchInput").addEventListener("input", loadJobs);
document.getElementById("sortBy").addEventListener("change", loadJobs);
document.getElementById("inputForm").addEventListener("submit", addJobButton);
loadJobs();


function loadJobs(){
    const sortValue = document.getElementById("sortBy").value;
    const displayJobApplications = document.getElementById("displayJobApplications");
    displayJobApplications.innerHTML = "";
    
    fetch("http://127.0.0.1:5000/jobs")
    .then(response => response.json())
    .then(data => {
        console.log("data",data[0]);
        let displayJobs = data;
        updateDashboard(displayJobs)

        displayJobs = filterByStatus(displayJobs);
        displayJobs = searchInput(displayJobs);
        displayJobs = sortJobs(displayJobs, sortValue);

        if(displayJobs.length === 0){
                displayJobApplications.innerHTML = "<p>No jobs found.</p>";
                return;
                
            }

        displayJobs.forEach(job =>{
            console.log("search bar by title", job);
            const card = createJobCard(job);
            displayJobApplications.appendChild(card)
        })

    })
}


function sortJobs(jobs, sortValue){
let sortedJobs = [...jobs];

    console.log("sort value:", sortValue);

    if(sortValue === "company-asc"){
        sortedJobs.sort((a,b) => a.company_name.localeCompare(b.company_name))
    }
    if(sortValue === "company-desc"){
        sortedJobs.sort((a,b) => b.company_name.localeCompare(a.company_name))
    }
    if(sortValue === "date-newest"){
        sortedJobs.sort((a,b) => new Date(b.applied_date) - new Date(a.applied_date))
    }
    if(sortValue === "date-oldest"){
        sortedJobs.sort((a,b) => new Date(a.applied_date) - new Date(b.applied_date))
    }

  return sortedJobs;
}
function updateDashboard(jobs){
    const count = {}

    jobs.forEach(job=> {
        if(count[job.status]  === undefined){
            count[job.status] = 0
        }
        count[job.status] += 1;
        console.log("count",count["Applied"]);
    })

    document.getElementById("totalJobs").textContent = jobs.length;
    document.getElementById("appliedJobs").textContent = count["Applied"];
    document.getElementById("interviewedJobs").textContent = count["Interview"];
    document.getElementById("offerJobs").textContent = count["Offer"];
    document.getElementById("rejectedJobs").textContent = count["Rejected"];

    console.log(count["Interview"])  

}
function filterByStatus(jobs){
    console.log("into filterByStatus");
    console.log("job" ,jobs);

    const filterValue = document.getElementById("searchByStatus").value;
    console.log("filterValue" + filterValue);

    const filteredJobs = jobs.filter(job =>{

        if (filterValue === "all"){
        return jobs
        }
        return filterValue === job.status
       
    })
    console.log("filteredJobs" ,filteredJobs);
    return filteredJobs;
    
}

function searchInput(jobs){

    console.log("searchInput: ",jobs)
    const searchValue = document.getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

    console.log("searchValue==>", searchValue);
    
    const filteredSearchJobs = jobs.filter(job =>{
        if(searchInput ==""){
            return jobs;
        }     

    return job.job_title.toLowerCase().includes(searchValue);
       
    });   
    return filteredSearchJobs;

}

function createJobCard(job){
    const fields = [
    ["Company Name", job.company_name],
    ["Job Title", job.job_title],
    ["Applied Date", job.applied_date],
    ["Status", job.status]
    ];
    
    const div = document.createElement("div");
    div.classList.add("job-card");
    
    fields.forEach(([label, value]) =>{
        div.appendChild(createParagraph(label, value))
    })

    const delete_button = document.createElement('button')
 
    delete_button.classList.add("deleteBtnCss")
    delete_button.textContent = "Delete";
    div.appendChild(delete_button)
    delete_button.addEventListener('click', ()=>{
        deletebtn(job.id)
    });

    const edit_Button = document.createElement("button");
    edit_Button.classList.add("editBtnCss")
    edit_Button.textContent = "Edit";
    div.appendChild(edit_Button);

    edit_Button.addEventListener("click", function () {
        console.log("job", job)
        openEditPopup(job);
    });

    const buttonGroup = document.createElement("div")
    buttonGroup.classList.add("button-group");

    buttonGroup.appendChild(delete_button);
    buttonGroup.appendChild(edit_Button);

    div.appendChild(buttonGroup);

    return div;
}

function createParagraph(label, value) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;

    p.appendChild(strong);
    p.append(value);

    return p;
}
 


function deletebtn(id){
    if (!confirm("Are you sure you want to delete this job?")) {
    return;
    }
    fetch('http://127.0.0.1:5000/jobs/'+id, {
    method: 'DELETE'
})
.then(response => response.json())
    .then(data => {
        console.log("id", id);
        loadJobs();
    });

}

let editJobId = null;
function openEditPopup(job){
    editJobId = job.id;
    const editPopup = document.getElementById("editPopup");

    document.getElementById("editCompanyName").value = job.company_name;
    document.getElementById("editJobTitle").value = job.job_title;
    document.getElementById("editAppliedDate").value = job.applied_date;
    document.getElementById("editStatus").value = job.status;

    editPopup.classList.remove("hidden");

    console.log("company name", job.company_name)
}

function hide(){
    document.getElementById("editPopup").classList.add("hidden");
   
}

function savebtn(){
    const compName = document.getElementById('editCompanyName').value;
    const JobTi = document.getElementById('editJobTitle').value;
    const date = document.getElementById('editAppliedDate').value;
    const status = document.getElementById('editStatus').value; 

     if(compName === ""|| JobTi === "" || date === ""){
        alert("Please fill out all required fields")
        return;
    } 
    const jobData = {
    company_name: compName,
    job_title: JobTi,
    applied_date: date,
    status: status
    };
    console.log("editJobId: "+ editJobId)

    fetch(`http://127.0.0.1:5000/jobs/${editJobId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Before updated");
        loadJobs();
        console.log("After updated");
    })
}



