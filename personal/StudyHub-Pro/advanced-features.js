// ===================================
// ADVANCED FEATURES MODULE
// Estadísticas, Pomodoro, Modo Examen, etc.
// ===================================

class AdvancedFeatures {
    constructor(app) {
        this.app = app;
        this.pomodoroTimer = null;
        this.pomodoroState = {
            isRunning: false,
            timeLeft: 25 * 60, // 25 minutos
            mode: 'work', // work, break, longBreak
            sessionsCompleted: 0
        };
        this.studyStreak = this.loadStreak();
    }

    // ===================================
    // POMODORO TIMER
    // ===================================

    startPomodoro() {
        if (this.pomodoroState.isRunning) return;

        this.pomodoroState.isRunning = true;
        this.pomodoroTimer = setInterval(() => {
            this.pomodoroState.timeLeft--;

            if (this.pomodoroState.timeLeft <= 0) {
                this.pomodoroComplete();
            }

            this.updatePomodoroDisplay();
        }, 1000);

        this.updatePomodoroDisplay();
    }

    pausePomodoro() {
        this.pomodoroState.isRunning = false;
        if (this.pomodoroTimer) {
            clearInterval(this.pomodoroTimer);
            this.pomodoroTimer = null;
        }
        this.updatePomodoroDisplay();
    }

    resetPomodoro() {
        this.pausePomodoro();
        this.pomodoroState.timeLeft = 25 * 60;
        this.pomodoroState.mode = 'work';
        this.updatePomodoroDisplay();
    }

    pomodoroComplete() {
        this.pausePomodoro();

        if (this.pomodoroState.mode === 'work') {
            this.pomodoroState.sessionsCompleted++;

            // Notificación
            this.app.showToast('¡Pomodoro completado! Toma un descanso', 'success');

            // Determinar tipo de descanso
            if (this.pomodoroState.sessionsCompleted % 4 === 0) {
                this.pomodoroState.mode = 'longBreak';
                this.pomodoroState.timeLeft = 15 * 60; // 15 min
            } else {
                this.pomodoroState.mode = 'break';
                this.pomodoroState.timeLeft = 5 * 60; // 5 min
            }
        } else {
            this.app.showToast('¡Descanso terminado! Vuelve al trabajo', 'info');
            this.pomodoroState.mode = 'work';
            this.pomodoroState.timeLeft = 25 * 60;
        }

        this.updatePomodoroDisplay();

        // Guardar sesión
        this.savePomodoroSession();
    }

    async savePomodoroSession() {
        await this.app.dbOperation('pomodoroSessions', 'add', {
            date: new Date().toISOString(),
            duration: 25,
            completed: true
        });
    }

