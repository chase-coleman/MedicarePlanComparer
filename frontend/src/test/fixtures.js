// Plan records mirror what the Spring API serialises from the Plan entity:
// planYear is a number, money fields come across as numbers, and
// benefitsPublished is a boolean that is false for placeholder plan-years.
let nextId = 1;

export const makePlan = (overrides = {}) => {
  const id = overrides.id ?? nextId++;
  return {
    id,
    planGroupId: 100,
    planName: "Test Advantage Plan",
    cmsPlanId: "H1234-005-000",
    planYear: 2026,
    benefitsPublished: true,
    monthlyPremium: 0,
    moop: 4500,
    planType: "HMO",
    drVisit: 10,
    erVisit: 110,
    hospitalStay: 295,
    hospitalStayLength: 5,
    surgeryCopayType: true,
    surgeryMin: 250,
    surgeryMax: 350,
    radiologyCopayMin: 50,
    radiologyCopayMax: 100,
    radiologyCoinsurance: 0,
    dentalBenefit: 2000,
    otcCredit: 75,
    otcRenewal: "quarterly",
    givebackAmount: 0,
    rxCoverage: true,
    ...overrides,
  };
};

// Reset the id counter so ids stay predictable inside a single test.
export const resetPlanIds = () => {
  nextId = 1;
};

export const makeCompany = (overrides = {}) => ({
  id: 1,
  companyName: "Devoted",
  ...overrides,
});

// Shape of an axios error for each of the three branches parseAxiosError handles.
export const axiosResponseError = (status, message) => ({
  response: { status, data: message === undefined ? {} : { message } },
});
export const axiosRequestError = () => ({ request: {} });
export const axiosSetupError = (message) => ({ message });
