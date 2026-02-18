// ===================================
// STUDYHUB PRO - MAIN APPLICATION
// ===================================

class StudyHubApp {
    constructor() {
        this.currentView = 'dashboard';
        this.db = null;
        this.aiConfig = new AIConfig();
        this.advancedFeatures = null; // Se inicializa después de la DB
        this.initializeApp();
    }

    // Initialize Application
    async initializeApp() {
        await this.initDatabase();
        this.advancedFeatures = new AdvancedFeatures(this);
        window.advancedFeatures = this.advancedFeatures; // Global access
        this.setupEventListeners();
        this.loadDashboardData();
        this.advancedFeatures.updateStreak();
        this.showToast('¡Bienvenido a StudyHub Pro!', 'success');
    }

    // ===================================
    // DATABASE MANAGEMENT (IndexedDB)
    // ===================================

    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('StudyHubDB', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('notes')) {
                    const notesStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
                    notesStore.createIndex('subject', 'subject', { unique: false });
                    notesStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                if (!db.objectStoreNames.contains('tasks')) {
                    const tasksStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
                    tasksStore.createIndex('dueDate', 'dueDate', { unique: false });
                    tasksStore.createIndex('priority', 'priority', { unique: false });
                }

                if (!db.objectStoreNames.contains('files')) {
                    const filesStore = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
                    filesStore.createIndex('type', 'type', { unique: false });
                    filesStore.createIndex('uploadedAt', 'uploadedAt', { unique: false });
                }

                if (!db.objectStoreNames.contains('aiChats')) {
                    const chatsStore = db.createObjectStore('aiChats', { keyPath: 'id', autoIncrement: true });
                    chatsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                if (!db.objectStoreNames.contains('pomodoroSessions')) {
                    const pomodoroStore = db.createObjectStore('pomodoroSessions', { keyPath: 'id', autoIncrement: true });
                    pomodoroStore.createIndex('date', 'date', { unique: false });
                }

                if (!db.objectStoreNames.contains('voiceNotes')) {
                    const voiceStore = db.createObjectStore('voiceNotes', { keyPath: 'id', autoIncrement: true });
                    voiceStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    // Generic DB Operations
    async dbOperation(storeName, operation, data = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], operation === 'get' || operation === 'getAll' ? 'readonly' : 'readwrite');
            const store = transaction.objectStore(storeName);

            let request;
            switch (operation) {
                case 'add':
                    request = store.add(data);
                    break;
                case 'put':
                    request = store.put(data);
                    break;
                case 'delete':
                    request = store.delete(data);
                    break;
                case 'get':
                    request = store.get(data);
                    break;
                case 'getAll':
                    request = store.getAll();
                    break;
            }

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ===================================
    // EVENT LISTENERS
    // ===================================

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);
            });
        });

        // Quick Actions
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', (e) => {
                const actionType = action.dataset.action;
                this.handleQuickAction(actionType);
            });
        });

        // Refresh Button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadDashboardData();
                this.showToast('Datos actualizados', 'success');
            });
        }
    }

    // ===================================
    // VIEW MANAGEMENT
    // ===================================

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}-view`);
        targetView.classList.add('active');

        this.currentView = viewName;

        // Load view-specific content
        this.loadViewContent(viewName);
    }

    async loadViewContent(viewName) {
        switch (viewName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'agenda':
                this.loadAgendaView();
                break;
            case 'notes':
                this.loadNotesView();
                break;
            case 'ai-assistant':
                this.loadAIAssistantView();
                break;
            case 'library':
                this.loadLibraryView();
                break;
            case 'repositories':
                this.loadRepositoriesView();
                break;
            case 'academic-calendar':
                this.loadAcademicCalendarView();
                break;
            case 'pomodoro':
                this.loadPomodoroView();
                break;
            case 'statistics':
                this.loadStatisticsView();
                break;
            case 'settings':
                this.loadSettingsView();
                break;
        }
    }

    // ===================================
    // DASHBOARD
    // ===================================

    async loadDashboardData() {
        try {
            const tasks = await this.dbOperation('tasks', 'getAll');
            const notes = await this.dbOperation('notes', 'getAll');
            const aiChats = await this.dbOperation('aiChats', 'getAll');

            // Update stats
            const pendingTasks = tasks.filter(t => !t.completed).length;
            document.getElementById('pendingTasks').textContent = pendingTasks;
            document.getElementById('totalNotes').textContent = notes.length;

            const todayChats = aiChats.filter(chat => {
                const chatDate = new Date(chat.timestamp);
                const today = new Date();
                return chatDate.toDateString() === today.toDateString();
            }).length;
            document.getElementById('aiQueries').textContent = todayChats;

            // Update activity
            this.updateRecentActivity();

            // Render mini calendar
            this.renderMiniCalendar();
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recentActivity');
        // This will be populated with real data
        // For now, showing welcome message
    }

    renderMiniCalendar() {
        const calendarDiv = document.getElementById('miniCalendar');
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        let html = `
            <div style="text-align: center; margin-bottom: 1rem; font-weight: 600;">
                ${monthNames[month]} ${year}
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">D</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">L</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">M</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">X</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">J</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">V</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">S</div>
        `;

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === now.getDate();
            html += `
                <div style="
                    padding: 0.5rem;
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    ${isToday ? 'background: var(--accent-gradient); color: white; font-weight: 700;' : 'color: var(--text-secondary);'}
                " onmouseover="this.style.background='var(--bg-elevated)'" onmouseout="this.style.background='${isToday ? 'var(--accent-gradient)' : 'transparent'}'">
                    ${day}
                </div>
            `;
        }

        html += '</div>';
        calendarDiv.innerHTML = html;
    }

    // ===================================
    // AGENDA VIEW
    // ===================================

    async loadAgendaView() {
        const view = document.getElementById('agenda-view');
        view.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Agenda</h2>
                    <p class="view-subtitle">Gestiona tus tareas y eventos</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.createNewTask()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 5v14m-7-7h14"/>
                        </svg>
                        Nueva Tarea
                    </button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-xl);">
                <div class="glass-card" style="padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">Tareas Pendientes</h3>
                    <div id="tasksList"></div>
                </div>
                
                <div class="glass-card" style="padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">Calendario</h3>
                    <div id="fullCalendar"></div>
                </div>
            </div>
        `;

        await this.loadTasks();
    }

    async loadTasks() {
        const tasks = await this.dbOperation('tasks', 'getAll');
        const tasksList = document.getElementById('tasksList');

        if (tasks.length === 0) {
            tasksList.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-2xl); color: var(--text-tertiary);">
                    <p>No hay tareas pendientes</p>
                    <p style="font-size: 0.875rem; margin-top: var(--spacing-sm);">¡Crea tu primera tarea!</p>
                </div>
            `;
            return;
        }

        tasksList.innerHTML = tasks.map(task => `
            <div class="task-item" style="
                padding: var(--spacing-lg);
                background: var(--bg-elevated);
                border-radius: var(--radius-lg);
                margin-bottom: var(--spacing-md);
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                transition: all var(--transition-base);
            " onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="app.toggleTask(${task.id})"
                       style="width: 20px; height: 20px; cursor: pointer;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; ${task.completed ? 'text-decoration: line-through; color: var(--text-tertiary);' : ''}">${task.title}</div>
                    ${task.dueDate ? `<div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">📅 ${new Date(task.dueDate).toLocaleDateString('es-ES')}</div>` : ''}
                </div>
                <span class="priority-badge" style="
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    font-weight: 600;
                    ${task.priority === 'high' ? 'background: var(--error); color: white;' :
                task.priority === 'medium' ? 'background: var(--warning); color: white;' :
                    'background: var(--success); color: white;'}
                ">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</span>
            </div>
        `).join('');
    }

    createNewTask() {
        const modal = this.createModal('Nueva Tarea', `
            <form id="taskForm" style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
                <div>
                    <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Título</label>
                    <input type="text" name="title" required 
                           style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans);">
                </div>
                <div>
                    <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Descripción</label>
                    <textarea name="description" rows="3"
                              style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans); resize: vertical;"></textarea>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                    <div>
                        <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Fecha límite</label>
                        <input type="date" name="dueDate"
                               style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Prioridad</label>
                        <select name="priority"
                                style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans);">
                            <option value="low">Baja</option>
                            <option value="medium" selected>Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top: var(--spacing-md);">Crear Tarea</button>
            </form>
        `);

        document.getElementById('taskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const task = {
                title: formData.get('title'),
                description: formData.get('description'),
                dueDate: formData.get('dueDate'),
                priority: formData.get('priority'),
                completed: false,
                createdAt: new Date().toISOString()
            };

            await this.dbOperation('tasks', 'add', task);
            this.closeModal();
            this.showToast('Tarea creada exitosamente', 'success');
            await this.loadTasks();
            this.loadDashboardData();
        });
    }

    async toggleTask(taskId) {
        const task = await this.dbOperation('tasks', 'get', taskId);
        task.completed = !task.completed;
        await this.dbOperation('tasks', 'put', task);
        await this.loadTasks();
        this.loadDashboardData();
    }

    // ===================================
    // NOTES VIEW
    // ===================================

    async loadNotesView() {
        const view = document.getElementById('notes-view');
        view.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Notas</h2>
                    <p class="view-subtitle">Organiza tus apuntes y conocimientos</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.createNewNote()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 5v14m-7-7h14"/>
                        </svg>
                        Nueva Nota
                    </button>
                </div>
            </div>
            
            <div id="notesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-xl);"></div>
        `;

        await this.loadNotes();
    }

    async loadNotes() {
        const notes = await this.dbOperation('notes', 'getAll');
        const notesGrid = document.getElementById('notesGrid');

        if (notes.length === 0) {
            notesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-2xl); color: var(--text-tertiary);">
                    <p>No hay notas guardadas</p>
                    <p style="font-size: 0.875rem; margin-top: var(--spacing-sm);">¡Crea tu primera nota!</p>
                </div>
            `;
            return;
        }

        notesGrid.innerHTML = notes.map(note => `
            <div class="glass-card" style="
                padding: var(--spacing-xl);
                cursor: pointer;
                transition: all var(--transition-base);
            " onclick="app.viewNote(${note.id})" 
               onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-xl)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow=''">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
                    <h3 style="font-size: 1.125rem; font-weight: 700;">${note.title}</h3>
                    ${note.subject ? `<span style="padding: 0.25rem 0.75rem; background: var(--accent-gradient); color: white; border-radius: var(--radius-sm); font-size: 0.75rem;">${note.subject}</span>` : ''}
                </div>
                <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    ${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}
                </p>
                <div style="margin-top: var(--spacing-lg); font-size: 0.75rem; color: var(--text-tertiary);">
                    📅 ${new Date(note.createdAt).toLocaleDateString('es-ES')}
                </div>
            </div>
        `).join('');
    }

    createNewNote() {
        const modal = this.createModal('Nueva Nota', `
            <form id="noteForm" style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
                <div>
                    <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Título</label>
                    <input type="text" name="title" required 
                           style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans);">
                </div>
                <div>
                    <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Asignatura</label>
                    <input type="text" name="subject"
                           style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans);">
                </div>
                <div>
                    <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Contenido</label>
                    <textarea name="content" rows="10" required
                              style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans); resize: vertical;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Guardar Nota</button>
            </form>
        `);

        document.getElementById('noteForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const note = {
                title: formData.get('title'),
                subject: formData.get('subject'),
                content: formData.get('content'),
                createdAt: new Date().toISOString()
            };

            await this.dbOperation('notes', 'add', note);
            this.closeModal();
            this.showToast('Nota guardada exitosamente', 'success');
            await this.loadNotes();
            this.loadDashboardData();
        });
    }

    async viewNote(noteId) {
        const note = await this.dbOperation('notes', 'get', noteId);
        const modal = this.createModal(note.title, `
            <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
                ${note.subject ? `<div><span style="padding: 0.25rem 0.75rem; background: var(--accent-gradient); color: white; border-radius: var(--radius-sm); font-size: 0.75rem;">${note.subject}</span></div>` : ''}
                <div style="color: var(--text-secondary); line-height: 1.8; white-space: pre-wrap;">${note.content}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary); padding-top: var(--spacing-lg); border-top: 1px solid var(--glass-border);">
                    Creada el ${new Date(note.createdAt).toLocaleDateString('es-ES')} a las ${new Date(note.createdAt).toLocaleTimeString('es-ES')}
                </div>
                <div style="display: flex; gap: var(--spacing-md);">
                    <button class="btn btn-secondary" onclick="app.editNote(${noteId})">Editar</button>
                    <button class="btn btn-secondary" onclick="app.deleteNote(${noteId})" style="background: var(--error); border-color: var(--error);">Eliminar</button>
                </div>
            </div>
        `);
    }

    async deleteNote(noteId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            await this.dbOperation('notes', 'delete', noteId);
            this.closeModal();
            this.showToast('Nota eliminada', 'success');
            await this.loadNotes();
            this.loadDashboardData();
        }
    }

    // ===================================
    // AI ASSISTANT VIEW
    // ===================================

    async loadAIAssistantView() {
        const view = document.getElementById('ai-assistant-view');
        view.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>IA Personal</h2>
                    <p class="view-subtitle">Tu asistente inteligente para estudiar</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-xl); height: calc(100vh - 200px);">
                <div class="glass-card" style="padding: var(--spacing-xl); display: flex; flex-direction: column;">
                    <div id="chatMessages" style="flex: 1; overflow-y: auto; margin-bottom: var(--spacing-lg);"></div>
                    <div style="display: flex; gap: var(--spacing-md);">
                        <input type="text" id="chatInput" placeholder="Pregunta lo que quieras..."
                               style="flex: 1; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans);">
                        <button class="btn btn-primary" onclick="app.sendAIMessage()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                            Enviar
                        </button>
                    </div>
                </div>
                
                <div class="glass-card" style="padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">Subir Archivos</h3>
                    <div style="border: 2px dashed var(--glass-border); border-radius: var(--radius-lg); padding: var(--spacing-2xl); text-align: center; cursor: pointer; transition: all var(--transition-base);"
                         onclick="document.getElementById('fileInput').click()"
                         onmouseover="this.style.borderColor='var(--accent-primary)'; this.style.background='var(--bg-elevated)'"
                         onmouseout="this.style.borderColor='var(--glass-border)'; this.style.background='transparent'">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 48px; height: 48px; margin: 0 auto var(--spacing-md); color: var(--accent-primary);">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Arrastra archivos aquí o haz clic</p>
                        <p style="color: var(--text-tertiary); font-size: 0.75rem; margin-top: var(--spacing-sm);">PDF, imágenes, PowerPoint, CSV, JSON...</p>
                    </div>
                    <input type="file" id="fileInput" multiple style="display: none;" onchange="app.handleFileUpload(event)">
                    
                    <div id="uploadedFiles" style="margin-top: var(--spacing-lg);"></div>
                    
                    <div style="margin-top: var(--spacing-xl);">
                        <h4 style="margin-bottom: var(--spacing-md); font-size: 0.875rem; color: var(--text-secondary);">Acciones Rápidas</h4>
                        <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--spacing-sm);" onclick="app.aiAction('resume')">
                            📝 Generar Resumen
                        </button>
                        <button class="btn btn-secondary" style="width: 100%; margin-bottom: var(--spacing-sm);" onclick="app.aiAction('flashcards')">
                            🎴 Crear Flashcards
                        </button>
                        <button class="btn btn-secondary" style="width: 100%;" onclick="app.aiAction('quiz')">
                            ❓ Generar Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.loadChatHistory();

        // Enter key to send message
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAIMessage();
            }
        });
    }

    async loadChatHistory() {
        const chats = await this.dbOperation('aiChats', 'getAll');
        const chatMessages = document.getElementById('chatMessages');

        if (chats.length === 0) {
            chatMessages.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-2xl); color: var(--text-tertiary);">
                    <p>👋 ¡Hola! Soy tu asistente de IA personal</p>
                    <p style="font-size: 0.875rem; margin-top: var(--spacing-sm);">Puedo ayudarte con:</p>
                    <ul style="list-style: none; margin-top: var(--spacing-md); font-size: 0.875rem;">
                        <li>✅ Resolver ejercicios y tareas</li>
                        <li>✅ Analizar documentos (PDF, imágenes, etc.)</li>
                        <li>✅ Crear resúmenes y apuntes</li>
                        <li>✅ Generar flashcards y quizzes</li>
                        <li>✅ Responder preguntas sobre tus materiales</li>
                    </ul>
                </div>
            `;
            return;
        }

        chatMessages.innerHTML = chats.map(chat => `
            <div style="margin-bottom: var(--spacing-lg);">
                <div style="background: var(--bg-elevated); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-sm);">
                    <strong>Tú:</strong> ${chat.userMessage}
                </div>
                <div style="background: var(--accent-gradient); padding: var(--spacing-md); border-radius: var(--radius-lg); color: white;">
                    <strong>IA:</strong> ${chat.aiResponse}
                </div>
            </div>
        `).join('');

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async sendAIMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        // Check if AI is configured
        if (!this.aiConfig.isConfigured()) {
            this.showToast('Por favor, configura tu API de IA en Configuración', 'warning');
            this.switchView('settings');
            return;
        }

        input.value = '';

        // Add user message to chat
        const chatMessages = document.getElementById('chatMessages');
        const userMessageDiv = document.createElement('div');
        userMessageDiv.style.marginBottom = 'var(--spacing-lg)';
        userMessageDiv.innerHTML = `
            <div style="background: var(--bg-elevated); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-sm);">
                <strong>Tú:</strong> ${message}
            </div>
            <div id="ai-response-temp" style="background: var(--accent-gradient); padding: var(--spacing-md); border-radius: var(--radius-lg); color: white;">
                <strong>IA:</strong> <span class="typing-indicator">●●●</span>
            </div>
        `;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Send to real AI
            const aiResponse = await this.aiConfig.sendMessage(message, {
                subject: 'general',
                studentLevel: 'intermediate'
            });

            // Humanize response
            const humanizedResponse = this.aiConfig.humanizeResponse(aiResponse);

            // Save to database
            await this.dbOperation('aiChats', 'add', {
                userMessage: message,
                aiResponse: humanizedResponse,
                provider: this.aiConfig.currentProvider,
                timestamp: new Date().toISOString()
            });

            // Update UI
            await this.loadChatHistory();
            this.loadDashboardData();

        } catch (error) {
            console.error('Error al enviar mensaje:', error);

            // Show error in chat
            const tempResponse = document.getElementById('ai-response-temp');
            if (tempResponse) {
                tempResponse.innerHTML = `<strong>IA:</strong> <em style="color: #ff6b6b;">Error: ${error.message}</em>`;
            }

            this.showToast('Error al conectar con la IA: ' + error.message, 'error');
        }
    }

    generateAIResponse(message) {
        // This is a placeholder. You'll integrate with real AI API (OpenAI, Gemini, etc.)
        const responses = [
            `Entiendo tu pregunta sobre "${message}". Para integrarte con una IA real, necesitarás configurar una API key en la sección de Configuración. Puedo ayudarte con OpenAI, Google Gemini, o Anthropic Claude.`,
            `Interesante pregunta. Una vez que configures tu API de IA, podré darte respuestas detalladas y ayudarte con tus estudios de forma mucho más efectiva.`,
            `Para poder ayudarte mejor con "${message}", te recomiendo que configures la integración con IA en Configuración. Mientras tanto, puedo guardar tus preguntas para cuando esté lista.`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        const uploadedFilesDiv = document.getElementById('uploadedFiles');

        for (const file of files) {
            // Save file info to database
            const fileData = {
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString()
            };

            await this.dbOperation('files', 'add', fileData);

            // Show in UI
            uploadedFilesDiv.innerHTML += `
                <div style="padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md); margin-bottom: var(--spacing-sm); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span>📄</span>
                    <div style="flex: 1;">
                        <div style="font-size: 0.875rem; font-weight: 600;">${file.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-tertiary);">${(file.size / 1024).toFixed(2)} KB</div>
                    </div>
                </div>
            `;
        }

        this.showToast(`${files.length} archivo(s) subido(s)`, 'success');
    }

    async aiAction(action) {
        if (!this.aiConfig.isConfigured()) {
            this.showToast('Por favor, configura tu API de IA en Configuración', 'warning');
            this.switchView('settings');
            return;
        }

        const actions = {
            resume: 'generar un resumen',
            flashcards: 'crear flashcards',
            quiz: 'generar un quiz'
        };

        // Get latest note or ask for text
        const notes = await this.dbOperation('notes', 'getAll');

        if (notes.length === 0) {
            this.showToast('Primero crea una nota para usar esta función', 'info');
            return;
        }

        // Use the most recent note
        const latestNote = notes[notes.length - 1];

        this.showToast(`Generando ${actions[action]}...`, 'info');

        try {
            let result;
            switch (action) {
                case 'resume':
                    result = await this.aiConfig.generateSummary(latestNote.content);
                    break;
                case 'flashcards':
                    result = await this.aiConfig.generateFlashcards(latestNote.content);
                    break;
                case 'quiz':
                    result = await this.aiConfig.generateQuiz(latestNote.content);
                    break;
            }

            // Show result in modal
            this.createModal(`${actions[action].charAt(0).toUpperCase() + actions[action].slice(1)} - ${latestNote.title}`, `
                <div style="white-space: pre-wrap; line-height: 1.8; color: var(--text-secondary);">
                    ${result}
                </div>
                <button class="btn btn-primary" style="margin-top: var(--spacing-lg);" onclick="app.saveAsNote('${action}', \`${result.replace(/`/g, '\\`')}\`)">
                    Guardar como Nota
                </button>
            `);

        } catch (error) {
            console.error('Error en acción de IA:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    }

    async saveAsNote(type, content) {
        const titles = {
            resume: 'Resumen Generado por IA',
            flashcards: 'Flashcards Generadas por IA',
            quiz: 'Quiz Generado por IA'
        };

        await this.dbOperation('notes', 'add', {
            title: titles[type] || 'Nota de IA',
            subject: 'IA',
            content: content,
            createdAt: new Date().toISOString()
        });

        this.closeModal();
        this.showToast('Guardado como nota', 'success');
        this.loadDashboardData();
    }

    // ===================================
    // LIBRARY VIEW
    // ===================================

    async loadLibraryView() {
        const view = document.getElementById('library-view');
        view.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Biblioteca</h2>
                    <p class="view-subtitle">Todos tus apuntes y archivos organizados</p>
                </div>
            </div>
            
            <div style="margin-bottom: var(--spacing-xl);">
                <input type="text" id="searchLibrary" placeholder="Buscar en biblioteca..."
                       style="width: 100%; max-width: 500px; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans);">
            </div>
            
            <div id="libraryContent"></div>
        `;

        await this.loadLibraryContent();
    }

    async loadLibraryContent() {
        const notes = await this.dbOperation('notes', 'getAll');
        const files = await this.dbOperation('files', 'getAll');
        const libraryContent = document.getElementById('libraryContent');

        const allItems = [
            ...notes.map(n => ({ ...n, type: 'note' })),
            ...files.map(f => ({ ...f, type: 'file' }))
        ].sort((a, b) => new Date(b.createdAt || b.uploadedAt) - new Date(a.createdAt || a.uploadedAt));

        if (allItems.length === 0) {
            libraryContent.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-2xl); color: var(--text-tertiary);">
                    <p>Tu biblioteca está vacía</p>
                    <p style="font-size: 0.875rem; margin-top: var(--spacing-sm);">Crea notas o sube archivos para empezar</p>
                </div>
            `;
            return;
        }

        libraryContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--spacing-lg);">
                ${allItems.map(item => `
                    <div class="glass-card" style="padding: var(--spacing-lg); cursor: pointer; transition: all var(--transition-base);"
                         onclick="${item.type === 'note' ? `app.viewNote(${item.id})` : ''}"
                         onmouseover="this.style.transform='translateY(-4px)'"
                         onmouseout="this.style.transform='translateY(0)'">
                        <div style="font-size: 2rem; margin-bottom: var(--spacing-md);">
                            ${item.type === 'note' ? '📝' : '📄'}
                        </div>
                        <h4 style="font-weight: 600; margin-bottom: var(--spacing-sm);">${item.title || item.name}</h4>
                        ${item.subject ? `<div style="font-size: 0.75rem; color: var(--accent-primary); margin-bottom: var(--spacing-sm);">${item.subject}</div>` : ''}
                        <div style="font-size: 0.75rem; color: var(--text-tertiary);">
                            ${new Date(item.createdAt || item.uploadedAt).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===================================
    // POMODORO VIEW
    // ===================================

    async loadPomodoroView() {
        const view = document.getElementById('pomodoro-view');
        view.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>🍅 Técnica Pomodoro</h2>
                    <p class="view-subtitle">Mejora tu concentración y productividad</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-xl);">
                <div class="glass-card" style="padding: var(--spacing-2xl);">
                    <div id="pomodoroDisplay"></div>
                </div>
                
                <div>
                    <div class="glass-card" style="padding: var(--spacing-xl); margin-bottom: var(--spacing-lg);">
                        <h3 style="margin-bottom: var(--spacing-lg);">📊 Sesiones de Hoy</h3>
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; font-weight: 800; color: var(--accent-primary);">
                                ${this.advancedFeatures.pomodoroState.sessionsCompleted}
                            </div>
                            <div style="color: var(--text-secondary); margin-top: var(--spacing-sm);">
                                Pomodoros completados
                            </div>
                        </div>
                    </div>
                    
                    <div class="glass-card" style="padding: var(--spacing-xl);">
                        <h3 style="margin-bottom: var(--spacing-lg);">ℹ️ Cómo Funciona</h3>
                        <ul style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.8;">
                            <li>25 min de trabajo enfocado</li>
                            <li>5 min de descanso corto</li>
                            <li>15 min de descanso largo cada 4 sesiones</li>
                            <li>Sin distracciones durante el trabajo</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        this.advancedFeatures.updatePomodoroDisplay();
    }

    // ===================================
    // STATISTICS VIEW
    // ===================================

    async loadStatisticsView() {
        const view = document.getElementById('statistics-view');
        const stats = await this.advancedFeatures.getStatistics();
        const streak = this.advancedFeatures.studyStreak;

        view.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>📊 Estadísticas</h2>
                    <p class="view-subtitle">Analiza tu progreso y productividad</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-xl); margin-bottom: var(--spacing-2xl);">
                <!-- Streak Card -->
                <div class="glass-card" style="padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                        <div style="font-size: 2rem;">🔥</div>
                        <h3>Racha de Estudio</h3>
                    </div>
                    <div style="font-size: 3rem; font-weight: 800; color: var(--accent-primary); margin-bottom: var(--spacing-sm);">
                        ${streak.current}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">
                        días consecutivos
                    </div>
                    <div style="margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--glass-border); font-size: 0.75rem; color: var(--text-tertiary);">
                        Récord: ${streak.longest} días
                    </div>
                </div>
                
                <!-- Completion Rate -->
                <div class="glass-card" style="padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%);">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                        <div style="font-size: 2rem;">✅</div>
                        <h3>Tasa de Completado</h3>
                    </div>
                    <div style="font-size: 3rem; font-weight: 800; color: var(--warning); margin-bottom: var(--spacing-sm);">
                        ${stats.productivity.completionRate}%
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">
                        de tareas completadas
                    </div>
                </div>
                
                <!-- Most Productive Day -->
                <div class="glass-card" style="padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%);">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                        <div style="font-size: 2rem;">📅</div>
                        <h3>Día Más Productivo</h3>
                    </div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--success); margin-bottom: var(--spacing-sm);">
                        ${stats.productivity.mostProductiveDay}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">
                        basado en actividad
                    </div>
                </div>
            </div>
            
            <!-- Detailed Stats -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-xl);">
                <!-- This Week -->
                <div class="glass-card" style="padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">📅 Esta Semana</h3>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Notas creadas</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.week.notes}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Tareas creadas</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.week.tasks}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Consultas IA</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.week.aiChats}</span>
                        </div>
                    </div>
                </div>
                
                <!-- This Month -->
                <div class="glass-card" style="padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">📊 Este Mes</h3>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Notas creadas</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.month.notes}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Tareas creadas</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.month.tasks}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Consultas IA</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.month.aiChats}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Total -->
                <div class="glass-card" style="padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">💯 Total</h3>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Notas totales</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.total.notes}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Tareas totales</span>
                            <span style="font-weight: 700; color: var(--accent-primary);">${stats.total.tasks}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--bg-elevated); border-radius: var(--radius-md);">
                            <span style="color: var(--text-secondary);">Tareas completadas</span>
                            <span style="font-weight: 700; color: var(--success);">${stats.total.completedTasks}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===================================
    // SETTINGS VIEW
    // ===================================

    async loadSettingsView() {
        const view = document.getElementById('settings-view');
        const currentProvider = this.aiConfig.currentProvider;
        const isConfigured = this.aiConfig.isConfigured();

        view.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Configuración</h2>
                    <p class="view-subtitle">Personaliza tu experiencia</p>
                </div>
            </div>
            
            <div style="max-width: 900px;">
                <!-- AI Configuration Card -->
                <div class="glass-card" style="padding: var(--spacing-xl); margin-bottom: var(--spacing-xl);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                        <h3>🤖 Integración con IA</h3>
                        <span style="padding: 0.5rem 1rem; background: ${isConfigured ? 'var(--success)' : 'var(--warning)'}; color: white; border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 700;">
                            ${isConfigured ? '✓ CONFIGURADA' : '⚠ NO CONFIGURADA'}
                        </span>
                    </div>
                    
                    <p style="color: var(--text-secondary); margin-bottom: var(--spacing-xl); font-size: 0.875rem; line-height: 1.6;">
                        Conecta tu API de IA favorita para desbloquear funcionalidades avanzadas como chat inteligente, generación de resúmenes, flashcards y quizzes.
                    </p>
                    
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
                        <div>
                            <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Proveedor de IA</label>
                            <select id="aiProvider" style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans); font-size: 1rem;">
                                <option value="">Seleccionar...</option>
                                <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>🌟 Google Gemini (GRATIS - Recomendado)</option>
                                <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>🧠 OpenAI (GPT-4)</option>
                                <option value="claude" ${currentProvider === 'claude' ? 'selected' : ''}>💬 Anthropic Claude</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">API Key</label>
                            <input type="password" id="apiKey" placeholder="Ingresa tu API key..." value="${this.aiConfig.providers[currentProvider]?.apiKey || ''}"
                                   style="width: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-mono); font-size: 0.875rem;">
                            <p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: var(--spacing-sm);">
                                Tu API key se guarda localmente en tu navegador y nunca se comparte.
                            </p>
                        </div>
                        
                        <!-- API Key Links -->
                        <div style="background: var(--bg-elevated); padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
                            <h4 style="font-size: 0.875rem; margin-bottom: var(--spacing-md); color: var(--text-secondary);">📚 Obtener API Keys:</h4>
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                                <a href="https://makersuite.google.com/app/apikey" target="_blank" style="color: var(--accent-primary); text-decoration: none; font-size: 0.875rem; display: flex; align-items: center; gap: var(--spacing-sm);">
                                    <span>→</span> Google Gemini (Gratis)
                                </a>
                                <a href="https://platform.openai.com/api-keys" target="_blank" style="color: var(--accent-primary); text-decoration: none; font-size: 0.875rem; display: flex; align-items: center; gap: var(--spacing-sm);">
                                    <span>→</span> OpenAI API Keys
                                </a>
                                <a href="https://console.anthropic.com/" target="_blank" style="color: var(--accent-primary); text-decoration: none; font-size: 0.875rem; display: flex; align-items: center; gap: var(--spacing-sm);">
                                    <span>→</span> Anthropic Claude
                                </a>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="app.saveAISettings()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                            Guardar Configuración
                        </button>
                    </div>
                </div>
                
                <!-- Data Management Card -->
                <div class="glass-card" style="padding: var(--spacing-xl); margin-bottom: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">💾 Gestión de Datos</h3>
                    <p style="color: var(--text-secondary); margin-bottom: var(--spacing-lg); font-size: 0.875rem;">
                        Exporta tus datos para hacer backup o borra todo para empezar de cero.
                    </p>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap;">
                        <button class="btn btn-secondary" onclick="app.exportData()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Exportar Datos (JSON)
                        </button>
                        <button class="btn btn-secondary" onclick="app.clearAllData()" style="background: var(--error); border-color: var(--error);">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Borrar Todos los Datos
                        </button>
                    </div>
                </div>
                
                <!-- About Card -->
                <div class="glass-card" style="padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg);">ℹ️ Acerca de StudyHub Pro</h3>
                    <div style="color: var(--text-secondary); line-height: 1.8;">
                        <p style="margin-bottom: var(--spacing-md);">
                            <strong style="color: var(--text-primary);">Versión:</strong> 1.0.0 Serverless
                        </p>
                        <p style="margin-bottom: var(--spacing-md);">
                            <strong style="color: var(--text-primary);">Modo:</strong> Sin servidor (100% Frontend)
                        </p>
                        <p style="font-size: 0.875rem; color: var(--text-tertiary);">
                            Tu asistente personal de estudio con IA integrada. Creado para ayudarte a organizar, estudiar y aprender de forma más eficiente. Todos tus datos se guardan localmente en tu navegador.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    async saveAISettings() {
        const provider = document.getElementById('aiProvider').value;
        const apiKey = document.getElementById('apiKey').value;

        if (!provider || !apiKey) {
            this.showToast('Por favor completa todos los campos', 'warning');
            return;
        }

        // Save using AIConfig
        this.aiConfig.saveApiKey(provider, apiKey);
        this.aiConfig.setProvider(provider);

        this.showToast(`✓ Configuración guardada: ${this.aiConfig.providers[provider].name}`, 'success');

        // Reload settings view to show updated status
        await this.loadSettingsView();
    }

    async exportData() {
        const notes = await this.dbOperation('notes', 'getAll');
        const tasks = await this.dbOperation('tasks', 'getAll');
        const files = await this.dbOperation('files', 'getAll');

        const data = {
            notes,
            tasks,
            files,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studyhub-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        this.showToast('Datos exportados exitosamente', 'success');
    }

    async clearAllData() {
        if (!confirm('¿Estás seguro? Esta acción no se puede deshacer.')) return;

        const stores = ['notes', 'tasks', 'files', 'aiChats'];
        for (const store of stores) {
            const transaction = this.db.transaction([store], 'readwrite');
            transaction.objectStore(store).clear();
        }

        this.showToast('Todos los datos han sido eliminados', 'success');
        this.loadDashboardData();
    }

    // ===================================
    // QUICK ACTIONS
    // ===================================

    handleQuickAction(action) {
        switch (action) {
            case 'new-note':
                this.switchView('notes');
                setTimeout(() => this.createNewNote(), 100);
                break;
            case 'new-task':
                this.switchView('agenda');
                setTimeout(() => this.createNewTask(), 100);
                break;
            case 'ask-ai':
                this.switchView('ai-assistant');
                setTimeout(() => document.getElementById('chatInput').focus(), 100);
                break;
            case 'upload-file':
                this.switchView('ai-assistant');
                setTimeout(() => document.getElementById('fileInput').click(), 100);
                break;
        }
    }

    // ===================================
    // UI UTILITIES
    // ===================================

    createModal(title, content) {
        const overlay = document.getElementById('modalOverlay');
        overlay.innerHTML = `
            <div class="glass-card" style="
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                padding: var(--spacing-2xl);
                animation: fadeIn var(--transition-base);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-xl);">
                    <h2 style="font-size: 1.5rem; font-weight: 700;">${title}</h2>
                    <button onclick="app.closeModal()" style="
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        cursor: pointer;
                        font-size: 1.5rem;
                        padding: 0;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: var(--radius-md);
                        transition: all var(--transition-fast);
                    " onmouseover="this.style.background='var(--bg-elevated)'" onmouseout="this.style.background='none'">×</button>
                </div>
                ${content}
            </div>
        `;
        overlay.classList.add('active');

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.remove('active');
        setTimeout(() => overlay.innerHTML = '', 300);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 20px; height: 20px; flex-shrink: 0;">
                ${type === 'success' ? '<polyline points="20 6 9 17 4 12"/>' :
                type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
                    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
            </svg>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn var(--transition-base) reverse';
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }

    // ===================================
    // REPOSITORIES VIEW
    // ===================================

    loadRepositoriesView() {
        const view = document.getElementById('repositories-view');
        if (typeof academicManager !== 'undefined') {
            view.innerHTML = academicManager.renderRepositoriesView();
        } else {
            view.innerHTML = `
                <div class="view-header">
                    <div>
                        <h2>📚 Mis Repositorios</h2>
                        <p class="view-subtitle">Cargando...</p>
                    </div>
                </div>
            `;
        }
    }

    // ===================================
    // ACADEMIC CALENDAR VIEW
    // ===================================

    loadAcademicCalendarView() {
        const view = document.getElementById('academic-calendar-view');
        if (typeof academicManager !== 'undefined') {
            view.innerHTML = academicManager.renderAcademicCalendarView();
        } else {
            view.innerHTML = `
                <div class="view-header">
                    <div>
                        <h2>📅 Calendario Académico</h2>
                        <p class="view-subtitle">Cargando...</p>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new StudyHubApp();
});

// Global helper functions for academic-manager.js
function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.innerHTML = '';
    }, 250);
}

function showToast(message, type = 'info') {
    if (app) {
        app.showToast(message, type);
    }
}
