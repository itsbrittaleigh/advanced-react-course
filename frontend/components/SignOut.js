import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { GET_CURRENT_USER } from './User';

const SIGN_OUT = gql`
  mutation SIGN_OUT {
    signOut {
      message
    }
  }
`;

const SignOut = props => (
  <Mutation
    mutation={SIGN_OUT}
    refetchQueries={[{ query: GET_CURRENT_USER }]}
  >
    {(signOut) => (
      <button onClick={signOut}>Sign Out</button>
    )}
  </Mutation>
);

export default SignOut;
