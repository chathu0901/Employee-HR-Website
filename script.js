// index.html - reg button
document.addEventListener("DOMContentLoaded", function () {
  const regBtn = document.getElementById("regbtn");
  if (regBtn) {
    regBtn.addEventListener("click", function () {
      window.location.href = "reg.html";
    });
  }
});


// reg.html
function calculateAge() {
  const dob = document.getElementById('dob').value;
  const ageField = document.getElementById('age');
  const dobError = document.getElementById('dobError');

  if (!dob) {
    dobError.textContent = "Please select your Date of Birth.";
    ageField.value = '';
    return;
  }

  dobError.textContent = "";
  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  ageField.value = age;
}

function validateForm() {
  let valid = true;

  const errorFields = ['fullNameError', 'dobError', 'emailError', 'contactError', 'ageError', 'regNumberError'];
  errorFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  const fullName = document.getElementById('fullName')?.value.trim();
  if (fullName === '') {
    document.getElementById('fullNameError').textContent = 'Full Name is required.';
    valid = false;
  }

  const dob = document.getElementById('dob')?.value;
  if (dob === '') {
    document.getElementById('dobError').textContent = 'Date of Birth is required.';
    valid = false;
  } else {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    document.getElementById("age").value = age;

    if (age <= 20) {
      document.getElementById("ageError").textContent = "Age must be greater than 20.";
      valid = false;
    }
  }

  const regNumber = document.getElementById('regNumber')?.value.trim();
  const allowedUsers = {
    "Kiyasha Ranmali Perera": "ABC01",
    "Kamal Jayantha Rathaththa": "ABC02",
    "Samanth Ediri Karuna": "ABC03",
    "Kethaki maheshi Udawatte": "ABC04",
    "Sithija Nuwan Abeysinghe": "ABC05",
    "Warun Uddika Ranwala": "ABC06",
    "Kesara Sadupa Pathirana": "ABC07",
    "Shriya Deepika Kumari": "ABC08",
    "Killian Januddara Bandara": "ABC09",
    "Sehansa Mihini Athapaththu": "ABC10"
  };

  const expectedReg = allowedUsers[fullName];
  if (!expectedReg || expectedReg !== regNumber) {
    document.getElementById('regNumberError').textContent = "Name and registration number do not match.";
    valid = false;
  }

  const email = document.getElementById('email')?.value.trim();
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email)) {
    document.getElementById('emailError').textContent = 'Invalid email format.';
    valid = false;
  }

  const contact = document.getElementById('contact')?.value.trim();
  if (!/^\d{10}$/.test(contact)) {
    document.getElementById('contactError').textContent = 'Enter a 10-digit numeric contact number.';
    valid = false;
  }

  return valid;
}

function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

  const fullName = document.getElementById("fullName").value.trim();
  const dob = document.getElementById("dob").value;
  const age = document.getElementById("age").value;
  const regNumber = document.getElementById("regNumber").value;
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();

  const query = new URLSearchParams({
    fullName, dob, age, regNumber, email, contact
  });

  window.location.href = "profile.html?" + query.toString();
}

function formatFullName(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return '';
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1)
    .map(name => name.charAt(0).toUpperCase() + '.')
    .join(' ');
  return `${initials} ${capitalizeFirst(lastName)}`;
}

function capitalizeFirst(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}


// profile.html
function populateProfilePage() {
  const params = new URLSearchParams(window.location.search);

  const fullNameInput = document.getElementById("pFullName");
  if (fullNameInput) {
    fullNameInput.value = formatFullName(params.get("fullName"));
    document.getElementById("pDOB").value = params.get("dob") || "";
    document.getElementById("pAge").value = params.get("age") || "";
    document.getElementById("pRegNumber").value = params.get("regNumber") || "";
    document.getElementById("pEmail").value = params.get("email") || "";
    document.getElementById("pContact").value = params.get("contact") || "";
  }
}


// projects.html
function filterProjects() {
  const input = document.getElementById("employeeSearch").value.trim().toUpperCase();
  const allCards = document.querySelectorAll(".project-card");

  allCards.forEach(card => {
    const memberTags = card.querySelectorAll(".teamMember");
    const teamList = Array.from(memberTags).map(tag => tag.textContent.trim().toUpperCase());

    if (teamList.some(member => member.startsWith(input))) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function resetFilter() {
  document.getElementById("employeeSearch").value = "";
  const allCards = document.querySelectorAll(".project-card");
  allCards.forEach(card => {
    card.style.display = "flex";
  });
}


// expenses.html
function calculateTotal() {
  const inputs = document.querySelectorAll('.expenseInput');
  let total = 0;

  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });

  document.getElementById('totalDisplay').textContent = `LKR ${total.toFixed(2)}`;
}

function loadExpensesFromJSON() {
  fetch("expenses.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load expense categories");
      return response.json();
    })
    .then(data => {
      const form = document.getElementById("expensesForm");
      form.innerHTML = ""; 

      data.forEach(item => {
        const label = document.createElement("label");
        label.className = "expensesLabels";
        label.textContent = item.label + ":";

        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.min = "0";
        input.className = "expenseInput";

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
      });

      const calcButton = document.createElement("button");
      calcButton.type = "button";
      calcButton.className = "calcBtn";
      calcButton.textContent = "Calculate Total";
      calcButton.onclick = calculateTotal;
      form.appendChild(calcButton);
    })
    .catch(err => console.error("Error loading expenses.json:", err));
}

window.addEventListener("DOMContentLoaded", () => {
  // logout button
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const confirmLogout = confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        window.location.href = "index.html";
      }
    });
  }

  if (document.getElementById("pFullName")) {
    populateProfilePage();
  }

  if (document.getElementById("expensesForm")) {
    loadExpensesFromJSON(); 
  }
});
