document.addEventListener('DOMContentLoaded', () => {
    const daysContainer = document.getElementById('days');
    const monthYearDisplay = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const taskForm = document.getElementById('task-form');
    const taskDateInput = document.getElementById('task-date');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    let currentDate = new Date();

    // Inicializar calendario y lista de tareas
    renderCalendar();
    renderTaskList();

    // Navegar por los meses
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Añadir tarea
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        if (taskText && taskDate) {
            addTask(taskDate, taskText);
            taskInput.value = '';
            renderCalendar();
            renderTaskList();
        }
    });

    // Renderizar el calendario
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = lastDayOfMonth.getDate();

        monthYearDisplay.textContent = `${firstDayOfMonth.toLocaleString('default', { month: 'long' })} ${year}`;
        daysContainer.innerHTML = '';

        for (let i = 0; i < firstDayOfWeek; i++) {
            daysContainer.innerHTML += `<div></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const tasksForDay = getTasksForDate(dateString);
            let tasksHtml = '';
            tasksForDay.forEach((task, index) => {
                tasksHtml += `<div class="task">${task} <button class="delete-task" data-date="${dateString}" data-index="${index}">X</button></div>`;
            });

            daysContainer.innerHTML += `<div data-date="${dateString}" class="day">${day}${tasksHtml}</div>`;
        }

        // Añadir evento para los botones de borrar tarea
        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', deleteTask);
        });

        // Añadir evento para seleccionar una fecha del calendario
        document.querySelectorAll('.day').forEach(day => {
            day.addEventListener('click', () => {
                selectDate(day.getAttribute('data-date'));
            });
        });
    }

    // Renderizar la lista de tareas
    function renderTaskList() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        taskList.innerHTML = '';

        for (const date in storedTasks) {
            storedTasks[date].forEach((task, index) => {
                const li = document.createElement('li');
                li.textContent = `${task} (${date}) `;
                const goToCalendarBtn = document.createElement('button');
                goToCalendarBtn.textContent = 'Ir al calendario';
                goToCalendarBtn.addEventListener('click', () => {
                    jumpToDate(date);
                });
                li.appendChild(goToCalendarBtn);
                taskList.appendChild(li);
            });
        }
    }

    // Obtener tareas para una fecha
    function getTasksForDate(date) {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        return storedTasks[date] || [];
    }

    // Añadir tarea a una fecha
    function addTask(date, task) {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        if (!storedTasks[date]) {
            storedTasks[date] = [];
        }
        storedTasks[date].push(task);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    // Borrar tarea de una fecha
    function deleteTask(event) {
        const date = event.target.getAttribute('data-date');
        const index = event.target.getAttribute('data-index');
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || {};

        if (storedTasks[date]) {
            storedTasks[date].splice(index, 1); // Eliminar tarea del array
            if (storedTasks[date].length === 0) {
                delete storedTasks[date]; // Eliminar la fecha si no tiene tareas
            }
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
            renderCalendar(); // Actualizar el calendario
            renderTaskList(); // Actualizar la lista de tareas
        }
    }

    // Saltar a una fecha en el calendario
    function jumpToDate(date) {
        const [year, month, day] = date.split('-').map(Number);
        currentDate = new Date(year, month - 1, day);
        renderCalendar();
    }

    // Seleccionar fecha al hacer clic en el calendario
    function selectDate(date) {
        taskDateInput.value = date;
        taskInput.focus();
    }
});
