event.preventDefault();
document.querySelector('#deckSelect').addEventListener('change', function() {
    document.querySelector('#DrawTestSelection').submit();
});