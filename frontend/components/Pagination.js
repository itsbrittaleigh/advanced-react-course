import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';

import { perPage } from '../config';

import Error from './ErrorMessage';

import PaginationStyles from './styles/PaginationStyles';

const GET_ITEMS_COUNT = gql`
  query GET_ITEMS_COUNT {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={GET_ITEMS_COUNT}>
    {({ data, loading, error }) => {
      if(error) return <Error error={error} />;
      if(loading) return <p>Loading...</p>;
      const count = data.itemsConnection.aggregate.count;
      const currentPage = props.page;
      const pages = Math.ceil(count / perPage);
      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits! Page {currentPage} of {pages}</title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: currentPage - 1},
            }}
          >
            <a className="prev" aria-disabled={currentPage <= 1}>&larr; Prev</a>
          </Link>
          <p>Page {currentPage} of {pages}</p>
          <p>{count} Items Total</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: currentPage + 1},
            }}
          >
            <a className="next" aria-disabled={currentPage >= pages}>Next &rarr;</a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
