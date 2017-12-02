import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  loading:boolean;
  authenticated: boolean;
  user: object;

  constructor(private dashboardService: DashboardService, private router: Router) {
    this.loading=true;
    this.authenticated = false;
    this.user = {
      name: ""
    };
  }

  ngOnInit() {


    /* referenced from stack overflow https://stackoverflow.com/questions/10730362/get-cookie-by-name*/
    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
    }
    /* copied from stack overflow*/

    let urlId = this.router.url.split("/")[1];
    let token = getCookie('token')||"";

    if(token != ""){
      this.dashboardService.getUserData(token).subscribe(
        data => {
            this.loading=false;
            if(data.id == urlId){
              this.user=data;
            }else{
              this.user={name:"Private Profile"};
              console.log("private profile");
            }
        },
        err => {
          this.loading=false;
              this.user={name:"An error occurred."};
              console.log("err", err);
          }
      );
    }else{
      this.router.navigate(['/login/']);
    }
  }

}
