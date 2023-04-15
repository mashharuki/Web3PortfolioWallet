import { gql } from 'urql';

// query
const getUserInfoQuery = gql`
  query MyQuery($addr:String!, $did:String!) {
  registereds(where: {to: $addr}) {
    did
    to
    name
    isRegistered
  }
  tokenCreateds {
    symbol
    name
  }
  balanceChangeds(
    where: {to: $addr}
    first: 1
    orderDirection: desc
    orderBy: blockTimestamp
  ) {
    to
    balanceOf
  }
  updateVcs(where: {did: $did}) {
    cid
    did
    name
  }
  updateScores(
    first: 1
    orderBy: blockTimestamp
    orderDirection: desc
    where: {to: $addr}
  ) {
    to
    score
  }
}`;

export default getUserInfoQuery;