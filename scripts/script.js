////////////////////////////////////////////
// Args:
//        postId: ID of the post <li> element
// Description: Changes the color of the upvote
////////////////////////////////////////////

// 'new' is a default parameteer
var storyType = 'new'
var numberOfStories = 30;
var previousPostCount = 0;
var viewedDate = new Date();
const dateOnPC = new Date()


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
const getTopNewStories = (type = undefined, count = 30, showMore = false, morePastPosts = false) => {
    const validTypes = ['top', 'new', 'best', 'ask', 'job'];
    console.log(type)
    if (!validTypes.includes(type))
        return Promise.reject(new Error('Invalid type ' + type));
    if (showMore)
        previousPostCount += parseFloat(count);
    else if (morePastPosts) {
        previousPostCount += parseFloat(numberOfStories);
    }
    else {
        previousPostCount = 0;
    }


    return fetch('https://hacker-news.firebaseio.com/v0/' + type + 'stories.json?print=pretty')
        .then((response) => response.json())
        .then((storyIds) => {
            let topStoryIds;
            if (morePastPosts) {
                topStoryIds = storyIds.slice(0, parseFloat(count)).reverse();
            }
            else {
                topStoryIds = storyIds.slice(previousPostCount, previousPostCount + parseFloat(count)).reverse();
            }
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
                removeAllStories()
                showStories(stories)
            })
            .catch((error) => {
                console.error("Error: ", error)
            });
    else
        getTopNewStories(storyType, numberOfStories, showMore)
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
            removeAllStories();
            removeDates();
            removeStatistics();
            hideDateButtons();
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

const fetchComments = async (postIds) => {
    const countCommentsPerUser = postIds.map(postId => postId.kids).flat();

    const processComments = async (ids, countMap) => {
        for (const id of ids) {
            const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
            const commentData = await response.json();
            if (commentData.deleted == true)
                console.log('del')
            else if (commentData == null)
                console.log('nul')
            else {
                const username = commentData.by || 'unknown';
                countMap.set(username, (countMap.get(username) || 0) + 1);
                if (commentData.kids && commentData.kids.length > 0)
                    await processComments(commentData.kids, countMap);
            }
        }
    };
    const countMap = new Map();
    await Promise.all(countCommentsPerUser.map(postId => processComments([postId], countMap)));

    return countMap;
};

const fetchStories = async (stories) => {
    // it takes the stories and their author, Set removes duplicates, it counts and sorts
    let mapToAuthorStories = stories.map((story) => story.by);
    let uniqueNames = new Set(mapToAuthorStories);
    let uniqueNamesArray = [...uniqueNames];
    let countStories = uniqueNamesArray.map(element => [
        element,
        mapToAuthorStories.filter(el => el == element).length
    ]);
    countStories.sort((a, b) => b[1] - a[1]);
    return countStories
}

const changeSite = (url = "../index.html", fn = undefined, storyType = 'new', count = numberOfStories, ifStart = false) => {
    document.location.href = url + "?fn=" + encodeURIComponent(fn) + "&storyType=" + encodeURIComponent(storyType) + "&count=" + encodeURIComponent(count) + "&ifStart=" + encodeURIComponent(ifStart);
}

const receiveSiteData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const func = urlParams.get('fn') || undefined;
    const storyTypeParam = urlParams.get('storyType') || 'new';
    const count = urlParams.get('count') || numberOfStories;

    numberOfStories = count
    storyType = storyTypeParam
    document.getElementById("postCount").value = parseInt(numberOfStories)

    if (func == "showStatistics")
        showStatistics()
    if (func == 'setRun' || func == undefined)
        setRun(storyType, numberOfStories)

    try {
        const ifStart = urlParams.get('ifStart');
        if (func == 'loadDates' && ifStart)
            loadDates(ifStart)
    }
    catch (error) {
        console.error("Error gathering dates " + error)
    }
};

//date manipulation
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.minusDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

//showing next or previous date
const ascendDate = () => {
    viewedDate = viewedDate.addDays(1);
    loadDates(true)
}
const descendDate = () => {
    viewedDate = viewedDate.minusDays(1);
    loadDates(true)
}

//loading more stories of selected date
const loadMore = () => {
    loadDates(true, true);
}

