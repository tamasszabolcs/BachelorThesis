function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

function handleEnter(e) {
    if (e.keyCode === 13) {
        validate()
    }
}