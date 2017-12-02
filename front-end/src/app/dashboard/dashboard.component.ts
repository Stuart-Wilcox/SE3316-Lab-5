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
  noCollections: boolean;
  loading:boolean;
  authenticated: boolean;
  user: object;
  collections: any;

  constructor(private dashboardService: DashboardService, private router: Router) {
    this.loading=true;
    this.authenticated = false;
    this.noCollections = true;
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
      //get user data
      this.dashboardService.getUserData(token).subscribe(
        data => {
            this.loading=false;
            if(data.id == urlId){
              this.user=data;
              console.log(data);
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

      //get the user's collection data
      this.dashboardService.getUserCollection(token, urlId).subscribe(
      data=>{
        console.log(data);
        if(data['length']==0){
          console.log("empty");
          this.noCollections=true;
        }else{
          this.noCollections=false;
          this.collections = data;
        }

      },
      err=>{
        console.log(err);
      }
    )

    }else{
      //user has no token, therefore must leave to login
      this.router.navigate(['/login/']);
    }
  }

}
