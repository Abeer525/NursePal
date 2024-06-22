document.addEventListener("DOMContentLoaded", function () {
  const errorElement = document.getElementById("error");
  const fullNameElements = document.querySelectorAll(".full-name");
  const customIdElement = document.getElementById("customId");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phoneNumber");
  const department = document.getElementById("department");
  const gender = document.getElementById("gender");
  const profileImages = document.querySelectorAll(".profile-image");

  // Now we don't need to clone the profileImage and fullName, as they're directly in the HTML

  // Now, fetch and display HR profile details
  document.addEventListener('DOMContentLoaded', function() {
    // Assuming you fetch the data from an API or local storage
    const fullName = 'Abeer'; // Replace this with the actual data fetching logic
    document.getElementById('fullName').textContent = fullName;
});

  const customId = sessionStorage.getItem("customId");

  if (!customId) {
      errorElement.innerText = "Custom ID not found in session storage.";
      return;
  }

  fetch(`http://127.0.0.1:5000/profile/${customId}`)
      .then((response) => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then((data) => {
          if (data.fullName && data.image) {
              fullNameElements.forEach((element) => {
                  element.innerText = `${data.fullName}`;
              });
              customIdElement.innerText = customId;
              email.innerText = data.email;
              phoneNumber.innerText = data.phoneNumber;
              department.innerText = data.department;
              gender.innerText = data.gender;
              profileImages.forEach((element) => {
                  element.src = `../static/uploads/${data.image}`;
              });
          } else {
              throw new Error("Invalid data format");
          }
      })
      .catch((error) => {
          errorElement.innerText = "Failed to load profile. Please try again later.";
          console.error("There was a problem with fetching HR profile:", error);
      });
});

// Function to open the password change modal
function openPasswordChangeModal() {
  $("#passwordChangeModal").modal("show");
}

// Event listener for password change form submission
document
  .getElementById("passwordChangeForm")
  .addEventListener("submit", function (event) {
      event.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const customId = sessionStorage.getItem("customId");

      if (newPassword !== confirmPassword) {
          alert("New password and confirm password do not match.");
          return;
      }

      const formData = {
          currentPassword: currentPassword,
          newPassword: newPassword,
      };

      fetch(`http://127.0.0.1:5000/api/hr/change-password/${customId}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      })
          .then((response) => response.json())
          .then((data) => {
              if (data.message) {
                  $("#passwordChangeModal").modal("hide");
                  alert("Password updated successfully.");
              } else {
                  alert("Failed to update password: " + data.error);
              }
          })
          .catch((error) => {
              console.error("Error updating password:", error);
          });
  });

// Function to open the profile update modal
function openProfileUpdateModal() {
  $("#updateProfileModal").modal("show");
}

// Event listener for profile update form submission
document
  .getElementById("updateProfileForm")
  .addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = document.getElementById("updateFullName").value;
      const email = document.getElementById("updateEmail").value;
      const phoneNumber = document.getElementById("updatePhoneNumber").value;
      const department = document.getElementById("updateDepartment").value;
      const gender = document.getElementById("updateGender").value;
      const customId = sessionStorage.getItem("customId");

      const formData = {
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
          department: department,
          gender: gender,
      };

      fetch(`http://127.0.0.1:5000/api/hr/update/${customId}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      })
          .then((response) => response.json())
          .then((data) => {
              if (data.message) {
                  $("#updateProfileModal").modal("hide");
                  alert("Profile updated successfully.");
              } else {
                  alert("Failed to update profile: " + data.error);
              }
          })
          .catch((error) => {
              console.error("Error updating profile:", error);
          });
  });
