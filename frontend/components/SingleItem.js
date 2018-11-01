import gql from 'graphql-tag';
import Head from 'next/head';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';

import Error from './ErrorMessage';

const GET_ITEM = gql`
  query GET_ITEM($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItemStyles = styled.div`
  max-width: calc(${props => props.theme.maxWidth} + 200px);
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query query={GET_ITEM} variables={{ id: this.props.id }}>
        {({ error, loading, data }) => {
          if(error) return <Error error={error} />;
          if(loading) return <p>Loading...</p>;
          if(!data.item) return <p>No item found for {this.props.id}</p>;
          const item = data.item;
          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          )
        }}
      </Query>
    );
  }
}

export default SingleItem;
