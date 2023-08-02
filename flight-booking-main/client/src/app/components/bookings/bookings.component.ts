import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
interface Booking {
  _id: string;
  user: string;
  flight: string;
  passengers: string[];
  totalPrice: number;
  date: Date;
  journeyDate: Date;
  seatNumbers: { seat: string }[];
  paymentMethod: string;
  // Add other properties if present in the actual data.
}


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent {
  isLoading = false
  bookings: any[] = []
  today = new Date();

  constructor(private http:HttpClient){
    const userId = localStorage.getItem('userId')
    this.isLoading = true
    this.http.get<any[]>(`http://localhost:5100/bookings/user/${userId}`).subscribe((res) => {
      this.bookings = res.sort((a, b) => {
        const dateA = new Date(a.journeyDate);
        const dateB = new Date(b.journeyDate);
        return dateB.getTime() - dateA.getTime() ;
      });
      console.log(res)
      this.isLoading = false
    })
  }

  isDateBeforeToday(journeyDate: string): boolean {
    const today = new Date();
    const journey = new Date(journeyDate);
    return journey < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  
  

  downloadTicketAsPdf(booking: Booking) {
    const docDefinition: any = {
      content: [
        { text: 'Airline Ticket', style: 'header',alignment:"center" },
        { text: `Booking ID: ${booking._id}` },
        { text: `User: ${booking.user}` },
        { text: `Flight: ${booking.flight}` },
        { text: 'Passengers:', style: 'subheader' },
        {
          ul: booking.passengers.map((passenger: string) => {
            return passenger;
          })
        },
        { text: `Total Price: ${booking.totalPrice}` },
        { text: `Booking Date: ${booking.date}` },
        { text: `Journey Date: ${booking.journeyDate }` },
        { text: 'Seat Numbers:', style: 'subheader' },
        {
          ul: booking.seatNumbers.map((seat: { seat: string }) => {
            return seat.seat;
          })
        },
        { text: `Payment Method: ${booking.paymentMethod}` },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      }
    };

    // Generate the PDF using pdfmake.
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    // Download the PDF using the generated Blob.
    pdfDocGenerator.download(`ticket_${booking._id}.pdf`);
  }
  onCancleTicket(id:string){
    this.http.delete(`http://localhost:5100/bookings/${id}`).subscribe((res) => {
      const userId = localStorage.getItem('userId')
      this.isLoading = true
      this.http.get<any[]>(`http://localhost:5100/bookings/user/${userId}`).subscribe((res) => {
        this.bookings = res.sort((a, b) => {
          const dateA = new Date(a.journeyDate);
          const dateB = new Date(b.journeyDate);
          return dateB.getTime() - dateA.getTime() ;
        });
        
        this.isLoading = false
      })
    })
  }
  
}
