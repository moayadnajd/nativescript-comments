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

## Angular NativeScript
### Regiter plugin in Component class

```

    import * as elementRegistryModule from 'nativescript-angular/element-registry';
    elementRegistryModule.registerElement("Comments", () => require("nativescript-comments).Comments);

```

### HTML
```

    <Comments  [items]="comments"  (like)="function($event)"  (add)="function($event)" >
    </Comments>

```

## API

## see [demo](https://github.com/moayadnajd/nativescript-comments/tree/master/demo) for more details


| Property | Default | Description |
| --- | --- | --- |
| items | required | Array of comment object { image:" image src ", id: "unique identifier of the comment", comment: "comment text ", username: "user name ", likes: " number of  how many likes ", isLike: "boolean is the user like this or not ", datetime: "datetime of the comment" } |
| add | function(arg){} | event on comment added you can access the object to push the comment buy args.object.push($comment-object) and you can get the id of the comment that replyed to by args.to |
| like | function(arg){} | event on like clicked send with obj.to and you can toggle the like with args.object.toggle(args.to) |
| scroll | true | enable or disable scrollview inside the comments holder |
| imagetag | <Image /> | the xml element of the image  so you can change it if you need to add cache plugin or something |
| plugin | empty string | plugin include statment like xmlns:IC="nativescript-web-image-cache" |
| title | Comments | the title of the comments box |
| replyText | reply | the reply button text |   
| likeText | like | the like button text |   
| toText | replying to : | replying to text  |   
| sendText | comment | the comment send button text |   
## License

Apache License Version 2.0, January 2004


