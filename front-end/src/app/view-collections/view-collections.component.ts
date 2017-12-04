import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ViewCollectionService } from '../view-collection.service';

@Component({
  selector: 'app-view-collections',
  templateUrl: './view-collections.component.html',
  styleUrls: ['./view-collections.component.css'],
  providers: [DashboardService, ViewCollectionService]
})
export class ViewCollectionsComponent implements OnInit {
  user:object;
  collections:object;
  job:any;
  authorized:boolean;
  constructor(private dashboardService:DashboardService, private viewCollectionService:ViewCollectionService) {
    this.user=null;
    this.collections = null;
    this.job=[];
  }

  getCookie(cname) {
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
    this.job.push(0);this.job.push(2);
    this.dashboardService.getUserData(this.getCookie("token")).subscribe(
      data=>{
        this.user=data;
        this.authorized=true;
        this.job[0]++;
      },
      err=>{
        this.authorized=false;
        this.job[0]++;
      }
    );

    this.viewCollectionService.getAllPublicCollections(this.getCookie("token")).subscribe(
      data=>{
        this.collections=data;
        this.job[0]++;
      },
      err=>{
        this.job[0]++;
      }
    );
  }

}
