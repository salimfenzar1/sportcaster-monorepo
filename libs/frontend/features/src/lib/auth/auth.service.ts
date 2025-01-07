import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserIdentity, IUserCredentials } from '@libs/shared/api/src';
import { environment } from '@libs/shared/util-env/src';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = `${environment.dataApiUrl}/auth`; 

    constructor(private http: HttpClient) {}

    login(credentials: IUserCredentials): Observable<IUserIdentity> {
        return this.http.post<IUserIdentity>(`${this.apiUrl}/login`, credentials);
    }

    register(user: IUserCredentials): Observable<IUserIdentity> {
        return this.http.post<IUserIdentity>(`${this.apiUrl}/register`, user);
    }
}
