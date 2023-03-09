"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-02-26T17:01:17.194Z",
    "2023-02-27T23:36:17.929Z",
    "2023-02-28T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function updateUI(acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
}

function formatMovementDate(date, locale) {
  // Function to calculate no.of days between 2 days
  function calcDaysPassed(date1, date2) {
    return Math.round(Math.abs((date2 - date1) / (24 * 60 * 60 * 1000)));
  }
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return Intl.DateTimeFormat(locale).format(date)
  }
}

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (movement, index) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[index]);

    const transactionDate = formatMovementDate(date, acc.locale);
    const option = {
      style: 'currency',
      currency: "INR"
    }
    const formattedMov = Intl.NumberFormat(acc.locale,option).format(movement);
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${transactionDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// displayMovements(account1);

const user = "Steven Thomas Williams";

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cVal) => (acc += cVal), 0);
  const options = {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits:2
  }
  const formattedBalance=  Intl.NumberFormat('en-IN',options).format(acc.balance)
  labelBalance.textContent = formattedBalance;
};
//Hard coded argument function call
// calcDisplayBalance(account1.movements);
function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cVal) => acc + cVal, 0);
  labelSumIn.textContent = `Rs.${incomes.toFixed(2)}`;
  const outgoing = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cVal) => acc + cVal, 0);
  // console.log(outgoing);

  labelSumOut.textContent = `Rs.${Math.abs(outgoing).toFixed(2)}`;
  //1.2% for every deposit
  const interest = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cVal) => {
      // console.log(cVal);
      // console.log(account.interestRate, "rate");
      let cValInterest = (cVal * account.interestRate) / 100;
      // console.log("interest of above ",cValInterest);
      if (cValInterest >= 1) return acc + cValInterest;
      else return acc + 0;
    }, 0);
  labelSumInterest.textContent = `Rs.${interest.toFixed(2)}`;
}
//Hard coded function call
// calcDisplaySummary(account1.movements);

function createUserName(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name.at(0))
      .join("");
  });
}

createUserName(accounts);
let sorted;
//Event Handlers
let currentAccount;

//Fake always login
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = "100";

//Experimenting API

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log("clicked");
  sorted = false;
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value.trim()
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(`${currentAccount.owner} logged in!`);
    //Display ui and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    const now = new Date();
    // const userLocale = navigator.language;
    // console.log(userLocale);
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale, options).format(
      now
    );
    // const intlDate = Intl.DateTimeFormat('en-US').format(now);
    // console.log(intlDate);
    //creating current date
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = String(now.getMonth()).padStart(2, 0);
    // const day = String(now.getDate()).padStart(2, 0);
    // const hour = String(now.getHours()).padStart(0, 2);
    // const mins = String(now.getMinutes()).padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${mins}`;
    containerApp.style.opacity = "100";
    updateUI(currentAccount);
    //clear input fields
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
    //Makes the field to loose focus
    inputLoginPin.blur();
  }
});
//transferring money functionality
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // console.log(receiverAcc);
  // console.log(receiverAcc.owner, " received amount");
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username != currentAccount.username
  ) {
    console.log(`Transferred ${amount} to ${receiverAcc.owner}`);
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Adding dates to transfers
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});
//Loan functionality;
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  // console.log(amount);
  // console.log((10/100)*amount);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    console.log("loan granted");
    currentAccount.movements.push(amount);
    //Adding dates to transfers
    currentAccount.movementsDates.push(new Date().toISOString());
    // receiverAcc.movementsDates.push(new Date());
    updateUI(currentAccount);
  }
});

// Closing account functionality
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const closeUserName = inputCloseUsername.value;
  const closeUserPin = Number(inputClosePin.value);
  // console.log(closeUserName,closeUserPin);
  if (
    closeUserName === currentAccount.username &&
    closeUserPin === currentAccount.pin
  ) {
    const userIndex = accounts.findIndex(
      (acc) => acc.username === closeUserName
    );
    console.log(userIndex);
    accounts.splice(userIndex, 1);
    console.log(accounts);
    containerApp.style.opacity = "0";
  }
  inputClosePin.value = "";
  inputCloseUsername.value = "";
  inputClosePin.blur();
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
//Getting username and pin

// console.log(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const EuroToUsd = 1.1;
const movementsUsd = movements.map(function (val, ind) {
  return Math.trunc(val * EuroToUsd);
});
// console.log(movements, movementsUsd);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
// console.log(deposits);

