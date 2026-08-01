const Joi = require('joi');
const { validate } = require('./authValidator');

const patientSchema = Joi.object({
  nik: Joi.string().length(16).pattern(/^\d+$/).required().messages({
    'string.length': 'NIK must be 16 digits',
    'string.pattern.base': 'NIK must contain only numbers',
    'any.required': 'NIK is required'
  }),
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required'
  }),
  gender: Joi.string().valid('L', 'P').required().messages({
    'any.only': 'Gender must be L or P',
    'any.required': 'Gender is required'
  }),
  birthDate: Joi.date().required().messages({ 'any.required': 'Birth date is required' }),
  phone: Joi.string().max(15).allow('', null),
  address: Joi.string().allow('', null)
});

const registrationSchema = Joi.object({
  patientId: Joi.string().uuid().required().messages({ 'any.required': 'Patient is required' }),
  doctorId: Joi.string().uuid().required().messages({ 'any.required': 'Doctor is required' }),
  polyclinicId: Joi.string().uuid().required().messages({ 'any.required': 'Polyclinic is required' }),
  paymentType: Joi.string().valid('umum', 'bpjs', 'asuransi').required().messages({ 'any.required': 'Payment type is required' }),
  registrationDate: Joi.date().iso().allow(null).messages({ 'date.format': 'Registration date must be a valid date' }),
  complaint: Joi.string().allow('', null)
});

const medicalRecordSchema = Joi.object({
  registrationId: Joi.string().uuid().required().messages({ 'any.required': 'Registration is required' }),
  patientId: Joi.string().uuid().required().messages({ 'any.required': 'Patient is required' }),
  doctorId: Joi.string().uuid().required().messages({ 'any.required': 'Doctor is required' }),
  subjective: Joi.string().allow('', null),
  objectiveBloodPressure: Joi.string().max(20).allow('', null),
  objectiveTemperature: Joi.number().min(30).max(45).allow(null),
  objectiveWeight: Joi.number().min(0).max(500).allow(null),
  objectiveHeight: Joi.number().min(0).max(300).allow(null),
  assessment: Joi.string().allow('', null),
  plan: Joi.string().allow('', null),
  medicalActions: Joi.array().items(Joi.object({
    actionName: Joi.string().required(),
    actionDescription: Joi.string().allow('', null),
    cost: Joi.number().min(0).allow(null)
  })).allow(null),
  prescriptions: Joi.array().items(Joi.object({
    drugName: Joi.string().required(),
    dosage: Joi.string().allow('', null),
    quantity: Joi.number().integer().min(0).allow(null),
    instructions: Joi.string().allow('', null)
  })).allow(null)
});

module.exports = {
  validate,
  patientSchema,
  registrationSchema,
  medicalRecordSchema
};
