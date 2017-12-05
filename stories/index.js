import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import Auth0Lock from 'auth0-lock'

import { LoginButton } from '../src/Login/LoginButton'
import { Loading } from '../src/components/Loading'

storiesOf('ログインページ', module).add('LoginButton', () => {
  const lock = new Auth0Lock('story', 'book')

  return <LoginButton lock={lock} />
})

storiesOf('汎用コンポーネント', module).add('Loading', () => {
  return <Loading />
})
