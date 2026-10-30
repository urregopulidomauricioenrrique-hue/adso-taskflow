// Importar los módulos necesarios de Firebase desde los CDNs oficiales
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Pega aquí los datos exactos de tu "firebaseConfig" que copiaste de la consola
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias a los elementos del HTML
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// 1. CREAR TAREA (Operación CRUD: Add)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        await addDoc(collection(db, "tasks"), {
            text: taskInput.value,
            createdAt: serverTimestamp()
        });
        taskInput.value = ''; // Limpiar la caja de texto después de enviar
    } catch (error) {
        console.error("Error al agregar la tarea: ", error);
    }
});

// 2. LEER EN TIEMPO REAL (Servicio Modular: onSnapshot)
// Esto actualiza la interfaz automáticamente en la pantalla sin necesidad de recargar la página
onSnapshot(collection(db, "tasks"), (querySnapshot) => {
    taskList.innerHTML = ''; // Limpiar la lista actual para redibujar los cambios
    
    if (querySnapshot.empty) {
        taskList.innerHTML = `<p class="text-slate-400 text-sm text-center py-4">No hay tareas creadas todavía.</p>`;
        return;
    }

    querySnapshot.forEach((docSnap) => {
        const task = docSnap.data();
        const taskId = docSnap.id;

        const li = document.createElement('li');
        li.className = "flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm";
        
        li.innerHTML = `
            <span class="text-slate-700 font-medium">${task.text}</span>
            <button onclick="window.deleteTask('${taskId}')" class="text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1 rounded transition-colors">
                Eliminar
            </button>
        `;
        
        taskList.appendChild(li);
    });
});

// 3. BORRAR TAREA (Operación CRUD: Delete)
window.deleteTask = async (id) => {
    try {
        await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
        console.error("Error al eliminar la tarea: ", error);
    }
};