//getting and displaying stories from the selected date
const retrieveRangeDatePosts = async (date1, date2, showMore = false) => {
    const thisDayDate = new Date(date1);
    const nextDayDate = new Date(date2);

    const thisDateUnix = Math.floor(thisDayDate.getTime() / 1000)
    const thisDayPlusOneDateUnix = Math.floor(nextDayDate.getTime() / 1000)    

    await getTopNewStories('top', 500, false, showMore)
        .then((posts) => {
            removeDates()
            removeAllStories()
            const filteredPosts = posts.filter((post) => post.time >= thisDayPlusOneDateUnix && post.time < thisDateUnix ? post : undefined);
            const rangedPosts = filteredPosts.slice(previousPostCount, previousPostCount + parseFloat(numberOfStories)).reverse();
            if (rangedPosts.length < 30) {
                document.getElementById("buttonMore").hidden = true;
            }
            displayDates(date1, date2)
            showStories(rangedPosts)
            return filteredPosts
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}

//processing manipulations on the past page(buttons, dates, stories)
const loadDates = (ifStart = false, showMore = false, count = numberOfStories) => {
    numberOfStories = count;
    document.getElementById("ascending").hidden = false;
    document.getElementById("descending").hidden = false;
    const today = viewedDate;
    const yesterday = today.minusDays(1);
    const todayDateUnix = Math.floor(today.getTime() / 1000)
    const dateOnPCUnix = Math.floor(dateOnPC.getTime() / 1000) 

    if (todayDateUnix == dateOnPCUnix) {
        document.getElementById("ascending").disabled = true;
    }
    else{
        document.getElementById("ascending").disabled = false;
    }
    if (ifStart) {
        displayDates(today, yesterday);
    }

    document.getElementById("buttonMore").hidden = false;
    console.log(retrieveRangeDatePosts(today, yesterday, showMore));
}

//formats date to a usual format
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return day + "/" + month + "/" + year;
}

//hiding buttons to change date
const hideDateButtons = () => {
    document.getElementById("ascending").hidden = true;
    document.getElementById("descending").hidden = true;
}
//removes dates from the page subsite
const removeDates = () => {
    const allDates = document.getElementById("viewDates");
    while (allDates.firstChild) {
        allDates.removeChild(allDates.lastChild);
    }
}

//showing dates on the page subsite
const displayDates = (today, yesterday) => {
    const viewDatesList = document.getElementById('viewDates');
    const todayListItem = document.createElement('ul');
    todayListItem.textContent = "Today: " + formatDate(today);
    const yesterdayListItem = document.createElement('ul');
    yesterdayListItem.textContent = "Yesterday: " + formatDate(yesterday);

    viewDatesList.appendChild(todayListItem);
    viewDatesList.appendChild(yesterdayListItem);
}

////////////////////////////////////////////
// Description: showing statistics of the website
////////////////////////////////////////////
const showStatistics = () => {
    removeAllStories();
    removeStatistics();
    let statCount = 10
    let olElement = document.querySelector("ol");
    postHtml = `
        <li style='list-style-type: none;' id="await">
        <h3>Calculating with our not threaded slow algorithms, give it a sec</h3>
        </li>
        `;
    olElement.insertAdjacentHTML("afterbegin", postHtml);
    getTopNewStories("top", statCount)
        .then((stories) => {

            let mapToScore = stories.map((story) => story.score);
            mapToScore.sort((a, b) => b - a);

            let mapToComments = stories.map((story) => story.descendants);
            mapToComments.sort((a, b) => b - a);


            fetchComments(stories)
                .then(countCommentsPerUser => {
                    let maxCount = -1;
                    let usernameWithMaxCount = '';

                    countCommentsPerUser.forEach((count, username) => {
                        if (count > maxCount) {
                            maxCount = count;
                            usernameWithMaxCount = username;
                        }
                    });
                    let topCommenterHtml = `
                <td class="statValue">`+ usernameWithMaxCount + `</td>
                `;
                    let topCommenterSelector = document.getElementById("topCommenter");
                    topCommenterSelector.insertAdjacentHTML("afterend", topCommenterHtml);
                })
                .catch(error => {
                    console.error('Error:', error);
                });



            fetchStories(stories)
                .then(countStories => {
                    let mostStoriesHtml = `
                <td class="statValue">`+ countStories[0][0] + `</td>
                `;
                    let mostStoriesSelector = document.getElementById("mostStories");
                    mostStoriesSelector.insertAdjacentHTML("afterend", mostStoriesHtml);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            hidePost('await')

            let olElement = document.querySelector("ol");
            postHtml = `
                <li style='list-style-type: none;'>
                <h3>Here are some of our statistics of the `+ statCount + ` last posts:</h3>
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
                </li>
                `;
            olElement.insertAdjacentHTML("afterbegin", postHtml);

            let mostCommentsHtml = `
                <td class="statValue">`+ mapToComments[0] + `</td>
            `;
            let mostCommentsSelector = document.getElementById("mostComments");
            mostCommentsSelector.insertAdjacentHTML("afterend", mostCommentsHtml);

            let topScoreHtml = `
                <td class="statValue">`+ mapToScore[0] + `</td>
            `;
            let topScoreSelector = document.getElementById("topScore");
            topScoreSelector.insertAdjacentHTML("afterend", topScoreHtml);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });

    if (!document.getElementById("buttonMore").hidden) {
        document.getElementById("buttonMore").hidden = true;
    }
}