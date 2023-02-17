import Head from 'next/head'

import { Inter } from '@next/font/google'
import styles from '@/styles/Product.module.css'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink } from '@apollo/client';
import ContentAreaRenderer from './components/ContentAreaRenderer';
import MainNavigation from './components/MainNavigation'


import ProductPageQuery from '../graphql/ProductPage';
import NavigationQuery from '../graphql/Navigation';

const inter = Inter({ subsets: ['latin'] })

type ProductPageProps = {
  page: any;
  navigation: any;
};

function ProductPage(props: ProductPageProps) {

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
        <h1 className='fullwidth'>{page.Name}</h1>
        
        <div className='wide'>
          <div dangerouslySetInnerHTML={setRaw(page.MainBody)} />
        </div>

        <div className='narrow'>
          <p>RHS Text</p>
        </div>
      </main>
    </>
  )
}

function setRaw(html: string)
{
  return {
    __html: html
  }
}
// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.


export const getStaticProps: GetStaticProps = async ({params}) => {

  if (!params || !params.slug) {
    return { props: {} };
  }

  const httpLink = new HttpLink({ uri: process.env.GRAPHQL_HOST });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    ssrMode: true
  });
 
  var { data } = await client.query({
    query: ProductPageQuery,
    variables: {
      segment: params.slug
    }
  })

  var page = data.ProductPage.items[0];

  var { data } = await client.query({
    query: NavigationQuery
  })
  
  var navigation = data.StartPage.items[0];

  return {
    props: {
      page: page,
      navigation: navigation
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const httpLink = new HttpLink({ uri: process.env.GRAPHQL_HOST });

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true
    });
   
    var { data } = await client.query({
      query: gql`query ProductPagesQuery {
        ProductPage(locale: en) {
          items {
            Name
            RouteSegment
          }
        }
      }`
    })
  
    var pages = data.ProductPage.items;

    const paths = pages.map((page: any) => ({
      params: { slug: page.RouteSegment}, locale: 'en',
    }));
  
    return { paths, fallback: false };
  };

export default ProductPage