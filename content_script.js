function fetchDropdownOptions(dropdownId) {
    let dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        let options = Array.from(dropdown.options).map(option => option.text);
        return options;
    } else {
        return [];
    }
}

function traverseDropdowns(dropdownId, level = 0) {
    let options = fetchDropdownOptions(dropdownId);
    let result = {};
    options.forEach((option, index) => {
        let nextDropdownId = `browseOptions${level + 1}`;
        result[option] = traverseDropdowns(nextDropdownId, level + 1);
    });
    return result;
}

function fetchDropdownData() {
    let schema = traverseDropdowns("browseOptions0");
    return JSON.stringify(schema, null, 2);
}

function copyCollectionText() {
    console.log("copyCollectionText called");
    return document.documentElement.outerHTML;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.action === "fetchDropdownData") {
        let data = fetchDropdownData();
        console.log('Data fetched:', data);
        sendResponse({result: data});
    } else if (request.action === "copyCollectionText") {
        console.log("copyCollectionText action received");
        let text = copyCollectionText();
        sendResponse({result: text});
    }
});