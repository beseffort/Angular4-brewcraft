import { Headers } from '@angular/http';

export const contentHeaders = new Headers();

contentHeaders.append('Content-Type', 'application/json');
contentHeaders.append('Access-Control-Allow-Origin', '*');