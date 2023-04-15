import { gql } from 'urql';

// query
const checkStatusQuery = gql`
  query MyQuery($addr:String) {
  registereds(where: {to: $addr}) {
    isRegistered
  }
}`;

export default checkStatusQuery;