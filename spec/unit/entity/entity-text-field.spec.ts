import { FieldDefinition } from "../../../lib";
import EntityTextField from "../../../lib/entity/fields/entity-text-field";
import { A_DATE, A_NUMBER, A_NUMBER_STRING, A_POINT, SOME_TEXT, SOME_STRINGS } from "../../helpers/example-data";

const FIELD_NAME = 'foo';
const FIELD_DEF: FieldDefinition = { type: 'text' };
const EXPECTED_NULL_JSON_DATA = {};
const EXPECTED_JSON_STRING_DATA = { foo: SOME_TEXT };
const EXPECTED_JSON_BOOLEAN_DATA = { foo: "true" };
const EXPECTED_JSON_NUMBER_DATA = { foo: A_NUMBER_STRING };

describe("EntityTextField", () => {

  let field: EntityTextField;

  describe("when created", () => {

    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF));

    it("has the expected alias", () => expect(field.name).toBe(FIELD_NAME));
    it("has a value of null", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));

    it("can be set to a string", () => {
      field.value = SOME_TEXT;
      expect(field.value).toBe(SOME_TEXT);
      expect(field.toRedisJson()).toEqual(EXPECTED_JSON_STRING_DATA);
    });

    it("can be set to a boolean", () => {
      field.value = true;
      expect(field.value).toBe("true");
      expect(field.toRedisJson()).toEqual(EXPECTED_JSON_BOOLEAN_DATA);
    });

    it("can be set to a number", () => {
      field.value = A_NUMBER;
      expect(field.value).toBe(A_NUMBER_STRING);
      expect(field.toRedisJson()).toEqual(EXPECTED_JSON_NUMBER_DATA);
    });

    it("can be set to null", () => {
      field.value = SOME_TEXT; // set it to something else first
      field.value = null;
      expect(field.value).toBeNull();
      expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA);
    });

    it("cannot be set to undefined", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = undefined)
        .toThrow("Property cannot be set to undefined. Use null instead.");
    });

    it("cannot be set to a Point", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_POINT)
        .toThrow(`Expected value with type of 'text' but received '${A_POINT}'.`);
    });

    it("cannot be set to a Date", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = A_DATE)
        .toThrow(`Expected value with type of 'text' but received '${A_DATE}'.`);
    });

    it("cannot be set to an array of strings", () => {
      // @ts-ignore: JavaScript trap
      expect(() => field.value = SOME_STRINGS)
        .toThrow(`Expected value with type of 'text' but received '${SOME_STRINGS}'.`);
    });
  });

  describe("when created with an alias", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, { type: 'text', alias: 'bar' }));
    it("has the aliased name", () => expect(field.name).toBe('bar'));
  });

  describe("when created with a string", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, SOME_TEXT));
    it("has the expected value", () => expect(field.value).toBe(SOME_TEXT));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_STRING_DATA));
  });

  describe("when created with a boolean", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, true));
    it("has the expected value", () => expect(field.value).toBe("true"));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_BOOLEAN_DATA));
  });

  describe("when created with a number", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, A_NUMBER));
    it("has the expected value", () => expect(field.value).toBe(A_NUMBER_STRING));
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_JSON_NUMBER_DATA));
  });

  describe("when created with a null", () => {
    beforeEach(() => field = new EntityTextField(FIELD_NAME, FIELD_DEF, null));
    it("has the expected value", () => expect(field.value).toBeNull());
    it("converts to the expected Redis JSON data", () => expect(field.toRedisJson()).toEqual(EXPECTED_NULL_JSON_DATA));
  });

  it("complains when created with a Point", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(FIELD_NAME, FIELD_DEF, A_POINT))
      .toThrow(`Expected value with type of 'text' but received '${A_POINT}'.`);
  });

  it("complains when created with a Date", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(FIELD_NAME, FIELD_DEF, A_DATE))
      .toThrow(`Expected value with type of 'text' but received '${A_DATE}'.`);
  });

  it("complains when created with an array of strings", () => {
    // @ts-ignore: JavaScript trap
    expect(() => new EntityTextField(FIELD_NAME, FIELD_DEF, SOME_STRINGS))
      .toThrow(`Expected value with type of 'text' but received '${SOME_STRINGS}'.`);
  });
});