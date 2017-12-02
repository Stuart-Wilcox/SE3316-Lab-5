import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { AddCollectionService } from '../add-collection.service';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.css'],
  providers: [DashboardService, AddCollectionService]
})
export class AddCollectionComponent implements OnInit {
  loading: boolean;
  user: object;
  err: boolean;
  errMsg: string;
  constructor(private dashboardService: DashboardService, private router: Router, private addCollectionService: AddCollectionService) {
    this.loading=true;
    this.user = null;
    this.err = false;
    this.errMsg="";
  }

  getCookie(cname) {/* referenced from stack overflow https://stackoverflow.com/questions/10730362/get-cookie-by-name*/
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

  ngOnInit() {

        let urlId = this.router.url.split("/")[1];
        let token = this.getCookie('token')||"";

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
        this.addCollectionService.addCollection(this.getCookie("token"), name, description, visibility).subscribe(
        data=>{
          if(data['message']=="Collection created"){
            this.router.navigate([`/${this.user['_id']}/dashboard`]);
          }
        },
        err=>{
          console.log(err);
        });
      }
    }

}
