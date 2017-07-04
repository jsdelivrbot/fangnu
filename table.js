
const Table = require('cli-table2')
const { round } = Math

const toWan = (num) => {
  return +(num / 10000).toFixed(1)
}

const table = ({ benxi, benjin, extra }) => {
  const cross_table = new Table({
    head: ['', '月供', '贷款总额', '还款总额', '支付利息', '贷款月数', '每月递减']
  })
  cross_table.push({
    "等额本息": [
      `${round(benxi.monthlyPay)}元`,
      `${toWan(benxi.base)}万`,
      `${toWan(benxi.payedTotal)}万`,
      `${toWan(benxi.interestTotal)}万`,
      `${extra.months}月`,
      '无'
    ]
  }, {
    "等额本金": [
      `${round(benjin.monthlyPay)}元`,
      `${toWan(benjin.base)}万`,
      `${toWan(benjin.payedTotal)}万`,
      `${toWan(benjin.interestTotal)}万`,
      `${extra.months}月`,
      `${round(benjin.delta)}元`
    ]
  })
  return cross_table
}

module.exports = {
  table
}
