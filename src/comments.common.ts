import { View } from "tns-core-modules/ui/core/view";
import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { Label } from 'tns-core-modules/ui/label';
import { ScrollView } from 'tns-core-modules/ui/scroll-view';
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { GridUnitType } from "tns-core-modules/ui/layouts/grid-layout";
import { TextField } from 'tns-core-modules/ui/text-field';
import { Button } from 'tns-core-modules/ui/button';
import { Repeater } from 'tns-core-modules/ui/repeater';
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
export class Common extends StackLayout {
  public newComment: string = "";
  public textReplyToHolder: any = "";
  public toText: string = "Repling to :";
  private replytoWraper: any;
  public items: any = [];
  public replyTo: number = 0;
  public textField: any;
  public scroll: any = true;
  public imagetag: any;
  private initscroll = true;
  public title: string = "Comments";
  public static likeEvent: string = "like";
  public static addEvent: string = "add";
  public replyText = "Reply";
  public likeText = "like";
  public activityindecator: ActivityIndicator;
  private rep: Repeater;
  private scrollview: any;
  public plugin: any;
  public sendbtn: Button;
  public sendText: string = "Comment";
  private likeQ = [];
  private headtitle: any;
  public dateHandler: any;
  public replyAction(args) {
    let self = <Common>args.object.parent.parent.parent.parent.bindingContext;
    let obj = args.object;
    self.replytoWraper.visibility = "visible";
    self.replyTo = obj.get('dataid');
    self.textReplyToHolder.text = obj.get('dataname');
    (<TextField>self.textField).focus();
  }

