document.addEventListener('DOMContentLoaded', () => {
    
    // --- DATA ---
    const projects = [
        { name: "Project Cygnus", progress: 85, status: "On Track" },
        { name: "Project Orion", progress: 40, status: "At Risk" },
        { name: "Project Vega", progress: 100, status: "Completed" },
        { name: "Project Draco", progress: 62, status: "Delayed" },
    ];

    let tasks = {
        todo: [
            { id: 'task-1', title: "Design new login flow", tag: { text: 'UI/UX', color: '#FF7B54' } },
            { id: 'task-2', title: "Develop API documentation", tag: { text: 'Backend', color: '#54A0FF' } },
        ],
        inprogress: [
            { id: 'task-3', title: "Build user profile page", tag: { text: 'Frontend', color: '#F8B400' } },
            { id: 'task-4', title: "Set up CI/CD pipeline", tag: { text: 'DevOps', color: '#9D5CFF' } },
        ],
        done: [
            { id: 'task-5', title: "Create database schema", tag: { text: 'Backend', color: '#54A0FF' } },
        ]
    };

    const team = [
        { name: 'Eva Rostova', role: 'Lead Developer', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Kenji Tanaka', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Maria Garcia', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=8' },
    ];
    
    const activity = [
        { text: 'Kenji Tanaka pushed new commits to UI branch.', time: '15 minutes ago' },
        { text: 'Maria Garcia updated the status of Project Orion.', time: '1 hour ago' },
        { text: 'Eva Rostova completed task "Create database schema".', time: '4 hours ago' },
    ];

    const header = document.getElementById('app-header');
    const main = document.getElementById('app-main');
    const aside = document.getElementById('app-aside');
    const profilePicInput = document.getElementById('profile-pic-input');

    // --- RENDER FUNCTIONS ---
    
    function renderHeader() {
        header.innerHTML = `
            <div class="logo" data-nav-to="top">NEXUS</div>
            <nav class="main-nav">
                <a data-nav-to="top" class="active">Dashboard</a>
                <a data-nav-to="projects">Projects</a>
                <a data-nav-to="tasks">Tasks</a>
            </nav>
            <input type="text" id="search-bar" placeholder="Search projects or tasks...">
            <div class="header-actions">
                <button class="icon-button" id="search-btn"><i data-lucide="search"></i></button>
                <button class="icon-button" id="toggle-aside"><i data-lucide="users"></i></button>
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" class="profile-button" id="profile-btn">
            </div>
        `;
    }

    function renderMainContent() {
        main.innerHTML = `
            <section id="dashboard-top">
                <h1 class="main-title">Team Dashboard</h1>
                <p class="main-subtitle">Welcome back, Alex. Here's your project overview.</p>
            </section>
            
            <section id="projects-section" class="projects-overview">
                ${projects.map(renderProjectCard).join('')}
            </section>
            
            <section id="tasks-section" class="task-board-container">
                <h2 class="main-title">Task Board</h2>
                <div class="task-board" id="task-board">
                    ${renderTaskColumn('To Do', 'todo', tasks.todo)}
                    ${renderTaskColumn('In Progress', 'inprogress', tasks.inprogress)}
                    ${renderTaskColumn('Done', 'done', tasks.done)}
                </div>
            </section>
        `;
    }
    
    function renderProjectCard(project) {
        const circumference = 2 * Math.PI * 55;
        const offset = circumference - (project.progress / 100) * circumference;
        return `
            <div class="project-card panel" data-searchable-name="${project.name.toLowerCase()}">
                <div class="progress-ring">
                    <svg width="120" height="120">
                        <circle class="ring-bg" cx="60" cy="60" r="55" />
                        <circle class="ring-fg" cx="60" cy="60" r="55" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
                    </svg>
                    <div class="progress-percent">${project.progress}%</div>
                </div>
                <h3>${project.name}</h3>
                <p>${project.status}</p>
            </div>
        `;
    }
    
    function renderTaskColumn(title, id, taskItems) {
        const addTaskUI = id === 'todo' ? `
            <button class="add-task-btn">+ Add Task</button>
            <form class="add-task-form">
                <input type="text" placeholder="Enter task title..." required />
            </form>
        ` : '';

        return `
            <div class="task-column" id="${id}" data-column-id="${id}">
                <h3><i data-lucide="list"></i> ${title} <span class="task-count">${taskItems.length}</span></h3>
                <div class="tasks-wrapper">
                    ${taskItems.map(renderTaskCard).join('')}
                </div>
                ${addTaskUI}
            </div>
        `;
    }

    function renderTaskCard(task) {
        return `
            <div class="task-card panel" draggable="true" data-task-id="${task.id}" data-searchable-name="${task.title.toLowerCase()}">
                <span class="task-tag" style="background-color:${task.tag.color}33; color:${task.tag.color};">${task.tag.text}</span>
                <p>${task.title}</p>
            </div>
        `;
    }

    function renderAside() {
        aside.innerHTML = `
            <div class="panel" style="height: 100%; display: flex; flex-direction: column;">
                <h2 class="aside-title">Team Members</h2>
                <div class="team-list">
                    ${team.map(member => `<div class="team-member"><img src="${member.avatar}" alt="${member.name}"><div><div class="member-name">${member.name}</div><div class="member-role">${member.role}</div></div></div>`).join('')}
                </div>
                <h2 class="aside-title" style="margin-top: 30px;">Activity Feed</h2>
                <div class="activity-feed">
                    ${activity.map(item => `<div class="activity-item"><p>${item.text}</p><div class="activity-time">${item.time}</div></div>`).join('')}
                </div>
            </div>
        `;
    }
    
    // --- INTERACTIVITY ---

    function attachDragEvents(card) {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    }

    function addEventListeners() {
        // --- Smooth Scroll Navigation ---
        document.querySelectorAll('[data-nav-to]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-nav-to');
                if (targetId === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    document.getElementById(`${targetId}-section`).scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // --- Toggle Aside Panel ---
        document.getElementById('toggle-aside').addEventListener('click', () => {
            aside.classList.toggle('collapsed');
        });
        
        // --- Profile Picture Change ---
        document.getElementById('profile-btn').addEventListener('click', () => {
            profilePicInput.click();
        });
        profilePicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('profile-btn').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // --- Search Bar Logic ---
        const searchBtn = document.getElementById('search-btn');
        const searchBar = document.getElementById('search-bar');
        searchBtn.addEventListener('click', () => {
            searchBar.classList.toggle('active');
            searchBar.focus();
        });
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('[data-searchable-name]').forEach(item => {
                const itemName = item.getAttribute('data-searchable-name');
                if (itemName.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // --- Drag and Drop for Kanban Board ---
        document.querySelectorAll('.task-card').forEach(attachDragEvents);
        const taskColumns = document.querySelectorAll('.tasks-wrapper');
        taskColumns.forEach(column => {
            column.addEventListener('dragover', e => {
                e.preventDefault();
                const draggingCard = document.querySelector('.dragging');
                if (draggingCard) {
                    column.appendChild(draggingCard);
                }
            });
        });

        // --- Add Task Functionality ---
        const addTaskBtn = document.querySelector('.add-task-btn');
        const addTaskForm = document.querySelector('.add-task-form');
        const taskInput = addTaskForm.querySelector('input');
        
        addTaskBtn.addEventListener('click', () => {
            addTaskForm.classList.toggle('active');
            taskInput.focus();
        });
        
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTitle = taskInput.value.trim();
            if (newTitle) {
                const newTask = {
                    id: `task-${Date.now()}`,
                    title: newTitle,
                    tag: { text: 'General', color: '#8884d8' } // Default tag
                };
                tasks.todo.push(newTask);
                const newTaskCardHTML = renderTaskCard(newTask);
                const todoWrapper = document.getElementById('todo').querySelector('.tasks-wrapper');
                
                // Create element from string and append
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newTaskCardHTML;
                const newTaskCardElement = tempDiv.firstElementChild;
                
                todoWrapper.appendChild(newTaskCardElement);
                attachDragEvents(newTaskCardElement); // Make the new card draggable

                taskInput.value = '';
                addTaskForm.classList.remove('active');
                
                // Update task count
                const countSpan = document.getElementById('todo').querySelector('.task-count');
                countSpan.textContent = tasks.todo.length;
            }
        });
    }

    // --- INITIALIZATION ---
    function init() {
        renderHeader();
        renderMainContent();
        renderAside();
        lucide.createIcons();
        addEventListeners();
    }

    init();
});

