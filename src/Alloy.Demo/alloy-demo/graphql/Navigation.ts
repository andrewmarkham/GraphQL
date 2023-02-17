import { gql } from '@apollo/client';

const NavigationQuery = gql`
query NavQuery {
    StartPage(locale: en) {
      items {
        _children {
          Content(where: {ContentType: {in: ["StandardPage","ProductPage"]}}) {
            items {
              Name
              RelativePath
              Status
              ContentType
            }
          }
        }
      }
    }
  }

 `   
export default NavigationQuery
  