    updatePomodoroDisplay() {
        const display = document.getElementById('pomodoroDisplay');
        if (!display) return;

        const minutes = Math.floor(this.pomodoroState.timeLeft / 60);
        const seconds = this.pomodoroState.timeLeft % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const modeEmoji = {
            work: '💼',
            break: '☕',
            longBreak: '🌟'
        };

        display.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; font-weight: 800; color: var(--accent-primary); margin-bottom: var(--spacing-md);">
                    ${timeStr}
                </div>
                <div style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: var(--spacing-lg);">
                    ${modeEmoji[this.pomodoroState.mode]} ${this.pomodoroState.mode === 'work' ? 'Enfócate' : this.pomodoroState.mode === 'break' ? 'Descanso Corto' : 'Descanso Largo'}
                </div>
                <div style="display: flex; gap: var(--spacing-md); justify-content: center;">
                    <button class="btn btn-primary" onclick="advancedFeatures.${this.pomodoroState.isRunning ? 'pausePomodoro' : 'startPomodoro'}()">
                        ${this.pomodoroState.isRunning ? '⏸ Pausar' : '▶ Iniciar'}
                    </button>
                    <button class="btn btn-secondary" onclick="advancedFeatures.resetPomodoro()">
                        🔄 Reiniciar
                    </button>
                </div>
                <div style="margin-top: var(--spacing-lg); font-size: 0.875rem; color: var(--text-tertiary);">
                    Sesiones completadas hoy: ${this.pomodoroState.sessionsCompleted}
                </div>
            </div>
        `;
    }

    // ===================================
    // STUDY STREAK
    // ===================================

    loadStreak() {
        const saved = localStorage.getItem('studyStreak');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            current: 0,
            longest: 0,
            lastStudyDate: null
        };
    }

    updateStreak() {
        const today = new Date().toDateString();

        if (this.studyStreak.lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (this.studyStreak.lastStudyDate === yesterday.toDateString()) {
                // Continúa la racha
                this.studyStreak.current++;
            } else {
                // Racha rota
                this.studyStreak.current = 1;
            }

            this.studyStreak.lastStudyDate = today;

            if (this.studyStreak.current > this.studyStreak.longest) {
                this.studyStreak.longest = this.studyStreak.current;
            }

            localStorage.setItem('studyStreak', JSON.stringify(this.studyStreak));
        }
    }

    // ===================================
    // STATISTICS
    // ===================================

    async getStatistics() {
        const notes = await this.app.dbOperation('notes', 'getAll');
        const tasks = await this.app.dbOperation('tasks', 'getAll');
        const aiChats = await this.app.dbOperation('aiChats', 'getAll');

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return {
            total: {
                notes: notes.length,
                tasks: tasks.length,
                aiChats: aiChats.length,
                completedTasks: tasks.filter(t => t.completed).length
            },
            week: {
                notes: notes.filter(n => new Date(n.createdAt) > weekAgo).length,
                tasks: tasks.filter(t => new Date(t.createdAt) > weekAgo).length,
                aiChats: aiChats.filter(c => new Date(c.timestamp) > weekAgo).length
            },
            month: {
                notes: notes.filter(n => new Date(n.createdAt) > monthAgo).length,
                tasks: tasks.filter(t => new Date(t.createdAt) > monthAgo).length,
                aiChats: aiChats.filter(c => new Date(c.timestamp) > monthAgo).length
            },
            productivity: {
                completionRate: tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length * 100).toFixed(1) : 0,
                averageNotesPerWeek: (notes.filter(n => new Date(n.createdAt) > weekAgo).length / 1).toFixed(1),
                mostProductiveDay: this.getMostProductiveDay(notes, tasks)
            }
        };
    }

    getMostProductiveDay(notes, tasks) {
        const dayCount = {};
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        [...notes, ...tasks].forEach(item => {
            const date = new Date(item.createdAt);
            const day = days[date.getDay()];
            dayCount[day] = (dayCount[day] || 0) + 1;
        });

        let maxDay = 'N/A';
        let maxCount = 0;

        for (const [day, count] of Object.entries(dayCount)) {
            if (count > maxCount) {
                maxCount = count;
                maxDay = day;
            }
        }

        return maxDay;
    }

    // ===================================
    // EXAM MODE
    // ===================================

    async startExamMode(duration = 60) {
        // Bloquear distracciones
        document.body.classList.add('exam-mode');

        const modal = this.app.createModal('🎯 Modo Examen Activado', `
            <div style="text-align: center;">
                <p style="font-size: 1.125rem; margin-bottom: var(--spacing-xl); color: var(--text-secondary);">
                    Modo concentración máxima activado por ${duration} minutos
                </p>
                <div id="examTimer" style="font-size: 3rem; font-weight: 800; color: var(--accent-primary); margin-bottom: var(--spacing-xl);">
                    ${duration}:00
                </div>
                <div style="background: var(--bg-elevated); padding: var(--spacing-lg); border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
                    <h4 style="margin-bottom: var(--spacing-md);">Durante el modo examen:</h4>
                    <ul style="text-align: left; color: var(--text-secondary); font-size: 0.875rem;">
                        <li>✓ Sin notificaciones</li>
                        <li>✓ Sin acceso a IA</li>
                        <li>✓ Solo notas y tareas</li>
                        <li>✓ Cronómetro visible</li>
                    </ul>
                </div>
                <button class="btn btn-secondary" onclick="advancedFeatures.endExamMode()" style="background: var(--error); border-color: var(--error);">
                    Finalizar Modo Examen
                </button>
            </div>
        `);

        this.examModeTimer = setInterval(() => {
            duration--;
            const mins = Math.floor(duration / 60);
            const secs = duration % 60;
            const timerEl = document.getElementById('examTimer');
            if (timerEl) {
                timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }

            if (duration <= 0) {
                this.endExamMode();
                this.app.showToast('¡Tiempo de examen terminado!', 'success');
            }
        }, 1000);
    }

    endExamMode() {
        document.body.classList.remove('exam-mode');
        if (this.examModeTimer) {
            clearInterval(this.examModeTimer);
            this.examModeTimer = null;
        }
        this.app.closeModal();
    }

    // ===================================
    // MARKDOWN EDITOR
    // ===================================

    createMarkdownEditor(initialContent = '') {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); height: 500px;">
                <div>
                    <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Markdown</label>
                    <textarea id="markdownInput" style="width: 100%; height: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-mono); font-size: 0.875rem; resize: none;">${initialContent}</textarea>
                </div>
                <div>
                    <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 600;">Vista Previa</label>
                    <div id="markdownPreview" style="width: 100%; height: 100%; padding: var(--spacing-md); background: var(--bg-elevated); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-secondary); overflow-y: auto;"></div>
                </div>
            </div>
        `;
    }

    updateMarkdownPreview() {
        const input = document.getElementById('markdownInput');
        const preview = document.getElementById('markdownPreview');

        if (input && preview) {
            // Simple markdown parser
            let html = input.value
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                .replace(/\n/gim, '<br>');

            preview.innerHTML = html;
        }
    }

    // ===================================
    // VOICE NOTES
    // ===================================

    async startVoiceRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.app.showToast('Tu navegador no soporta grabación de voz', 'error');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                this.saveVoiceNote(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            });

            mediaRecorder.start();
            this.app.showToast('🎤 Grabando...', 'info');

            // Auto-stop after 5 minutes
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, 5 * 60 * 1000);

            // Store reference for manual stop
            this.currentRecording = mediaRecorder;

        } catch (error) {
            this.app.showToast('Error al acceder al micrófono', 'error');
        }
    }

    stopVoiceRecording() {
        if (this.currentRecording && this.currentRecording.state === 'recording') {
            this.currentRecording.stop();
            this.app.showToast('Grabación guardada', 'success');
        }
    }

    async saveVoiceNote(audioBlob) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            await this.app.dbOperation('voiceNotes', 'add', {
                audio: reader.result,
                createdAt: new Date().toISOString(),
                duration: 0 // Could calculate actual duration
            });
        };
        reader.readAsDataURL(audioBlob);
    }
}

// Export for use in app.js
window.AdvancedFeatures = AdvancedFeatures;
