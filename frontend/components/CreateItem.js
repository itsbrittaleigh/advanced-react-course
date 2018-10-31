import gql from 'graphql-tag';
import Router from 'next/router';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

import Form from './styles/Form';

const CREATE_ITEM = gql`
  mutation CREATE_ITEM(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  };

  handleChange = (event) => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({ [name]: val, });
  }

  uploadFile = async (event) => {
    const files = event.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');
    const response = await fetch('https://api.cloudinary.com/v1_1/demwvw7bx/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await response.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM} variables={this.state}>
        {(createItem, {loading, error }) => (
          <Form onSubmit={async (event) => {
            event.preventDefault();
            const response = await createItem();
            Router.push({
              pathname: '/item',
              query: { id: response.data.createItem.id },
            });
          }}>
            <h2>Sell an Item</h2>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input type="file" id="file" name="file" placeholder="Upload an image" onChange={this.uploadFile} />
                {this.state.image &&
                  <img src={this.state.image} />
                }
              </label>
              <label htmlFor="title">
                Title
                <input type="text" id="title" name="title" placeholder="Title" value={this.state.title} onChange={this.handleChange} required />
              </label>
              <label htmlFor="price">
                Price
                <input type="number" id="price" name="price" placeholder="Price" value={this.state.price} onChange={this.handleChange} required />
              </label>
              <label htmlFor="description">
                Description
                <textarea id="description" name="description" placeholder="Enter a description" value={this.state.description} onChange={this.handleChange} required />
              </label>
            </fieldset>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Mutation>
    );
  }
}

export { CREATE_ITEM };
export default CreateItem;
