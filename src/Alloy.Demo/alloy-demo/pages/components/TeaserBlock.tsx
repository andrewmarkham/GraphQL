import React from 'react'; // we need this to make JSX compile
import Image from 'next/image'

import styles from '@/styles/components/teaserblock.module.css';


const TeaserBlock = (props:any) => {

    var {item} = props;

    var blockData = item?.ContentLink.Expanded;
    var imageUrl = blockData?.Image?.Url.replace('https','https')
    return(
        <div className={styles.container}>
            <div className={styles.imgwrapper}>
                <Image
                    className="img-wrapper mb-3"
                    src={imageUrl}
                    alt = ""
                    width={416}
                    height={200}
                    priority
                />

            </div>

            <h2>{blockData?.Heading}</h2>
            <p>{blockData?.Text}</p>
        </div>
    )
}

export default TeaserBlock