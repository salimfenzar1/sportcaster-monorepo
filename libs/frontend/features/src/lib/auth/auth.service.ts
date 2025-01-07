import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCredentials } from '../../../../../shared/api/src/lib/models/auth.interface';
import { IUserIdentity } from '../../../../../shared/api/src/lib/models/user.interface';
import { environment } from '../../../../../../libs/shared/util-env/src/lib/environment';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = `${environment.dataApiUrl}/auth`; // Backend URL

    constructor(private http: HttpClient) {}

    login(credentials: IUserCredentials): Observable<IUserIdentity> {
        return this.http.post<IUserIdentity>(`${this.apiUrl}/login`, credentials);
    }

    register(user: IUserCredentials): Observable<IUserIdentity> {
        return this.http.post<IUserIdentity>(`${this.apiUrl}/register`, user);
    }
}
