import { View } from "tns-core-modules/ui/core/view";
import { Observable } from "tns-core-modules/data/observable";
import * as app from "tns-core-modules/application";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { Label } from "tns-core-modules/ui/label";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { GridUnitType } from "tns-core-modules/ui/layouts/grid-layout";
import { TextField } from "tns-core-modules/ui/text-field";
import { Button } from "tns-core-modules/ui/button";
import { Repeater } from "tns-core-modules/ui/repeater";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TextView } from "tns-core-modules/ui/text-view";
import { isAndroid, isIOS } from "tns-core-modules/platform";
export class Common extends StackLayout {
  private _newComment: string = "";
  public textReplyToHolder: any = "";
  public toText: string = "Repling to :";
  private replytoWraper: any;
  private random(range: any) {
    return Math.floor(Math.random() * range + 1);
  }
  public xbtn = "x";
  public fontClass = "fa";
  public editing: number = 0;
  public items: ObservableArray<any>;
  public replyingto: Label;
  public replyTo: number = 0;
  public textField: any;
  public editingText = "Editing your comment";
  public scroll: any = true;
  public imagetag: any;
  private initscroll = true;
  public title: string = "Comments";
  public static likeEvent: string = "like";
  public static deleteEvent: string = "delete";
  public static editEvent: string = "edit";
  public static addEvent: string = "add";
  public static userEvent: string = "user";
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
  public isadmin: any = false;
  public canComment: any = true;
  public textview: any = false;
  public dateHandler: any;
  public customTemplate: (canComment: boolean, plugin: any, imageholder: string, commentsDateTo: any) => string;

