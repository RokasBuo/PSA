function getStorage(key) {
    const json = window.localStorage.getItem(key);
    const data = JSON.parse(json);
    return data;
}

function saveStorage(key, data) {
    const json = JSON.stringify(data);
    window.localStorage.setItem(key, json);
    return true;
}