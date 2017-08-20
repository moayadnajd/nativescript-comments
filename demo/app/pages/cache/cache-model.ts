import { BaseViewModel } from '../../base-view-model';


export class Cache extends BaseViewModel {
  
    private random(range: any) {
    return Math.floor((Math.random() * range) + 1)
  }
  
  public imagetag ='<IC:WebImage stretch="fill" class="comment-userimage img-circle" height="45" width="45"  verticalAlignment="top" row="0" col="0" placeholder="~/images/icon-50.png" src="{{ image }}" />';
  
  
  public plugin ='xmlns:IC="nativescript-web-image-cache"'
   

  public comments = [{ image:"https://mel.cgiar.org/graph/getcimage/width/50/height/50/image/-user-b78ac78b7849a0fb1d4b2be8c28a24af7e9c8fae1470124136.jpg", id: this.random(1000), comment: "First Comment", username: "Moayad Najdwai", likes: this.random(10), isLike: true, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) }];
  
  
  constructor() {
    super();
  }
  public like(args) {
   setTimeout(function () {
      args.object.toggle(args.to);
    }, 2000);
  }

  public add(args) {
    let self = this;
    args.object.busy(true)
    setTimeout(function () {
      args.object.push({ image:"https://mel.cgiar.org/graph/getcimage/width/50/height/50/image/-user-b78ac78b7849a0fb1d4b2be8c28a24af7e9c8fae1470124136.jpg" , id: self.random(1000), comment: args.comment, username: "Demo User",likes:0,isLike:false,datetime: Date.now() });
      args.object.busy(false);
    }, 1000);

  }

}
