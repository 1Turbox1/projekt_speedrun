/*
ZADANIA TURBOXA

zad 1 done (1 pkt) Aplikacja na początkowej stronie powinna wyświetlić pierwsze 30 dostępnych Newsów z API z możliwością przechodzenia dalej
zad 2 done (1 pkt) Aplikacja ma mieć możliwość ustawienia pobrania konkretnej ilości Newsów z API z możliwością przechodzenia dalej
zad 3 done (1 pkt) Aplikacja powinna wyświetlać newsy zaczynając od najnowszego z nich
zad 4 done (1 pkt) Opcja wyboru sortowanie newsów od najlepiej ocenianych newsów
zad 5 done (2 pkt) Każdy z newsów powinien składać się z następujących elementów:
        o    (1 pkt) Tytuł
        o    (1 pkt) Link jako odnośnik do tytułu
zad 6 done (1 pkt) Po kliknięciu na news aplikacja powinna przekierować nas na stronę podaną w linku

zad 7 done (2 pkt) Każdy z newsów powinien zawierać przycisk hide w celu ukrycia newsa
zad 8 done (2 pkt) Każdy z newsów powinien zawierać strzałkę w celu głosowania na dany news (strzałka zmienia kolor na zielony po kliknięciu)
*/

const colorChanger = (postId) => {
    const postIdUpvote = document.getElementById(postId + "upvote");
    if (!postIdUpvote.classList.contains('upvote-green')) 
        postIdUpvote.classList.add('upvote-green');
    else 
        postIdUpvote.classList.remove('upvote-green');
};

const calculateTimeDifference = (date) => {
    const currentDate = new Date()
    const unixCurrDate = Math.floor(currentDate.getTime() / 1000)
    return unixCurrDate - date;
};

const makeVerbalDate = (date) => {
    const timeDifference = calculateTimeDifference(date);

    if (timeDifference < 60)
        return timeDifference + ' seconds ago'
    else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60)
        return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago'
    } 
    else if (timeDifference < 86400) {
        const hours = Math.floor(timeDifference / 3600)
        return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago'
    } 
    else if (timeDifference < 604800) {
        const days = Math.floor(timeDifference / 86400)
        return days + ' day' + (days > 1 ? 's' : '') + ' ago'
    } 
    else if (timeDifference < 2592000) {
        const weeks = Math.floor(timeDifference / 604800)
        return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago'
    } 
    else if (timeDifference < 31536000) {
        const months = Math.floor(timeDifference / 2592000)
        return months + ' month' + (months > 1 ? 's' : '') + ' ago'
    } 
    else {
        const years = Math.floor(timeDifference / 31536000)
        return years + ' year' + (years > 1 ? 's' : '') + ' ago'
    }
};

const extractBaseDomain = (url) => {
    if (url == undefined)
        return ""
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.').reverse();
    const baseDomain = parts[1] + '.' + parts[0]
    return baseDomain;
}

const hidePost = (postId) => {
    const liElement = document.getElementById(postId);
    liElement.remove();
}

const insertPost = (postId, title, titleLink, siteLinkName, siteLinkHref, userName, points, userLink, date, dateLink, commentsLink, commentsCount) => {
    let olElementt = document.querySelector('ol');
    olElementt.start = previousPostCount + 1;
    let postHtml = ``
    if (siteLinkName) {
        postHtml = `
        <li id="` + postId + `">
            <div class="title-line">
                <div class="upvote" id="` + postId + `upvote" onclick="colorChanger(`+postId+`)"></div>
                <a href="` + titleLink + `" class="post-title">` + title + `</a>
                <span class="site-link"> (<a href="` + siteLinkHref + `">
                    <span class="site-link">` + siteLinkName + `</span></a>)
                </span>
            </div>
            <div class="undertitle-data">
                <span id="2">&emsp;` + points + ` points</span> by <a href="` + userLink + `">` + userName + `</a>
                <span title="` + date + `">
                    <a href="` + dateLink + `">` + makeVerbalDate(date) + `</a>
                </span>
                <span id="unv_` + postId + `"></span> | <a href="#" onclick="hidePost('` + postId + `')">hide</a> | 
                <a href="` + commentsLink + `">` + commentsCount + `&nbsp;comments</a>
            </div>
        </li>
        `;
    } else {
        postHtml = `
        <li id="` + postId + `">
            <div class="title-line">
                <div class="upvote" id="` + postId + `upvote" onclick="colorChanger(`+postId+`)"></div>
                <a href="` + titleLink + `" class="post-title">` + title + `</a>
            </div>
            <div class="undertitle-data">
                <span id="2">&emsp;` + points + ` points</span> by <a href="` + userLink + `">` + userName + `</a>
                <span title="` + date + `">
                    <a href="` + dateLink + `">` + makeVerbalDate(date) + `</a>
                </span>
                <span id="unv_` + postId + `"></span> | <a href="#" onclick="hidePost('` + postId + `')">hide</a> | 
                <a href="` + commentsLink + `">` + commentsCount + `&nbsp;comments</a>
            </div>
        </li>
        `;
    }


    const olElement = document.querySelector('ol');
    if (olElement)
        olElement.insertAdjacentHTML('afterbegin', postHtml)
    else
        console.error('No <ol> tag found in the document.');
}

