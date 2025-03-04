const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  typeOfProject: { 
    type: String, 
    enum: ['Residential', 'Commercial', 'Plots', 'Villa', 'Residential / Commercial', 'IT/ITES', 'Warehouse'],
    required: true
  },
  areaOfLand: { type: String, default: '' },
  geoTag: { type: String, default: '' },
  typeOfUnits: { 
    type: String, 
    enum: ['Studio', '1BHK', '1.5 BHK', '2BHK', '2.5 BHK', '3BHK', '4 BHK', 'Row House', 'Villa'],
    required: true
  },
  address: { type: String, required: true },
  numberOfBuildings: { type: Number, default: 0 },
  numberOfPhases: { type: Number, default: 0 },
  amenities: { type: [String], default: [] },
  typeOfBuilding: { type: String, default: '' },
  flatsPerFloor: { type: Number, default: 0 },
  paymentSchedule: { type: String, default: '' },
  demandLetter: { type: String, default: '' },
  currentASRRate: { type: Number, default: 0 },
  RERANumber: { type: String, default: '' },
  bankDetails: {
    approval: { type: String, default: '' },
    IOD: { type: String, default: '' },
    CC: { type: String, default: '' },
    NA: { type: String, default: '' },
    purchaseDeed: { type: String, default: '' },
    titleDocument: { type: String, default: '' },
    reraCertificate: { type: String, default: '' },
    approvedPlan: { type: String, default: '' },
    NOCFire: { type: String, default: '' },
    tree: { type: String, default: '' },
    PWD: { type: String, default: '' },
    environment: { type: String, default: '' },
    airportAuthority: { type: String, default: '' },
    traffic: { type: String, default: '' },
    projectBrochure: { type: String, default: '' }
  },
  otherCharges: {
    parking: { type: Number, default: 0 },
    societyFormation: { type: Number, default: 0 },
    developmentCharge: { type: Number, default: 0 },
    legalCharge: { type: Number, default: 0 },
    maintenancePerSqFt: { type: Number, default: 0 },
    infrastructureCharge: { type: Number, default: 0 }
  },
  pdfFilePath: { type: String, default: '' } // Added for file uploads
});

// Cascade delete to remove project references from users
projectSchema.pre('deleteOne', async function(next) {
  const projectId = this.getQuery()["_id"];
  await mongoose.model('User').updateMany({}, { $pull: { projects: projectId } });
  next();
});

module.exports = mongoose.model("Project", projectSchema);
