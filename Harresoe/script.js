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
    const filterLabelId = "filterLabel";
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

        const filterLabel = document.getElementById(filterLabelId);
        filterLabel.innerText = "Size filter ("+ numberOfRemovedItems +" items removed)";
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
        checkbox.onchange = filterSizes;
    
        const smallCheckboxLabel = document.createElement("label");
        smallCheckboxLabel.htmlFor = element;
        smallCheckboxLabel.innerText = element;
    
        checkboxContainer.append(...[checkbox, smallCheckboxLabel]);
        stringSizeFieldset.append(checkboxContainer); 
    });

    clothingContainer.prepend(stringSizeFieldset);

    // Adding filter button UI element
    const filteringLabel = document.createElement("label");
    filteringLabel.id = filterLabelId;
    filteringLabel.innerText = "Size filter (0 items removed)";
    filteringLabel.style.backgroundColor = "#484744";
    filteringLabel.style.border = "none";
    filteringLabel.style.color = "white";
    filteringLabel.style.textAlign = "center";
    filteringLabel.style.textDecoration = "none";
    filteringLabel.style.fontSize = "18px";
    filteringLabel.style.display = "inline-block";
    filteringLabel.style.marginBottom = "20px";
    filteringLabel.style.padding = "10px";
    filteringLabel.style.width = "350px";

    clothingContainer.prepend(filteringLabel);
})();