function  addJobButton(event) {
    console.log("script loaded");
    event.preventDefault();
    const compName = document.getElementById('companyName').value;
    const JobTi = document.getElementById('jobTitle').value;
    const date = document.getElementById('selectDate').value;
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
function loadJobs(){
    const displayJobApplications = document.getElementById("displayJobApplications");
    
    fetch("http://127.0.0.1:5000/jobs")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayJobApplications.innerHTML = "";

        data.forEach(job => {
            console.log("creating", job);
            const card = createJobCard(job);
            console.log("card" + card)
            displayJobApplications.appendChild(card);
            
        });
        console.log("finished loading jobs");
    })
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
    delete_button.className = "deleteBtnCss"
    delete_button.textContent = "Delete";
    div.appendChild(delete_button)
    delete_button.addEventListener('click', ()=>{
        alert("Job has been deleted successfully!")
        deletebtn(job.id)
    });

    const editButton = document.createElement("button");
    editButton.className = "editBtnCss"
    editButton.textContent = "Edit";
    div.appendChild(editButton);

    editButton.addEventListener("click", function () {
        console.log("job", job)
        openEditPopup(job);
    });

    return div;
}

function createParagraph(label, value) {
    const p = document.createElement("p");
    p.textContent = label + ": " + value;
    return p;
}
 
document.getElementById("inputForm").addEventListener("submit", addJobButton);
loadJobs();

function deletebtn(id){
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