  public likeAction(args) {
    let obj = args.object;
    let self = <Common>args.object.parent.parent.parent.parent.bindingContext;
    self.likeQ[obj.get('dataid')] = { obj: obj, self: self };
    obj.className = "comment-action like loading";
    self.notify({
      eventName: Common.likeEvent,
      object: self,
      to: obj.get('dataid'),
    });

  }
  public toggle(to) {
    if (this.likeQ[to]) {
      let obj = this.likeQ[to].obj;
      let self = this.likeQ[to].self;

      if (!obj.isLike) {
        obj.likes = obj.likes + 1;
        obj.isLike = true;
        obj.className = "comment-action like liked";

      } else {
        obj.likes = obj.likes - 1;
        obj.isLike = false;
        obj.className = "comment-action like";
      }
      obj.text = self.likeText + " (" + (obj.likes) + ")";
      let index = self.items.findIndex((element) => {
        return element.id === to;
      });
      self.items[index].likes = obj.likes;
      self.items[index].isLike = obj.isLike;
    }

  }
  public commentCount() {
    let count = this.items.length;
    return this.title + ' (' + count + ')';
  }
  public init() {

    let self = this;

    if (this.scroll === "false")
      this.scroll = false;
    else
      this.scroll = true;
    let hrlight = this.parseOptions(new StackLayout(), { className: "hr-light" });
    this.headtitle = this.parseOptions(new Label(), { class: "comment-title", text: this.commentCount() });
    // this.addChild(grid);
    this.addChild(this.headtitle);
    this.addChild(hrlight);
    // <GridLayout rows="*,auto">
    let wraper = this.parseOptions(new GridLayout(), { rows: ["star", "auto"] });

    let imageholder = "";
    if (this.imagetag)
      imageholder = this.imagetag;
    else
      imageholder = '<Image verticalAlignment="top" row="0" col="0" src="{{ image }}" class="comment-userimage img-circle" height="45" width="45" stretch="fill" />';
    let plugin = "";
    if (this.plugin)
      plugin = this.plugin;
    if (this.scroll === true)
      this.scrollview = <ScrollView>this.parseOptions(new ScrollView(), { row: 0 });
    else
      this.scrollview = <StackLayout>this.parseOptions(new StackLayout(), { row: 0 });

    this.rep = new Repeater();
    if (this.items[this.items.length - 1])
      this.items[this.items.length - 1].scrolltome = 'scrolltome';
    this.rep.items = this.items;
    this.rep.bindingContext = self;
    this.rep.id = 'mainrep';
    let commentsDateTo;
    if (this.dateHandler)
      commentsDateTo = this.dateHandler;
    else
      commentsDateTo = "commentsDateTo";

    this.rep.itemTemplate = `
        <GridLayout  ${ plugin} class="{{ replyTo  ? 'comment comment-reply' : 'comment'}}" rows="auto" columns="auto,*">
        ${imageholder}
        <GridLayout row="0" col="1" rows="auto,auto,auto,auto">
          <Label row="0" col="1" text="{{ username }}" class="comment-username" textWrap="true" />
          <Label row="1" col="1" text="{{ comment }}" textWrap="true" />
          <StackLayout class="comment-action-bar" row="2" orientation="horizontal">
            <Label text="{{ getlikeText(likes) }}"  dataid="{{ id }}"  tap="{{$parents['Repeater'].likeAction,$parents['Repeater'].likeAction}}" isLike="{{ isLike }}" likes="{{ likes }}"  class="{{ isLike ? 'comment-action like liked' : 'comment-action like'}}" textWrap="true" />
            <Label  visibility="{{ replyTo  ? 'collapse' : 'visible'}}"  text="." class="comment-seprator" />
            <Label visibility="{{ replyTo  ? 'collapse' : 'visible'}}"  dataid="{{ id }}" dataname="{{ username }}" text="{{$parents['Repeater'].replyText,$parents['Repeater'].replyText}}" tap="{{$parents['Repeater'].replyAction,$parents['Repeater'].replyAction}}" class="comment-action reply" textWrap="true" />
            <Label  text="." class="comment-seprator" />
            <Label  id="{{ id }}" text="{{ ${commentsDateTo}(datetime) }}" class="comment-details" textWrap="true" />
          </StackLayout>
          <StackLayout row="3"  id="{{ scrolltome ? scrolltome : ''  }}" />
         </GridLayout>
        </GridLayout>
        `;
    if (this.scroll === true)
      this.scrollview.content = this.rep;
    else
      this.scrollview.addChild(this.rep);

    // <GridLayout class="comment-footer" row= "1" rows= "auto,auto" columns= "*,auto" >
    //             </GridLayout>
    let footer = this.parseOptions(new GridLayout(), { className: "comment-footer", row: 1, rows: ["auto", "auto"], columns: ["star", "auto"] });

    this.replytoWraper = this.parseOptions(new StackLayout(), { row: 0, colSpan: 2, class: "comment-reply-wrapper", orientation: "horizontal", width: "100%", visibility: "collapse" });

    let xbtn = this.parseOptions(new Label(), { className: "comment-reply-x-btn", row: 1, col: 1, text: "x" });
    let replyingto = this.parseOptions(new Label(), { className: "comment-replyingto", text: this.toText });
    this.textReplyToHolder = this.parseOptions(new Label(), { className: "comment-reply-username", text: this.replyTo });
    this.replytoWraper.addChild(xbtn);
    this.replytoWraper.addChild(replyingto);
    this.replytoWraper.addChild(this.textReplyToHolder);

    xbtn.on('tap', () => {
      self.replytoWraper.visibility = "collapse";
      self.replyTo = 0;
    });

    // TextField class="comment-field" row= "1" col= "0" hint= "Comment..." text= "" />
    this.textField = <TextField>this.parseOptions(new TextField(), { className: "comment-field", row: 2, col: 0, hint: "Comment..." });

    // <Button class="comment-btn" row= "1" col= "1" text= "comment" tap= "" />
    this.sendbtn = this.parseOptions(new Button(), { className: "comment-btn", row: 2, col: 1, text: this.sendText });


    let textFieldBindingOptions = {
      sourceProperty: "newComment",
      targetProperty: "text",
      twoWay: true
    };
    this.textField.bind(textFieldBindingOptions, self);

    this.sendbtn.on('tap', () => {
      if (!this.activityindecator.busy) {
        self.notify({
          eventName: Common.addEvent,
          object: self,
          comment: self.newComment,
          to: self.replyTo,
        });
      }
    });

    footer.addChild(this.replytoWraper);

    footer.addChild(this.textField);

    footer.addChild(this.sendbtn);


    this.activityindecator = <ActivityIndicator>this.parseOptions(new ActivityIndicator(), { className: "comment-indicator", horizontalAlignment: 'center', verticalAlignment: 'middle', row: 2, col: 1 });

    footer.addChild(this.activityindecator);

    wraper.addChild(this.scrollview);

    wraper.addChild(footer);

    this.addChild(wraper);

  }
  constructor() {
    super();
    let self = this;
    setTimeout(() => {
      this.init();
    }, 100);

    let resorce = app.getResources();
    resorce['getlikeText'] = (likes) => {
      return self.likeText + ' (' + likes + ')';
    };
    resorce['commentsDateTo'] = function (time: any) {
      switch (typeof <any>time) {
        case 'number':
          break;
        case 'string':
          time = +new Date(time);
          break;
        case 'object':
          if (time.constructor === Date) time = time.getTime();
          break;
        default:
          time = +new Date();
      }
      let time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ];
      let seconds = (+new Date() - <any>time) / 1000,
        token = 'ago',
        list_choice = 1;

      if (seconds === 0) {
        return 'Just now';
      }
      if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
      }
      let i = 0,
        format;
      while (format = time_formats[i++])
        if (seconds < format[0]) {
          if (typeof format[2] === 'string')
            return format[list_choice];
          else
            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
      return time;
    };