  private baseTemplate (canComment: boolean, plugin: any, imageholder: string, commentsDateTo: any): string {
    if (canComment)
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
    else
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

  public get newComment(): string {
    return this._newComment;
  }

  public set newComment(value: string) {
    // if (this.textview === true) this.adjustTextHeight(this.textField, value);
    this._newComment = value;
  }

  private adjustTextHeight(textview, value) {
    let linesCount = 0;
    let self = this;
    if (isIOS) {
      linesCount =
        textview.ios.contentSize.height / textview.ios.font.lineHeight;
      if (linesCount <= 5) {
        textview.height = textview.ios.contentSize.height + 10;
      }
    } else {
      linesCount = textview.android.getLineCount();
      let lineHieght = 20;
      if (linesCount <= 5) {
        let height_in_pixels = linesCount * lineHieght;
        textview.height = height_in_pixels;
      } else {
        let height_in_pixels = 5 * lineHieght;
        textview.height = height_in_pixels;
      }
    }

    // let scrolltome = <Label>this.getViewById("comments-understack");
    //      this.scrollview.scrollToVerticalOffset(
    //             scrolltome.getLocationRelativeTo(self).y,
    //             true
    //           );
  }

  public replyAction(args) {
    let self = <Common>args.object.parent.parent.parent.parent.bindingContext;
    let obj = args.object;
    self.editing = 0;
    self.replyingto.text = self.toText;
    self.replytoWraper.visibility = "visible";
    self.replyTo = obj.get("dataid");
    self.textReplyToHolder.text = obj.get("dataname");
    (<TextField>self.textField).focus();
  }

  public userNameAction(args) {
    //alert('prehello');
    let self = <Common>args.object.parent.parent.parent.bindingContext;
    let obj = args.object;
    self.userAction(obj.get("dataid"));
  }

  public userImageAction(args) {
    //alert('prehello');
    let self = <Common>args.object.parent.parent.bindingContext;
    let obj = args.object;
    self.userAction(obj.get("dataid"));
  }

  public userAction(id) {
    let self = this;
    let index: any;
    index = self.items.filter(item => {
      return item.id == id;
    });
    index = self.items.indexOf(index[0]);

    self.notify({
      eventName: Common.userEvent,
      object: self,
      comment: self.items.getItem(index)
    });
  }
  public likeAction(args) {
    let obj = args.object;
    let self = <Common>args.object.parent.parent.parent.parent.bindingContext;
    self.likeQ[obj.get("dataid")] = { obj: obj, self: self };
    obj.className = "comment-action like loading";
    self.notify({
      eventName: Common.likeEvent,
      object: self,
      to: obj.get("dataid")
    });
  }

  public LongPress(args) {
    let obj = args.object;
    let self = <Common>args.object.parent.bindingContext;
    if (obj.get("dataediting") == true) {
      dialogs
        .action("What to do ?", "Cancel", ["Delete", "Edit"])
        .then(function(result) {
          if (result == "Delete") {
            self.delete(obj.get("dataid"));
          } else if (result == "Edit") {
            self.edit(obj.get("dataid"), obj.get("datacomment"));
          }
        });
    } else if (self.isadmin == true) {
      dialogs
        .action("What to do ?", "Cancel", ["Delete"])
        .then(function(result) {
          if (result == "Delete") {
            self.delete(obj.get("dataid"));
          }
        });
    }
  }
  public edit(id, comment) {
    this.replyingto.text = this.editingText;
    this.textReplyToHolder.text = "";
    this.replytoWraper.visibility = "visible";
    this.editing = id;
    (<TextField>this.textField).text = comment;
    (<TextField>this.textField).focus();
  }
  public delete(id) {
    let self = this;
    dialogs.confirm("Are you sure ?").then(function(result) {
      if (result) {
        self.items.forEach(element => {
          if (element.id == id || element.replyTo == id) {
            let index = self.items.indexOf(element);
            self.items.splice(index, 1);
          }
        });
        self.notify({
          eventName: Common.deleteEvent,
          object: self,
          id: id
        });
        self.refresh();
      }
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
      obj.text = self.likeText + " (" + obj.likes + ")";
      let index = self.items.filter(item => {
        return item.id === to;
      });
      index = self.items.indexOf(index[0]);
      self.items.getItem(index).likes = obj.likes;
      self.items.getItem(index).isLike = obj.isLike;
    }
  }

  private process() {
    let replys = this.items.filter(item => {
      return item.replyTo;
    });
    let comments = this.items.filter(item => {
      return !item.replyTo;
    });
    let commentsandReplys = [];
    comments.forEach(element => {
      commentsandReplys.push(element);
      replys.forEach(elementreply => {
        if (element.id == elementreply.replyTo)
          commentsandReplys.push(elementreply);
      });
    });

    return commentsandReplys;
  }
  public commentCount() {
    let count = this.items.length;
    return this.title + " (" + count + ")";
  }
  public init() {
    let self = this;

    if (this.scroll === "false") this.scroll = false;
    else this.scroll = true;
    if (this.canComment === "false") this.canComment = false;
    else if (this.canComment === "true") this.canComment = true;

    if (this.textview === "false") this.textview = false;
    else if (this.textview === "true") this.textview = true;

    if (self.isadmin == "true") self.isadmin = true;
    else if (self.isadmin == "false") self.isadmin = false;

    let hrlight = this.parseOptions(new StackLayout(), {
      className: "hr-light"
    });
    this.headtitle = this.parseOptions(new Label(), {
      class: "comment-title",
      text: this.commentCount()
    });
    // this.addChild(grid);
    this.addChild(this.headtitle);
    this.addChild(hrlight);
    if (Object.prototype.toString.call(this.items) == "[object Array]")
      this.items = new ObservableArray(this.items);
    // <GridLayout rows="*,auto">
    let wraper = this.parseOptions(new GridLayout(), {
      rows: ["star", "auto", "auto"]
    });

    let imageholder = "";
    if (this.imagetag) imageholder = this.imagetag;
    else
      imageholder =
        '<Image  src="{{ image }}" class="comment-userimage img-circle" height="45" width="45" stretch="fill" />';
    let plugin = "";
    if (this.plugin) plugin = this.plugin;
    if (this.scroll === true)
      this.scrollview = <ScrollView>this.parseOptions(new ScrollView(), {
        row: 0
      });
    else
      this.scrollview = <StackLayout>this.parseOptions(new StackLayout(), {
        row: 0
      });

    this.rep = new Repeater();
    if (this.items[this.items.length - 1])
      this.items[this.items.length - 1].scrolltome = "scrolltome";

    this.rep.items = this.process();

    this.rep.bindingContext = self;
    this.rep.id = "mainrep";
    let commentsDateTo;
    if (this.dateHandler) commentsDateTo = this.dateHandler;
    else commentsDateTo = "commentsDateTo";

    if(typeof this.customTemplate != "function"){
      this.customTemplate = this.baseTemplate;
    }

    this.rep.itemTemplate = this.customTemplate(this.canComment, plugin, imageholder, commentsDateTo);

    if (this.scroll === true) this.scrollview.content = this.rep;
    else this.scrollview.addChild(this.rep);

    // <GridLayout class="comment-footer" row= "1" rows= "auto,auto" columns= "*,auto" >
    //             </GridLayout>
    this.replytoWraper = this.parseOptions(new GridLayout(), {
      row: 1,
      class: "comment-reply-wrapper",
      width: "100%",
      visibility: "collapse",
      columns: ["auto","auto", "star"]
    });

    let footer = this.parseOptions(new GridLayout(), {
      className: "comment-footer",
      row: 2,
      rows: ["auto"],
      columns: ["star", "auto"]
    });

    let xbtn = this.parseOptions(new Label(), {
      className: "comment-reply-x-btn fa",
      row: 0,
      col: 0,
      text: this.xbtn
    });
    this.replyingto = this.parseOptions(new Label(), {
      className: "comment-replyingto",
      text: this.toText,
      row: 0,
      col: 1,
    });
    this.textReplyToHolder = this.parseOptions(new Label(), {
      className: "comment-reply-username",
      text: this.replyTo,
      row: 1,
      col: 2,
    });
    this.replytoWraper.addChild(xbtn);
    this.replytoWraper.addChild(this.replyingto);
    this.replytoWraper.addChild(this.textReplyToHolder);

    xbtn.on("tap", () => {
      self.replytoWraper.visibility = "collapse";
      self.replyTo = 0;
      self.editing = 0;
    });

    // TextField class="comment-field" row= "1" col= "0" hint= "Comment..." text= "" />
    if (this.textview) {
      this.textField = <TextView>this.parseOptions(new TextView(), {
        className: "comment-field comment-textview",
        id: "comment-field",
        row: 2,
        col: 0,
        editable: true,
        // style:{placeholderColor:'red'},
        hint: "Comment..."
      });
    } else {
      this.textField = <TextField>this.parseOptions(new TextField(), {
        className: "comment-field",
        id: "comment-field",
        row: 2,
        col: 0,
        hint: "Comment..."
      });
    }

    // <Button class="comment-btn" row= "1" col= "1" text= "comment" tap= "" />
    this.sendbtn = this.parseOptions(new Button(), {
      className: "comment-btn " + this.fontClass,
      row: 1,
      col: 1,
      text: this.sendText
    });

    let textFieldBindingOptions = {
      sourceProperty: "newComment",
      targetProperty: "text",
      twoWay: true
    };
    this.textField.bind(textFieldBindingOptions, self);

    this.sendbtn.on("tap", () => {
      if (!this.activityindecator.busy) {
        if (self.editing != 0) {
          self.notify({
            eventName: Common.editEvent,
            object: self,
            comment: self.newComment,
            id: self.editing,
            to: self.replyTo
          });
          let toedit = self.items.filter(elemet => {
            return elemet.id == self.editing;
          });
          self.items.getItem(self.items.indexOf(toedit[0])).comment =
            self.newComment;
          this.replytoWraper.visibility = "collapse";
          this.editing = 0;
          (<TextField>this.textField).text = "";
          self.refresh();
        } else
          self.notify({
            eventName: Common.addEvent,
            object: self,
            comment: self.newComment,
            to: self.replyTo
          });
      }
    });

    footer.addChild(this.textField);

    footer.addChild(this.sendbtn);

    this.activityindecator = <ActivityIndicator>this.parseOptions(
      new ActivityIndicator(),
      {
        className: "comment-indicator",
        horizontalAlignment: "center",
        verticalAlignment: "middle",
        row: 2,
        col: 1
      }
    );

    footer.addChild(this.activityindecator);

    wraper.addChild(this.scrollview);
    wraper.addChild(this.replytoWraper);
    if (this.canComment) {
      wraper.addChild(footer);
    }
    this.addChild(wraper);
    this.addChild(
      this.parseOptions(new StackLayout(), { id: "comments-understack" })
    );
  }
  constructor() {
    super();
    let self = this;
    setTimeout(() => {
      this.init();
    }, 100);

    let resorce = app.getResources();
    resorce["getlikeText"] = likes => {
      return self.likeText + " (" + likes + ")";
    };
    resorce["commentsDateTo"] = function(time: any) {
      switch (typeof (<any>time)) {
        case "number":
          break;
        case "string":
          time = +new Date(time);
          break;
        case "object":
          if (time.constructor === Date) time = time.getTime();
          break;
        default:
          time = +new Date();
      }
      let time_formats = [
        [60, "seconds", 1], // 60
        [120, "1 minute ago", "1 minute from now"], // 60*2
        [3600, "minutes", 60], // 60*60, 60
        [7200, "1 hour ago", "1 hour from now"], // 60*60*2
        [86400, "hours", 3600], // 60*60*24, 60*60
        [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
        [604800, "days", 86400], // 60*60*24*7, 60*60*24
        [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
        [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
        [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
        [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
        [58060800000, "centuries", 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ];
      let seconds = (+new Date() - <any>time) / 1000,
        token = "ago",
        list_choice = 1;

      if (seconds === 0) {
        return "Just now";
      }
      if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = "from now";
        list_choice = 2;
      }
      let i = 0,
        format;
      while ((format = time_formats[i++]))
        if (seconds < format[0]) {
          if (typeof format[2] === "string") return format[list_choice];
          else
            return (
              Math.floor(seconds / format[2]) + " " + format[1] + " " + token
            );
        }
      return time;
    };

    app.setResources(resorce);
  }

  public busy(flag) {
    if (flag) {
      this.activityindecator.busy = true;
      this.sendbtn.className = "comment-btn loading " + this.fontClass;
    } else {
      this.activityindecator.busy = false;
      this.sendbtn.className = "comment-btn " + this.fontClass;
    }
  }
  public push(obj) {
    let self = this;
    let scrolltome = <Label>this.rep.getViewById("scrolltome");
    if (scrolltome) scrolltome.id = "";
    self.items.forEach(item => {
      delete item.scrolltome;
    });
    obj["scrolltome"] = "scrolltome";

    self.items.push(obj);

    this.refresh();
    setTimeout(() => {
      if (this.scroll === true) {
        let scrolltome = <Label>this.rep.getViewById("scrolltome");
        if (self.initscroll && this.scrollview.scrollableHeight) {
          this.scrollview.scrollToVerticalOffset(
            this.scrollview.scrollableHeight,
            false
          );
          self.initscroll = false;
        }
        if (scrolltome)
          this.scrollview.scrollToVerticalOffset(
            scrolltome.getLocationRelativeTo(self).y,
            true
          );
      }
    }, 100);

    self.textField.text = "";
    self.headtitle.text = self.commentCount();
  }
  public refresh() {
    this.headtitle.text = this.commentCount();
    this.rep.items = this.process();
    this.rep.refresh();
    this.rep.className = "comments-repeater";
  }
  private parseOptions(view, options) {
    Object.keys(options).forEach(function(key, index) {
      if (key === "rows")
        options[key].forEach(function(value, index) {
          view.addRow(new ItemSpec(1, <GridUnitType>value));
        });
      else if (key === "columns")
        options[key].forEach(function(value, index) {
          view.addColumn(new ItemSpec(1, <GridUnitType>value));
        });
      else {
        view[key] = options[key];
      }
    });

    return view;
  }
}
