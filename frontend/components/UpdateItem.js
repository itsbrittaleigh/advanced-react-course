import gql from 'graphql-tag';
import Router from 'next/router';
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';

import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

import Form from './styles/Form';

const GET_ITEM = gql`
  query GET_ITEM($id: ID!) {
    item(where: {
      id: $id
    }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation UPDATE_ITEM(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = (event) => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({ [name]: val, });
  }

  handleSubmit = async (event, updateItemMutation) => {
    event.preventDefault();
    const response = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      }
    });
    Router.push({
      pathname: '/item',
      query: { id: response.data.updateItem.id },
    });
  }

  render() {
    return (
      <Query query={GET_ITEM} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if(loading) return <p>Loading...</p>;
          if(!data.item) return <p>No item found for ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM} variables={this.state}>
              {(updateItem, {loading, error }) => (
                <Form onSubmit={(event) => this.handleSubmit(event, updateItem)}>
                  <h2>Update Item</h2>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input type="text" id="title" name="title" placeholder="Title" defaultValue={data.item.title} onChange={this.handleChange} required />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input type="number" id="price" name="price" placeholder="Price" defaultValue={data.item.price} onChange={this.handleChange} required />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea id="description" name="description" placeholder="Enter a description" defaultValue={data.item.description} onChange={this.handleChange} required />
                    </label>
                  </fieldset>
                  <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    );
  }
}

export { UPDATE_ITEM };
export default UpdateItem;
