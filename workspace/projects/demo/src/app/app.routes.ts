import { Routes } from '@angular/router';
import { DemoPageComponent } from './demo-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'demo', pathMatch: 'full' },
  { path: 'demo', component: DemoPageComponent },
];