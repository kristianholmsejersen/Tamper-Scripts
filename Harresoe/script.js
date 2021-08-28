// ==UserScript==
// @name         Harresø size filtering
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Size filtering for Harresø
// @author       Kristian Holm Sejersen
// @match        https://harresoe.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const clothingSelector = "#collection-product-repeat .col-sm-4";
    const buttonId = "filterButton";
    const fieldsetId = "sizeInput";
    
    const availableSizes = new Set();

    // Your code here...
    const filterSizes = function() {
        const selectedSizes = document.querySelectorAll("#sizeInput > div > input:checked");
        const sizeInput = Array.from(selectedSizes).map(x => x.value);
        const shouldFilter = sizeInput.length > 0;

        const clothingitems = document.querySelectorAll(clothingSelector);
        let numberOfRemovedItems = 0;

        for (const item of clothingitems) {
            if(shouldFilter) {
                const sizeContainer = item.getElementsByClassName("sizes")[0];

                if (!sizeContainer) {
                    continue;
                }

                let sizeMatch = false;
                const sizes = sizeContainer.children;
                
                for (const size of sizes) {
                        const actualSize = size.innerHTML.toLocaleLowerCase();

                        if(sizeInput.includes(actualSize)) {
                            sizeMatch = true;
                            break;
                        }
                }

                if (!sizeMatch) {
                    item.style.display = "none";
                    numberOfRemovedItems++;
                }
                else {
                    item.style.display = "block";
                }
            }
            else {
                item.style.display = "block";
            }
        }

        const button = document.getElementById(buttonId);
        button.innerText = "Filter for my sizes ("+ numberOfRemovedItems +" removed)";
    };

    const extractAvailableSizes = function() {
        const clothingitems = document.querySelectorAll(clothingSelector);

        for (const item of clothingitems) {
            const sizeContainer = item.getElementsByClassName("sizes")[0];

            if (!sizeContainer) {
                continue;
            }

            const sizes = sizeContainer.children;
            
            for (const size of sizes) {
                const actualSize = size.innerHTML.toLocaleLowerCase();
                availableSizes.add(actualSize);
            }
        }
    };

    // Extract available sizes on the page
    extractAvailableSizes();

    // Adding filtering input elements
    const clothingContainer = document.getElementById("collection-product-repeat");

    const stringSizeFieldset = document.createElement("fieldset");
    stringSizeFieldset.id = fieldsetId;
    stringSizeFieldset.style.marginBottom = "20px";
    stringSizeFieldset.style.display = "flex";
    stringSizeFieldset.style.flexWrap = "wrap";
    stringSizeFieldset.style.justifyContent = "space-evenly";

    const availableSizesArray = Array.from(availableSizes);
    availableSizesArray.sort();
    availableSizesArray.forEach(element => {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.style.flex = "auto";
        checkboxContainer.style.padding = "10px";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = element;
        checkbox.value = element;
    
        const smallCheckboxLabel = document.createElement("label");
        smallCheckboxLabel.htmlFor = element;
        smallCheckboxLabel.innerText = element;
    
        checkboxContainer.append(...[checkbox, smallCheckboxLabel]);
        stringSizeFieldset.append(checkboxContainer); 
    });

    clothingContainer.prepend(stringSizeFieldset);

    // Adding filter button UI element
    const button = document.createElement("button");
    button.id = buttonId;
    button.innerText = "Filter for my sizes (0 removed)";
    button.style.backgroundColor = "#957DAD";
    button.style.border = "none";
    button.style.color = "white";
    button.style.textAlign = "center";
    button.style.textDecoration = "none";
    button.style.fontSize = "20px";
    button.style.display = "inline-block";
    button.style.marginBottom = "20px";
    button.style.padding = "15px";
    button.style.width = "350px";
    button.style.borderRadius = "30px";
    button.onclick = filterSizes;

    clothingContainer.prepend(button);
})();