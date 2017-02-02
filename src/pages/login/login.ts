import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { SignupPage } from '../signup/signup';
import { ListPage } from '../list/list';


@Component({
  templateUrl: 'login.html'
})
export class LoginPage {
  user: User = {
    username: "dman",
    password: "123"
  }

  url: string;
  headers: Headers;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public http: Http, public localStorage: Storage) {
      this.headers = new Headers();
      this.headers.append("X-Parse-Application-Id", "AppId1");
      this.headers.append("X-Parse-Rest-API-Key", "restAPIKey");
  }

  goToSignUp() {
    this.navCtrl.push( SignupPage );
  }

  login(){
    if(!(this.user.username && this.user.password)){
      this.alertCtrl.create({
        title: 'Error',
        message: 'Check username or password. Please return',
        buttons: ['OK']
      }).present();
      return;
    }
    this.url = "https://parsewithionic2-duanev1.c9users.io/app1/login?username="+this.user.username+"&password="+this.user.password;
    this.http.get(this.url, { headers: this.headers })
      .subscribe(res => {
        // success
        console.log(res);
        this.localStorage.set('friendsuser', res.json().objectId).then(()=>{
          console.log("user stored locally");
          this.navCtrl.setRoot(ListPage);
        });
      },
      err => {
        // Error
        console.log(err);
        this.alertCtrl.create({ title: "Error", message: err.text(),
                    buttons: [{text: "ok"}]}).present();
      })


  }

}
