document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('searchInput');
    const cardItems = document.querySelectorAll('.cardItem');

    const filterCards = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        cardItems.forEach(card => {
            const cardName = card.querySelector('p').textContent.toLowerCase();
            if (cardName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('input', filterCards);
});

document.getElementById('toggleChangeName').addEventListener('click', function() {
    const form = document.getElementById('changeNameForm');
    form.style.display = (form.style.display === 'none') ? 'block' : 'none';
});

