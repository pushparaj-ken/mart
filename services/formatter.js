const moment = require('moment');

const toDate = (dateInput) => {
  return moment(dateInput).format("DD-MM-YYYY");
};


const toTime = (timeInput) => {

  return moment(timeInput).format('HH:mm:ss');
};


const toDecimal = (decimalInput) => {
  //console.log("toDecimal",decimalInput)
  return decimalInput.toFixed(2);
};


const toINR = (currencyInput) => {
  //console.log("CURRENCY_------>",parseFloat(currencyInput.toLocaleString('en-IN').replace(/,/g, '')))
  return currencyInput.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR'
  });
};

const toNumber = (numberInput) => {
  //console.log("CURRENCY_------>",parseFloat(currencyInput.toLocaleString('en-IN').replace(/,/g, '')))
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(numberInput);
};

const monthNames = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const splittime = (values) => {
  let time = values.split(':');
  return time[0] + ":" + time[1];
}

const toDatenew = (dateInput) => {
  return moment(dateInput).format("DD-MM-YY");
};

const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
}

const formatDate = (date) => {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

module.exports = {
  toDate,
  toTime,
  toDecimal,
  toINR,
  monthNames,
  toDatenew,
  splittime,
  padTo2Digits,
  formatDate,
  toNumber,
  capitalize
};