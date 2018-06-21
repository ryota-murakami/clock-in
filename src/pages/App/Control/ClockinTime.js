// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { theme } from '../../../const'
import { calcTotalTime } from '../../../function'
import type { CurrentTime } from '../../../dataType'
import type { ReduxState } from '../../../reducer'

const Container = styled.div`
  flex-basics: max-content;
  flex-grow: 3;
  color: ${theme.textColor};
  font-size: 1.1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px solid ${theme.borderColor};
  border-radius: 5px;
  margin-right: 10px;
`

type User = {
  id: string,
  clocks: Array<{
    id: string,
    clockIn: string
  }>
}

type GraphQLdata = {
  user: User,
  loading: boolean
}

type StateToProps = {|
  currentTime: CurrentTime
|}

type Props = StateToProps & {
  data: GraphQLdata
}

export class ClockinTime extends Component<Props> {
  formatDate: Function

  constructor(props: Props) {
    super(props)
    this.formatDate = this.formatDate.bind(this)
  }

  /**
   * @param str ISOString. e.g. '2017-12-10T14:31:10.501Z'
   * @returns {string} human readable string. e.g. '11:31 PM'
   */
  formatDate(str: string): string {
    const dateObj = new Date(str)

    const options = {
      hour: '2-digit',
      minute: '2-digit'
    }

    return dateObj.toLocaleTimeString('en-us', options)
  }

  render() {
    const { data } = this.props
    if (data.loading) return null

    const { user } = data
    const currentTime: CurrentTime = this.props.currentTime

    const now: Date = currentTime.dateObject
    const ClockinTimeISO: string = user.clocks[0].clockIn
    const past = new Date(ClockinTimeISO)

    const TotalTime = calcTotalTime(now, past)

    return (
      <Container enzyme-testid="clock-in-time">
        <div>ClockIn</div>
        <div>{this.formatDate(ClockinTimeISO)}</div>
        <div>TotalTime</div>
        <div>{TotalTime}</div>
      </Container>
    )
  }
}

const mapStateToProps = (state: ReduxState): StateToProps => {
  return {
    currentTime: state.currentTime
  }
}

export default connect(mapStateToProps)(ClockinTime)
