window.addEventListener("load", () => {
    let uploadContainer = document.querySelector(".upload-container");
    let uploadBtn = uploadContainer.querySelector(".upload-container__upload");
    let resetBtn = uploadContainer.querySelector(".remove-container");
    let inputBtn = uploadContainer.querySelector("#csvFileInput");
    let downloadBtn = uploadContainer.querySelector(".download-container");
    let messageContainer = uploadContainer.querySelector(".upload-container__message");
    let shopifyInput = document.querySelector(".user-form__input_shopify");
    let dfHeaders = document.querySelector(".datafeed-information_headers").querySelectorAll("select");
    let storeCheck = document.querySelector("#storesconnect");
    let storeIDInput = document.querySelector(".user-form__input_storesconnect");

    let helpPopup = document.querySelector(".help-popup");
    let helpOpen = helpPopup.querySelector(".help-button_open");
    let helpClose = helpPopup.querySelector(".help-button_close");

    helpOpen.addEventListener("click", () => {
        helpPopup.classList.add("help-popup_active");
    });
    helpClose.addEventListener("click", () => {
        helpPopup.classList.remove("help-popup_active");
    });

    uploadBtn.addEventListener("click", () => {
        inputBtn.value == "" ? inputBtn.click() : handleMessage(messageContainer, "You already have a file uploaded, please use the refresh button before uploading a new file", true);
    });

    downloadBtn.addEventListener("click", () => {
        inputBtn.value == "" ? handleMessage(messageContainer, "Please add a file to start processing your datafeed", true) : "";
    });

    storeCheck.addEventListener("click", () => {
        storeCheck.classList.toggle("user-form__input-field_checked");
        storeIDInput.classList.toggle("user-form__input_storesconnect_hide");
        storeIDInput.classList.toggle("user-form__input_mandatory");
    });

    resetBtn.addEventListener("click", () => {
        document.querySelector(`#category option`).selected = true;
        document.querySelector(`#subcategory option`).selected = true;
        inputBtn.value = "";
        (shopifyInput.classList.add("user-form__input_shopify_hide"), shopifyInput.classList.remove("user-form__input_mandatory"));
        dfHeaders.forEach((select) => select.innerHTML = "");
        handleMessage(messageContainer, "File Removed", false);
    });

    inputBtn.addEventListener("change", () => {
        inputBtn.value == "" ? "" : handleMessage(messageContainer, "File Uploaded", false);
    })

    const handleMessage = (container, message, error) => {
        error ? container.classList.add("error") : container.classList.remove("error");
        let secs = error ? 3500 : 2000;
        container.textContent = message;
        if (container.textContent != "") {
            setTimeout(()=>{
                handleMessage(messageContainer, "", false);
            }, secs);
        }
    }
});
