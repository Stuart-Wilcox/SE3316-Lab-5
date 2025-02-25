import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ActivateComponent } from './activate/activate.component';
import { HomeComponent } from './home/home.component';
import { AddCollectionComponent } from './add-collection/add-collection.component';
import { ViewCollectionComponent } from './view-collection/view-collection.component';
import { SearchComponent } from './search/search.component';
import { ViewImageComponent } from './view-image/view-image.component';
import { ViewCollectionsComponent } from './view-collections/view-collections.component';

const appRoutes:Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'search',
    component: SearchComponent
  },
  {
    path:'public-collections',
    component: ViewCollectionsComponent
  },
  {
    path: ':id/dashboard',
    component: DashboardComponent
  },
  {
    path: ':id/dashboard/add-collection',
    component: AddCollectionComponent
  },
  {
    path: 'collections/:collection_id',
    component: ViewCollectionComponent
  },
  {
    path: 'images/:image_id',
    component: ViewImageComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'accounts/activate/:id',
    component: ActivateComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    RegisterComponent,
    ActivateComponent,
    HomeComponent,
    AddCollectionComponent,
    ViewCollectionComponent,
    SearchComponent,
    ViewImageComponent,
    ViewCollectionsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [LoginService, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
