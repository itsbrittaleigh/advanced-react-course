import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { GET_CURRENT_USER } from './User';
import Error from './ErrorMessage';
import Form from './styles/Form';

const SIGN_IN = gql`
  mutation SIGN_IN($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class SignIn extends Component {
  state = {
    email: '',
    password: '',
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <Mutation
        mutation={SIGN_IN}
        variables={this.state}
        refetchQueries={[{ query: GET_CURRENT_USER }]}
      >
        {(signIn, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async (event) => {
                event.preventDefault();
                await signIn();
                this.setState({ name: '', email: '', password: '' });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign in to your account</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                  <input type="email" name="email" value={this.state.email} onChange={this.handleUpdate} />
                </label>
                <label htmlFor="password">
                  Password
                  <input type="password" name="password" value={this.state.password} onChange={this.handleUpdate} />
                </label>
                <button type="submit">Sign In</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default SignIn;
