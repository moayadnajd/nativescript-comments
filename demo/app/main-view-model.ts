import { BaseViewModel } from './base-view-model';

export class HelloWorldModel extends BaseViewModel {
  private random(range: any) {
    return Math.floor((Math.random() * range) + 1)
  }
  public comments = [{ image:"~/images/icon-50.png", id: this.random(1000), comment: "First Comment", username: "Moayad Najdwai", likes: this.random(10), isLike: true, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) }];
 
  constructor() {
    super();
  }
  public like(args) {
      args.object.toggle(args.to);
  }
  public add(args) {
    let self = this;
    args.object.busy(true)
    setTimeout(function () {
      args.object.push({ image:"~/images/icon-50.png" , id: self.random(1000), comment: args.comment, username: "Demo User",likes:0,isLike:false,datetime: Date.now() });
      args.object.busy(false);
    }, 2000);

  }

}
