//string
describe("number", () => {
  it("first test", () => {
    expect(2 + 2).toBe(4);
  });

  it("second test", () => {
    expect(2 + 3).toBe(5);
  });
});

describe("string", () => {
  it("greeting1", () => {
    expect("Hello mosh!").toMatch(/mosh/);
  });

  it("greeting2", () => {
    //call fn here
    expect("Hello mosh!").toContain("mosh");
  });
});

describe("Array", () => {
  it("should return array required", () => {
    const result = ["AED", "USD", "EGP"];
    expect(result).toEqual(expect.arrayContaining(["AED", "USD", "EGP"]));
  });
});

describe("Object", () => {
  it("should return specific object", () => {
    const result = { id: 10, price: 99, cat: "a" };
    // expect(result).toEqual({ id: 10, price: 99 }); //work with exact match only
    expect(result).toMatchObject({ id: 10, price: 99 });
    expect(result).toHaveProperty("id", 10);
  });
});

//dummy fn to testing
const registerUser = (username: any) => {
  if (!username) {
    throw new Error("invalid person!");
  }
  return { id: Date.now(), username: username };
};

describe("registerUser|| exception", () => {
  it("should throw an error if username if falsy ", () => {
    const args = [0, "", false, NaN, undefined, null];
    args.forEach((v) => {
      expect(() => registerUser(v)).toThrow();
    });
  });
  it("should return valid user object in case valid username is passed ", () => {
    const result = registerUser("Amr");
    expect(result).toMatchObject({ username: "Amr" });
    expect(result.id).toBeGreaterThan(0);
  });
});

// Mock function
/*
db.getCustomerSync = jest.fn().mockReturnValue({ email: "a" });
db.getCustomerSync = jest.fn().mockRejectedValue();

mail.send = jest.fn();
expect(mail.send).toHaveBeenCalled();
expect(mail.send).toHaveBeenCalledWith({ email: "a", message: "..." });
expect(mail.send.mock.calls[0][0]).toBe("a"); //check args
expect(mail.send.mock.calls[0][1]).toMatch(/order/); //checl args
*/

//folder strcuture for unit tests => src/tests/unit/<same structure>
//   ex. src/tests/unit/models.user.test.ts
