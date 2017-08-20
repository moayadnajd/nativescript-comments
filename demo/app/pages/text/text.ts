
import * as pages from 'tns-core-modules/ui/page';
import { HelloWorldModel } from '../../main-view-model';


export function pageLoaded(args) {
    let page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();
}


