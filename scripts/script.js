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



////////////////////////////////////////////
// Args:
//        postId: ID of the post <li> element
// Description: Changes the color of the upvote
////////////////////////////////////////////
const colorChanger = (postId) => {
    const postIdUpvote = document.getElementById(postId + "upvote");
    if (!postIdUpvote.classList.contains('upvote-green'))
        postIdUpvote.classList.add('upvote-green');
    else
        postIdUpvote.classList.remove('upvote-green');
};

////////////////////////////////////////////
// Args:
//        date: a Unix timestamp
// Description: calculates the difference between the provided timestamp and today's timestamp ( so earlier time minus now )
// Returns:
//        the time difference
////////////////////////////////////////////
const calculateTimeDifference = (date) => {
    const currentDate = new Date()
    const unixCurrDate = Math.floor(currentDate.getTime() / 1000)
    return unixCurrDate - date;
};

////////////////////////////////////////////
// Args:
//        date: a Unix timestamp
// Description: converts a Unix timestamp into a description of the time difference
// Returns:
//   description of the time difference (for exm. 3 weeks ago)
////////////////////////////////////////////
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

////////////////////////////////////////////
// Args:
//        url: a string of the url
// Description: extracts the base domain from the url
// Returns:
//        if successful, returns the base domain. Otherwise an empty string.
////////////////////////////////////////////
const extractBaseDomain = (url) => {
    if (url == undefined)
        return ""
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.').reverse();
    const baseDomain = parts[1] + '.' + parts[0]
    return baseDomain;
}

////////////////////////////////////////////
// Args:
//        postId: ID of the post <li> to hide
// Description: hides a post by removing it
////////////////////////////////////////////
const hidePost = (postId) => {
    const liElement = document.getElementById(postId);
    liElement.remove();
}

