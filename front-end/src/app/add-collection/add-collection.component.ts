import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.css'],
  providers: [DashboardService]
})
export class AddCollectionComponent implements OnInit {
  loading: boolean;
  user: object;
  err: boolean;
  errMsg: string;
  constructor(private dashboardService: DashboardService, private router: Router) {
    this.loading=true;
    this.user = null;
    this.err = false;
    this.errMsg="";
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
                  this.router.navigate([`/${data['id']}/dashboard/`]);
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


    validateInput(event, name, description, visibility){
      event.preventDefault();
      if(!name){
        this.err = true;
        this.errMsg = "Please enter a name.";
      }else if(!description){
        this.err = true;
        this.errMsg = "Please enter a description";
      }else if(!visibility){
        this.err = true;
        this.errMsg = "Please select a visibility.";
      }else{
        this.err = false;
        this.errMsg = "";
        console.log(name, description, visibility);
        //invoke addCollectionService to add collection
      }
    }

}
