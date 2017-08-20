
import * as pages from 'tns-core-modules/ui/page';
import { Cache } from './cache-model';


export function pageLoaded(args) {
    let page = <pages.Page>args.object;
    page.bindingContext = new Cache();
}


