const Validator = require('../Validator');
const expect = require('chai').expect;

const checkFieldsForErrors = (fieldsWithValidation, fieldsWithValue, expectedErrors) => {
  const validator = new Validator(fieldsWithValidation);

  const errors = validator.validate(fieldsWithValue);

  if (!expectedErrors) {
    expect(errors).to.have.length(0);
  } else {
    expect(errors).to.have.length(expectedErrors.length);

    expectedErrors.forEach((expectedError, idx) => {
      expect(errors[idx]).to.have.property('field').and.to.be.equal(expectedError.field);
      expect(errors[idx]).to.have.property('error').and.to.be.equal(expectedError.message);
    });
  }
};

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('checking valid type and min + max for string field gives no error', () => {
      checkFieldsForErrors(
          {name: {type: 'string', min: 2, max: 10}},
          {name: 'Vasyl'},
      );
    });

    it('checking valid type and min + max for number field gives no error', () => {
      checkFieldsForErrors(
          {age: {type: 'number', min: 2, max: 10}},
          {age: 8},
      );
    });

    it('checking valid types and min + max for multiple fields gives no error', () => {
      checkFieldsForErrors(
          {
            name: {type: 'string', min: 2, max: 10},
            surname: {type: 'string', min: 2, max: 10},
            age: {type: 'number', min: 2, max: 10},
            nickname: {type: 'string', min: 2, max: 10},
          },
          {name: 'Vasyl', surname: 'Vasylenko', age: 8, nickname: 'Godzilla'},
      );
    });

    it('checking invalid type for string field gives an error', () => {
      checkFieldsForErrors(
          {name: {type: 'string', min: 2, max: 10}},
          {name: 8},
          [{field: 'name', message: 'expect string, got number'}],
      );
    });

    it('checking invalid type for number field gives an error', () => {
      checkFieldsForErrors(
          {age: {type: 'number', min: 2, max: 10}},
          {age: 'Vasyl'},
          [{field: 'age', message: 'expect number, got string'}],
      );
    });

    it('checking invalid types for multiple fields gives error', () => {
      checkFieldsForErrors(
          {
            name: {type: 'string', min: 2, max: 10},
            surname: {type: 'string', min: 2, max: 10},
            age: {type: 'number', min: 2, max: 10},
            nickname: {type: 'string', min: 2, max: 10},
          },
          {name: 10, surname: 'Vasylenko', age: 'bla', nickname: 'Godzilla'},
          [
            {field: 'name', message: 'expect string, got number'},
            {field: 'age', message: 'expect number, got string'},
          ],
      );
    });

    it('checking min value, which more than max value gives an error', () => {
      checkFieldsForErrors(
          {age: {type: 'number', min: 10, max: 2}},
          {age: 8},
          [{field: 'age', message: 'min: 10 can not be more than max: 2'}],
      );
    });

    it('checking no passed field, but validation present gives an error', () => {
      checkFieldsForErrors(
          {age: {type: 'number', min: 5, max: 20}},
          {},
          [{field: 'age', message: 'no field: age, specified in validation rules was passed'}],
      );
    });

    it('checking string for too short length', () => {
      checkFieldsForErrors(
          {name: {type: 'string', min: 5, max: 10}},
          {name: 'bla'},
          [{field: 'name', message: 'too short, expect 5, got 3'}],
      );
    });

    it('checking string for too long length', () => {
      checkFieldsForErrors(
          {name: {type: 'string', min: 5, max: 10}},
          {name: 'blablablabla'},
          [{field: 'name', message: 'too long, expect 10, got 12'}],
      );
    });

    it('checking number for too little value', () => {
      checkFieldsForErrors(
          {age: {type: 'number', min: 5, max: 10}},
          {age: 3},
          [{field: 'age', message: 'too little, expect 5, got 3'}],
      );
    });

    it('checking number for too big value', () => {
      checkFieldsForErrors(
          {age: {type: 'number', min: 5, max: 10}},
          {age: 12},
          [{field: 'age', message: 'too big, expect 10, got 12'}],
      );
    });

    it('checking having type + value errors gives just one type error', () => {
      checkFieldsForErrors(
          {age: {type: 'number', min: 5, max: 10}},
          {age: 'balblablabla'},
          [{field: 'age', message: 'expect number, got string'}],
      );
    });
  });
});
