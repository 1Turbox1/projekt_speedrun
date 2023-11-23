/*
ZADANIA TURBOXA

zad 1 done (1 pkt) Aplikacja na początkowej stronie powinna wyświetlić pierwsze 30 dostępnych Newsów z API z możliwością przechodzenia dalej
zad 2 done (1 pkt) Aplikacja ma mieć możliwość ustawienia pobrania konkretnej ilości Newsów z API z możliwością przechodzenia dalej
zad 3 done (1 pkt) Aplikacja powinna wyświetlać newsy zaczynając od najnowszego z nich
zad 4 done (1 pkt) Opcja wyboru sortowanie newsów od najlepiej ocenianych newsów

te gorne tylko potrzebuja implementacji

zad 5 (2 pkt) Każdy z newsów powinien składać się z następujących elementów:
        o    (1 pkt) Tytuł
        o    (1 pkt) Link jako odnośnik do tytułu
zad 6 (1 pkt) Po kliknięciu na news aplikacja powinna przekierować nas na stronę podaną w linku
zad 7 (2 pkt) Każdy z newsów powinien zawierać przycisk hide w celu ukrycia newsa
zad 8 (2 pkt) Każdy z newsów powinien zawierać strzałkę w celu głosowania na dany news (strzałka zmienia kolor na zielony po kliknięciu)
*/

const fetchStoryDetails = (storyId) => {
    return fetch("https://hacker-news.firebaseio.com/v0/item/" + storyId + ".json?print=pretty")
        .then((response) => response.json())
        .catch((error) => {
            console.error("Error fetching IDs: ", error)
        });
};

const getTopNewStories = (type, count = 30) => {
    const validTypes = ['top', 'new', 'best']
    if (!validTypes.includes(type))
        return Promise.reject(new Error("Invalid type"));
    return fetch("https://hacker-news.firebaseio.com/v0/" + type + "stories.json?print=pretty")
        .then((response) => response.json())
        .then((storyIds) => {
            const topStoryIds = storyIds.slice(0, count)
            const storyPromises = topStoryIds.map((storyId) => fetchStoryDetails(storyId));
            return Promise.all(storyPromises)
        })
        .catch((error) => {
            console.error("Error fetching top new stories: ", error);
            return [];
        });
};

const removeStories = () => {
    // TODO
}

const showStories = (storiesDictionary) => {
    // TODO
}

// 'top' jest defaultowy
const storyType = 'top'
const numberOfStories = 30;
getTopNewStories(storyType, numberOfStories)
    .then((stories) => {
        console.log(storyType + " " + stories.length + " new stories: ", stories)
    })
    .catch((error) => {
        console.error("Error: ", error)
    });