import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import Error from './ErrorMessage';

import Form from './styles/Form';

const SIGNUP = gql`
  mutation SIGNUP($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    name: '',
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <Mutation mutation={SIGNUP} variables={this.state}>
      {(signup, { error, loading }) => {
        return (
          <Form
            method="post"
            onSubmit={async (event) => {
              event.preventDefault();
              await signup();
              this.setState({ name: '', email: '', password: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input type="email" name="email" value={this.state.email} onChange={this.handleUpdate} />
              </label>
              <label htmlFor="password">
                Password
                <input type="password" name="password" value={this.state.password} onChange={this.handleUpdate} />
              </label>
              <label htmlFor="name">
                Name
                <input type="text" name="name" value={this.state.name} onChange={this.handleUpdate} />
              </label>
              <button type="submit">Sign Up</button>
            </fieldset>
          </Form>
        );
      }}
      </Mutation>
    );
  }
}

export default SignUp;
