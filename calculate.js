
const { GONGJIJIN_RATE, SHANGYE_RATE } = require('./const')
const { pow } = Math

const calculate = (data) => {
  const loanMapper = {
    '公积金贷款': (data) => {
      return pub(data)
    },
    '商业贷款': (data) => {
      return biz(data)
    },
    '组合贷款': (data) => {
      return combo(data)
    }
  }
  return loanMapper[data['loan-way']](data)
}

const benxi = (base, monthlyRate, months) => {
  let monthlyPay = (base * monthlyRate * pow(1 + monthlyRate, months)) / (pow(1 + monthlyRate, months) - 1)
  let payedTotal = monthlyPay * months
  return {
    base,
    monthlyPay: monthlyPay,
    payedTotal: monthlyPay * months,
    interestTotal: payedTotal - base
  }
}

const benjin = (base, monthlyRate, months) => {

  let interestPayed = 0

  let first
  let last

  for (let i = 0; i < months; i++) {
    interestPayed += (base - (base / months) * i) * monthlyRate
    let mp = base / months + ((base - (base / months) * i) * monthlyRate)
    if (i === 0) {
      first = mp
    }
    if (i === months - 1) {
      last = mp
    }
  }

  let monthlyPay = (base / months) + (interestPayed / months)
  let delta = (first - last) / months

  return {
    base,
    monthlyPay: first,
    payedTotal: monthlyPay * months,
    interestTotal: interestPayed,
    delta: delta
  }
}

const init = (data) => {
  let base
  let calWay = data['cal-way']
  let loanWay = data['loan-way']
  if (calWay === '按房价总额') {
    let loanPercentage = (+data['loan-percentage'].replace('%', '')) / 100
    base = +data['pay-total'] * 10000 * loanPercentage
  } else if (calWay === '按贷款总额') {
    base = +data['loan-total'] * 10000
  }

  let months = +data['loan-age'] * 12
  let defaultRate
  if (loanWay === '公积金贷款') {
    defaultRate = GONGJIJIN_RATE
  } else if (loanWay === '商业贷款') {
    defaultRate = SHANGYE_RATE
  } else {

  }
  let monthlyRate = (+data['custom-rate'] || defaultRate) / 12

  let lr = data['loan-rate']
  if (lr && (lr.indexOf('倍') != -1 || lr.indexOf('折') != -1)) {
    let reg = /(\d\.?\d?)/ig
    let _result = lr.match(reg)
    let change = +_result[0]
    if (lr.indexOf('折') != -1) {
      change /= 10
    }
    monthlyRate = monthlyRate * change
  }

  return {
    base,
    monthlyRate,
    months
  }
}

const pub = (data) => {

  let { base, monthlyRate, months  } = init(data)

  return {
    benxi: benxi(base, monthlyRate, months),
    benjin: benjin(base, monthlyRate, months)
  }
}

const biz = (data) => {

  let { base, monthlyRate, months  } = init(data)

  return {
    benxi: benxi(base, monthlyRate, months),
    benjin: benjin(base, monthlyRate, months)
  }
}

const combo = (data) => {

  let pubData = {
    'loan-way': '公积金贷款',
    'cal-way': '按贷款总额',
    'loan-total': +data['combo-pub-loan'],
    'loan-age': +data['combo-loan-age'],
    'custom-rate': +data['combo-custom-pub-rate'],
    'loan-rate': data['combo-pub-rate'],
    'loan-percentage': data['combo-loan-percentage'],
    'pay-total': +data['combo-pay-total']
  }
  let bizData = {
    'loan-way': '商业贷款',
    'cal-way': '按贷款总额',
    'loan-total': +data['combo-loan-total'] - +data['combo-pub-loan'],
    'loan-age': +data['combo-loan-age'],
    'custom-rate': +data['combo-custom-biz-rate'],
    'loan-rate': data['combo-biz-rate'],
    'loan-percentage': data['combo-loan-percentage'],
    'pay-total': +data['combo-pay-total']
  }

  if (data['combo-cal-way'] === '按房价总额') {
    let _percent = +data['combo-loan-percentage'].replace('%', '') / 100
    pubData['loan-total'] = +data['combo-pub-loan']
    bizData['loan-total'] = +data['combo-pay-total'] * _percent - +data['combo-pub-loan']
  }

  let pubResult = pub(pubData)
  let bizResult = biz(bizData)

  return {
    benxi: {
      base: pubResult.benxi.base || bizResult.benxi.base,
      monthlyPay: pubResult.benxi.monthlyPay + bizResult.benxi.monthlyPay,
      payedTotal: pubResult.benxi.payedTotal + bizResult.benxi.payedTotal,
      interestTotal: pubResult.benxi.interestTotal + bizResult.benxi.interestTotal
    },
    benjin: {
      base: pubResult.benjin.base || bizResult.benjin.base,
      monthlyPay: pubResult.benjin.monthlyPay + bizResult.benjin.monthlyPay,
      payedTotal: pubResult.benjin.payedTotal + bizResult.benjin.payedTotal,
      interestTotal: pubResult.benjin.interestTotal + bizResult.benjin.interestTotal,
      delta: pubResult.benjin.delta + bizResult.benjin.delta
    }
  }
}

module.exports = {
  calculate,
  benjin,
  benxi
}
