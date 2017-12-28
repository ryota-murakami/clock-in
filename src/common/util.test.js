import { parseTime, pad2, calcTotalTime } from './util'

describe('parseTime()', () => {
  it('should be return CurrentDate when passed Date', () => {
    const date = new Date('2017/1/1 12:00:00')
    const expected = {
      dateObject: date,
      year: '2017',
      month: 'January',
      days: 'Sunday',
      date: '01',
      hour: '12',
      minutes: '00',
      seconds: '0'
    }
    const actual = parseTime(date)

    expect(actual).toEqual(expected)
  })
})

describe('pad2()', () => {
  it('should be return 2digit-zero-paddinged string when passing 1digit string', () => {
    const one = '1'
    const expected = '01'

    expect(pad2(one)).toEqual(expected)
  })

  it('should be return raw string when passing 2digit string', () => {
    const twenty = '20'
    const expected = '20'

    expect(pad2(twenty)).toEqual(expected)
  })
})

describe('calcTotalTime()', () => {
  it('should be return time diff string', () => {
    const now = new Date('2017/01/01 12:00:00')
    const past = new Date('2017/01/01 11:00:00')
    const res = calcTotalTime(now, past)

    expect(res).toBe('01h00m')
  })
})
