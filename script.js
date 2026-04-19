const API_URL = "http://localhost:5000"; // Ajusta según tu backend

// Mostrar vistas
function showView(view) {
  document.getElementById("studentView").classList.toggle("d-none", view !== "student");
  document.getElementById("adminView").classList.toggle("d-none", view !== "admin");
}

// Cargar talleres para estudiantes y admin
async function loadWorkshops() {
  try {
    const resp = await fetch(`${API_URL}/workshops`);
    if (!resp.ok) throw new Error("Error al cargar talleres");
    const workshops = await resp.json();

    // Vista estudiante
    const list = document.getElementById("workshopsList");
    list.innerHTML = "";
    workshops.forEach(w => {
      list.innerHTML += `
        <div class="col-md-4">
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${w.name}</h5>
              <p>${w.date} ${w.time} - ${w.place}</p>
              <p><strong>${w.category}</strong></p>
              <button class="btn btn-success" onclick="openRegister(${w.id})">Inscribirse</button>
            </div>
          </div>
        </div>`;
    });

    // Vista admin
    const adminTable = document.getElementById("adminWorkshops");
    adminTable.innerHTML = "";
    workshops.forEach(w => {
      adminTable.innerHTML += `
        <tr>
          <td>${w.name}</td><td>${w.date}</td><td>${w.time}</td><td>${w.place}</td><td>${w.category}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editWorkshop(${w.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteWorkshop(${w.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    alert(err.message);
  }
}

// Abrir modal inscripción
function openRegister(id) {
  document.getElementById("registerWorkshopId").value = id;
  new bootstrap.Modal(document.getElementById("registerModal")).show();
}

// Enviar inscripción
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("registerWorkshopId").value;
  const student = document.getElementById("studentName").value;

  try {
    const resp = await fetch(`${API_URL}/workshops/${id}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({student})
    });
    if (resp.ok) {
      alert("Inscripción realizada correctamente");
      bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
      loadWorkshops();
    } else {
      alert("Error al inscribirse");
    }
  } catch {
    alert("No se pudo conectar con la API");
  }
});

// Nuevo taller
document.getElementById("newWorkshopForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    place: document.getElementById("place").value,
    category: document.getElementById("category").value
  };

  try {
    const resp = await fetch(`${API_URL}/workshops`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (resp.ok) {
      alert("Taller registrado correctamente");
      bootstrap.Modal.getInstance(document.getElementById("newWorkshopModal")).hide();
      loadWorkshops();
    } else {
      alert("Error al registrar el taller");
    }
  } catch {
    alert("No se pudo conectar con la API");
  }
});

// Eliminar taller
async function deleteWorkshop(id) {
  try {
    const resp = await fetch(`${API_URL}/workshops/${id}`, { method: "DELETE" });
    if (resp.ok) {
      alert("Taller eliminado");
      loadWorkshops();
    } else {
      alert("Error al eliminar el taller");
    }
  } catch {
    alert("No se pudo conectar con la API");
  }
}

// Inicializar
loadWorkshops();
