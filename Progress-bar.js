const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");
const previewButton = document.getElementById("vista-previa");
// Se establece que al dar click al cuadro, se ejecuta un click en el input
form.addEventListener("click", () =>{
  fileInput.click();
});
/*En esta parte del codigo se establece el tamano del nombre.
Asi mismo se establece el modo en el cual se suben los archivos (Array para una serie de archivos o un archivo a la vez)*/
fileInput.onchange = ({target})=>{
  const file = target.files[0]; 
  let fileName = file.name;
  if(fileName.length >= 12){
    let splitName = fileName.split('.');
    fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
  }
  uploadFile(fileName, file); 
};
//Eventos de drag and drop
form.addEventListener("dragover", (event) => {
  event.preventDefault();
  form.classList.add("dragover"); 
});
form.addEventListener("dragenter", (event) => {
  event.preventDefault();
  form.classList.add("dragover"); 
});
form.addEventListener("dragleave", () => {
  form.classList.remove("dragover");
});
form.addEventListener("drop", (event) => {
  event.preventDefault();
  form.classList.remove("dragover"); 
  const files = event.dataTransfer.files;
  Array.from(files).forEach(file => {
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName);
  });
});
/*En el siguiente codigo se encuentra la logica de subida de archivos*/ 
function uploadFile(name){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "#");
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if(loaded == total){
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
      let successMessage = document.createElement("div");
      successMessage.classList.add("success-message");
      /*El mensaje que aparece en la parte superior derecha*/ 
      successMessage.textContent = "Archivo subido con exito";
      document.body.appendChild(successMessage);
    
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 2000); 
    }
  });
  if (uploadedArea.children.length === 0) {
    document.getElementById("vista-previa").style.display = "block";
  }
  let data = new FormData(form);
  xhr.send(data);
}
/*La logica detras de la previsualizacion de archivos*/ 
previewButton.addEventListener("click", () => {
  for (const archivo of fileInput.files) {
    window.open(URL.createObjectURL(archivo), '_blank');
  }
});