import { gql } from '@apollo/client';

const ProductPageQuery = gql`
query ProductPageQuery($segment: String) {
  ProductPage(locale: en, where: {RouteSegment: {eq: $segment}}) {
    items {
      Name
      MetaTitle
      MetaKeywords
      MetaDescription
      MainBody
      TeaserText
      RelativePath
      PageImage {
        Url
      }
      RouteSegment
    }
  }
}
`
export default ProductPageQuery