////////////////////////////////////////////
// Args:
//        postId: Id of the post
//        title: title of the post
//        titleLink: link in the title of the post
//        siteLinkName: the base domain from the url as text from siteLinkHref
//        siteLinkHref: url for the site link
//        userName: name of the user
//        points: Number of updooties for the post
//        userLink: link to the user's profile
//        date: date of the post's creation ( you need to hover over it to see it )
//        dateLink: link of the post 
//        commentsLink: link for the comments' in this post
//        commentsCount: number of comments
// Description: inserts a post into the HTML document
////////////////////////////////////////////
const insertPost = (postId, title, titleLink, siteLinkName, siteLinkHref, userName, points, userLink, date, dateLink, commentsLink, commentsCount) => {
    let olElement = document.querySelector('ol');
    olElement.start = previousPostCount + 1;
    let postHtml = ``
    if (siteLinkName) {
        postHtml = `
        <li id="` + postId + `">
            <div class="title-line">
                <div class="upvote" id="` + postId + `upvote" onclick="colorChanger(` + postId + `)"></div>
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
                <div class="upvote" id="` + postId + `upvote" onclick="colorChanger(` + postId + `)"></div>
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
    olElement.insertAdjacentHTML('afterbegin', postHtml)
}

////////////////////////////////////////////
// Args:
//        storyId: type of posts to fetch
// Description: fetches JSON from Hackernews API
// Returns:
//        a promise that sends the JSON response or catches errors
////////////////////////////////////////////
const fetchStoryDetails = (storyId) => {
    return fetch("https://hacker-news.firebaseio.com/v0/item/" + storyId + ".json?print=pretty")
        .then((response) => response.json())
        .catch((error) => {
            console.error("Error fetching IDs: ", error)
        });
};


////////////////////////////////////////////
// Args:
//        type: type of posts ('top', 'new', 'best') - deafaults to undefined
//        count: number of posts to retrieve - defaults to 30
//        showMore: boolean indicating whether to show more stories (slices from x posts to y posts, for example 30 <-> 60), depends on count parameter
// Description: gets top, new, or best posts from Hackernews API based on the type and count
// Returns:
//        an array full of dicstionaries (JSON)
////////////////////////////////////////////
const getTopNewStories = (type = undefined, count = 30, showMore = false) => {
    const validTypes = ['top', 'new', 'best', 'ask', 'job'];
    if (!validTypes.includes(type))
        return Promise.reject(new Error('Invalid type'));
    if (showMore)
        previousPostCount += parseFloat(count);
    else
        previousPostCount = 0;

    return fetch('https://hacker-news.firebaseio.com/v0/' + type + 'stories.json?print=pretty')
        .then((response) => response.json())
        .then((storyIds) => {
            const topStoryIds = storyIds.slice(previousPostCount, previousPostCount + parseFloat(count)).reverse();
            const storyPromises = topStoryIds.map((storyId) => fetchStoryDetails(storyId));
            return Promise.all(storyPromises);
        })
        .catch((error) => {
            console.error('Error fetching stories: ', error);
            return [];
        });
};


////////////////////////////////////////////
// Description: removes all 'li' tags from the document
////////////////////////////////////////////
const removeAllStories = () => {
    const allLiTags = document.querySelectorAll('li');
    allLiTags.forEach(li => {
        li.remove();
    });
}


////////////////////////////////////////////
// Description: removes all tags used for statistics from the document
////////////////////////////////////////////
const removeStatistics = () => {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.remove();
    });
    const h3s = document.querySelectorAll('h3');
    h3s.forEach(h3 => {
        h3.remove();
    });
}

////////////////////////////////////////////
// Args:
//        storiesDictionary: an array of dictionaries (JSON)
// Description: iterates through each post in JSON and preprocesses necessary data to display in a post
////////////////////////////////////////////
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

////////////////////////////////////////////
// Args:
//        type: string, specifies the type of posts to fetch
//        count: number, specifies the number of posts to fetcg
//        showMore: boolean, optional parameter to show posts in some range
// Description: starting function, sets everything up
////////////////////////////////////////////
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

    if (document.getElementById("buttonMore").hidden) {
        document.getElementById("buttonMore").hidden = false;
    }
}


////////////////////////////////////////////
// Description: filtering stories' titles, authors and urls to find keyword
// and displaying filtered stories
////////////////////////////////////////////
const searchingThroughSections = () => {
    let keyWord = document.getElementById("search").value.toLowerCase();
    getTopNewStories(storyType, 500)
        .then((stories) => {
            return stories;
        })
        .then((stories) => {
            removeAllStories();
            let filteredTitles = (array) => array.filter((element) => element.title.toLowerCase().includes(keyWord));
            let filteredUsers = (array) => array.filter((element) => element.by.toLowerCase().includes(keyWord));
            let filteredUrls = (array) => array.filter((element) => {
                if (element.url != undefined) {
                    element.url.includes(keyWord)
                }
            });
            let filteredStories = filteredTitles(stories).concat(filteredUsers(stories)).concat(filteredUrls(stories));
            showStories(filteredStories);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
    if (!document.getElementById("buttonMore").hidden) {
        document.getElementById("buttonMore").hidden = true;
    }
};


////////////////////////////////////////////
// Description: showing statistics of the website
////////////////////////////////////////////
const showStatistics = () => {
    removeAllStories();
    removeStatistics();
    let olElement = document.querySelector("ol");
    postHtml = `
        <h3>Here are some of our statistics:</h3>
        <table class="styled-table">
            <tr>
                <th class="statName">Name</th>
                <th class="statValue">Value</th>
            </tr>
            <tr>
                <td class="statName" id="topScore">Highest score on story</td>
            </tr>
            <tr>
                <td class="statName" id="mostComments">Most comments on story</td>
            </tr>
            <tr>
                <td class="statName" id="topCommenter">User with the most comments</td>
            </tr>
            <tr>
                <td class="statName" id="mostStories">User with the most posts</td>
            </tr>
        </table>
        `;
    olElement.insertAdjacentHTML("afterbegin", postHtml);
    getTopNewStories("top", 499)
        .then((stories) => {
            return stories;
        })
        .then((stories) => {
            let mapToScore = stories.map((story) => story.score);
            mapToScore.sort((a, b) => b - a);
            let topScoreHtml = `
                <td class="statValue">`+ mapToScore[0] + `</td>
            `;
            let topScoreSelector = document.getElementById("topScore");
            topScoreSelector.insertAdjacentHTML("afterend", topScoreHtml);



            let mapToComments = stories.map((story) => story.descendants);
            mapToComments.sort((a, b) => b - a);
            let mostCommentsHtml = `
                <td class="statValue">`+ mapToComments[0] + `</td>
            `;
            let mostCommentsSelector = document.getElementById("mostComments");
            mostCommentsSelector.insertAdjacentHTML("afterend", mostCommentsHtml);


            console.log(stories)

            //doesn't work
            let filteredComments = stories.filter((story) => (story.type == "comment"));
            let mapToAuthorComments = stories.map((story) => story.by);
            console.log(filteredComments)
            const uniqueElementsComments = [...new Set(mapToAuthorComments)];
            const countComments = uniqueElementsComments.map(element => [
                element,
                mapToAuthorComments.filter(el => el === element).length,
            ]);
            countComments.sort((a, b) => b[1] - a[1]);
            let topCommenterHtml = `
                <td class="statValue">`+ countComments[0][0] + `</td>
            `;
            let topCommenterSelector = document.getElementById("topCommenter");
            topCommenterSelector.insertAdjacentHTML("afterend", topCommenterHtml);
            //

            //doesn't work
            let filteredStories = stories.filter((story) => (story.type == "story"));
            let mapToAuthorStories = stories.map((story) => story.by);
            console.log(filteredStories)
            const uniqueElementsStories = [...new Set(mapToAuthorStories)];
            const countStories = uniqueElementsStories.map(element => [
                element,
                mapToAuthorStories.filter(el => el === element).length,
            ]);
            countStories.sort((a, b) => b[1] - a[1]);
            let mostStoriesHtml = `
                <td class="statValue">`+ countStories[0][0] + `</td>
            `;
            let mostStoriesSelector = document.getElementById("mostStories");
            mostStoriesSelector.insertAdjacentHTML("afterend", mostStoriesHtml);
            //
        })
        .catch((error) => {
            console.error("Error: ", error);
        });

    if (!document.getElementById("buttonMore").hidden) {
        document.getElementById("buttonMore").hidden = true;
    }
}

// 'new' is a default parameteer
var storyType = 'new'
var numberOfStories = 30;
var previousPostCount = 0;
setRun(storyType, numberOfStories)



