import { gql } from 'urql';

// query
const getUserDid = gql`
  query MyQuery($addr:String!, $did:String!) {
  registereds(where: {to: $addr}) {
    did
  }
}`;

export default getUserDid;