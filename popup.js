document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            document.getElementById('data').innerText = 'Error querying tabs';
            return;
        }

        chrome.tabs.sendMessage(tabs[0].id, {action: "fetchDropdownData"}, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                document.getElementById('data').innerText = 'Error sending message to content script';
                return;
            }

            if (response && response.result) {
                document.getElementById('data').innerText = response.result;
            } else {
                console.error('Response is undefined or has no result:', response);
                document.getElementById('data').innerText = 'No data found';
            }
        });
    });

    document.getElementById('copyButton').addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "copyCollectionText"}, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    document.getElementById('data').innerText = 'Error sending message to content script';
                    return;
                }

                if (response && response.result) {
                    document.getElementById('data').innerText = response.result;
                } else {
                    console.error('Response is undefined or has no result:', response);
                    document.getElementById('data').innerText = 'Element not found';
                }
            });
        });
    });
});