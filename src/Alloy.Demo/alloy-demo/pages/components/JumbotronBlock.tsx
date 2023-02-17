import React from 'react'; // we need this to make JSX compile

import styles from '@/styles/components/jumbotron.module.css';


 const JumbotronBlock = (props:any) => {

    var {item} = props;

    var blockData = item?.ContentLink.Expanded;

    const divStyle = {
        backgroundImage: 'url('+ blockData?.Image?.Url.replace('https','https') + ')'
    }
 
    return(
        <div style={divStyle} className={styles.container}>
            <div className="jumbotron-dimmer"></div>
            <div className="jumbotron-inner">
                <h1 className="display-5 mb-4">{blockData?.Heading}</h1>
                <p className="lead mb-5">{blockData?.SubHeading}</p>
                <a className="btn btn-primary btn-lg" href="" id="jumboLink">{blockData?.ButtonText}</a>
            </div>
        </div>
    )
}

export default JumbotronBlock