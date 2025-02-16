import Package from "../models/packages.js";
import asyncHandler from "express-async-handler";


export const createPackage = asyncHandler(async (req, res) => {
  try {
    const formData = req.body.payload;
      
      if (!formData.name || !formData.price || !formData.interest || !formData.period) {
          return res.status(400).json({ status: false, message: 'All fields are required', data: null });
      }
      
      const newPackage = await Package.create(formData);
      res.json({ status: true, data: newPackage, message: "Packages Retrieved" });
  } catch (err) {
      res.status(500).json({ status: false, message: err.message });
  }
});

// Get all packages
export const getAllPackages = asyncHandler(async (req, res) => {
  try {
      const packages = await Package.find({}).sort({ createdAt: -1 });;
      res.json({ status: true, data: packages, message: "" });
  } catch (err) {
      res.status(500).json({ status: false, message: err.message });
  }
});

export const getSinglePackage = asyncHandler(async (req, res) => {
  try {
      const id = req.params.id;
      const packageItem = await Package.findById(id);
      
      if (!packageItem) {
          return res.status(404).json({ status: false, message: 'Package not found' });
      }
      
      res.json({ status: true, data: packageItem, message: "" });
  } catch (err) {
      res.status(500).json({ status: false, message: err.message });
  }
});

export const updatePackage = asyncHandler(async (req, res) => {
  try {
      const id = req.params.id;
      const formData = req.body.payload;
      const updatedPackage = await Package.findByIdAndUpdate(id, formData, { new: true, runValidators: true });
      
      if (!updatedPackage) {
          return res.status(404).json({ status: false, message: 'Package not found' });
      }
      
      res.json({ status: true, data: updatedPackage });
  } catch (err) {
      res.status(500).json({ status: false, message: err.message });
  }
});

export const deletePackage = asyncHandler(async (req, res) => {
  try {
      const id = req.params.id;
      const deletedPackage = await Package.findByIdAndDelete(id);
      
      if (!deletedPackage) {
          return res.json({ status: false, message: 'Package not found', data: null });
      }
      
      res.json({ status: true, message: 'Package deleted successfully', data: null });
  } catch (err) {
      res.status(500).json({ status: false, message: err.message });
  }
});