/**
 * Academic Manager - Gestión de Repositorios y Calendario Académico
 * Maneja repositorios de GitHub y eventos académicos (entregas, exámenes, etc.)
 */

class AcademicManager {
    constructor() {
        this.repositories = this.loadRepositories();
        this.academicEvents = this.loadAcademicEvents();
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
    }

    // ==================== REPOSITORIOS ====================

    loadRepositories() {
        const saved = localStorage.getItem('studyhub_repositories');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                name: 'StudyHub-Pro',
                url: 'https://github.com/lcenguz/luiscendan-private',
                description: 'Aplicación personal de estudio con IA integrada. Incluye gestión de notas, tareas, Pomodoro y asistente IA.',
                language: 'JavaScript',
                lastUpdate: '2025-12-30',
                stars: 0,
                status: 'active',
                topics: ['education', 'ai', 'productivity', 'study-app']
            },
            {
                id: 2,
                name: 'luiscendan-private',
                url: 'https://github.com/lcenguz/luiscendan-private',
                description: 'Repositorio principal con proyectos académicos y personales del máster.',
                language: 'Multiple',
                lastUpdate: '2025-12-30',
                stars: 0,
                status: 'active',
                topics: ['master', 'projects', 'academic']
            }
        ];
    }

    saveRepositories() {
        localStorage.setItem('studyhub_repositories', JSON.stringify(this.repositories));
    }

    addRepository(repo) {
        const newRepo = {
            id: Date.now(),
            ...repo,
            lastUpdate: new Date().toISOString().split('T')[0],
            stars: 0,
            status: 'active'
        };
        this.repositories.push(newRepo);
        this.saveRepositories();
        return newRepo;
    }

    updateRepository(id, updates) {
        const index = this.repositories.findIndex(r => r.id === id);
        if (index !== -1) {
            this.repositories[index] = { ...this.repositories[index], ...updates };
            this.saveRepositories();
            return this.repositories[index];
        }
        return null;
    }

    deleteRepository(id) {
        this.repositories = this.repositories.filter(r => r.id !== id);
        this.saveRepositories();
    }

    renderRepositoriesView() {
        return `
            <div class="view-header">
                <div>
                    <h2>📁 Estructura del Proyecto</h2>
                    <p class="view-subtitle">Repositorio y carpetas principales</p>
                </div>
            </div>

            <div style="max-width: 800px; margin: 0 auto;">
                <div class="repository-card" style="margin-bottom: var(--spacing-xl);">
                    <div class="repo-header">
                        <div class="repo-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                        </div>
                    </div>

                    <div class="repo-content">
                        <h3 class="repo-name">
                            <a href="https://github.com/lcenguz/luiscendan-private" target="_blank" rel="noopener noreferrer">
                                luiscendan-private
                            </a>
                        </h3>
                        <p class="repo-description">Repositorio principal - Máster Big Data & Analytics UAX</p>

                        <div class="repo-topics">
                            <span class="topic-tag">master</span>
                            <span class="topic-tag">big-data</span>
                            <span class="topic-tag">analytics</span>
                            <span class="topic-tag">projects</span>
                        </div>

                        <div class="repo-meta">
                            <span class="repo-language">
                                <span class="language-dot" style="background: #8257e5;"></span>
                                Multiple
                            </span>
                            <span class="repo-updated">
                                Actualizado: ${this.formatDate(new Date().toISOString().split('T')[0])}
                            </span>
                        </div>
                    </div>

                    <div class="repo-footer">
                        <a href="https://github.com/lcenguz/luiscendan-private" target="_blank" class="btn btn-secondary btn-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Ver en GitHub
                        </a>
                    </div>
                </div>

                <div style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); padding: var(--spacing-xl);">
                    <h3 style="margin-bottom: var(--spacing-lg); font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">Carpetas Principales</h3>
                    
                    <div class="folder-item" style="padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); margin-bottom: var(--spacing-sm); display: flex; align-items: center; gap: var(--spacing-md); transition: all var(--transition-base); cursor: pointer;" onmouseover="this.style.transform='translateX(4px)'; this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='var(--glass-border)'">
                        <span style="font-size: 1.5rem;">🎓</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: var(--text-primary);">estudios/</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">Máster Big Data & Analytics UAX</div>
                        </div>
                    </div>

                    <div class="folder-item" style="padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); margin-bottom: var(--spacing-sm); display: flex; align-items: center; gap: var(--spacing-md); transition: all var(--transition-base); cursor: pointer;" onmouseover="this.style.transform='translateX(4px)'; this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='var(--glass-border)'">
                        <span style="font-size: 1.5rem;">💼</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: var(--text-primary);">personal/</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">Proyectos personales</div>
                        </div>
                    </div>

                    <div class="folder-item" style="padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); display: flex; align-items: center; gap: var(--spacing-md); transition: all var(--transition-base); cursor: pointer;" onmouseover="this.style.transform='translateX(4px)'; this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='var(--glass-border)'">
                        <span style="font-size: 1.5rem;">📄</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: var(--text-primary);">curriculum/</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">CV y documentos profesionales</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRepositoryCard(repo) {
        const languageColors = {
            'JavaScript': '#f1e05a',
            'Java': '#b07219',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'TypeScript': '#2b7489',
            'Multiple': '#8257e5'
        };

        const color = languageColors[repo.language] || '#888';

        return `
            <div class="repository-card" data-repo-id="${repo.id}">
                <div class="repo-header">
                    <div class="repo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                    </div>
                    <div class="repo-actions">
                        <button class="icon-btn" onclick="academicManager.editRepository(${repo.id})" title="Editar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                        <button class="icon-btn" onclick="academicManager.deleteRepository(${repo.id})" title="Eliminar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="repo-content">
                    <h3 class="repo-name">
                        <a href="${repo.url}" target="_blank" rel="noopener noreferrer">
                            ${repo.name}
                        </a>
                    </h3>
                    <p class="repo-description">${repo.description}</p>

                    <div class="repo-topics">
                        ${repo.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    </div>

                    <div class="repo-meta">
                        <span class="repo-language">
                            <span class="language-dot" style="background: ${color};"></span>
                            ${repo.language}
                        </span>
                        <span class="repo-stars">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            ${repo.stars}
                        </span>
                        <span class="repo-updated">
                            Actualizado: ${this.formatDate(repo.lastUpdate)}
                        </span>
                    </div>
                </div>

                <div class="repo-footer">
                    <a href="${repo.url}" target="_blank" class="btn btn-secondary btn-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Ver en GitHub
                    </a>
                </div>
            </div>
        `;
    }

    showAddRepositoryModal() {
        const modal = `
            <div class="modal" id="repoModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Añadir Repositorio</h3>
                        <button class="close-btn" onclick="closeModal()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="repoForm" onsubmit="academicManager.handleAddRepository(event)">
                            <div class="form-group">
                                <label>Nombre del Repositorio</label>
                                <input type="text" name="name" required placeholder="mi-proyecto">
                            </div>
                            <div class="form-group">
                                <label>URL de GitHub</label>
                                <input type="url" name="url" required placeholder="https://github.com/usuario/repo">
                            </div>
                            <div class="form-group">
                                <label>Descripción</label>
                                <textarea name="description" rows="3" required placeholder="Breve descripción del proyecto..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Lenguaje Principal</label>
                                <select name="language" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Java">Java</option>
                                    <option value="Python">Python</option>
                                    <option value="TypeScript">TypeScript</option>
                                    <option value="HTML">HTML</option>
                                    <option value="CSS">CSS</option>
                                    <option value="Multiple">Múltiples</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Topics (separados por coma)</label>
                                <input type="text" name="topics" placeholder="web, javascript, proyecto">
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Añadir Repositorio</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalOverlay').innerHTML = modal;
        document.getElementById('modalOverlay').classList.add('active');
    }

    handleAddRepository(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const repo = {
            name: formData.get('name'),
            url: formData.get('url'),
            description: formData.get('description'),
            language: formData.get('language'),
            topics: formData.get('topics').split(',').map(t => t.trim()).filter(t => t)
        };

        this.addRepository(repo);
        closeModal();
        this.refreshRepositoriesView();
        showToast('Repositorio añadido correctamente', 'success');
    }

    refreshRepositoriesView() {
        const view = document.getElementById('repositories-view');
        if (view && view.classList.contains('active')) {
            view.innerHTML = this.renderRepositoriesView();
        }
    }

    // ==================== CALENDARIO ACADÉMICO ====================

    loadAcademicEvents() {
        const saved = localStorage.getItem('studyhub_academic_events');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                title: 'Entrega Práctica Big Data',
                date: '2025-01-15',
                type: 'entrega',
                subject: 'Programación Big Data',
                description: 'Entrega final del proyecto Spark',
                completed: false
            },
            {
                id: 2,
                title: 'Examen Análisis de Información',
                date: '2025-01-20',
                type: 'examen',
                subject: 'Análisis de Información',
                description: 'Examen final del primer cuatrimestre',
                completed: false
            },
            {
                id: 3,
                title: 'Presentación StudyHub Pro',
                date: '2025-01-25',
                type: 'presentacion',
                subject: 'Proyecto Personal',
                description: 'Demo del proyecto StudyHub Pro',
                completed: false
            }
        ];
    }

    saveAcademicEvents() {
        localStorage.setItem('studyhub_academic_events', JSON.stringify(this.academicEvents));
    }

    addAcademicEvent(event) {
        const newEvent = {
            id: Date.now(),
            ...event,
            completed: false
        };
        this.academicEvents.push(newEvent);
        this.saveAcademicEvents();
        return newEvent;
    }

    updateAcademicEvent(id, updates) {
        const index = this.academicEvents.findIndex(e => e.id === id);
        if (index !== -1) {
            this.academicEvents[index] = { ...this.academicEvents[index], ...updates };
            this.saveAcademicEvents();
            return this.academicEvents[index];
        }
        return null;
    }

    deleteAcademicEvent(id) {
        this.academicEvents = this.academicEvents.filter(e => e.id !== id);
        this.saveAcademicEvents();
    }

    toggleEventCompletion(id) {
        const event = this.academicEvents.find(e => e.id === id);
        if (event) {
            event.completed = !event.completed;
            this.saveAcademicEvents();
            this.refreshCalendarView();
        }
    }

    renderAcademicCalendarView() {
        const upcomingEvents = this.getUpcomingEvents();
        const monthEvents = this.getMonthEvents(this.currentYear, this.currentMonth);

        return `
            <div class="view-header">
                <div>
                    <h2>📅 Calendario Académico</h2>
                    <p class="view-subtitle">Gestiona tus entregas, exámenes y eventos</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="academicManager.showAddEventModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 5v14m-7-7h14" />
                        </svg>
                        Nuevo Evento
                    </button>
                </div>
            </div>

            <div class="calendar-container">
                <div class="calendar-main">
                    ${this.renderCalendar()}
                </div>

                <div class="calendar-sidebar">
                    <div class="upcoming-events-card">
                        <h3>Próximos Eventos</h3>
                        <div class="events-list">
                            ${upcomingEvents.length > 0
                ? upcomingEvents.map(event => this.renderEventItem(event)).join('')
                : '<p class="empty-state">No hay eventos próximos</p>'
            }
                        </div>
                    </div>

                    <div class="event-stats-card">
                        <h3>Estadísticas</h3>
                        ${this.renderEventStats()}
                    </div>
                </div>
            </div>
        `;
    }

    renderCalendar() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let calendarHTML = `
            <div class="calendar-header">
                <button class="icon-btn" onclick="academicManager.previousMonth()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h3>${monthNames[this.currentMonth]} ${this.currentYear}</h3>
                <button class="icon-btn" onclick="academicManager.nextMonth()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            <div class="calendar-grid">
                <div class="calendar-day-header">Dom</div>
                <div class="calendar-day-header">Lun</div>
                <div class="calendar-day-header">Mar</div>
                <div class="calendar-day-header">Mié</div>
                <div class="calendar-day-header">Jue</div>
                <div class="calendar-day-header">Vie</div>
                <div class="calendar-day-header">Sáb</div>
        `;

        // Empty cells before first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            const dateStr = date.toISOString().split('T')[0];
            const dayEvents = this.academicEvents.filter(e => e.date === dateStr);

            const isToday = date.toDateString() === today.toDateString();
            const hasEvents = dayEvents.length > 0;

            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}"
                     onclick="academicManager.showDayEvents('${dateStr}')">
                    <span class="day-number">${day}</span>
                    ${hasEvents ? `<div class="event-indicators">
                        ${dayEvents.slice(0, 3).map(e => `
                            <span class="event-dot ${e.type}" title="${e.title}"></span>
                        `).join('')}
                    </div>` : ''}
                </div>
            `;
        }

        calendarHTML += '</div>';
        return calendarHTML;
    }

    renderEventItem(event) {
        const typeIcons = {
            'entrega': '📝',
            'examen': '📚',
            'presentacion': '🎤',
            'clase': '👨‍🏫',
            'otro': '📌'
        };

        const typeColors = {
            'entrega': 'var(--primary)',
            'examen': 'var(--error)',
            'presentacion': 'var(--warning)',
            'clase': 'var(--info)',
            'otro': 'var(--text-secondary)'
        };

        const daysUntil = this.getDaysUntil(event.date);
        const urgencyClass = daysUntil <= 3 ? 'urgent' : daysUntil <= 7 ? 'soon' : '';

        return `
            <div class="event-item ${event.completed ? 'completed' : ''} ${urgencyClass}" data-event-id="${event.id}">
                <div class="event-checkbox">
                    <input type="checkbox" 
                           ${event.completed ? 'checked' : ''} 
                           onchange="academicManager.toggleEventCompletion(${event.id})">
                </div>
                <div class="event-icon" style="background: ${typeColors[event.type]};">
                    ${typeIcons[event.type]}
                </div>
                <div class="event-details">
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">
                        <span class="event-subject">${event.subject}</span>
                        <span class="event-date">${this.formatDate(event.date)}</span>
                        ${daysUntil >= 0 ? `<span class="event-countdown">${daysUntil === 0 ? 'Hoy' : daysUntil === 1 ? 'Mañana' : `En ${daysUntil} días`}</span>` : ''}
                    </div>
                    ${event.description ? `<p class="event-description">${event.description}</p>` : ''}
                </div>
                <div class="event-actions">
                    <button class="icon-btn" onclick="academicManager.editEvent(${event.id})" title="Editar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button class="icon-btn" onclick="academicManager.deleteAcademicEvent(${event.id}); academicManager.refreshCalendarView();" title="Eliminar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    renderEventStats() {
        const total = this.academicEvents.length;
        const completed = this.academicEvents.filter(e => e.completed).length;
        const pending = total - completed;
        const upcoming = this.getUpcomingEvents().length;

        return `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${total}</div>
                    <div class="stat-label">Total</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" style="color: var(--warning);">${pending}</div>
                    <div class="stat-label">Pendientes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" style="color: var(--success);">${completed}</div>
                    <div class="stat-label">Completados</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" style="color: var(--error);">${upcoming}</div>
                    <div class="stat-label">Próximos</div>
                </div>
            </div>
        `;
    }

    showAddEventModal() {
        const modal = `
            <div class="modal" id="eventModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Nuevo Evento Académico</h3>
                        <button class="close-btn" onclick="closeModal()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="eventForm" onsubmit="academicManager.handleAddEvent(event)">
                            <div class="form-group">
                                <label>Título del Evento</label>
                                <input type="text" name="title" required placeholder="Ej: Entrega Práctica 1">
                            </div>
                            <div class="form-group">
                                <label>Fecha</label>
                                <input type="date" name="date" required>
                            </div>
                            <div class="form-group">
                                <label>Tipo de Evento</label>
                                <select name="type" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="entrega">📝 Entrega</option>
                                    <option value="examen">📚 Examen</option>
                                    <option value="presentacion">🎤 Presentación</option>
                                    <option value="clase">👨‍🏫 Clase</option>
                                    <option value="otro">📌 Otro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Asignatura</label>
                                <input type="text" name="subject" required placeholder="Ej: Programación Big Data">
                            </div>
                            <div class="form-group">
                                <label>Descripción (opcional)</label>
                                <textarea name="description" rows="3" placeholder="Detalles adicionales..."></textarea>
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Añadir Evento</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalOverlay').innerHTML = modal;
        document.getElementById('modalOverlay').classList.add('active');
    }

    handleAddEvent(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newEvent = {
            title: formData.get('title'),
            date: formData.get('date'),
            type: formData.get('type'),
            subject: formData.get('subject'),
            description: formData.get('description')
        };

        this.addAcademicEvent(newEvent);
        closeModal();
        this.refreshCalendarView();
        showToast('Evento añadido correctamente', 'success');
    }

    refreshCalendarView() {
        const view = document.getElementById('academic-calendar-view');
        if (view && view.classList.contains('active')) {
            view.innerHTML = this.renderAcademicCalendarView();
        }
    }

    // ==================== UTILIDADES ====================

    getUpcomingEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.academicEvents
            .filter(e => !e.completed && new Date(e.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 10);
    }

    getMonthEvents(year, month) {
        return this.academicEvents.filter(e => {
            const eventDate = new Date(e.date);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    }

    getDaysUntil(dateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(dateStr);
        eventDate.setHours(0, 0, 0, 0);
        const diffTime = eventDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.refreshCalendarView();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.refreshCalendarView();
    }

    showDayEvents(dateStr) {
        const events = this.academicEvents.filter(e => e.date === dateStr);
        if (events.length === 0) {
            showToast('No hay eventos para este día', 'info');
            return;
        }

        const modal = `
            <div class="modal" id="dayEventsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Eventos del ${this.formatDate(dateStr)}</h3>
                        <button class="close-btn" onclick="closeModal()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="events-list">
                            ${events.map(e => this.renderEventItem(e)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalOverlay').innerHTML = modal;
        document.getElementById('modalOverlay').classList.add('active');
    }
}

// Inicializar el gestor académico
const academicManager = new AcademicManager();
