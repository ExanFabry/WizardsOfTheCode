// event.preventDefault();
document.querySelector('#deckSelect').addEventListener('change', function() {
    event.preventDefault();
    document.querySelector('#DrawTestSelection').submit();
});