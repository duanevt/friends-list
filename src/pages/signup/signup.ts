import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  user: User = {
    name: "",
    username: "",
    email: "",
    password: ""
  }

  confirmPassword: string;
  url: string;
  headers: Headers;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              public http: Http) {
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-Id", "AppId1");
    this.headers.append("X-Parse-Rest-API-Key", "restAPIKey");
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  goToLogin() {
    this.navCtrl.pop();
  }

  signup() {
    if(this.user.password != this.confirmPassword) {
      this.alertCtrl.create({
        title: "Error",
        message: "Passwords should match",
        buttons: ['OK']
      }).present();
      return;
    }

    this.url = "https://parsewithionic2-duanev1.c9users.io/app1/users";
    this.http.post(this.url, this.user, { headers: this.headers })
      .map(res => res.json())
      .subscribe(res => {
        // success
        console.log(res);
        this.alertCtrl.create ({
          title: "Success",
          message: "Congratulations. Account has been created. Please Login.",
          buttons: [{
            text: "Login",
            handler: () => {
              this.navCtrl.pop(); // takes the user back to login
            }
          }]
        }).present();
      },
      err => {
        // Error
        console.log(err);
        this.alertCtrl.create({ title: "Error", message: err.text(),
                    buttons: [{text: "ok"}]}).present();
      })
  }
}
