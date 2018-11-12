import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { GET_CURRENT_USER } from './User';
import Error from './ErrorMessage';
import Form from './styles/Form';

const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(
      resetToken: $resetToken,
      password: $password,
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  }

  state = {
    password: '',
    confirmPassword: '',
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }}
        refetchQueries={[{ query: GET_CURRENT_USER }]}
      >
        {(resetPassword, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async (event) => {
                event.preventDefault();
                await resetPassword();
                this.setState({
                  password: '',
                  confirmPassword: '',
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Your Password</h2>
                <Error error={error} />
                <label htmlFor="password">
                  New Password
                  <input type="password" name="password" value={this.state.password} onChange={this.handleUpdate} />
                </label>
                <label htmlFor="confirmPassword">
                  Confirm New Password
                  <input type="password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleUpdate} />
                </label>
                <button type="submit">Reset Password</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Reset;
