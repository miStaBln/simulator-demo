import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { SimulationService } from '@/services/simulationService';
import SimulationPeriod from './simulator/SimulationPeriod';
import SimulationParameters from './simulator/SimulationParameters';
import Composition from './simulator/Composition';
import RebalancingSection from './simulator/RebalancingSection';
import PriceOverrides from './simulator/PriceOverrides';
import BottomActions from './simulator/BottomActions';

// Mock index data with parameters
const mockIndices = [
  { 
    id: 'SOLACTIVE1', 
    name: 'Solactive Tech Index', 
    currency: 'USD', 
    returnType: 'NTR', 
    divisor: '100000',
    constituents: [
      { ric: 'AAPL.OQ', shares: '10000', weight: '25' },
      { ric: 'MSFT.OQ', shares: '5000', weight: '20' },
      { ric: 'GOOGL.OQ', shares: '2000', weight: '18' },
      { ric: 'AMZN.OQ', shares: '3000', weight: '22' },
      { ric: 'META.OQ', shares: '4000', weight: '15' },
    ]
  },
  { 
    id: 'SOLACTIVE2', 
    name: 'Solactive Energy Index', 
    currency: 'EUR', 
    returnType: 'GTR', 
    divisor: '50000',
    constituents: [
      { ric: 'XOM.N', shares: '15000', weight: '22' },
      { ric: 'CVX.N', shares: '12000', weight: '20' },
      { ric: 'BP.L', shares: '30000', weight: '18' },
      { ric: 'SHEL.L', shares: '25000', weight: '20' },
      { ric: 'TTE.PA', shares: '10000', weight: '20' },
    ]
  },
  { 
    id: 'SOLACTIVE3', 
    name: 'Solactive Healthcare Index', 
    currency: 'GBP', 
    returnType: 'PR', 
    divisor: '75000',
    constituents: [
      { ric: 'JNJ.N', shares: '8000', weight: '22' },
      { ric: 'PFE.N', shares: '25000', weight: '18' },
      { ric: 'MRK.N', shares: '15000', weight: '20' },
      { ric: 'NOVN.S', shares: '10000', weight: '20' },
      { ric: 'ROG.S', shares: '5000', weight: '20' },
    ]
  },
];

interface SimulationDataProps {
  onSimulationComplete?: (isComplete: boolean, stocks: any[], selectedIndex?: string) => void;
  shouldReset?: boolean;
  onResetComplete?: () => void;
}

