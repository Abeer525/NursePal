async function fetchPatients() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/patients');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const patients = await response.json();

        const container = document.getElementById('patientsContainer');
        container.innerHTML = ''; // Clear previous content
        patients.forEach(patient => {
            const card = document.createElement('div');
            card.className = 'card collapsed';

            card.innerHTML = `
                <div class="header">
                    <div class="name-id">
                        <h2>${patient.name}</h2>
                        <p>ID: ${patient.customId}</p>
                    </div>
                    <!-- <button class="toggle-button" onclick="toggleCard(this)">&#9660;</button> -->
                    <button class="toggle-button" onclick="toggleCard(this)"><i class="fas fa-chevron-down"></i></button>

                </div>
                <div class="card-content">
                    <div class="section">
                        <h3>Personal Info</h3>
                        <p><strong>Father's Name:</strong> ${patient.fatherName || '-'}</p>
                        <p><strong>Mother's Name:</strong> ${patient.motherName || '-'}</p>
                        <p><strong>DOB:</strong> ${patient.dob || '-'}</p>
                        <p><strong>Gender:</strong> ${patient.gender || '-'}</p>
                        <p><strong>Marital Status:</strong> ${patient.maritalStatus || '-'}</p>
                        <p><strong>Children Status:</strong> ${patient.childrenStatus || '-'}</p>
                    </div>
                    <div class="section">
                        <h3>Contact Info</h3>
                        <p><strong>Phone:</strong> ${patient.phone || '-'}</p>
                        <p><strong>Emergency Phone:</strong> ${patient.emergencyPhone || '-'}</p>
                        <p><strong>Email:</strong> ${patient.email || '-'}</p>
                    </div>
                    <div class="section">
                        <h3>Medical Info</h3>
                        <p><strong>Room Number:</strong> ${patient.roomNumber || '-'}</p>
                        <p><strong>Bed Type:</strong> ${patient.bedType || '-'}</p>
                        <p><strong>Medical History:</strong> ${patient.medicalHistory || '-'}</p>
                        <p><strong>Reason For Visit:</strong> ${patient.reasonForVisit || '-'}</p>
                        <p><strong>Symptoms:</strong> ${patient.symptoms || '-'}</p>
                        <p><strong>Vital Signs:</strong> ${patient.vitalSigns || '-'}</p>
                        <p><strong>Diagnostic Tests:</strong> ${patient.diagnosticTests || '-'}</p>
                        <p><strong>Treatment Plan:</strong> ${patient.treatmentPlan || '-'}</p>
                    </div>
                    <div class="section">
                        <h3>Insurance Info</h3>
                        <p><strong>Insurance Status:</strong> ${patient.insuranceStatus || '-'}</p>
                        <p><strong>Insurance Policy:</strong> ${patient.insurancePolicy || '-'}</p>
                        <p><strong>Insurer Name:</strong> ${patient.insurerName || '-'}</p>
                    </div>
                    <div class="section">
                        <h3>Additional Info</h3>
                        <p><strong>Doctor Name:</strong> ${patient.doctorName || '-'}</p>
                        <p><strong>Pills:</strong> ${patient.pills || '-'}</p>
                        <p><strong>Admission Date:</strong> ${patient.admissionDate || '-'}</p>
                        <p><strong>Discharge Date:</strong> ${patient.dischargeDate || '-'}</p>
                        <p><strong>Lifestyle Choices:</strong> ${patient.lifestyleChoices || '-'}</p>
                        <p><strong>Additional Comments:</strong> ${patient.additionalComments || '-'}</p>
                    </div>
                    <button class="update-button" onclick="openUpdateModal('${patient.customId}', '${patient.name}', '${patient.fatherName}', '${patient.motherName}', '${patient.dob}', '${patient.gender}', '${patient.maritalStatus}', '${patient.childrenStatus}', '${patient.phone}', '${patient.emergencyPhone}', '${patient.email}', '${patient.roomNumber}', '${patient.bedType}', '${patient.medicalHistory}', '${patient.reasonForVisit}', '${patient.symptoms}', '${patient.vitalSigns}', '${patient.diagnosticTests}', '${patient.treatmentPlan}', '${patient.insuranceStatus}', '${patient.insurancePolicy}', '${patient.insurerName}', '${patient.doctorName}', '${patient.pills}', '${patient.admissionDate}', '${patient.dischargeDate}', '${patient.lifestyleChoices}', '${patient.additionalComments}')">Edit</button>
                </div>
     
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

function toggleCard(button) {
    const card = button.closest('.card');
    card.classList.toggle('expanded');
    card.classList.toggle('collapsed');
}

function openUpdateModal(customId, name, fatherName, motherName, dob, gender, maritalStatus, childrenStatus, phone, emergencyPhone, email, roomNumber, bedType, medicalHistory, reasonForVisit, symptoms, vitalSigns, diagnosticTests, treatmentPlan, insuranceStatus, insurancePolicy, insurerName, doctorName, pills, admissionDate, dischargeDate, lifestyleChoices, additionalComments) {
    document.getElementById('customId').value = customId;
    document.getElementById('name').value = name;
    document.getElementById('fatherName').value = fatherName;
    document.getElementById('motherName').value = motherName;
    document.getElementById('dob').value = dob;
    document.getElementById('gender').value = gender;
    document.getElementById('maritalStatus').value = maritalStatus;
    document.getElementById('childrenStatus').value = childrenStatus;
    document.getElementById('phone').value = phone;
    document.getElementById('emergencyPhone').value = emergencyPhone;
    document.getElementById('email').value = email;
    document.getElementById('roomNumber').value = roomNumber;
    document.getElementById('bedType').value = bedType;
    document.getElementById('medicalHistory').value = medicalHistory;
    document.getElementById('reasonForVisit').value = reasonForVisit;
    document.getElementById('symptoms').value = symptoms;
    document.getElementById('vitalSigns').value = vitalSigns;
    document.getElementById('diagnosticTests').value = diagnosticTests;
    document.getElementById('treatmentPlan').value = treatmentPlan;
    document.getElementById('insuranceStatus').value = insuranceStatus;
    document.getElementById('insurancePolicy').value = insurancePolicy;
    document.getElementById('insurerName').value = insurerName;
    document.getElementById('doctorName').value = doctorName;
    document.getElementById('pills').value = pills;
    document.getElementById('admissionDate').value = admissionDate;
    document.getElementById('dischargeDate').value = dischargeDate;
    document.getElementById('lifestyleChoices').value = lifestyleChoices;
    document.getElementById('additionalComments').value = additionalComments;

    const modal = document.getElementById('updateModal');
    modal.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    const modal = document.getElementById('updateModal');
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('updateModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
document.getElementById('updateForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        customId: document.getElementById('customId').value,
        name: document.getElementById('name').value,
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        maritalStatus: document.getElementById('maritalStatus').value,
        childrenStatus: document.getElementById('childrenStatus').value,
        phone: document.getElementById('phone').value,
        emergencyPhone: document.getElementById('emergencyPhone').value,
        email: document.getElementById('email').value,
        roomNumber: document.getElementById('roomNumber').value,
        bedType: document.getElementById('bedType').value,
        medicalHistory: document.getElementById('medicalHistory').value,
        reasonForVisit: document.getElementById('reasonForVisit').value,
        symptoms: document.getElementById('symptoms').value,
        vitalSigns: document.getElementById('vitalSigns').value,
        diagnosticTests: document.getElementById('diagnosticTests').value,
        treatmentPlan: document.getElementById('treatmentPlan').value,
        insuranceStatus: document.getElementById('insuranceStatus').value,
        insurancePolicy: document.getElementById('insurancePolicy').value,
        insurerName: document.getElementById('insurerName').value,
        doctorName: document.getElementById('doctorName').value,
        pills: document.getElementById('pills').value,
        admissionDate: document.getElementById('admissionDate').value,
        dischargeDate: document.getElementById('dischargeDate').value,
        lifestyleChoices: document.getElementById('lifestyleChoices').value,
        additionalComments: document.getElementById('additionalComments').value,
    };

    console.log('Updating patient with data:', formData); // Debug log

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/patient/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to update patient');
        }

        console.log('Patient updated successfully');
        const modal = document.getElementById('updateModal');
        modal.style.display = 'none';
        fetchPatients(); // Refresh the patients list
    } catch (error) {
        console.error('Error updating patient:', error);
        // Handle error here (e.g., show error message to user)
    }
});

fetchPatients();