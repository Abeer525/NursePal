// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};



// login Style
const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});


// profile from index_one.html
document.addEventListener('DOMContentLoaded', function () {
	const profileLink = document.getElementById('profileLink');
	const logoutLink = document.getElementById('logout');
	const searchButton = document.getElementById('searchButton');
	const searchInput = document.getElementById('searchInput');
	const profileImage = document.getElementById('profileImage');
	const fullName = document.getElementById('fullName');
	const errorElement = document.getElementById('error');
	const loadingElement = document.getElementById('loading');
	const searchPopup = document.getElementById('searchPopup');
	const graphImage = document.querySelector('img[alt="Daily Patients Graph"]');

	// Update the profile link to redirect to profile.html
	profileLink.addEventListener('click', function (event) {
		event.preventDefault();
		window.location.href = 'profile.html';
	});

	// Handle sign out
	logoutLink.addEventListener('click', function (event) {
		event.preventDefault();
		fetch('http://127.0.0.1:5000/logout')
			.then(response => {
				if (response.ok) {
					sessionStorage.clear();
					window.location.href = 'login.html';
				} else {
					throw new Error('Network response was not ok');
				}
			})
			.catch(error => {
				console.error('There was a problem with the logout request:', error);
			});
	});

	// Extract custom ID from sessionStorage
	const customId = sessionStorage.getItem('customId');

	if (!customId) {
		errorElement.innerText = 'Custom ID not found in session storage.';
		return;
	}

	// Fetch and display HR profile details
	fetch(`http://127.0.0.1:5000/profile/${customId}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			if (data.fullName && data.email && data.phoneNumber && data.department && data.gender && data.image) {
				fullName.innerText = data.fullName;
				profileImage.src = `app/static/uploads/${data.image}`;
			} else {
				throw new Error('Invalid data format');
			}
		})
		.catch(error => {
			errorElement.innerText = 'Failed to load profile. Please try again later.';
			console.error('There was a problem with fetching HR profile:', error);
		});
});

	// Handle search
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
				loadingElement.style.display = 'none';

				// Clear previous results
				searchPopup.innerHTML = ''; 

				// Add close button
				const closeBtn = document.createElement('span');
				closeBtn.classList.add('close-btn');
				closeBtn.innerHTML = '&times;';
				closeBtn.onclick = () => searchPopup.innerHTML = ''; // Close popup on click
				searchPopup.appendChild(closeBtn);

				// Populate popup with search results
				['hr', 'nurses', 'patients'].forEach(category => {
					if (data[category].length > 0) {
						const categoryHeader = document.createElement('h3');
						categoryHeader.innerText = category.charAt(0).toUpperCase() + category.slice(1);
						searchPopup.appendChild(categoryHeader);

						data[category].forEach(item => {
							const resultItem = document.createElement('div');
							resultItem.classList.add('result-item');
							resultItem.innerHTML = `Name: ${item.fullName || item.name}, ID: ${item.customId}`;
							resultItem.addEventListener('click', function() {
								// Redirect to another page with selected data
								if (category === 'hr') {
									window.location.href = `/hr/profile/${item.customId}`;
								} else if (category === 'nurses') {
									window.location.href = `/nurse/profile/${item.customId}`;
								} else if (category === 'patients') {
									window.location.href = `/patient/profile/${item.customId}`;
								}
							});
							searchPopup.appendChild(resultItem);
						});
					}
				});

				if (searchPopup.innerHTML === '') {
					searchPopup.innerHTML = '<p>No results found.</p>';
				}
			})
			.catch(error => {
				loadingElement.style.display = 'none';
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





    // <script>
    //     document.addEventListener('DOMContentLoaded', function () {
    //         const profileLink = document.getElementById('profileLink');
    //         const logoutLink = document.getElementById('logout');
    //         const searchButton = document.getElementById('searchButton');
    //         const searchInput = document.getElementById('searchInput');
    //         const profileImage = document.getElementById('profileImage');
    //         const fullName = document.getElementById('fullName');
    //         const errorElement = document.getElementById('error');
    //         const loadingElement = document.getElementById('loading');
    //         const searchPopup = document.getElementById('searchPopup');
    //         const graphImage = document.querySelector('img[alt="Daily Patients Graph"]');
        
    //         // Update the profile link to redirect to profile.html
    //         profileLink.addEventListener('click', function (event) {
    //             event.preventDefault();
    //             window.location.href = 'profile.html';
    //         });
        
    //         // Handle sign out
    //         logoutLink.addEventListener('click', function (event) {
    //             event.preventDefault();
    //             fetch('http://127.0.0.1:5000/logout')
    //                 .then(response => {
    //                     if (response.ok) {
    //                         sessionStorage.clear();
    //                         window.location.href = 'login.html';
    //                     } else {
    //                         throw new Error('Network response was not ok');
    //                     }
    //                 })
    //                 .catch(error => {
    //                     console.error('There was a problem with the logout request:', error);
    //                 });
    //         });
        
    //         // Extract custom ID from sessionStorage
    //         const customId = sessionStorage.getItem('customId');
        
    //         if (!customId) {
    //             errorElement.innerText = 'Custom ID not found in session storage.';
    //             return;
    //         }
        
    //         // Fetch and display HR profile details
    //         fetch(`http://127.0.0.1:5000/profile/${customId}`)
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error('Network response was not ok');
    //                 }
    //                 return response.json();
    //             })
    //             .then(data => {
    //                 if (data.fullName && data.email && data.phoneNumber && data.department && data.gender && data.image) {
    //                     fullName.innerText = data.fullName;
    //                     profileImage.src = `app/static/uploads/${data.image}`;
    //                 } else {
    //                     throw new Error('Invalid data format');
    //                 }
    //             })
    //             .catch(error => {
    //                 errorElement.innerText = 'Failed to load profile. Please try again later.';
    //                 console.error('There was a problem with fetching HR profile:', error);
    //             });
    //     });
        
    //         // Handle search
    //         searchButton.addEventListener('click', function () {
    //             const query = searchInput.value.trim();
    //             if (!query) {
    //                 errorElement.innerText = 'Please enter a search term.';
    //                 return;
    //             }
    
    //             fetch(`http://127.0.0.1:5000/search?q=${query}`)
    //                 .then(response => {
    //                     if (!response.ok) {
    //                         throw new Error('Network response was not ok');
    //                     }
    //                     return response.json();
    //                 })
    //                 .then(data => {
    //                     loadingElement.style.display = 'none';
    
    //                     // Clear previous results
    //                     searchPopup.innerHTML = ''; 
    
    //                     // Add close button
    //                     const closeBtn = document.createElement('span');
    //                     closeBtn.classList.add('close-btn');
    //                     closeBtn.innerHTML = '&times;';
    //                     closeBtn.onclick = () => searchPopup.innerHTML = ''; // Close popup on click
    //                     searchPopup.appendChild(closeBtn);
    
    //                     // Populate popup with search results
    //                     ['hr', 'nurses', 'patients'].forEach(category => {
    //                         if (data[category].length > 0) {
    //                             const categoryHeader = document.createElement('h3');
    //                             categoryHeader.innerText = category.charAt(0).toUpperCase() + category.slice(1);
    //                             searchPopup.appendChild(categoryHeader);
    
    //                             data[category].forEach(item => {
    //                                 const resultItem = document.createElement('div');
    //                                 resultItem.classList.add('result-item');
    //                                 resultItem.innerHTML = `Name: ${item.fullName || item.name}, ID: ${item.customId}`;
    //                                 resultItem.addEventListener('click', function() {
    //                                     // Redirect to another page with selected data
    //                                     if (category === 'hr') {
    //                                         window.location.href = `/hr/profile/${item.customId}`;
    //                                     } else if (category === 'nurses') {
    //                                         window.location.href = `/nurse/profile/${item.customId}`;
    //                                     } else if (category === 'patients') {
    //                                         window.location.href = `/patient/profile/${item.customId}`;
    //                                     }
    //                                 });
    //                                 searchPopup.appendChild(resultItem);
    //                             });
    //                         }
    //                     });
    
    //                     if (searchPopup.innerHTML === '') {
    //                         searchPopup.innerHTML = '<p>No results found.</p>';
    //                     }
    //                 })
    //                 .catch(error => {
    //                     loadingElement.style.display = 'none';
    //                     errorElement.innerText = 'Failed to perform search. Please try again later.';
    //                     console.error('There was a problem with the search request:', error);
    //                 });
    //         });
    
    //         // Enable search on Enter key press
    //         searchInput.addEventListener('keypress', function (event) {
    //             if (event.key === 'Enter') {
    //                 searchButton.click();
    //             }
    //         });
    // </script>





