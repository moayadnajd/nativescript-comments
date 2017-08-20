
import { Observable } from 'tns-core-modules/data/observable';

import drawerModule = require("nativescript-telerik-ui/sidedrawer");
import frameModule = require("tns-core-modules/ui/frame");
export class BaseViewModel extends Observable {

public onOpenDrawerTap() {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>( frameModule.topmost().getViewById("sideDrawer"));
    sideDrawer.showDrawer();
}

public closeDrawer() {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>( frameModule.topmost().getViewById("sideDrawer"));
    sideDrawer.closeDrawer();
}

public goToSecondPage(args) {

    var navigationEntry = {
        moduleName: args.object.pageName,
        context: this,
        animated: true
    };
    
    frameModule.topmost().navigate(navigationEntry);
}

}