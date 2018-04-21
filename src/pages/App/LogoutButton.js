// @flow
import React, { Component } from 'react'
import { AUTH0_ID_TOKEN } from '../../const'
import { Button } from '../../elements/Button'
import { theme } from '../../const'

type Props = {||}

export class LogoutButton extends Component<Props> {
  logout = () => {
    window.localStorage.removeItem(AUTH0_ID_TOKEN)
    window.location.reload()
  }

  render() {
    return (
      <Button color={theme.gray} onClick={this.logout} data-test="logout-btn">
        Logout
      </Button>
    )
  }
}

export default LogoutButton