function SaveToFile_SaveFileToDownloadFolder(fileNameArg, dataArg) {
    // usual save function, will save with filename in download folder
    var link = document.createElement('a');
    link.download = fileNameArg;
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(dataArg)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function SaveToFile_SaveFile(fileNameArg, dataArg, instance, callBack) {

    // save to user choosen folder and filename
    //!!!! BEWARE FUNCTION WILL RETURN BEFORE THE FILE IS WRITTEN BECAUSE FUNCTION IS WAITING FOR USER INPUT
    //NON REENTRANT CODE !!!!

    window.SaveDataToFile_DataToSave = dataArg;
    window.SaveDataToFile_FileName = fileNameArg;
    window.SaveDataToFile_CallBack = callBack;
    window.SaveDataToFile_Instance = instance;

    const saveBtn = document.createElement('button');

    saveBtn.addEventListener("click", function () {
        SaveToFile_PerformSaveDataToFile(); // Make the job
    });

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 20
    });

    saveBtn.dispatchEvent(evt);
}


async function SaveToFile_PerformSaveDataToFile() {

    const options = {
        suggestedName: window.SaveDataToFile_FileName
    };

    try {
        const handle = await window.showSaveFilePicker(options);

        await SaveToFile_WriteFile(handle, window.SaveDataToFile_DataToSave);
        alert("Données sauvées dans : " + handle.name);
    }
    catch (err) {
        alert("Erreur ou Annulation par l'utilisateur : " + err);
    }

    SaveDataToFile_Instance.invokeMethodAsync(SaveDataToFile_CallBack);

    delete window.SaveDataToFile_DataToSave;
    delete window.SaveDataToFile_FileName;
    delete window.SaveDataToFile_CallBack ;
    delete window.SaveDataToFile_Instance ;

}

// fileHandle is an instance of FileSystemFileHandle..
async function SaveToFile_WriteFile(fileHandle, contents) {

    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}