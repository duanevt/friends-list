import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';
import { LoginPage } from '../login/login';

/*
  Generated class for the List page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  headers: Headers;
  url: string;
  friends: any[];
  userId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
          public alertCtrl: AlertController,
        public http: Http, public localStorage: Storage) {
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-Id", "AppId1");
    this.headers.append("X-Parse-Rest-API-Key", "restAPIKey");
    //this.headers.append("Content-Type", "application/json; charset=utf-8");
    this.localStorage.get('friendsuser').then((value)=> {
      this.userId = value;
      this.getFriends(null);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  showAddDialog() {
    this.alertCtrl.create({
      title: "Add Friend",
      message: "Enter the information of a new friend",
      inputs: [{
        name: 'name',
        placeholder: "Enter the name"
      },{
        name: 'email',
        placeholder: "Enter the email"
      },{
        name: 'number',
        placeholder: "Enter the phone number"
      }],
      buttons: [{
        text: "Cancel",
      },
      {
        text: "Save",
        handler: data => {
          // post the information to parse server
          //this.url = "https://parsewithionic2-duanev1.c9users.io/app1/users";
          this.url = "https://parsewithionic2-duanev1.c9users.io/app1/classes/friendslist";
          this.http.post(this.url,
            {
              owner: this.userId,
              name: data.name,
              email: data.email,
              number: data.number,
              image: "http://lorempixel.com/32/32"
            },
            { headers: this.headers })
            .map(res => res.json())
            .subscribe(res => {
              this.alertCtrl.create({
                title: "Success",
                message: "Friend Information Saved Successfully",
                buttons: [{
                  text: "Ok",
                  handler: ()=>{
                    this.getFriends(null);
                  }
                }]
              }).present()

            }), err => {
              console.log(err);
              this.alertCtrl.create({
                title: "Error",
                message: err.text(),
                buttons: [{
                  text: "Ok"
                }]
              }).present()
            }
        }
      }
    ]
  }).present();

  }

  getFriends(refresher) {
    this.url = 'https://parsewithionic2-duanev1.c9users.io/app1/classes/friendslist?where={"owner":"' +this.userId+ '" }';
    this.http.get(this.url, {headers: this.headers}).map(res=>res.json())
    .subscribe(res => {
      console.log(res);
      this.friends = res.results;
      if(refresher !== null)
        refresher.complete();
    }), err => {
      this.alertCtrl.create({
        title: "Error",
        message: err.text(),
        buttons: [{
          text: "Ok"
        }]
      }).present()
    }
  }

  editFriend(friend: any, item: ItemSliding){
    this.alertCtrl.create({
      title: "Edit Friend",
      message: "Edit your friends information here",
      inputs: [{
        name: 'name',
        placeholder: "Enter the name",
        value: friend.name
      },{
        name: 'email',
        placeholder: "Enter the email",
        value: friend.email
      },{
        name: 'number',
        placeholder: "Enter the phone number",
        value: friend.number
      }],
      buttons: [{
        text: "Cancel",
        handler: () => {
          console.log("don't forget to close the sliding item");
          item.close();
        }
      },{
        text: "Save",
        handler: data => {
          //perform update on parse server here
          this.url = "https://parsewithionic2-duanev1.c9users.io/app1/classes/friendslist/"+friend.objectId;
          this.http.put(this.url, {name: data.name, email: data.email, number: data.number}, {headers: this.headers})
            .map(res=>res.json())
            .subscribe(
              res => {
                console.log(res);
                this.alertCtrl.create({
                  title: "Success",
                  message: "Friend Information Saved Successfully",
                  buttons: [{
                    text: "Ok",
                    handler: ()=>{
                      this.getFriends(null);
                    }
                  }]
                }).present()
              },
              err => {
                this.alertCtrl.create({
                  title: "Error",
                  message: err.text(),
                  buttons: [{
                    text: "Ok"
                  }]
                }).present()
              }
            )

        }
      }]
    }).present()
  }

  deleteFriend(friend: any, item: ItemSliding){
    this.alertCtrl.create({
      title: "Delete Friend",
      message: "Are you sure?",
      buttons: [{
        text: "No",
        handler: () => {
          console.log("don't forget to close the sliding item");
          item.close();
        }
      },{
        text: "Yes",
        handler: () => {
          //perform update on parse server here
          this.url = "https://parsewithionic2-duanev1.c9users.io/app1/classes/friendslist/"+friend.objectId;
          this.http.delete(this.url, {headers: this.headers})
            .subscribe(
              res => {
                console.log(res);
                this.alertCtrl.create({
                  title: "Success",
                  message: "Friend Deleted Successfully",
                  buttons: [{
                    text: "Ok",
                    handler: ()=>{
                      this.getFriends(null);
                    }
                  }]
                }).present()
              },
              err => {
                this.alertCtrl.create({
                  title: "Error",
                  message: err.text(),
                  buttons: [{
                    text: "Ok"
                  }]
                }).present()
              }
            )

        }
      }]
    }).present()
  }

  logout() {
    this.localStorage.remove('friendsuser').then(() => {
      this.navCtrl.setRoot(LoginPage);
    })
  }

}
