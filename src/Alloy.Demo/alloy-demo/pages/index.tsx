import Head from 'next/head'

import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink } from '@apollo/client';
import ContentAreaRenderer from './components/ContentAreaRenderer';
import MainNavigation from './components/MainNavigation'


import StartPageQuery from '../graphql/StartPage';
import NavigationQuery from '../graphql/Navigation';

const inter = Inter({ subsets: ['latin'] })

type PageProps = {
  page: any;
  navigation: any;
};

function Home(props: PageProps) {
  const { page, navigation } = props;
  return (
    <>
      <Head>
        <title>{page.MetaTitle}</title>
        <meta name="description" content={page.MetaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainNavigation navigation={navigation}/>
      <main className={styles.main}>
        <ContentAreaRenderer items={page.MainContentArea} />
      </main>
    </>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.


export const getStaticProps: GetStaticProps = async (context) => {

  const httpLink = new HttpLink({ uri: process.env.GRAPHQL_HOST });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    ssrMode: true
  });
 
  var { data } = await client.query({
    query: StartPageQuery
  })

  var startPage = data.StartPage.items[0];

  var { data } = await client.query({
    query: NavigationQuery
  })
  
  var navigation = data.StartPage.items[0];

  console.log(navigation)

  return {
    props: {
      page: startPage,
      navigation: navigation
    },
  }
}

export default Home