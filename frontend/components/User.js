import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const GET_CURRENT_USER = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`;

const User = props => (
  <Query {...props} query={GET_CURRENT_USER}>
    {payload => props.children(payload)}
  </Query>
);

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export { GET_CURRENT_USER };
export default User;
