// @flow
import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { AUTH0_ID_TOKEN } from '../common/const'
import Loading from '../common/components/Loading'
import type { GraphQLMutation } from '../types/GraphQLMutation'

type Props = {
  data: Object,
  createUser: GraphQLMutation
}

export class CreateUser extends React.Component<Props> {
  isFreshUser(): boolean {
    const { data } = this.props

    return !data.user || window.localStorage.getItem(AUTH0_ID_TOKEN) !== null
  }

  createUser(): void {
    const { createUser } = this.props

    const variables = {
      idToken: window.localStorage.getItem(AUTH0_ID_TOKEN)
    }

    createUser({ variables }).catch(e => {
      if (
        e.message === 'GraphQL error: User already exists with that information'
      )
        return

      alert('error occurred when createUser')
    })
  }

  render() {
    const { data } = this.props

    if (data.loading) {
      return <Loading />
    }

    // 新規ユーザーであればGraphCoolにユーザー情報としてAuth0認証情報を登録する
    if (this.isFreshUser()) {
      this.createUser()
    }

    return (
      <Redirect
        to={{
          pathname: '/'
        }}
      />
    )
  }
}

const createUser = gql`
  mutation($idToken: String!) {
    createUser(authProvider: { auth0: { idToken: $idToken } }) {
      id
    }
  }
`

const userQuery = gql`
  query {
    user {
      id
    }
  }
`

export default graphql(createUser, { name: 'createUser' })(
  graphql(userQuery, {
    options: { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true }
  })(withRouter(CreateUser))
)
