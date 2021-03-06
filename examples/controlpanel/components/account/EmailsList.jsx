import React from 'react';
import { compose, pure, withProps } from 'recompose';
import { graphql, withApollo } from '@apollo/client/react/hoc';
import gql from 'graphql-tag';
import EmailsListItem from './EmailsListItem';
import FormAddEmail from './FormAddEmail';

const EmailsList = ({
  userId,
  emails,
  onSubmitSuccess,
  disableSendVerificationEmail,
}) => (
  <>
    {emails.map(({ address, verified }) => (
      <EmailsListItem
        key={address}
        userId={userId}
        address={address}
        verified={verified}
        disableSendVerificationEmail={disableSendVerificationEmail}
        onSubmitSuccess={onSubmitSuccess}
      />
    ))}
    <FormAddEmail userId={userId} onSubmitSuccess={onSubmitSuccess} />
  </>
);

export default compose(
  withApollo,
  graphql(gql`
    query emails($userId: ID) {
      user(userId: $userId) {
        _id
        emails {
          verified
          address
        }
      }
    }
  `),
  withProps(({ data: { user: { emails = [] } = {} } }) => ({
    emails,
  })),
  pure
)(EmailsList);
