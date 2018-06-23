// @flow
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { getUserQuery } from '../../../graphql/query'
import { compose } from 'redux'
import gql from 'graphql-tag'
import { Button } from '../../../elements/Button'
import { theme } from '../../../const'

type Props = {
  data: {
    loading: boolean,
    user: {
      id: string
    }
  },
  mutation: Function
}

const mutation = gql`
  mutation($userId: ID!, $clockIn: DateTime) {
    createClock(userId: $userId, clockIn: $clockIn) {
      id
      clockIn
      clockOut
    }
    updateUser(id: $userId, isDuringClockIn: true) {
      id
      isDuringClockIn
      clocks(last: 1) {
        id
        clockIn
        clockOut
      }
    }
  }
`

export class ClockinButton extends Component<Props> {
  gqlLogic: Function

  constructor(props: Props) {
    super(props)
    this.gqlLogic = this.gqlLogic.bind(this) // avoid Class properties arrow function bind in order to test mocking
  }

  gqlLogic(): void {
    const { data, mutation } = this.props
    const userId = data.user.id

    mutation({
      variables: { userId: userId, clockIn: new Date().toISOString() },
      update: (proxy, { data: { updateUser } }) => {
        const data = proxy.readQuery({ query: getUserQuery })
        data.user = updateUser
        proxy.writeQuery({ query: getUserQuery, data })
      }
    })
  }

  render() {
    const { loading } = this.props.data
    if (loading) return null

    return (
      <Button
        primary
        color={theme.green}
        onClick={this.gqlLogic}
        enzyme-testid="clock-in-btn"
      >
        Clock In
      </Button>
    )
  }
}

export default compose(
  graphql(getUserQuery),
  graphql(mutation, {
    name: 'mutation'
  })
)(ClockinButton)
