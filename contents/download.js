document.addEventListener("DOMContentLoaded", downloadHandle);


function downloadHandle() {

    const myForm = document.getElementById("myForm");
    const cancel = document.getElementById("cancel");
    const download = document.getElementById("download-now");
    myForm.addEventListener("submit", handleVideo)
    download.addEventListener("click", handleDownloading);
    cancel.addEventListener("click", () => {
        const overlay = document.getElementById("overlay");
        const iframe = document.getElementById("iframe");
        iframe.src = "";
        overlay.classList.remove("show");
        overlay.classList.add("hide");
    })
}
async function handleDownloading(){
    const iframe = document.getElementById("iframe");
    const link = {url: iframe.src}
    const linkStringfied = JSON.stringify(link);
    const options  = {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body:linkStringfied
    }
    try {
        fetch("/api/download-now",options).then(res => res.json())
        .then(data => {alert(data.message)})
        
    } catch (error) {console.log(error)}
}
async function handleVideo(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const url = form.action;
    const method = form.method;

    try {
        const formData = new FormData(form)
        // convertendo os valores para json e depois strings para passar no body
        const plainFormData = Object.fromEntries(formData.entries());        
        const formDataJsonString = JSON.stringify(plainFormData);
        
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: formDataJsonString
        }

        const res = await fetch(url, options);
        const data = await res.json();
        if(data.ok){
            const overlay = document.getElementById("overlay");
            // overlay.classList.remove("hide");
            const iframe = document.getElementById("iframe");
            console.log(data.info.videoDetails.embed.iframeUrl)
            iframe.src = data.info.videoDetails.embed.iframeUrl
            overlay.classList.add("show");
        }
    } catch (error) {console.log(error)}
}


