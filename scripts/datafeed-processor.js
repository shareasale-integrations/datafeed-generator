window.addEventListener("load", () => {
    let fileInput = document.querySelector("#csvFileInput");
    let downloadBtn = document.querySelector(".download-container");
    let msgContainer = document.querySelector(".status-popup__message");
    let currentFile;
    let dfHead = ["SKU","Name","URL to product","Price","Retail Price","URL to image","URL to thumbnail image","Commission","Category","SubCategory","Description","SearchTerms","Status","Your MerchantID","Custom 1","Custom 2","Custom 3","Custom 4","Custom 5","Manufacturer","PartNumber","MerchantCategory","MerchantSubcategory","ShortDescription","ISBN","UPC","CrossSell","MerchantGroup","MerchantSubgroup","CompatibleWith","CompareTo","QuantityDiscount","Bestseller","AddToCartURL","ReviewsRSSURL","Option1","Option2","Option3","Option4","Option5","customCommissions","customCommissionIsFlatRate","customCommissionNewCustomerMultiplier","mobileURL","mobileImage","mobileThumbnail","ReservedForFutureUse","ReservedForFutureUse","ReservedForFutureUse","ReservedForFutureUse"];
    let dfHeadStores = ["SKU","Name","URL to product","Price","Retail Price","URL to image","URL to thumbnail image","Commission","Category","SubCategory","Description","SearchTerms","Status","Your MerchantID","Custom 1","Custom 2","Custom 3","Custom 4","Custom 5", "Store ID","Manufacturer","PartNumber","MerchantCategory","MerchantSubcategory","ShortDescription","ISBN","UPC","CrossSell","MerchantGroup","MerchantSubgroup","CompatibleWith","CompareTo","QuantityDiscount","Bestseller","AddToCartURL","ReviewsRSSURL","Option1","Option2","Option3","Option4","Option5","customCommissions","customCommissionIsFlatRate","customCommissionNewCustomerMultiplier","mobileURL","mobileImage","mobileThumbnail","ReservedForFutureUse","ReservedForFutureUse","ReservedForFutureUse","ReservedForFutureUse"];



    // Generate Datafeed File
    const generateDatafeed = (data, headersObj, siteURL) => {


        let feedHeader = isStoresConnect() ? dfHeadStores : dfHead;
        let datafeed = [feedHeader];
        if (shopifyHandler(data[0])) {
            data.forEach((row) => {
                if (row[7] != undefined && row[17] != undefined) {
                    if (row[7].toUpperCase() == "TRUE" && row[17] != ""
                    && (row[headersObj["SKU"]] != "" && row[headersObj["SKU"]] != undefined)
                    && (row[headersObj["URL to product"]] != "" && row[headersObj["URL to product"]] != undefined)
                    && (row[headersObj["Price"]] != "" && row[headersObj["Price"]] != undefined)) {
                        let newRow = [];
                        datafeed[0].forEach((headerItem) => {
                            switch (headerItem) {
                                case "URL to product":
                                    newRow.push(siteURL ? `${siteURL.substring(0, 4) == "http" ? siteURL : "https://" + siteURL}${row[headersObj[headerItem]]}` : "");
                                    break;
                                case "Description":
                                    newRow.push(row[headersObj[headerItem]] ? `"${sanitizeInputs(row[headersObj[headerItem]]).split('"').join(`""`)}"` : "");
                                    break;
                                case "Category":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                case "SubCategory":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                case "Your MerchantID":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                case "Store ID":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                default:
                                    newRow.push(row[headersObj[headerItem]] ? `"${sanitizeInputs(row[headersObj[headerItem]]).split('"').join(`""`)}"` : "");
                            }
                        });
                        datafeed.push(newRow);
                    }
                }
            });
        } else {
            data.forEach((row) => {
                    if (row.length > 0 && row != data[0] 
                        && (row[headersObj["SKU"]] != "" && row[headersObj["SKU"]] != undefined)
                        && (row[headersObj["URL to product"]] != "" && row[headersObj["URL to product"]] != undefined)
                        && (row[headersObj["Price"]] != "" && row[headersObj["Price"]] != undefined)) {
                        let newRow = [];
                        datafeed[0].forEach((headerItem) => {
                            switch (headerItem) {
                                case "URL to product":
                                    newRow.push(row[headersObj[headerItem]] ? `"${row[headersObj[headerItem]].split('"').join(`""`)}"` : "");
                                    break;
                                case "Description":
                                    newRow.push(row[headersObj[headerItem]] ? `"${sanitizeInputs(row[headersObj[headerItem]]).split('"').join(`""`)}"` : "");
                                    break;
                                case "Category":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                case "SubCategory":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                case "Your MerchantID":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                case "Store ID":
                                    newRow.push(headersObj[headerItem] || "");
                                    break;
                                default:
                                    newRow.push(row[headersObj[headerItem]] ? `"${sanitizeInputs(row[headersObj[headerItem]]).split('"').join(`""`)}"` : "");
                            }
                        });
                        datafeed.push(newRow);
                    }
            });
        }
        
        
        // Convert array to CSV string
        const csvContent = datafeed.map(row => row.join(",")).join("\n");
        
        // Create a Blob from the CSV string
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const date = new Date();
        let today = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}_${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}_${date.getFullYear()}`;
        
        // Use FileSaver.js to save the file
        saveAs(blob, `${headersObj["Your MerchantID"] ? headersObj["Your MerchantID"] : ""}datafeed-${today}.csv`);
    }

    // Generate headerObj
    const generateHeadersobj = (dataHeaders) => {
        let columns = {
            "SKU": "",
            "Name": "",
            "URL to product": "",
            "Price": "",
            "Retail Price": "",
            "URL to image": "",
            "URL to thumbnail image": "",
            "Commission": "",
            "Category": "",
            "SubCategory": "",
            "Description": "",
            "SearchTerms": "",
            "Status": "",
            "Your MerchantID": "",
            "Custom 1": "",
            "Custom 2": "",
            "Custom 3": "",
            "Custom 4": "",
            "Custom 5": "",
            "Manufacturer": "",
            "PartNumber": "",
            "MerchantCategory": "",
            "MerchantSubcategory": "",
            "ShortDescription": "",
            "ISBN": "",
            "UPC": "",
            "CrossSell": "",
            "MerchantGroup": "",
            "MerchantSubgroup": "",
            "CompatibleWith": "",
            "CompareTo": "",
            "QuantityDiscount": "",
            "Bestseller": "",
            "AddToCartURL": "",
            "ReviewsRSSURL": "",
            "Option1": "","Option2": "",
            "Option3": "",
            "Option4": "",
            "Option5": "",
            "customCommissions": "",
            "customCommissionIsFlatRate": "",
            "customCommissionNewCustomerMultiplier": "",
            "mobileURL": "",
            "mobileImage": "",
            "mobileThumbnail": "",
            "ReservedForFutureUse": "",
            "ReservedForFutureUse": "",
            "ReservedForFutureUse": "",
            "ReservedForFutureUse": ""
        };
        if (isStoresConnect()) {
            columns["Store ID"] = document.querySelector("#store-id").value != "" ? document.querySelector("#store-id").value : "";
        }

        let inputs = document.querySelectorAll(".user-form__input");
        let shopifyUrl = "";

        inputs.forEach((input) => {
            let inputValue = input.querySelector(".input") != null ? input.querySelector(".input").value : input.querySelector("select").options[input.querySelector("select").selectedIndex].value;
            let inputId = input.querySelector(".input") != null ? input.querySelector(".input").id : input.querySelector("select").id;

            switch (inputId) {
                case "merchant-id":
                    columns["Your MerchantID"] = inputValue;
                    break;
                case "site-url":
                    shopifyUrl = inputValue;
                    break;
                case "category":
                    columns["Category"] = Number(inputValue);
                    break;
                case "subcategory":
                    columns["SubCategory"] = Number(inputValue);
                    break;
                case "sku-column":
                    columns["SKU"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "name-column":
                    columns["Name"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "url-column":
                    columns["URL to product"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "price-column":
                    columns["Price"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "retail-price-column":
                    columns["Retail Price"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "image-column":
                    columns["URL to image"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "thumbnail-column":
                    columns["URL to thumbnail image"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "description-column":
                    columns["Description"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "search-terms-column":
                    columns["SearchTerms"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "status-column":
                    columns["Status"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "commission-column":
                    columns["Commission"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "custom-comm-rate-column":
                    columns["customCommissions"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "custom-comm-flat-column":
                    columns["customCommissionIsFlatRate"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "custom-1-column":
                    columns["Custom 1"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "custom-2-column":
                    columns["Custom 2"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "custom-3-column":
                    columns["Custom 3"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "custom-4-column":
                    columns["Custom 4"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "custom-5-column":
                    columns["Custom 5"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "manufacturer-column":
                    columns["Manufacturer"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "partnumber-column":
                    columns["PartNumber"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "merchantcategory-column":
                    columns["MerchantCategory"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "merchantsubcategory-column":
                    columns["MerchantSubcategory"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "shortdescription-column":
                    columns["ShortDescription"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "isbn-column":
                    columns["ISBN"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "upc-column":
                    columns["UPC"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "crosssell-column":
                    columns["CrossSell"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "merchantgroup-column":
                    columns["MerchantGroup"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "merchantsubgroup-column":
                    columns["MerchantSubgroup"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "compatiblewith-column":
                    columns["CompatibleWith"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "compareto-column":
                    columns["CompareTo"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "quantitydiscount-column":
                    columns["QuantityDiscount"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "bestseller-column":
                    columns["Bestseller"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "addtocarturl-column":
                    columns["AddToCartURL"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "reviewsrssurl-column":
                    columns["ReviewsRSSURL"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "option1-column":
                    columns["Option1"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "option2-column":
                    columns["Option2"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "option3-column":
                    columns["Option3"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "option4-column":
                    columns["Option4"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "option5-column":
                    columns["Option5"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "mobileurl-column":
                    columns["mobileURL"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "mobileimage-column":
                    columns["mobileImage"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "mobilethumbnail-column":
                    columns["mobileThumbnail"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
                case "customcommissionnewcustomermultiplier-column":
                    columns["customCommissionNewCustomerMultiplier"] = inputValue != "" ? dataHeaders.indexOf(inputValue) : "";
                    break;
            }
        });
        return [columns, shopifyUrl];
    }

    // Download Button event listener
    downloadBtn.addEventListener("click", () => {
        if(validateInputs()) {
            let headerArray = generateHeadersobj(currentFile[0]);
            generateDatafeed(currentFile, headerArray[0], headerArray[1]);
            handleMsg({
                el: msgContainer,
                message: "File Downloaded",
                error: false
            });
            setTimeout(() => {
                handleMsg({
                    el: msgContainer,
                    message: "",
                    error: false
                })
            }, 4500);
        } else {
            handleMsg({
                el: msgContainer,
                message: "Please select every mandatory inputs before downloading the file",
                error: true
            });
            setTimeout(() => {
                handleMsg({
                    el: msgContainer,
                    message: "",
                    error: false
                })
            }, 5500);
        }
        
    });

    // Handle message popup
    const handleMsg = (msgObj) => {
        if (msgObj.message != "") {
            msgObj.el.textContent = msgObj.message;
            msgObj.el.parentElement.classList.contains("status-popup_active") ? "" : msgObj.el.parentElement.classList.add("status-popup_active");
            if (msgObj.error) {
                msgObj.el.parentElement.classList.add("status-popup_error");
            } else {
                msgObj.el.parentElement.classList.remove("status-popup_error");
            }
        } else {
            msgObj.el.textContent = "";
            msgObj.el.parentElement.classList.remove("status-popup_error"), msgObj.el.parentElement.classList.remove("status-popup_active");
        }
    }

    // Validate Download
    const validateInputs = () => {
        let invalidInputs = 0;
        let inputs = document.querySelectorAll(".user-form__input_mandatory");
        inputs.forEach((input) => {
            let inputValue = input.querySelector(".input") != null ? input.querySelector(".input").value : input.querySelector("select").options[input.querySelector("select").selectedIndex].value;
            inputValue == "" ? invalidInputs++ : "";
        });
        return invalidInputs == 0 ? true : false;
    }

    // Is Shopify handler
    const shopifyHandler = (headers) => {
        let shopifyInput = document.querySelector(".user-form__input_shopify");
        let isShopify = false;
        if (headers.includes("Variant SKU") && headers.includes("Title") &&
        headers.includes("Handle") && headers.includes("Variant Price") &&
        headers.includes("Image Src") && headers.includes("Body (HTML)")) {
            isShopify = true;
        }
        isShopify ? 
        (shopifyInput.classList.remove("user-form__input_shopify_hide"), shopifyInput.classList.add("user-form__input_mandatory")) : 
        (shopifyInput.classList.add("user-form__input_shopify_hide"), shopifyInput.classList.remove("user-form__input_mandatory"));
        return isShopify;
    }

    const isStoresConnect = () => {
        let hasStores = false
        hasStores = document.querySelector("#storesconnect").classList.contains("user-form__input-field_checked") ? true : false;
        return hasStores;
    }

    const sanitizeInputs = (input) => {
        const regex1 = /\|/;
        const regex2 = /"(?![^<>]*>)/g;
        const str = input;
        const sanitize = str.replace(regex1, "/").replace(regex2, `''`);
        return sanitize;
    }

    // Get Headers Options
    const genHeadersOpt = (headersColumns) => {
        let isShopify = shopifyHandler(headersColumns);
        const columnsForm = document.querySelector("#datafeed-headers").querySelectorAll("select");
        let sortedHeaders = [];
        headersColumns.forEach((item) => sortedHeaders.push(item));
        let newEl = [];
        
        sortedHeaders.sort().forEach((hd) => {
            if (hd !=""){
                let newOption = document.createElement("option");
                newOption.value = hd, newOption.textContent = hd;
                newEl.push(newOption);
            }
        });

        let addingEl = `<option value="" selected="selected">Select one option</option>`;
        newEl.forEach((op) => {
            addingEl = `${addingEl}\n${op.outerHTML}`;
        });
        columnsForm.forEach((el) => {
            el.innerHTML = addingEl;
            if (isShopify) {
                el.options[el.selectedIndex].selected = false;
                switch (el.id) {
                    case "sku-column":
                        el.querySelectorAll("option").forEach((option) => {
                            option.value == "Variant SKU" ? option.selected = true : "";
                        });
                        break;
                    case "name-column":
                        el.querySelectorAll("option").forEach((option) => {
                            option.value == "Title" ? option.selected = true : "";
                        });
                        break;
                    case "url-column":
                        el.querySelectorAll("option").forEach((option) => {
                            option.value == "Handle" ? option.selected = true : "";
                        });
                        break;
                    case "price-column":
                        el.querySelectorAll("option").forEach((option) => {
                            option.value == "Variant Price" ? option.selected = true : "";
                        });
                        break;
                    case "image-column":
                        el.querySelectorAll("option").forEach((option) => {
                            option.value == "Image Src" ? option.selected = true : "";
                        });
                        break;
                    case "thumbnail-column":
                        el.querySelectorAll("option").forEach((option) => {
                            option.value == "Image Src" ? option.selected = true : "";
                        });
                        break;
                    case "description-column":
                        el.querySelectorAll("option").forEach((option) => {
                            option.value == "Body (HTML)" ? option.selected = true : "";
                        });
                        break;
                }
            }
        });
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvData = e.target.result;
                Papa.parse(csvData, {
                    complete: function(results) {
                        const data = results.data;
                        currentFile = data;
                        genHeadersOpt(data[0]);
                    },
                    header: false // Set to true if your CSV has headers
                });
            };
            reader.readAsText(file);
        }
    });

});
