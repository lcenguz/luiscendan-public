import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SessionTimeoutService {
    private router = inject(Router);
    private auth = inject(AuthService);

    private readonly TIMEOUT_MINUTES = 5;
    private readonly WARNING_MINUTES = 1;

    private timeoutId: any;
    private warningTimeoutId: any;
    private isWarningShown = false;

    startMonitoring(): void {
        if (!this.auth.isAuthenticated()) {
            return;
        }
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            document.addEventListener(event, () => this.resetTimer(), true);
        });

        this.resetTimer();
    }

    stopMonitoring(): void {
        this.clearTimers();
    }
    private resetTimer(): void {
        this.clearTimers();
        this.isWarningShown = false;

        if (!this.auth.isAuthenticated()) {
            return;
        }

        const warningTime = (this.TIMEOUT_MINUTES - this.WARNING_MINUTES) * 60 * 1000;
        this.warningTimeoutId = setTimeout(() => {
            this.showWarning();
        }, warningTime);

        const timeoutTime = this.TIMEOUT_MINUTES * 60 * 1000;
        this.timeoutId = setTimeout(() => {
            this.logout();
        }, timeoutTime);
    }

    private showWarning(): void {
        if (this.isWarningShown) return;

        this.isWarningShown = true;

        const remainingMinutes = this.WARNING_MINUTES;
        const message = `Hey!! Toca algo que me voy en  ${remainingMinutes} minuto(s)`;

        const continueSession = confirm(message);

        if (continueSession) {
            this.resetTimer();
        } else {
            this.logout();
        }
    }

    private logout(): void {
        console.log('Sesión cerrada por inactividad');

        this.clearTimers();

        this.auth.logout();

        this.router.navigate(['/login'], {
            queryParams: { timeout: 'true' }
        });

        alert('Tu sesión ha expirado por g.... inactividad.');
    }

    private clearTimers(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        if (this.warningTimeoutId) {
            clearTimeout(this.warningTimeoutId);
            this.warningTimeoutId = null;
        }
    }
}
