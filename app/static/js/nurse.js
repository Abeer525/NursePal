async function fetchNurses() {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/nurses");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const nurses = await response.json();

      const container = document.getElementById("nursesContainer");
      container.innerHTML = ""; // Clear previous content
      nurses.forEach((nurse) => {
        const card = document.createElement("div");
        card.className = "card collapsed";

        card.innerHTML = `
                    <div class="header">
                        <div class="name-id">
                            <h2>${nurse.fullName}</h2>
                            <p>ID: ${nurse.customId}</p>
                        </div>
                        <button class="toggle-button" onclick="toggleCard(this)"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="card-content">
                        <div class="section">
                            <h3>Contact Info</h3>
                            <p><strong>Email:</strong> ${
                              nurse.email || "-"
                            }</p>
                            <p><strong>Phone Number:</strong> ${
                              nurse.phoneNumber || "-"
                            }</p>
                        </div>
                        <div class="section">
                            <h3>Nursing Info</h3>
                            <p><strong>Nursing Type:</strong> ${
                              nurse.nursingType || "-"
                            }</p>
                            <p><strong>Date of Birth:</strong> ${
                              nurse.dateOfBirth || "-"
                            }</p>
                        </div>
                        <button class="update-button" onclick="openUpdateModal('${
                          nurse.customId
                        }', '${nurse.fullName}', '${nurse.email}', '${
          nurse.phoneNumber
        }', '${nurse.nursingType}', '${nurse.dateOfBirth}')">Edit</button>
                    </div>
                `;

        container.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  }

  function toggleCard(button) {
    const card = button.closest(".card");
    card.classList.toggle("expanded");
    card.classList.toggle("collapsed");
  }

  function openUpdateModal(
    customId,
    fullName,
    email,
    phoneNumber,
    nursingType,
    dateOfBirth
  ) {
    document.getElementById("customId").value = customId;
    document.getElementById("fullName").value = fullName;
    document.getElementById("email").value = email;
    document.getElementById("phoneNumber").value = phoneNumber;
    document.getElementById("nursingType").value = nursingType;
    document.getElementById("dateOfBirth").value = dateOfBirth;

    const modal = document.getElementById("updateModal");
    modal.style.display = "block";
  }

  document.querySelector(".close").addEventListener("click", () => {
    const modal = document.getElementById("updateModal");
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("updateModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  document
    .getElementById("updateForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        customId: document.getElementById("customId").value,
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        nursingType: document.getElementById("nursingType").value,
        dateOfBirth: document.getElementById("dateOfBirth").value,
      };

      console.log("Updating nurse with data:", formData); // Debug log

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/nurse/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.error || "Failed to update nurse");
        }

        console.log("Nurse updated successfully");
        const modal = document.getElementById("updateModal");
        modal.style.display = "none";
        fetchNurses(); // Refresh the nurses list
      } catch (error) {
        console.error("Error updating nurse:", error);
        // Handle error here (e.g., show error message to user)
      }
    });

  fetchNurses();
   document
        .getElementById("registerForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();

          const formData = new FormData();
          formData.append("fullName",document.getElementById("fullName").value
          );
          formData.append("email", document.getElementById("email").value);
          formData.append(
            "phoneNumber",
            document.getElementById("phoneNumber").value
          );
          formData.append(
            "nursingType",
            document.getElementById("nursingType").value
          );
          formData.append("shift", document.getElementById("shift").value);
          formData.append(
            "gender",
            document.querySelector('input[name="gender"]:checked').value
          );
          formData.append(
            "dateOfBirth",
            document.getElementById("dateOfBirth").value
          );
          formData.append("image", document.getElementById("image").files[0]);

          try {
            const response = await fetch(
              "http://127.0.0.1:5000/register_nurse",
              {
                method: "POST",
                body: formData,
              }
            );

            const responseData = await response.json();

            if (response.ok) {
              document.getElementById(
                "responseMessage"
              ).textContent = `Nurse registered successfully! ID: ${responseData.id}`;
              document.getElementById("responseMessage").style.color = "green";
            } else {
              document.getElementById(
                "responseMessage"
              ).textContent = `Error: ${responseData.error}`;
              document.getElementById("responseMessage").style.color = "red";
            }
          } catch (error) {
            document.getElementById(
              "responseMessage"
            ).textContent = `Error: ${error.message}`;
            document.getElementById("responseMessage").style.color = "red";
          }
        });