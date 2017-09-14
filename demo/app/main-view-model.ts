import { BaseViewModel } from './base-view-model';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

export class HelloWorldModel extends BaseViewModel {
  private random(range: any) {
    return Math.floor((Math.random() * range) + 1)
  }
  public comments = new ObservableArray([
    { image: "~/images/icon-50.png", id: 1, comment: "First Comment", username: "Moayad Najdwai", likes: this.random(10), isLike: true, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { image: "~/images/icon-50.png", id: 2, comment: "hello", username: "Hashem najdawi", likes: this.random(10), isLike: true, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { image: "~/images/icon-50.png", id: 3, replyTo: 1, comment: "First Reply", username: "Demo User", likes: this.random(10), isLike: true, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  ]);

  constructor() {
    super();

  }
  public like(args) {
    args.object.toggle(args.to);
    console.log(this.comments.getItem(0).isLike);
  }
  public add(args) {
    let self = this;
    args.object.busy(true)
    setTimeout(function () {
      args.object.push({ image: "~/images/icon-50.png", id: self.random(1000), comment: args.comment, replyTo: args.to, username: "Demo User", likes: 0, isLike: false, datetime: Date.now() });
      console.log(self.comments.length);
      args.object.busy(false);
    }, 2000);
   
  }

}
