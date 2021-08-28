// ==UserScript==
// @name         Harresø size filtering
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Size filtering for Harresø
// @author       Kristian Holm Sejersen
// @match        https://harresoe.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const buttonId = "filterButton";
    let isFiltered = false;

    // Your code here...
    const toggleItemVisibility = function(node) {
        if(!node) return;
        node.style.display = node.style.display === "none" ? "block" : "none";
    };

    const filterSizes = function() {
        const clothingitems = document.querySelectorAll("#collection-product-repeat .col-sm-4");
        let numberOfRemovedItems = 0;

        for (const item of clothingitems) {
            const sizeContainer = item.getElementsByClassName("sizes")[0];

            if (!sizeContainer) {
                continue;
            }

            let sizeMatch = false;
            const sizes = sizeContainer.children;
            
            for (const size of sizes) {
                    const actualSize = size.innerHTML.toLocaleLowerCase();

                    if(actualSize == "s" || actualSize == "29" || actualSize == "30" || actualSize == "44") {
                        sizeMatch = true;
                    }
            }

            if (!sizeMatch) {
                toggleItemVisibility(item);
                numberOfRemovedItems++;
            }
        }

        isFiltered = !isFiltered;

        const button = document.getElementById(buttonId);
        button.innerText = "Filter for my sizes (" + isFiltered + (isFiltered ? " " + numberOfRemovedItems : "") + ")";
    };

    // Adding UI elements
    const clothingContainer = document.getElementById("collection-product-repeat");
    
    const button = document.createElement("button");
    button.id = buttonId;
    button.innerText = "Filter for my sizes (" + isFiltered + ")";
    button.style.backgroundColor = "#957DAD";
    button.style.border = "none";
    button.style.color = "white";
    button.style.textAlign = "center";
    button.style.textDecoration = "none";
    button.style.fontSize = "20px";
    button.style.display = "inline-block";
    button.style.marginBottom = "20px";
    button.style.padding = "15px";
    button.style.width = "300px";
    button.style.borderRadius = "30px";
    button.onclick = filterSizes;

    clothingContainer.prepend(button);
})();