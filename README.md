# Nativescript Comments
[![npm](https://img.shields.io/npm/v/nativescript-comments.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/nativescript-comments)
[![npm](https://img.shields.io/npm/dt/nativescript-comments.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/nativescript-comments)

Comments box ready for integration inside you'r native script app


![Sample1](http://codeobia.com/screenshots/comments.gif)

## Installation

- `tns plugin add nativescript-comments`

### add comments.ios.css and comments.android.css [css](https://github.com/moayadnajd/nativescript-comments/tree/master/demo/app) for styling 

*Be sure to run a new build after adding plugins to avoid any issues

## Usage 
	
```
    <Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:UI="nativescript-comments">
    <UI:Comments  like="{{ like }}" add="{{ add }}" items="{{ comments }}"   />
    </page>
```

## access events

```
     public like(args) {
        // args.object.toggle(args.to) function increase or decrease the like count inside the comment
        // args.to has the id of the liked item 
        args.object.toggle(args.to);
        console.log(this.comments.getItem(0).isLike);
    }

    public add(args) {
        // args.object.busy(true) show the activity indicator
        // args.object.busy(false) hide the activity indicator
        // args.object.push({}) push new comment to the items 
        let self = this;
        args.object.busy(true)

        // setTimeout is just to emulate server delay time 
        setTimeout(function () {
        args.object.push({ image: "~/images/icon-50.png", id: self.random(1000), comment: args.comment, replyTo: args.to, username: "Demo User", likes: 0, isLike: false, datetime: Date.now() });
        console.log(self.comments.length);
        args.object.busy(false);
        }, 2000);
    }

    public edit(args) {
        // the edited comment 
        alert(args.comment);
        //the id of the edited comment
        alert(args.id)
    }

        public delete(args) {
        //the id of the deleted comment
        alert(args.id);
    }

```
### you can edit or delete by longPress on the comment that have {editing:true} in the comment object 


## API

## see [demo](https://github.com/moayadnajd/nativescript-comments/tree/master/demo) for more details


| Property | Default | Description |
| --- | --- | --- |
| items | required | Array of comment object { image:" image src ", id: "unique identifier of the comment", comment: "comment text ", username: "user name ", likes: " number of  how many likes ", isLike: "boolean is the user like this or not ", datetime: "datetime of the comment" } |
| add | function(arg){} | event on comment added you can access the object to push the comment buy args.object.push($comment-object) and you can get the id of the comment that replyed to by args.to |
| like | function(arg){} | event on like clicked send with obj.to and you can toggle the like with args.object.toggle(args.to) |
| scroll | true | enable or disable scrollview inside the comments holder |
| canComment | true | disable or enable submission|
| imagetag | <Image /> | the xml element of the image  so you can change it if you need to add cache plugin or something |
| plugin | empty string | plugin include statment like xmlns:IC="nativescript-web-image-cache" |
| title | Comments | the title of the comments box |
| replyText | reply | the reply button text |   
| likeText | like | the like button text |   
| toText | replying to : | replying to text  |   
| sendText | comment | the comment send button text |
| fontClass | fa | the font library class |
|editingText | editing your comment | the editing help text when you hit edit |
|xbtn | x | the exit edit or reply text can be font icon  |     
|textview | false | boolean flag to make comment field  textview  or textfield | 
|customTemplate| function(canComment, plugin, imageholder, commentsDateTo): string {} | can return own comment template string. See main-view-model.ts in demo |

## License

Apache License Version 2.0, January 2004


