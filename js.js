var temp = '';
var calcArr = [];
var char = '';
var num = '';
var fp = 'false';
var mem = 0;

function calcIt(val) {
  var l = calcArr.length;
  // test for numbers
  if (!isNaN(val)) {
    if (mem === 0) { // don't allow input of numbers if mem is not zero
      if (l === 0) { // leading zeros not allowed
        if (val !== '0') { // only allow numbers > zero
          temp = document.simplecalc.result.value = val * 1;
          calcArr.push(val * 1);
          num += val;
        }
      } else if (val !== '0') { // accept any number
        calcArr.push(val * 1);
        temp = document.simplecalc.result.value += val * 1;
        num += val;
      } else if (flZero(calcArr, l - 1, fp) || num > 0) { // test if number in calcArr is already floating number or number bigger than zero
        calcArr.push(val * 1);
        temp = document.simplecalc.result.value += val * 1;
        num += val;
      }
    }
    // if not a number test for floating point
  } else {
    // allow input of NaN
    if (val === '.') { // floating numbers
      char = calcArr[l - 1] // the last character entered before the floating point
      if (fp === 'false') {
        if (l === 0) {
          calcArr.push(val);
          temp = document.simplecalc.result.value += val;
          num += val;
          fp = 'true' // set fp flag
          mem = 0;
        } else if (num === '') {
          val = '0' + val;
          calcArr.push(val);
          temp = document.simplecalc.result.value += val;
          num += val;
          fp = 'true' // set fp flag
          mem = 0;
        } else if (parseFloat(num + val + 0) === (num + val + 0) * 1) {
          calcArr.push(val);
          temp = document.simplecalc.result.value += val;
          num += val;
          fp = 'true' // set floating point flag
          mem = 0;
        }
      }
      //  test for minus
    } else if (l === 0 || (l > 0 && mem !== 0)) {
      // push value in array, no testing needed for an empty calcArr
      calcArr.push(val);
      // store val in temp, display it
      temp = document.simplecalc.result.value += val;
      num = '';
      fp = 'false';
      mem = 0;
    } else if (l > 0) { // test to see if there's already something in the calculation array
      char = calcArr[l - 1];
      if (val !== '-' && !testRegex(char)) {
        // double minus is not allowed, any other combination of number and minus or arethmetic operator and minus is okat
        calcArr.push(val);
        temp = document.simplecalc.result.value += val;
        fp = 'false'; // reset floating point flag
        num = '';
        mem = 0;
      } else if (!testRegex(char) || val === '-') { // check if last char in calcArr is a number or val is minus]
        if ((!(char === '-' && val === '-')) || val !== '-') {
          // double minus is not allowed, any other combination of number and minus or arethmetic operator and minus is okat
          calcArr.push(val);
          temp = document.simplecalc.result.value += val;
          fp = 'false';
          num = '';
          mem = 0;
        }
      }
    }
  }
  document.simplecalc.calculation.value = temp;

}

function testRegex(a) { // returns true in case of arithmetic operators
  var regex = /\W/;
  return regex.test(a);
}

function testMinus(b) {
  var regex = /-/;
  return regex.test(b); // returns true if val is minus
}

function calcResult() { // the actual calculation
  temp = eval(document.simplecalc.result.value);
  temp = parseFloat(temp.toFixed(10));
  //  var tr = temp.replace(/0+$/g, "")
  document.simplecalc.result.value = temp;
  calcArr.length = 0; //clear the expression array after calculating
  calcArr.push(temp); // store the result of the calculation as first element in calcArr
  num = 0; // reset
  fp = isFp(temp); // set floating point flag
  mem = temp; // fill mem with result
}

function isFp(y) {
  if (isNaN(y)) {
    console.log(y, 'no number');
    return false;
  } else {
    var cfp = Math.round(y);
    if (cfp === y) { // check if temp has a floating point
      console.log('false cfp', cfp, 'y', y);
      return 'false';
    } else {
      console.log('true cfp', cfp, 'y', y);
      return 'true'; // set the floating point flag
    }
  }
}

function clearIt() {
  // clear the last item in the array
  calcArr.pop();
  document.simplecalc.result.value = calcArr.join('');
  num = num.substr(0, num.length - 1);
  tr = temp.toString().substr(0, temp.length - 1);
  document.simplecalc.calculation.value = tr;
}

function clearAll() { // reset all
  temp = 0;
  num = 0;
  fp = 'false';
  calcArr.length = 0;
}

function flZero(array, lt, fp) {
  if (testRegex(array[lt]) || fp === 'true') {
    return true;
  }
}