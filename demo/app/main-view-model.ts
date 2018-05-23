import { BaseViewModel } from './base-view-model';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

export class HelloWorldModel extends BaseViewModel {
  private random(range: any) {
    return Math.floor((Math.random() * range) + 1)
  }
  public comments = new ObservableArray([
    { editing: true, image: "~/images/icon-50.png", id: 1, comment: "First Comment", username: "Moayad Najdwai", likes: this.random(10), isLike: false, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { image: "~/images/icon-50.png", id: 2, comment: "hello", username: "Hashem najdawi", likes: this.random(10), isLike: true, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { image: "~/images/icon-50.png", id: 3, replyTo: 1, comment: "First Reply", isOwn: true, username: "Demo User", likes: this.random(10), isLike: true, datetime: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  ]);

  customTemplate(canComment: boolean, plugin: any, imageholder: string, commentsDateTo: any): string {
    if (canComment){
      return `
        <GridLayout dataediting="{{ editing,editing }}" dataid="{{ id }}" datacomment="{{ comment }}" longPress="{{$parents['Repeater'].LongPress,$parents['Repeater'].LongPress}}"  ${
          plugin
        } class="{{ 'comment' + (replyTo ? ' comment-reply' : '') + (isOwn ? ' own' : '') }}" rows="auto" columns="auto,*">
        <StackLayout dataid="{{ id }}" tap="{{$parents['Repeater'].userImageAction,$parents['Repeater'].userImageAction}}"  verticalAlignment="top" row="0" col="0">
        ${imageholder}
        </StackLayout>
        <GridLayout row="0" col="1" rows="auto,auto,auto,auto">
          <Label row="0" col="1" dataid="{{ id }}" tap="{{$parents['Repeater'].userNameAction,$parents['Repeater'].userNameAction}}" text="{{ username }}" class="comment-username" textWrap="true" />
          <Label row="1" col="1" class="comment-text" text="{{ comment }}" textWrap="true" />
          <StackLayout class="comment-action-bar" row="2" orientation="horizontal">
            <Label text="{{ getlikeText(likes) }}"  dataid="{{ id }}"  tap="{{$parents['Repeater'].likeAction,$parents['Repeater'].likeAction}}" isLike="{{ isLike }}" likes="{{ likes }}"  class="{{ isLike ? 'comment-action like liked' : 'comment-action like'}}" textWrap="true" />
            <Label  visibility="{{ replyTo  ? 'collapse' : 'visible'}}"  text="." class="comment-separator" />
            <Label visibility="{{ replyTo  ? 'collapse' : 'visible'}}"  dataid="{{ id }}" dataname="{{ username }}" text="{{$parents['Repeater'].replyText,$parents['Repeater'].replyText}}" tap="{{$parents['Repeater'].replyAction,$parents['Repeater'].replyAction}}" class="comment-action reply" textWrap="true" />
            <Label  id="{{ id }}" text="{{ ${
              commentsDateTo
            }(datetime) }}" class="comment-details" textWrap="true" />
          </StackLayout>
          <StackLayout row="3"  id="{{ scrolltome ? scrolltome : ''  }}" />
         </GridLayout>
        </GridLayout>
        `;
    }
    return `
      <GridLayout dataediting="{{ editing,editing }}" dataid="{{ id }}" datacomment="{{ comment }}" longPress="{{$parents['Repeater'].LongPress,$parents['Repeater'].LongPress}}"  ${
        plugin
      } class="{{ 'comment' + (replyTo ? ' comment-reply' : '') + (isOwn ? ' own' : '') }}" rows="auto" columns="auto,*">
      <StackLayout dataid="{{ id }}" tap="{{$parents['Repeater'].userImageAction,$parents['Repeater'].userImageAction}}"  verticalAlignment="top" row="0" col="0">
      ${imageholder}
      </StackLayout>
      <GridLayout row="0" col="1" rows="auto,auto,auto,auto">
        <Label row="0" col="1" dataid="{{ id }}" tap="{{$parents['Repeater'].userNameAction,$parents['Repeater'].userNameAction}}" text="{{ username }}" class="comment-username" textWrap="true" />
        <Label row="1" col="1" class="comment-text" text="{{ comment }}" textWrap="true" />
        <StackLayout class="comment-action-bar" row="2" orientation="horizontal">
          <Label  id="{{ id }}" text="{{ ${
            commentsDateTo
          }(datetime) }}" class="comment-details" textWrap="true" />
        </StackLayout>
        <StackLayout row="3"  id="{{ scrolltome ? scrolltome : ''  }}" />
        </GridLayout>
      </GridLayout>
      `;
  }

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
      args.object.push({ image: "~/images/icon-50.png", id: self.random(1000), isOwn: true, comment: args.comment, replyTo: args.to, username: "Demo User", likes: 0, isLike: false, datetime: Date.now() });
      console.log(self.comments.length);
      args.object.busy(false);
    }, 1000);

  }

  public userTap(args){

   alert(args.comment.username) ;

  }
  public edit(args) {
    alert(args.comment);
  }

  public delete(args) {
    alert(args.id);
  }

}
