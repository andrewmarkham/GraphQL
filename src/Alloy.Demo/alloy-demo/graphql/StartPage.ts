import { gql } from '@apollo/client';

const StartPageQuery = gql`
query MyQuery {
  StartPage(locale: en) {
    items {
      Name
      TeaserText
      RouteSegment
      MetaTitle
      MetaKeywords
      MetaDescription
      MainContentArea {
        DisplayOption
        Tag
        ContentLink {
          Id
          Expanded {
            Name
            ContentType
            ... on JumbotronBlock {
              Name
              Heading
              Image {
                Url
              }
              ButtonText
              ContentType
              SubHeading
            }
            ... on TeaserBlock {
              _score
              Name
              Image {
                Url
              }
              Heading
              Text
            }
          }
        }
      }
    }
  }
}


    `
export default StartPageQuery