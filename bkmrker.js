var bookmarks = []; //This is the data-storage variable, every piece of data will be stored in this variable
getFromStorage(bookmarks);
/**
  * This function will add whatever passed to it to the bookmarks variable,
  * that is acting as the data-storage variable for the extension
  */
function bookmark(str){
    getFromStorage(bookmarks);  // Update the local instance with the data in the local storage
    bookmarks.push(str);
    pushToStorage(bookmarks);   //Store the bookmarks in the local storage
}
/**
 * This function acts as a wrapper for the chrome.storage.sync.set() method
 */
function pushToStorage(bookmarks){
    chrome.storage.sync.set({"data": bookmarks});
    getFromStorage(bookmarks);
}

/**
 * This function acts as a wrapper around chrome.storage.sync.get() method
 * it assigns the object named data in the storage to the bookmarks variable
 * which is the object that is supposed to be the current instance of the storage
 */
function getFromStorage(){
    chrome.storage.sync.get("data", function(theData){
        console.log("Value of the theData", theData);
        console.log("Value of the theData.data", theData.data);
        if (theData.data != undefined){
            bookmarks = theData.data;
        }
        console.log("The bookmarks variable updated from the storage",
                                                                    bookmarks);
    });
}

/**
 * This function will validate if the URL passed to it is a valid
 * youtube url or not
 */
function validateYouTubeURL(url){
    var regex =
           /^(((https:\/\/)|(http:\/\/))(www\.)?((youtube\.com)|(youtu.be)))/ig;
    return regex.test(url);
}

/**
 * This function will iterate over each of the youtube urls stored in storage
 * and call a function given that as an argument
 * So, the iterator will call the function x times where x = no of urls stored
 *
 * ONLY OF USE TO DEVELOPERS :P
 */
function iterator(callback){
    for(var obj in bookmarks){
        callback(obj[0]);
    }
}

//================================= Main Action ================================

 /**
 * The main function where all other functions and other statements are executed
 * It is an event-listener
 */
chrome.browserAction.onClicked.addListener(function(tab){
    var notification = {};
    notification.invalid = {
        "type": "progress",
        "iconUrl": "youtube-bkmrker.png",
        "title": "YouTube-bkmrker",
        "message": tab.url + " is not a YouTube URL :("
    }

    notification.success = {
        "type": "progress",
        "iconUrl": "youtube-bkmrker.png",
        "title": "YouTube-bkmrker",
        "message": tab.title + " has been bookmarked :)"
    }
    console.log("Clicked");
    if (validateYouTubeURL(tab.url)){
        var tabDetails = [tab.url, tab.title];
        bookmark(tabDetails);
        chrome.notifications.create(null, notification.success);
    }
    else{
        console.log("The current webpage is not the youtube website, \
                     please try the official youtube website\
                      https://www.youtube.com");
        chrome.notifications.create(notification.invalid)
    }

    url = "http://yt.fierybit.com/?"

    for( var obj in bookmarks){
        reg = /https:\/\/www\.youtube\.com\/watch\?v=(.+)/i;
        url = url + "id=" + bookmarks[obj][0].match(reg)[1] + "&";
    }

    console.log(url);
});
