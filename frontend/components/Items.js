import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';

import Item from './Item';

const GET_ALL_ITEMS = gql`
  query GET_ALL_ITEMS {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    return (
      <Center>
        <Query query={GET_ALL_ITEMS}>
          {({ data, error, loading }) => {
            if(loading) return <p>Loading...</p>;
            if(error) return <p>Error: {error.message}</p>;
            return (
              <ItemsList>
                {data.items.map(item => <Item item={item} key={item.id} /> )}
              </ItemsList>
            );
          }}
        </Query>
      </Center>
    );
  }
}

export { GET_ALL_ITEMS };
export default Items;