const withdrawals = movements.filter((amt) => amt < 0);
// console.log(withdrawals);
// console.log(movements);
const balance = movements.reduce(function (pVal, cVal, ind) {
  let maxVal = pVal > cVal ? pVal : cVal;
  return maxVal;
}, movements[0]);

// console.log(balance);
//chaining methods to convert euros to usd
const totalDepositsInUsd = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * EuroToUsd)
  .reduce((acc, cVal) => acc + cVal, 0);
//find method
// console.log(movements.findIndex(mov => mov<0))

// const account  = accounts.find(acc => acc.owner === "Jessica Davis")
// console.log(account);

// const accountMap = accounts.map(acc => acc.owner === "Jessica Davis"? acc:"")
// console.log(accountMap);

// const accountFilter = accounts.filter(mov => mov.owner === "Jessica Davis");
// console.log(accountFilter);

// for (const acc of accounts) {
//   acc.owner === "Jessica Davis"? console.log(acc):"";
// }
///////////some and every method////////////////////
// console.log(movements.some(mov => mov>1000))

// console.log(movements.every(mov => mov > -1000));

/////////flat and flat map ///////////////////////////////

const subArr = [1, 3, [2, 35, 6, [2, 5, 6, [1, 2]]], "last"];
// console.log(subArr.flat(3));
/////converts all movements of accounts into single array
// const accountMovements = accounts.reduce((acc, cVal) =>{
//   return [...acc,...cVal.movements];
// },[])

// const accountMovements = accounts.map(acc => acc.movements)
// const allMovements  = accountMovements.flat();
// const overallBalance = allMovements.reduce((acc, cVal) => acc+= cVal,0)
// console.log(accountMovements, allMovements, overallBalance);

// const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, cVal) => acc += cVal,0)
const overallBalance = accounts
  .reduce((acc, cVal) => [...acc, ...cVal.movements], [])
  .reduce((acc, cVal) => (acc += cVal), 0);
// console.log(overallBalance);

const overallBalance2 = accounts.flatMap((acc) => acc.movements);
// console.log(overallBalance2);
/////////Sorting Arrays///////////
const owners = ["Jonas", "Jack", "Adam", "Martha"];
//Sort method also mutates the original array and it does sorting based on the strings
//Sort method converts everything into string and does the sorting method
// console.log(owners.sort());
// console.log(owners);
// const numArr = ['1', '2', '3', '7', '5'];
// console.log("Based on string ", movements.sort());
// console.log( numArr.sort());
// console.log(numArr);
//Sort method can take a compare call back function and that call back function can take two arguments called 'a' and 'b', these arguments are like currentValue and nextValue
//If we want a before b then return < 0(keep order)
//If we want b before a then return > 0(switch order)
//sort method loops through the array until the array is sorted in ascending order
movements.sort((a, b) => a - b);
// console.log("based on ascending method", movements);
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
// console.log("based on descending method", movements);

//If you want a before b return < 0 (keep change)
//If you want b before a return > 0 (switch order)
owners.sort((a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
});

// console.log(owners);

const arr = new Array(8);
// console.log(arr);
arr.push(10);
// console.log(arr);
arr.fill(5, 2, 4);
arr.unshift(3);
// console.log(arr);
arr.fill(6, 3, 4);
arr.pop();
// console.log(arr);
let count = 0;
const fromArr = Array.from({ length: 5 }, () => (count += 1));
// console.log(fromArr);

const randDiceRolls = Array.from({ length: 5 }, () =>
  Math.trunc(Math.random() * 15)
);
// console.log(randDiceRolls);

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (cVal, ind) => cVal.textContent
  );
  console.log(movementsUI);
});

// const testing = Array.from(movements, (v, k) => v)
// console.log(testing);

// console.log(Object.keys(account2));

///////////Exercises ////////////////////////
//1.
const allTrans = accounts
  .flatMap((ele) => ele.movements)
  .filter((ele) => ele > 0)
  .reduce((acc, cVal) => acc + cVal, 0);
// console.log(allTrans);

//2.
// const aboveThousandDeposits = accounts.flatMap(ele => ele.movements).filter(ele => ele > 1000).length
//Same above code with reduce
const aboveThousandDeposits = accounts
  .flatMap((ele) => ele.movements)
  .reduce((acc, cVal) => {
    if (cVal >= 1000) return ++acc;
    return acc;
  }, 0);
// console.log(aboveThousandDeposits);

