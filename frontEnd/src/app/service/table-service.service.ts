import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Clubs } from './table-interface'
import { environment} from 'src/environments/environment';


@Injectable()
export class TableServiceService {

  constructor(private http: HttpClient) { }

  public getTableData(): Observable<Clubs> {
    return this.http.get<Clubs>(`${environment.URL}/clubs`);
  }

  public postTableData(payload): Observable<Clubs> {
    return this.http.post<Clubs>(`${environment.URL}/clubs`, payload);
  }

}
