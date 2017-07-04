
const test = require('ava')
const { GONGJIJIN_RATE } = require('../const')
const { round } = Math
const { calculate, benxi, benjin } = require('../calculate')

let base = 60 * 10000
let monthlyRate = GONGJIJIN_RATE / 12
let months = 30 * 12

test('calculate.benxi', t => {
  let { monthlyPay, payedTotal, interestTotal } = benxi(base, monthlyRate, months)
  t.is((round(monthlyPay)), 2611)
  t.is(+(payedTotal / 10000).toFixed(1), 94)
  t.is(+(interestTotal / 10000).toFixed(1), 34)
  t.pass()
})

test('calculate.benjin', t => {
  let { monthlyPay, payedTotal, interestTotal, delta } = benjin(base, monthlyRate, months)
  t.is(round(monthlyPay), 3292)
  t.is(+(payedTotal / 10000).toFixed(1), 89.3)
  t.is(+(interestTotal / 10000).toFixed(1), 29.3)
  t.is(round(delta), 5)
  t.pass()
})
