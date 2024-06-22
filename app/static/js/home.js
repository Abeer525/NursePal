document.addEventListener("DOMContentLoaded", function() {
    fetch('http://127.0.0.1:5000/api/nurses/details')
        .then(response => response.json())
        .then(data => {
            const nurseDetails = document.getElementById('nurseDetails');
            data.forEach(nurse => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td width="60px">
                        <div class="imgBx">
                            <img src="../static/uploads/${nurse.image}" alt="" />
                        </div>
                    </td>
                    <td>
                        <h4>
                            ${nurse.fullName} <br />
                            <span>${nurse.nursingType}</span> <br />
                            <span>${nurse.shift}</span>
                        </h4>
                    </td>
                `;
                nurseDetails.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching nurses:', error));
});



document.addEventListener("DOMContentLoaded", function() {
    fetch('http://127.0.0.1:5000/api/patient_details')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('patientDetails');
            tbody.innerHTML = "";

            data.forEach(patient => {
                const row = document.createElement('tr');
                
                // Create gender circle
                const genderCircle = document.createElement('div');
                genderCircle.classList.add('gender-circle');
                genderCircle.style.backgroundColor = patient.gender === 'Male' ? 'lightblue' : 'lightpink';
                genderCircle.textContent = patient.name[0].toUpperCase();

                const genderTd = document.createElement('td');
                genderTd.appendChild(genderCircle);

                row.innerHTML = `
                    <td style="text-align:left;">${patient.name}</td>
                    <td style="text-align:left;">${patient.room_number || 'N/A'}</td>
                    <td style="text-align:left;">${patient.reason_for_visit || 'N/A'}</td>
                `;

                row.prepend(genderTd);
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching patient details:', error));
});



// count hr & nurses & patients

fetch('http://127.0.0.1:5000/counts')
.then(response => response.json())
.then(data => {
  // Update HR count
  document.getElementById('hrCount').textContent = data.hr_count;
 

  // Update Nurses count
  document.getElementById('nursesCount').textContent = data.nurses_count;


  // Update Patients count
  document.getElementById('patientsCount').textContent = data.patients_count;
 
})
.catch(error => console.error('Error fetching counts:', error));

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
        window.location.href = 'index_one.html';
    });

    // Handle sign out
    document.addEventListener('DOMContentLoaded', function() {
        const logoutLink = document.getElementById('logout');
    
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            fetch('http://127.0.0.1:5000/logout')
                .then(response => {
                    if (response.ok) {
                        sessionStorage.clear();
                        window.location.href = '/login'    // or  http://127.0.0.1:5000/login' {% endcomment %}
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the logout request:', error);
                });
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
                profileImage.src = `../static/uploads/${data.image}`;
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


















