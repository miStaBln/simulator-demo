import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import SimulationPeriod from './simulator/SimulationPeriod';
import SimulationParameters from './simulator/SimulationParameters';
import AdvancedParameters from './simulator/AdvancedParameters';
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
}

const SimulationData = ({ onSimulationComplete = () => {} }: SimulationDataProps) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('11.04.2025');
  const [endDate, setEndDate] = useState('15.04.2025');
  const [currency, setCurrency] = useState('USD');
  const [returnType, setReturnType] = useState('NTR');
  const [divisor, setDivisor] = useState('100000');
  const [initialLevel, setInitialLevel] = useState('1000.00');
  const [inputMethod, setInputMethod] = useState('manual');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [indexDate, setIndexDate] = useState('11.04.2025');
  const [priceType, setPriceType] = useState('close');
  const [loading, setLoading] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  
  // Advanced parameters state
  const [showAdvancedParameters, setShowAdvancedParameters] = useState(false);
  const [lateDividendHandling, setLateDividendHandling] = useState('NONE');
  const [cashDividendTaxHandling, setCashDividendTaxHandling] = useState('None');
  const [specialDividendTaxHandling, setSpecialDividendTaxHandling] = useState('None');
  const [considerStockDividend, setConsiderStockDividend] = useState(true);
  const [considerStockSplit, setConsiderStockSplit] = useState(true);
  const [considerRightsIssue, setConsiderRightsIssue] = useState(true);
  const [considerDividendFee, setConsiderDividendFee] = useState(false);
  const [drDividendTreatment, setDrDividendTreatment] = useState('DEFAULT');
  const [globalDrTaxRate, setGlobalDrTaxRate] = useState('');
  
  // Rebalancing data
  const [rebalancings, setRebalancings] = useState<any[]>([]);
  const [shareOrWeight, setShareOrWeight] = useState('shares');
  
  // Stock data - reduced to 3 elements
  const [stocks, setStocks] = useState([
    { ric: 'AAPL.OQ', shares: '10000', weight: '25.0' },
    { ric: 'MSFT.OQ', shares: '8000', weight: '35.0' },
    { ric: 'GOOGL.OQ', shares: '5000', weight: '40.0' },
  ]);

  // Price overrides
  const [priceOverrides, setPriceOverrides] = useState<Array<{ric: string, date: string, price: string}>>([]);
  
  // Rebalancing upload data - fixing the type to match RebalancingUpload props
  const [rebalancingUploads, setRebalancingUploads] = useState<Array<{selectionDate: string, rebalancingDate: string, file: string}>>([]);
  
  const addRow = () => {
    setStocks([...stocks, { ric: '', shares: '', weight: '' }]);
  };

  const updateStock = (index: number, field: 'ric' | 'shares' | 'weight', value: string) => {
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
    setRebalancings([
      ...rebalancings, 
      { 
        id: `rebal-${rebalancings.length + 1}`,
        selectionDate: startDate,
        rebalancingDate: startDate,
        components: [
          { ric: 'AAPL.OQ', shares: '1000', weight: '20' },
          { ric: 'MSFT.OQ', shares: '500', weight: '15' },
        ]
      }
    ]);
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
    newRebalancings[rebalancingIndex].components.push({ ric: '', shares: '', weight: '' });
    setRebalancings(newRebalancings);
  };

  const updateRebalancingComponent = (
    rebalancingIndex: number, 
    componentIndex: number, 
    field: 'ric' | 'shares' | 'weight', 
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

  const handleSimulate = () => {
    setLoading(true);
    toast({
      title: "Simulation started",
      description: "Please wait while we process your simulation data",
    });
    
    // Simulate processing time
    setTimeout(() => {
      setLoading(false);
      setSimulationComplete(true);
      
      // Notify parent component about simulation completion
      if (onSimulationComplete) {
        onSimulationComplete(true, stocks, selectedIndex);
      }
      
      toast({
        title: "Simulation complete",
        description: "Your index simulation is ready to view",
      });
    }, 2000);
  };

  const viewResults = () => {
    // Update the global state or use a callback to inform the parent component to switch tabs
    navigate('/simulator?tab=results');
  };

  return (
    <div className="p-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel - Simulation Period */}
        <SimulationPeriod
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        
        {/* Right Panel - Parameters */}
        <SimulationParameters
          currency={currency}
          setCurrency={setCurrency}
          returnType={returnType}
          setReturnType={setReturnType}
          divisor={divisor}
          setDivisor={setDivisor}
          initialLevel={initialLevel}
          setInitialLevel={setInitialLevel}
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
      
      {/* Advanced Parameters Panel */}
      <AdvancedParameters
        isExpanded={showAdvancedParameters}
        onToggle={() => setShowAdvancedParameters(!showAdvancedParameters)}
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
        mockIndices={mockIndices}
      />
      
      {/* Combined Rebalancing Section */}
      <RebalancingSection
        rebalancings={rebalancings}
        shareOrWeight={shareOrWeight}
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