const fetchStoryDetails = (storyId) => {
    return fetch("https://hacker-news.firebaseio.com/v0/item/" + storyId + ".json?print=pretty")
        .then((response) => response.json())
        .catch((error) => {
            console.error("Error fetching IDs: ", error)
        });
};

const getTopNewStories = (type = undefined, count = 30, showMore = false) => {
    const validTypes = ['top', 'new', 'best'];
    if (!validTypes.includes(type))
        return Promise.reject(new Error('Invalid type'));
    if (showMore)
        previousPostCount += parseFloat(count);
    else
        previousPostCount = 0

    return fetch('https://hacker-news.firebaseio.com/v0/' + type + 'stories.json?print=pretty')
        .then((response) => response.json())
        .then((storyIds) => {
            const topStoryIds = storyIds.slice(previousPostCount, previousPostCount + parseFloat(count)).reverse();
            const storyPromises = topStoryIds.map((storyId) => fetchStoryDetails(storyId));
            return Promise.all(storyPromises);
        })
        .catch((error) => {
            console.error('Error fetching top new stories: ', error);
            return [];
        });
};

const removeAllStories = () => {
    const allLiTags = document.querySelectorAll('li');
    allLiTags.forEach(li => {
        li.remove();
    });
}

const showStories = (storiesDictionary) => {
    storiesDictionary.forEach((story) => {
        let titleLink = story.url
        let postId = story.id;
        let baseDomain = extractBaseDomain(titleLink);
        let siteLinkHref, siteLinkName;

        if (baseDomain == '') {
            siteLinkHref = 'https://news.ycombinator.com/from?site=' + postId;
            siteLinkName = false;
            titleLink = "https://news.ycombinator.com/item?id=" + postId;
        } else {
            siteLinkHref = 'https://news.ycombinator.com/from?site=' + baseDomain;
            siteLinkName = baseDomain;
        }

        let title = story.title;
        let userName = story.by
        let points = story.score
        let userLink = "https://news.ycombinator.com/user?id=" + userName;
        let date = story.time
        let dateLink = "https://news.ycombinator.com/item?id=" + postId;
        let commentsLink = "https://news.ycombinator.com/item?id=" + postId
        let commentsCount = story.descendants

        insertPost(postId, title, titleLink, siteLinkName, siteLinkHref, userName, points, userLink, date, dateLink, commentsLink, commentsCount);
    })
}

const setRun = (type, count, showMore = false) => {
    if (type == undefined)
        type = storyType;
    else
        storyType = type
    numberOfStories = count
    if (!showMore)
        getTopNewStories(storyType, numberOfStories)
            .then((stories) => {
                return stories
            })
            .then((stories) => {
                removeAllStories()
                showStories(stories)
            })
            .catch((error) => {
                console.error("Error: ", error)
            });
    else    
        getTopNewStories(storyType, numberOfStories, showMore)
        .then((stories) => {
            return stories
        })
        .then((stories) => {
            removeAllStories()
            showStories(stories)
        })
        .catch((error) => {
            console.error("Error: ", error)
        });
}

// 'new' jest defaultowy
var storyType = 'new'
var numberOfStories = 30;
var previousPostCount = 0;
setRun(storyType, numberOfStories)