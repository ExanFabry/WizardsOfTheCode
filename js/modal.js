// declaraties
let modal = document.getElementById("modal");
let chosenId = "no-item-selected";
// wanneer je klikt op een element met class "item" verschijnt het venster
for (let item of document.getElementsByClassName("item")) {
    item.onclick = function() {
        modal.style.display = "block";
    }
}
// wanneer je klikt op de X knop verdwijnt het venster
document.getElementById("close").onclick = function() {
    modal.style.display = "none";
}
// wanneer je klikt op de zwarte achtergrond verdwijnt het venster
window.onclick = function(clickAway) {
    if (clickAway.target == modal) {
        modal.style.display = "none";
    }
}