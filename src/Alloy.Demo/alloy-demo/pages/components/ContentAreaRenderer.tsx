import React from 'react'; // we need this to make JSX compile

import JumbotronBlock from './JumbotronBlock';
import TeaserBlock from './TeaserBlock';

import styles from '@/styles/components/contentarea.module.css';
import { JsxElement } from 'typescript';

class ContentAreaItem {
    ItemClasses: string;
    Component: any;

    constructor () {
        this.ItemClasses = "fullwidth"
    }
}

interface IComponents {
    key: string,
    component: any
}

interface Dictionary<T> {
    [Key: string]: T;
}
class componentFactory {
  
    components: Dictionary<any> = {};

    constructor(){
        this.components["JumbotronBlock"] = JumbotronBlock;
        this.components["TeaserBlock"] = TeaserBlock;
    } 

    getType(item: any) : string {
        var contentTypes = item.ContentLink.Expanded.ContentType;
        return contentTypes[contentTypes.length - 1]; 
    }

    getDisplayOption(item: any) : string {
        return item.DisplayOption === "" ? "fullwidth" : item.DisplayOption; 
    }

    resolve(item: any): ContentAreaItem {
        var contentType: string = this.getType(item);

        var i = new ContentAreaItem();

        i.Component = this.components[contentType];
        i.ItemClasses = this.getDisplayOption(item);

        return i;
    }
}

function ContentAreaRenderer(props :any) {

    let items :any[] = props.items;

    var factory = new componentFactory()

    return(
        <div className={styles.container}>

        {items?.map(i => {

            const ContentAreaItem = factory.resolve(i);
            const Component = ContentAreaItem.Component;
            
            if (Component != null)
                return (
                <div className={ContentAreaItem.ItemClasses} key={i.ContentLink.Id}>
                    <Component item={i}  />
                </div>)
            else
                return null
        })}

        </div>
    )
}

export default ContentAreaRenderer