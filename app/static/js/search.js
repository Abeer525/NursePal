searchButton.addEventListener('click', function () {
    const query = searchInput.value.trim();
    if (!query) {
        errorElement.innerText = 'Please enter a search term.';
        return;
    }

    fetch(`http://127.0.0.1:5000/search?q=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Create and populate search results popup
            const popup = document.getElementById('searchPopup');
            popup.innerHTML = ''; // Clear previous results

            // Add close button
            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close-btn');
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = () => popup.innerHTML = ''; // Close popup on click
            popup.appendChild(closeBtn);

            // Populate popup with search results
            ['hr', 'nurses', 'patients'].forEach(category => {
                if (data[category].length > 0) {
                    const categoryHeader = document.createElement('h3');
                    categoryHeader.innerText = category.charAt(0).toUpperCase() + category.slice(1);
                    popup.appendChild(categoryHeader);

                    data[category].forEach(item => {
                        const resultItem = document.createElement('div');
                        resultItem.classList.add('result-item');
                        resultItem.innerHTML = `Name: ${item.fullName || item.name}, ID: ${item.customId}`;
                        popup.appendChild(resultItem);
                    });
                }
            });

            if (popup.innerHTML === '') {
                popup.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => {
            errorElement.innerText = 'Failed to perform search. Please try again later.';
            console.error('There was a problem with the search request:', error);
        });
});

// Enable search on Enter key press
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

