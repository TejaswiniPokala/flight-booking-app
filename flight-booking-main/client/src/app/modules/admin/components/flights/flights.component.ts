import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent {
  isLoading = false
  flights: any[] = []
  constructor(private http:HttpClient){
    this.isLoading = true
    this.http.get<any[]>('http://localhost:5100/flights').subscribe((res) => {
      this.flights = res
      this.isLoading = false
    })
  }
  
 /* onCancleTicket(id:string){
    this.http.delete(`http://localhost:5100/flights/${}`).subscribe((res) => {
      this.isLoading = true
    this.http.get<any[]>('http://localhost:5100/flights').subscribe((res) => {
      this.flights = res
      this.isLoading = false
    })
  })
  }*/
  onDeleteFlight(id: string) {
    // Send a DELETE request to the server to delete the flight with the given id
    this.http.delete(`http://localhost:5100/flights/${id}`).subscribe(() => {
      // Remove the deleted flight from the local flights array
      //this.flights = this.flights.filter((flight) => flight._id !== id);
      this.isLoading = true
      this.http.get<any[]>('http://localhost:5100/flights').subscribe((res) => {
        this.flights = res
        this.isLoading = false
      })
    });
  }
}
