import asyncHandler from "express-async-handler";
import Account from "../models/account.js";


export const getBalance = asyncHandler(async (req, res) => {
  try {
    // console.log(req.headers.authorization);
    const account = await Account.findOne({ user: req.user._id });
    if (account) {
      res.status(200).json({ balance: account.balance });
    } else {
      res.status(404);
      throw new Error("Account not found for the authenticated user");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export const getAccountDetailsByAccountNumber = asyncHandler(async (req, res) => {
  try {
    const account = await Account.findOne({ accountNumber:  req.params.accountNumber});
    console.log(account)
    console.log(req.params.accountNumber)
    if (account) {
      res.json({data: account, message: "Account Retrieved", status: false});
    } else {
      res.json({data: null, message: "Account not found for the authenticated user", status: false})
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export const getAccountDetails = asyncHandler(async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user._id });
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404);
      throw new Error("Account not found for the authenticated user");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//this can be crypto or normal foreign bank(US) account
export const addMoreAccount = asyncHandler(async(req, res) => {
  try {
    
  } catch (error) {
    
  }
})


export const deleteAnAccount = asyncHandler(async(req, res) => {
  try {
    
  } catch (error) {
    
  }
})