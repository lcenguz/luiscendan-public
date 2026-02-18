import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forbidden',
  templateUrl: './forbidden.html',
  imports: [RouterLink],
})
export class ForbiddenComponent {}
