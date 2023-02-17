import React from 'react'; // we need this to make JSX compile
import styles from '@/styles/components/mainnavigation.module.css';

import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink } from '@apollo/client';



const MainNavigation = (props : any) => {

    var {navigation} = props;
    console.log(navigation)
    let children : any[] = navigation?._children.Content.items;

    return(
        
        <div className={styles.menu}>
            
            <ul>
            {
                children?.map(i => {
                    return (
                        <li key={i}>
                          <a href={i.RelativePath}>{i.Name}</a>
                        </li>
                    )
                })
            }
            </ul>
        </div>
    )
}
  
export default MainNavigation