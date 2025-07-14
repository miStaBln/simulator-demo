
export function buildCAHandlingBondDefault() {
  return {
    enableCaHandling: true,
    corporateActionHandling: "BOND_DELETION_MAT_CALL"
  };
}

export function buildCAHandlingDefault(returnType: string) {
  let taxTypeCashDiv = 'USE_WITH_TAX';
  let taxTypeSpecialDiv = 'USE_WITH_TAX';

  if (returnType === "GTR") {
    taxTypeCashDiv = 'USE_WITHOUT_TAX';
    taxTypeSpecialDiv = 'USE_WITHOUT_TAX';
  }

  if (returnType === "PR") {
    taxTypeCashDiv = 'NONE';
  }

  return {
    enableCaHandling: true,
    cashDividendTaxHandling: taxTypeCashDiv,
    specialDividendTaxHandling: taxTypeSpecialDiv,
    considerStockDividend: true,
    considerStockSplit: true,
    considerRightsIssue: true,
    considerRightsIssueToCashComponent: false,
    considerCapitalDecrease: true,
    cashDividendTax: 0,
    specialDividendTax: 0,
    corporateActionHandling: 'START_OF_DAY',
    useWeightNeutralRightsIssue: false,
    useWeightNeutralCapitalDecrease: false,
    franking: "NO_ADJUSTMENT",
    pid: "NO_ADJUSTMENT",
    reit: "NO_ADJUSTMENT",
    returnOfCapital: "NO_ADJUSTMENT",
    interestOnCapital: "NO_ADJUSTMENT",
    nzInvestorType: "LOCAL_NO_IMPUTATION",
    auInvestorType: "LOCAL_NO_IMPUTATION",
    considerDividendFee: true,
    drDividendTreatment: 'DEFAULT',
    globalDrTaxRate: 0
  };
}
