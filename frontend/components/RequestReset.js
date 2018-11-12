import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import Form from './styles/Form';

const REQUEST_RESET = gql`
  mutation REQUEST_RESET($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: '',
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET}
        variables={this.state}
      >
        {(requestReset, { error, loading, called }) => {
          return (
            <Form
              method="post"
              onSubmit={async (event) => {
                event.preventDefault();
                await requestReset();
                this.setState({ email: '' });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a Password Reset</h2>
                <Error error={error} />
                {!error && !loading && called &&
                  <p>Success! Check your email for a reset link.</p>
                }
                <label htmlFor="email">
                  Email
                  <input type="email" name="email" value={this.state.email} onChange={this.handleUpdate} />
                </label>
                <button type="submit">Request Reset</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