const SimulationData = ({ 
  onSimulationComplete = () => {}, 
  shouldReset = false,
  onResetComplete = () => {}
}: SimulationDataProps) => {
  const navigate = useNavigate();
  
  // Initialize with stored values or defaults
  const [startDate, setStartDate] = useState(() => 
    localStorage.getItem('sim_startDate') || '11.04.2025'
  );
  const [endDate, setEndDate] = useState(() => 
    localStorage.getItem('sim_endDate') || '15.04.2025'
  );
  const [currency, setCurrency] = useState(() => 
    localStorage.getItem('sim_currency') || 'USD'
  );
  const [returnType, setReturnType] = useState(() => 
    localStorage.getItem('sim_returnType') || 'NTR'
  );
  const [divisor, setDivisor] = useState(() => 
    localStorage.getItem('sim_divisor') || '100000'
  );
  const [initialLevel, setInitialLevel] = useState(() => 
    localStorage.getItem('sim_initialLevel') || '100.00'
  );
  const [indexFamily, setIndexFamily] = useState(() => 
    localStorage.getItem('sim_indexFamily') || 'DEFAULT_LASPEYRE'
  );
  const [identifierType, setIdentifierType] = useState(() => 
    localStorage.getItem('sim_identifierType') || 'RIC'
  );
  const [referenceIndexId, setReferenceIndexId] = useState(() => 
    localStorage.getItem('sim_referenceIndexId') || ''
  );
  const [inputMethod, setInputMethod] = useState(() => 
    localStorage.getItem('sim_inputMethod') || 'manual'
  );
  const [selectedIndex, setSelectedIndex] = useState(() => 
    localStorage.getItem('sim_selectedIndex') || ''
  );
  const [indexDate, setIndexDate] = useState(() => 
    localStorage.getItem('sim_indexDate') || '11.04.2025'
  );
  const [priceType, setPriceType] = useState(() => 
    localStorage.getItem('sim_priceType') || 'close'
  );
  const [loading, setLoading] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(() => 
    localStorage.getItem('sim_complete') === 'true'
  );
  
  // Advanced parameters state
  const [showAdvancedParameters, setShowAdvancedParameters] = useState(() => 
    localStorage.getItem('sim_showAdvanced') === 'true'
  );
  const [lateDividendHandling, setLateDividendHandling] = useState(() => 
    localStorage.getItem('sim_lateDividendHandling') || 'NONE'
  );
  const [cashDividendTaxHandling, setCashDividendTaxHandling] = useState(() => 
    localStorage.getItem('sim_cashDividendTaxHandling') || 'None'
  );
  const [specialDividendTaxHandling, setSpecialDividendTaxHandling] = useState(() => 
    localStorage.getItem('sim_specialDividendTaxHandling') || 'None'
  );
  const [considerStockDividend, setConsiderStockDividend] = useState(() => 
    localStorage.getItem('sim_considerStockDividend') !== 'false'
  );
  const [considerStockSplit, setConsiderStockSplit] = useState(() => 
    localStorage.getItem('sim_considerStockSplit') !== 'false'
  );
  const [considerRightsIssue, setConsiderRightsIssue] = useState(() => 
    localStorage.getItem('sim_considerRightsIssue') !== 'false'
  );
  const [considerDividendFee, setConsiderDividendFee] = useState(() => 
    localStorage.getItem('sim_considerDividendFee') === 'true'
  );
  const [drDividendTreatment, setDrDividendTreatment] = useState(() => 
    localStorage.getItem('sim_drDividendTreatment') || 'DEFAULT'
  );
  const [globalDrTaxRate, setGlobalDrTaxRate] = useState(() => 
    localStorage.getItem('sim_globalDrTaxRate') || ''
  );
  
  // Rebalancing data
  const [rebalancings, setRebalancings] = useState<any[]>(() => {
    const stored = localStorage.getItem('sim_rebalancings');
    return stored ? JSON.parse(stored) : [];
  });
  const [shareOrWeight, setShareOrWeight] = useState(() => 
    localStorage.getItem('sim_shareOrWeight') || 'shares'
  );
  
  // Stock data - updated interface
  const [stocks, setStocks] = useState(() => {
    const stored = localStorage.getItem('sim_stocks');
    return stored ? JSON.parse(stored) : [
      { ric: 'AAPL.OQ', shares: '10000', weight: '25.0', weightingCapFactor: '1.0' },
      { ric: 'MSFT.OQ', shares: '8000', weight: '35.0', weightingCapFactor: '1.0' },
      { ric: 'GOOGL.OQ', shares: '5000', weight: '40.0', weightingCapFactor: '1.0' },
    ];
  });

  const [previousRebalancingIndexValue, setPreviousRebalancingIndexValue] = useState(() => 
    localStorage.getItem('sim_previousRebalancingIndexValue') || '100.00'
  );

  // Price overrides
  const [priceOverrides, setPriceOverrides] = useState<Array<{ric: string, date: string, price: string}>>(() => {
    const stored = localStorage.getItem('sim_priceOverrides');
    return stored ? JSON.parse(stored) : [];
  });
  
  // Rebalancing upload data
  const [rebalancingUploads, setRebalancingUploads] = useState<Array<{selectionDate: string, rebalancingDate: string, file: string}>>(() => {
    const stored = localStorage.getItem('sim_rebalancingUploads');
    return stored ? JSON.parse(stored) : [];
  });

  // Save state to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('sim_startDate', startDate);
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem('sim_endDate', endDate);
  }, [endDate]);

  useEffect(() => {
    localStorage.setItem('sim_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('sim_returnType', returnType);
  }, [returnType]);

  useEffect(() => {
    localStorage.setItem('sim_divisor', divisor);
  }, [divisor]);

  useEffect(() => {
    localStorage.setItem('sim_initialLevel', initialLevel);
  }, [initialLevel]);

  useEffect(() => {
    localStorage.setItem('sim_indexFamily', indexFamily);
  }, [indexFamily]);

  useEffect(() => {
    localStorage.setItem('sim_identifierType', identifierType);
  }, [identifierType]);

  useEffect(() => {
    localStorage.setItem('sim_referenceIndexId', referenceIndexId);
  }, [referenceIndexId]);

  useEffect(() => {
    localStorage.setItem('sim_inputMethod', inputMethod);
  }, [inputMethod]);

  useEffect(() => {
    localStorage.setItem('sim_selectedIndex', selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    localStorage.setItem('sim_indexDate', indexDate);
  }, [indexDate]);

  useEffect(() => {
    localStorage.setItem('sim_priceType', priceType);
  }, [priceType]);

  useEffect(() => {
    localStorage.setItem('sim_complete', simulationComplete.toString());
  }, [simulationComplete]);

  useEffect(() => {
    localStorage.setItem('sim_showAdvanced', showAdvancedParameters.toString());
  }, [showAdvancedParameters]);

  useEffect(() => {
    localStorage.setItem('sim_lateDividendHandling', lateDividendHandling);
  }, [lateDividendHandling]);

  useEffect(() => {
    localStorage.setItem('sim_cashDividendTaxHandling', cashDividendTaxHandling);
  }, [cashDividendTaxHandling]);

  useEffect(() => {
    localStorage.setItem('sim_specialDividendTaxHandling', specialDividendTaxHandling);
  }, [specialDividendTaxHandling]);

  useEffect(() => {
    localStorage.setItem('sim_considerStockDividend', considerStockDividend.toString());
  }, [considerStockDividend]);

  useEffect(() => {
    localStorage.setItem('sim_considerStockSplit', considerStockSplit.toString());
  }, [considerStockSplit]);

  useEffect(() => {
    localStorage.setItem('sim_considerRightsIssue', considerRightsIssue.toString());
  }, [considerRightsIssue]);

  useEffect(() => {
    localStorage.setItem('sim_considerDividendFee', considerDividendFee.toString());
  }, [considerDividendFee]);

  useEffect(() => {
    localStorage.setItem('sim_drDividendTreatment', drDividendTreatment);
  }, [drDividendTreatment]);

  useEffect(() => {
    localStorage.setItem('sim_globalDrTaxRate', globalDrTaxRate);
  }, [globalDrTaxRate]);

  useEffect(() => {
    localStorage.setItem('sim_shareOrWeight', shareOrWeight);
  }, [shareOrWeight]);

  useEffect(() => {
    localStorage.setItem('sim_stocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('sim_rebalancings', JSON.stringify(rebalancings));
  }, [rebalancings]);

  useEffect(() => {
    localStorage.setItem('sim_priceOverrides', JSON.stringify(priceOverrides));
  }, [priceOverrides]);

  useEffect(() => {
    localStorage.setItem('sim_rebalancingUploads', JSON.stringify(rebalancingUploads));
  }, [rebalancingUploads]);

  useEffect(() => {
    localStorage.setItem('sim_previousRebalancingIndexValue', previousRebalancingIndexValue);
  }, [previousRebalancingIndexValue]);

  // Handle reset from parent component
  useEffect(() => {
    if (shouldReset) {
      handleReset();
      onResetComplete();
    }
  }, [shouldReset]);
  
  const handleReset = () => {
    // Clear all localStorage items
    const keysToRemove = [
      'sim_startDate', 'sim_endDate', 'sim_currency', 'sim_returnType', 'sim_divisor',
      'sim_initialLevel', 'sim_indexFamily', 'sim_identifierType', 'sim_referenceIndexId',
      'sim_inputMethod', 'sim_selectedIndex', 'sim_indexDate', 'sim_priceType', 'sim_complete', 
      'sim_showAdvanced', 'sim_lateDividendHandling', 'sim_cashDividendTaxHandling', 
      'sim_specialDividendTaxHandling', 'sim_considerStockDividend', 'sim_considerStockSplit', 
      'sim_considerRightsIssue', 'sim_considerDividendFee', 'sim_drDividendTreatment', 
      'sim_globalDrTaxRate', 'sim_shareOrWeight', 'sim_stocks', 'sim_rebalancings', 
      'sim_priceOverrides', 'sim_rebalancingUploads'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('sim_previousRebalancingIndexValue');

    // Reset all state to defaults
    setStartDate('11.04.2025');
    setEndDate('15.04.2025');
    setCurrency('USD');
    setReturnType('NTR');
    setDivisor('100000');
    setInitialLevel('100.00');
    setIndexFamily('DEFAULT_LASPEYRE');
    setIdentifierType('RIC');
    setReferenceIndexId('');
    setInputMethod('manual');
    setSelectedIndex('');
    setIndexDate('11.04.2025');
    setPriceType('close');
    setSimulationComplete(false);
    setShowAdvancedParameters(false);
    setLateDividendHandling('NONE');
    setCashDividendTaxHandling('None');
    setSpecialDividendTaxHandling('None');
    setConsiderStockDividend(true);
    setConsiderStockSplit(true);
    setConsiderRightsIssue(true);
    setConsiderDividendFee(false);
    setDrDividendTreatment('DEFAULT');
    setGlobalDrTaxRate('');
    setRebalancings([]);
    setShareOrWeight('shares');
    setStocks([
      { ric: 'AAPL.OQ', shares: '10000', weight: '25.0', weightingCapFactor: '1.0' },
      { ric: 'MSFT.OQ', shares: '8000', weight: '35.0', weightingCapFactor: '1.0' },
      { ric: 'GOOGL.OQ', shares: '5000', weight: '40.0', weightingCapFactor: '1.0' },
    ]);
    setPriceOverrides([]);
    setRebalancingUploads([]);
    
    setPreviousRebalancingIndexValue('100.00');
    
    SimulationService.clearResults();
  };
  
  const addRow = () => {
    const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';
    const newStock = isBondIndex 
      ? { ric: '', shares: '', weight: '', baseValue: '', weightingCapFactor: '1.0', caCash: '', couponCash: '', sinkingCash: '' }
      : { ric: '', shares: '', weight: '', weightingCapFactor: '1.0' };
    setStocks([...stocks, newStock]);
  };

  const updateStock = (index: number, field: 'ric' | 'shares' | 'weight' | 'baseValue' | 'weightingCapFactor' | 'caCash' | 'couponCash' | 'sinkingCash', value: string) => {
    const newStocks = [...stocks];
    newStocks[index][field] = value;
    setStocks(newStocks);
  };

  const removeStock = (index: number) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  const addPriceOverride = () => {
    setPriceOverrides([...priceOverrides, { ric: '', date: startDate, price: '' }]);
  };

  const updatePriceOverride = (index: number, field: 'ric' | 'date' | 'price', value: string) => {
    const newPriceOverrides = [...priceOverrides];
    newPriceOverrides[index][field] = value;
    setPriceOverrides(newPriceOverrides);
  };

  const removePriceOverride = (index: number) => {
    setPriceOverrides(priceOverrides.filter((_, i) => i !== index));
  };

  const addRebalancingUpload = (selectionDate: string, rebalancingDate: string, file: string) => {
    setRebalancingUploads([...rebalancingUploads, { selectionDate, rebalancingDate, file }]);
    toast({
      title: "Rebalancing uploaded",
      description: `Rebalancing for ${selectionDate} (rebalancing ${rebalancingDate}) has been added to the simulation`,
    });
  };

  const removeRebalancingUpload = (index: number) => {
    setRebalancingUploads(rebalancingUploads.filter((_, i) => i !== index));
  };

  const fetchIndexData = () => {
    toast({
      title: "Loading index data",
      description: `Fetching data for ${selectedIndex} on ${indexDate}`,
    });
    
    // Find the selected index data
    const selectedIndexData = mockIndices.find(index => index.id === selectedIndex);
    
    if (selectedIndexData) {
      // Update parameters based on the selected index
      setCurrency(selectedIndexData.currency);
      setReturnType(selectedIndexData.returnType);
      setDivisor(selectedIndexData.divisor);
      
      // Update stocks based on the selected index
      setStocks(selectedIndexData.constituents);
      
      toast({
        title: "Data loaded",
        description: "Index data has been successfully loaded and parameters prefilled",
      });
    } else {
      toast({
        title: "Error",
        description: "Selected index data not found",
        variant: "destructive",
      });
    }
  };

  const handleSelectedIndexChange = (indexId: string) => {
    setSelectedIndex(indexId);
  };

  const addRebalancing = () => {
    const newRebalancing = { 
      id: `rebal-${rebalancings.length + 1}`,
      selectionDate: startDate,
      rebalancingDate: startDate,
      components: [
        { ric: 'AAPL.OQ', shares: '1000', weight: '20', weightingCapFactor: '1.0' },
        { ric: 'MSFT.OQ', shares: '500', weight: '15', weightingCapFactor: '1.0' },
      ]
    };
    
    setRebalancings([...rebalancings, newRebalancing]);
  };

  const removeRebalancing = (index: number) => {
    setRebalancings(rebalancings.filter((_, i) => i !== index));
  };

  const updateRebalancingDate = (index: number, field: 'selectionDate' | 'rebalancingDate', value: string) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[index][field] = value;
    setRebalancings(newRebalancings);
  };

  const addRebalancingComponent = (rebalancingIndex: number) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[rebalancingIndex].components.push({ 
      ric: '', 
      shares: '', 
      weight: '', 
      weightingCapFactor: '1.0' 
    });
    setRebalancings(newRebalancings);
  };

  const updateRebalancingComponent = (
    rebalancingIndex: number, 
    componentIndex: number, 
    field: 'ric' | 'shares' | 'weight' | 'weightingCapFactor', 
    value: string
  ) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[rebalancingIndex].components[componentIndex][field] = value;
    setRebalancings(newRebalancings);
  };

  const removeRebalancingComponent = (rebalancingIndex: number, componentIndex: number) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[rebalancingIndex].components = 
      newRebalancings[rebalancingIndex].components.filter((_, i) => i !== componentIndex);
    setRebalancings(newRebalancings);
  };

  const handleSimulate = async () => {
    setLoading(true);
    toast({
      title: "Simulation started",
      description: "Calling real simulation API...",
    });
    
    try {
      const result = await SimulationService.runSimulation(
        startDate,
        endDate,
        currency,
        returnType,
        divisor,
        indexFamily,
        identifierType,
        referenceIndexId,
        stocks,
        {
          cashDividendTaxHandling,
          specialDividendTaxHandling,
          considerStockDividend,
          considerStockSplit,
          considerRightsIssue,
          considerDividendFee,
          drDividendTreatment,
          globalDrTaxRate
        },
        priceOverrides,
        initialLevel,
        previousRebalancingIndexValue,
        rebalancings // Pass rebalancings to the simulation service
      );
      
      setLoading(false);
      setSimulationComplete(true);
      
      // Notify parent component about simulation completion
      if (onSimulationComplete) {
        onSimulationComplete(true, stocks, selectedIndex);
      }
      
      toast({
        title: "Simulation complete",
        description: "Real simulation API returned successfully",
      });
      
      console.log('Simulation completed with result:', result);
    } catch (error) {
      setLoading(false);
      console.error('Simulation failed:', error);
      toast({
        title: "Simulation failed",
        description: error instanceof Error ? error.message : "An error occurred during simulation",
        variant: "destructive",
      });
    }
  };

  const viewResults = () => {
    // Update the global state or use a callback to inform the parent component to switch tabs
    navigate('/simulator?tab=results');
  };

  return (
    <div className="p-6 pb-6">
      <div className="space-y-6">
        {/* Simulation Period */}
        <SimulationPeriod
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        
        {/* Parameters */}
        <SimulationParameters
          currency={currency}
          setCurrency={setCurrency}
          returnType={returnType}
          setReturnType={setReturnType}
          divisor={divisor}
          setDivisor={setDivisor}
          initialLevel={initialLevel}
          setInitialLevel={setInitialLevel}
          indexFamily={indexFamily}
          setIndexFamily={setIndexFamily}
          identifierType={identifierType}
          setIdentifierType={setIdentifierType}
          referenceIndexId={referenceIndexId}
          setReferenceIndexId={setReferenceIndexId}
          previousRebalancingIndexValue={previousRebalancingIndexValue}
          setPreviousRebalancingIndexValue={setPreviousRebalancingIndexValue}
          showAdvancedParameters={showAdvancedParameters}
          setShowAdvancedParameters={setShowAdvancedParameters}
          lateDividendHandling={lateDividendHandling}
          setLateDividendHandling={setLateDividendHandling}
          cashDividendTaxHandling={cashDividendTaxHandling}
          setCashDividendTaxHandling={setCashDividendTaxHandling}
          specialDividendTaxHandling={specialDividendTaxHandling}
          setSpecialDividendTaxHandling={setSpecialDividendTaxHandling}
          considerStockDividend={considerStockDividend}
          setConsiderStockDividend={setConsiderStockDividend}
          considerStockSplit={considerStockSplit}
          setConsiderStockSplit={setConsiderStockSplit}
          considerRightsIssue={considerRightsIssue}
          setConsiderRightsIssue={setConsiderRightsIssue}
          considerDividendFee={considerDividendFee}
          setConsiderDividendFee={setConsiderDividendFee}
          drDividendTreatment={drDividendTreatment}
          setDrDividendTreatment={setDrDividendTreatment}
          globalDrTaxRate={globalDrTaxRate}
          setGlobalDrTaxRate={setGlobalDrTaxRate}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="my-8">
        <BottomActions
          simulationComplete={simulationComplete}
          loading={loading}
          handleSimulate={handleSimulate}
          viewResults={viewResults}
        />
      </div>
      
      {/* Composition Panel */}
      <Composition
        inputMethod={inputMethod}
        setInputMethod={setInputMethod}
        stocks={stocks}
        shareOrWeight={shareOrWeight}
        setShareOrWeight={setShareOrWeight}
        updateStock={updateStock}
        removeStock={removeStock}
        addRow={addRow}
        selectedIndex={selectedIndex}
        setSelectedIndex={handleSelectedIndexChange}
        indexDate={indexDate}
        setIndexDate={setIndexDate}
        priceType={priceType}
        setPriceType={setPriceType}
        fetchIndexData={fetchIndexData}
        indexFamily={indexFamily}
        mockIndices={mockIndices}
        cashes={[]}
        addCash={() => {}}
        updateCash={() => {}}
        removeCash={() => {}}
      />
      
      {/* Combined Rebalancing Section */}
      <RebalancingSection
        rebalancings={rebalancings}
        shareOrWeight={shareOrWeight}
        indexFamily={indexFamily}
        addRebalancing={addRebalancing}
        removeRebalancing={removeRebalancing}
        updateRebalancingDate={updateRebalancingDate}
        addRebalancingComponent={addRebalancingComponent}
        updateRebalancingComponent={updateRebalancingComponent}
        removeRebalancingComponent={removeRebalancingComponent}
        rebalancingUploads={rebalancingUploads}
        addRebalancingUpload={addRebalancingUpload}
        removeRebalancingUpload={removeRebalancingUpload}
      />
      
      {/* Price Overrides Panel */}
      <PriceOverrides
        priceOverrides={priceOverrides}
        addPriceOverride={addPriceOverride}
        updatePriceOverride={updatePriceOverride}
        removePriceOverride={removePriceOverride}
      />
    </div>
  );
};

export default SimulationData;
