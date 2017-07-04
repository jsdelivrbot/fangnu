
const inquirer = require('inquirer')
const { GONGJIJIN_RATE, GONGJIJIN_LIMIT, SHANGYE_RATE } = require('./const')

let loanTotal

module.exports = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'combo-cal-way',
      message: '计算方式',
      choices: [
        '按房价总额',
        '按贷款总额'
      ],
      default: '按贷款总额'
    }, {
      type: 'input',
      name: 'combo-loan-total',
      message:'贷款总额(万):',
      validate: (value) => {
        if ((+value).toString() === 'NaN') {
          return '请输入数字'
        }
        return true
      },
      when: (answers) => {
        return answers['combo-cal-way'] === '按贷款总额'
      }
    }, {
      type: 'input',
      name: 'combo-pay-total',
      message: '房价总额(万):',
      validate: (value) => {
        if ((+value).toString() === 'NaN') {
          return '请输入数字'
        }
        return true
      },
      when: (answers) => {
        return answers['combo-cal-way'] === '按房价总额'
      }
    }, {
      type: 'list',
      name: 'combo-loan-percentage',
      message: '贷款比例:',
      choices: ['20%', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%'],
      default: '70%',
      pageSize: 5,
      when: (answers) => {
        return answers['combo-cal-way'] === '按房价总额'
      }
    }, {
      type: 'input',
      name: 'combo-pub-loan',
      message: '公积金贷款(万):',
      validate: (value) => {
        if ((+value).toString() === 'NaN') {
          return '请输入数字'
        }
        if (+value > GONGJIJIN_LIMIT) {
          return `目前公积金最大贷款上限为${GONGJIJIN_LIMIT}万`
        }
        if (+value > loanTotal) {
          return '超出贷款总额'
        }
        return true
      },
      when: (answers) => {
        if (answers['combo-cal-way'] === '按房价总额') {
          loanTotal = +answers['combo-loan-percentage'].replace('%', '') / 100 * +answers['combo-pay-total']
        } else {
          loanTotal = +answers['combo-loan-total']
        }
        return true
      }
    }, {
      type: 'expand',
      name: 'combo-pub-rate',
      message: `公积金利率(默认为${GONGJIJIN_RATE * 100}%):`,
      choices: [
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
    }, {
      type: 'input',
      name: 'combo-custom-pub-rate',
      message: '自定义公积金利率(%):',
      validate: (value) => {
        return parseFloat(value).toString() === 'NaN'?'请输入数字':true
      },
      when: (answers) => {
        return answers['combo-pub-rate'] === '自定义利率'
      },
      filter: (value) => {
        return +value / 100
      }
    }, {
      type: 'expand',
      name: 'combo-biz-rate',
      message: `商贷利率(${SHANGYE_RATE * 100}%):`,
      pageSize: 20,
      choices: [
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
    }, {
      type: 'input',
      name: 'combo-custom-biz-rate',
      message: `自定义商贷利率(默认为${SHANGYE_RATE * 100}%):`,
      validate: (value) => {
        return parseFloat(value).toString() === 'NaN'?'请输入数字':true
      },
      when: (answers) => {
        return answers['combo-biz-rate'] === '自定义利率'
      },
      filter: (value) => {
        return +value / 100
      }
    }, {
      type: 'input',
      name: 'combo-loan-age',
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
    }
  ])
}
