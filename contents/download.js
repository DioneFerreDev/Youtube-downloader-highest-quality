document.addEventListener("DOMContentLoaded", downloadHandle);


function downloadHandle() {

    const myForm = document.getElementById("myForm");
    myForm.addEventListener("submit", handleVideo)
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


