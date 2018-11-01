import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { GET_ALL_ITEMS } from './Items';

const DELETE_ITEM = gql`
  mutation DELETE_ITEM($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  updateClient = (cache, payload) => {
    const data = cache.readQuery({ query: GET_ALL_ITEMS });
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    debugger;
    cache.writeQuery({
      query: GET_ALL_ITEMS,
      data,
    });
  }

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM}
        variables={{ id: this.props.id }}
        update={this.updateClient}
      >
        {(deleteItem, { error }) => (
          <button onClick={() => {
            if(confirm('Are you sure you want to delete this item?')) deleteItem();
          }}>
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export { DELETE_ITEM };
export default DeleteItem;
