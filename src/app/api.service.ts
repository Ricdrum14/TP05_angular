import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instruments } from '../shared/models/instrument';
import { environnement } from '../shared/environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Obtenez les instruments
  getInstruments(): Observable<Instruments[]> {
    return this.http.get<Instruments[]>(environnement.backendInstrument);
  }
}
