import React, { useState } from "react";

import "./App.css";

const App = () => {
  const [values, setValues] = useState({
    amount: 0,
    factor: 0,
    investmentYears: 0,
    holdingYears: 0,
    cagr: 0,
    inflation: 0,
    increment: 0,
    result: 0,
    investment: 0,
    error: false,
    success: false,
  });

  const {
    amount,
    factor,
    investmentYears,
    holdingYears,
    cagr,
    inflation,
    increment,
    result,
    investment,
    error,
    success,
  } = values;

  const infoMessage = (
    <div className="container my-3 mx-auto">
      <div className="text-left">
        <div className="alert alert-warning">
          We are working on taxations and other features as well. Coming Soon!
        </div>
      </div>
    </div>
  );

  const successMessage = (
    <div className="container my-3 mx-auto">
      <div className="text-left">
        <div className="alert alert-success">
          Congratulations! You have {result} on total investment of {investment}
        </div>
      </div>
    </div>
  );

  const errorMessage = (
    <div className="container my-3 mx-auto">
      <div className="text-left">
        <div className="alert alert-danger">{error}</div>
      </div>
    </div>
  );

  const handleChange = (key) => (event) => {
    setValues({
      ...values,
      success: false,
      error: false,
      [key]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!(factor <= 12 && factor >= 1)) {
      setValues({
        ...values,
        error: "Number of Investments needs to be an integer between 1 and 12",
      });
    } else if (investmentYears > holdingYears) {
      setValues({
        ...values,
        error:
          "Number of Investment Years needs to be lesser than or equal to Holding Years",
      });
    } else {
      let holdingPeriod = holdingYears * factor;
      let investmentPeriod = investmentYears * factor;

      // flag to mark the completion of an year
      let flag = 0;

      // periodic investment amount
      let SIP = Number.parseInt(amount);

      // effective periodic rate of interest after inflation
      let c = Number.parseFloat(cagr);
      let i = Number.parseFloat(inflation);

      let roi = ((1 + c / 100) / (1 + i / 100) - 1) / factor;

      let totalAmount = 0;
      let totalInvestment = 0;

      for (let i = 1; i <= holdingPeriod; i++) {
        if (i <= investmentPeriod) {
          // adding SIP
          totalAmount += SIP;
          totalInvestment += SIP;
        }

        if (i <= holdingPeriod) {
          // adding return
          totalAmount += totalAmount * roi;
        }

        flag++;
        if (flag === Number.parseInt(factor)) {
          // increment
          SIP += (SIP * increment) / 100;
          flag = 0;
        }
      }

      setValues({
        ...values,
        result: Math.round(totalAmount),
        investment: Math.round(totalInvestment),
        success: true,
      });
    }
  };

  const form = (
    <div className="container m-auto">
      <div className="text-left">
        <form>
          <div className="form-group SIP">
            <label>SIP Amount</label>
            <input
              className="form-control"
              type="number"
              value={amount}
              onChange={handleChange("amount")}
            />
          </div>
          <div className="form-group SIP">
            <label>Number of SIPs (per year)</label>
            <input
              className="form-control"
              type="number"
              value={factor}
              onChange={handleChange("factor")}
            />
          </div>
          <div className="form-group rates">
            <label>Annual Expected Return (%)</label>
            <input
              className="form-control"
              type="number"
              value={cagr}
              onChange={handleChange("cagr")}
            />
          </div>
          <div className="form-group rates">
            <label>Annual Inflation (%)</label>
            <input
              className="form-control"
              type="number"
              value={inflation}
              onChange={handleChange("inflation")}
            />
          </div>
          <div className="form-group rates">
            <label>Annual Increment in SIP (%)</label>
            <input
              className="form-control"
              type="number"
              value={increment}
              onChange={handleChange("increment")}
            />
          </div>
          <div className="form-group years">
            <label>Number of Investment Years</label>
            <input
              className="form-control"
              type="number"
              value={investmentYears}
              onChange={handleChange("investmentYears")}
            />
          </div>
          <div className="form-group years">
            <label>Number of Holding Years</label>
            <input
              className="form-control"
              type="number"
              value={holdingYears}
              onChange={handleChange("holdingYears")}
            />
          </div>
          <button className="btn btn-info btn-block" onClick={handleSubmit}>
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
  return (
    <div>
      <h1 className="text-center m-5 text-info">SIP Calculator</h1>
      {form}
      {success ? successMessage : undefined}
      {error ? errorMessage : undefined}
      {infoMessage}
    </div>
  );
};

export default App;