//3.
const { deposits: deposit, withDrawals } = accounts
  .flatMap((ele) => ele.movements)
  .reduce(
    (acc, cVal) => {
      // if (cVal > 0) {
      //   acc.deposits = acc.deposits + cVal;
      //   return acc;
      // }
      // else{
      //   acc.withDrawals = acc.withDrawals + cVal;
      //   return acc;
      // }
      //Optimized above if else loop

      acc[cVal > 0 ? "deposits" : "withDrawals"] += cVal;
      return acc;
    },
    { deposits: 0, withDrawals: 0 }
  );
// console.log(deposit,withDrawals);
//Doing above challenge with only reduce.
// const reduceFlat = accounts.reduce((acc,cVal)=>{
//   acc.push(...cVal.movements)

//   return acc;
// },[])
// console.log(reduceFlat);

//4.
const convertTitleCase = function (title) {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  const exceptions = ["an", "a", "and", "the", "but", "or", "on", "in", "with"];
  const splitBySpace = title
    .toLowerCase()
    .split(" ")
    .filter((word) => word);
  const titleCase = splitBySpace.map((ele) => {
    // if(!exceptions.includes(ele)){
    //   return `${ele.at(0).toUpperCase()}${ele.slice(1).toLowerCase()}`
    // }
    // else{
    //   return ele;
    // }
    //Above if else loop can be optimized as
    return exceptions.includes(ele) ? ele : capitalize(ele);
  });
  return capitalize(titleCase.join(" "));
};
// console.log(convertTitleCase("this is a nice title"));
// console.log(convertTitleCase("this is a long title but not too long"));
// console.log(convertTitleCase("and  here is another the title with an EXAMPLE"));

// console.log(Number.parseInt("37"));
// console.log(Number.parseInt("1010",2));
// console.log(Number.parseFloat());
// console.log(Number.isFinite(10));
// console.log(Number.isInteger(2.5));

// console.log(Math.sqrt(9), 9 ** (1/2));
// console.log(Math.cbrt(81), 81 ** (1/3));

// const rand = Array.from({length:5}, ()=> Math.trunc(Math.random()*10))
// console.log(rand);
// console.log(Math.max(...rand));
function rand(min, max) {
  // console.log(Math.trunc(Math.random() * (max - min)+1)+min);
}
rand(10, 22);
// console.log(Math.trunc(Math.random()*22));
// console.log(Math.trunc('-22.5'));

////////////Rounding Numbers////////////////
////2.1 is primitive and we are calling method toFixed on primitive, js will perform boxing on these numbers internally
// console.log((2.1676).toFixed(0));
// console.log((2).toFixed(3));

//////////////////Remainder Operator///////////////

function isEven(a) {
  // console.log(`${a%2 === 0?"even":"odd"}`);
}
isEven(3);
labelBalance.addEventListener("click", () => {
  const alldata = [...document.querySelectorAll(".movements__row")];
  alldata.forEach((val, i) => {
    if (i % 2 === 0) val.style.backgroundColor = "orangered";
  });
});

// console.log(2**53-1);
// console.log(2**53+6);
// console.log(typeof 10n);
// console.log(BigInt("59278905438573475894350273538457"));
// console.log(BigInt("59278905438573475894350273538457"));
// const bi = 34323n;
// console.log(34323 === bi);

///////////////Dates and Time/////////////////////////
/////////////////Date//////////////////////////////

///Creating a date

// const date = new Date();
// console.log(date);
// console.log(new Date(1*24*60*60*1000))

/////Working with dates

const future = new Date(2024, 9, 25);
console.log(future);
console.log(future.getDay());
console.log(new Date(future.getTime()));
console.log(new Date(Date.now()));
const samp = new Date().setFullYear(2050);
const currDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);
// console.log(currDate);
// const deadLine = new Date(2023, 1, 24);
// const remainingSecs = deadLine.getTime() - currDate.getTime();
// const remainingDays = remainingSecs / (1000 * 3600 * 24);
// console.log(remainingDays);

// console.log(currDate.getTime());
// console.log(+currDate);

function calcDaysPassed(date1, date2) {
  return (date2 - date1) / (24 * 3600 * 1000);
}

// console.log(calcDaysPassed(new Date(2023, 4, 1), new Date(2023, 4, 3)));


//////////Internationalizing numbers

const options = {
  style: 'unit',
  // unit: 'mile-per-hour'
  unit: 'celsius'
}
const num = 12341343;
console.log(Intl.NumberFormat(navigator.language, options).format(num));