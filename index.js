const inquirer = require('inquirer')
const { calculate } = require('./calculate')
const combination = require('./combination')
const { table } = require('./table')
const { GONGJIJIN_RATE, GONGJIJIN_LIMIT, SHANGYE_RATE } = require('./const')

let loanLimit = 999999999
let loanWay

inquirer.prompt([
  {
    type: 'list',
    name: 'loan-way',
    message: '贷款方式:',
    choices: [
      '公积金贷款',
      '商业贷款',
      '组合贷款'
    ],
    default: '商业贷款'
  },
]).then(function (answers) {
  loanWay = answers['loan-way']
  if (loanWay === '组合贷款') {
    return combination()
  }
  return inquirer.prompt([
    {
      type: 'list',
      name: 'cal-way',
      message: '计算方式:',
      choices: [
        '按房价总额',
        '按贷款总额'
      ],
      default: '按贷款总额'
    }, {
      type: 'input',
      name: 'pay-total',
      message: '房价总额(万):',
      validate: (value) => {
        if ((+value).toString() === 'NaN') {
          return '请输入数字'
        }
        return true
      },
      when: (answers) => {
        return answers['cal-way'] === '按房价总额'
      }
    }, {
      type: 'list',
      name: 'loan-percentage',
      message: '贷款比例:',
      choices: ['20%', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%'],
      default: '70%',
      pageSize: 5,
      when: (answers) => {
        return answers['cal-way'] === '按房价总额'
      }
    }, {
      type: 'input',
      name: 'loan-total',
      message: '贷款总额(万):',
      validate: (value) => {
        if ((+value).toString() === 'NaN') {
          return '请输入数字'
        }
        if (+value > loanLimit) {
          return `目前公积金最大贷款上限为${loanLimit}万`
        }
        return true
      },
      when: (answers) => {
        if (loanWay === '公积金贷款') {
          loanLimit = GONGJIJIN_LIMIT
        }
        return answers['cal-way'] === '按贷款总额'
      }
    }, {
      type: 'input',
      name: 'loan-age',
      message: '贷款年限(1~30年):',
      validate: (value) => {
        if (!Number.isInteger(+value)) {
          return '请输入整数'
        }
        if (value < 1 || value > 30) {
          return '最低1年，最高30年'
        }
        return true
      }
    }, {
      type: 'expand',
      name: 'loan-rate',
      pageSize: 20,
      message: (answers) => {
        return loanWay === '商业贷款'?`贷款利率(默认为${SHANGYE_RATE * 100}%)`:`贷款利率(默认为${GONGJIJIN_RATE * 100}%):`
      },
      choices: () => {
        if (loanWay === '商业贷款') {
          return [
            {
              key: 'a',
              name: '最新基准利率',
              value: '最新基准利率'
            }, {
              key: 'b',
              name: '最新基准利率9.5折',
              value: '最新基准利率9.5折'
            }, {
              key: 'c',
              name: '最新基准利率9折',
              value: '最新基准利率9折'
            }, {
              key: 'd',
              name: '最新基准利率8.8折',
              value: '最新基准利率8.8折'
            }, {
              key: 'e',
              name: '最新基准利率8.7折',
              value: '最新基准利率8.7折'
            }, {
              key: 'f',
              name: '最新基准利率8.6折',
              value: '最新基准利率8.6折'
            }, {
              key: 'g',
              name: '最新基准利率8.5折',
              value: '最新基准利率8.5折'
            }, {
              key: 'z',
              name: '最新基准利率8.2折',
              value: '最新基准利率8.2折'
            }, {
              key: 'i',
              name: '最新基准利率8折',
              value: '最新基准利率8折'
            }, {
              key: 'j',
              name: '最新基准利率7.5折',
              value: '最新基准利率7.5折'
            }, {
              key: 'k',
              name: '最新基准利率7折',
              value: '最新基准利率7折'
            }, {
              key: 'l',
              name: '最新基准利率1.1倍',
              value: '最新基准利率1.1倍'
            }, {
              key: 'm',
              name: '最近基准利率1.2倍',
              value: '最近基准利率1.2倍'
            }, {
              key: 'n',
              name: '最近基准利率1.3倍',
              value: '最近基准利率1.3倍'
            }, {
              key: 'o',
              name: '自定义利率',
              value: '自定义利率'
            }
          ]
        }
        return [
          {
            key: 'a',
            name: '最新基准利率',
            value: '最新基准利率'
          }, {
            key: 'b',
            name: '最新基准利率1.1倍',
            value: '最新基准利率1.1倍'
          }, {
            key: 'c',
            name: '最新基准利率1.2倍',
            value: '最新基准利率1.2倍'
          }, {
            key: 'd',
            name: '自定义利率',
            value: '自定义利率'
          }
        ]
      }
    }, {
      type: 'input',
      name: 'custom-rate',
      message: '自定义利率(%):',
      validate: (value) => {
        return parseFloat(value).toString() === 'NaN'?'请输入数字':true
      },
      when: (answers) => {
        return answers['loan-rate'] === '自定义利率'
      },
      filter: (value) => {
        return +value / 100
      }
    }
  ])
}).then((answers) => {
  answers['loan-way'] = loanWay
  let result = calculate(answers)
  result['extra'] = {
    months: +(answers['loan-age'] || answers['combo-loan-age']) * 12
  }
  console.log(table(result).toString())
}).catch((e) => {
  console.log(e)
})