    app.setResources(resorce);
    // let wraper = this.renderGrid({ rows: { star: title, auto: hr1 } });
    // let hr2 = this.renderStack();
    // this.addChild(hr2);
    // this.addChild(wraper);
    // let wraper = this.renderGrid({ className: "comment-foote", row: 1, rows: ["auto", "auto"], columns: ["star", "auto"] });
  }

  public busy(flag) {
    if (flag) {
      this.activityindecator.busy = true;
      this.activityindecator.className = 'comment-indicator loading';
      this.sendbtn.className = 'comment-btn loading';
    }
    else {
      this.activityindecator.busy = false;
      this.activityindecator.className = 'comment-indicator';
      this.sendbtn.className = 'comment-btn';

    }
  }
  public push(obj) {
    let self = this;
    let scrolltome = <Label>this.rep.getViewById('scrolltome');
    if(scrolltome)
      scrolltome.id = '';
    self.items.forEach((item) => {
      delete item.scrolltome;
    });
    obj['scrolltome'] = "scrolltome";
    if (!self.replyTo) {
      self.items.push(obj);
    } else {
      let index = self.items.findIndex((element) => {
        return element.id === self.replyTo;
      });
      let otherreply = self.items.filter((element) => {
        return element.replyTo === self.replyTo;
      });
      index = index + otherreply.length;
      obj['replyTo'] = self.replyTo;
      self.items.splice(index + 1, 0, obj);
    }
    self.rep.refresh();
    setTimeout(() => {
      if (this.scroll === true) {
        let scrolltome = <Label>this.rep.getViewById('scrolltome');
        if (self.initscroll && this.scrollview.scrollableHeight) {
          this.scrollview.scrollToVerticalOffset(this.scrollview.scrollableHeight, false);
          self.initscroll = false;
        }
        if (scrolltome)
          this.scrollview.scrollToVerticalOffset(scrolltome.getLocationRelativeTo(self).y, true);
      }
    }, 100);

    self.textField.text = "";
    self.headtitle.text = self.commentCount();
  }

  private parseOptions(view, options) {

    Object.keys(options).forEach(function (key, index) {
      if (key === "rows")
        options[key].forEach(function (value, index) {
          view.addRow(new ItemSpec(1, (<GridUnitType>value)));
        });
      else if (key === "columns")
        options[key].forEach(function (value, index) {
          view.addColumn(new ItemSpec(1, (<GridUnitType>value)));
        });
      else {
        view[key] = options[key];
      }
    });

    return view;
  }

}