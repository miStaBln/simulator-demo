
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DatePicker from '../DatePicker';

export interface CorporateActionEntry {
  action: 'add' | 'delete';
  eventId: string;
  ric: string;
  eventType: string;
  executionDate: string;
  value: string;
  currency: string;
}

interface CorporateActionsOverridesProps {
  corporateActions: CorporateActionEntry[];
  addCorporateAction: () => void;
  updateCorporateAction: (index: number, field: keyof CorporateActionEntry, value: string) => void;
  removeCorporateAction: (index: number) => void;
}

const CorporateActionsOverrides = ({
  corporateActions,
  addCorporateAction,
  updateCorporateAction,
  removeCorporateAction,
}: CorporateActionsOverridesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-gray-100 rounded-md shadow-sm p-6 mt-6 border border-gray-200">
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <h2 className="text-lg font-medium">Corporate Actions (Optional)</h2>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Add or delete corporate action events to simulate their effects on the index.
          </p>

          {corporateActions.length === 0 ? (
            <div className="text-muted-foreground text-sm mb-4">No corporate actions added yet</div>
          ) : (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-2 font-medium min-w-[90px]">Action</th>
                    <th className="pb-2 pr-2 font-medium min-w-[100px]">Event ID</th>
                    <th className="pb-2 pr-2 font-medium min-w-[100px]">RIC</th>
                    <th className="pb-2 pr-2 font-medium min-w-[140px]">Type</th>
                    <th className="pb-2 pr-2 font-medium min-w-[130px]">Execution Date</th>
                    <th className="pb-2 pr-2 font-medium min-w-[80px]">Value</th>
                    <th className="pb-2 pr-2 font-medium min-w-[80px]">Currency</th>
                    <th className="pb-2 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {corporateActions.map((ca, index) => (
                    <tr key={index} className="border-b border-border/40">
                      <td className="py-2 pr-2">
                        <Select
                          value={ca.action}
                          onValueChange={(v) => updateCorporateAction(index, 'action', v)}
                        >
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Add</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      <td className="py-2 pr-2">
                        <Input
                          value={ca.eventId}
                          onChange={(e) => updateCorporateAction(index, 'eventId', e.target.value)}
                          placeholder={ca.action === 'delete' ? 'Required' : 'Optional'}
                          className="h-9"
                          disabled={ca.action === 'add'}
                        />
                      </td>

                      <td className="py-2 pr-2">
                        <Input
                          value={ca.ric}
                          onChange={(e) => updateCorporateAction(index, 'ric', e.target.value)}
                          placeholder="e.g., AAPL.OQ"
                          className="h-9"
                          disabled={ca.action === 'delete'}
                        />
                      </td>

                      <td className="py-2 pr-2">
                        <Select
                          value={ca.eventType}
                          onValueChange={(v) => updateCorporateAction(index, 'eventType', v)}
                          disabled={ca.action === 'delete'}
                        >
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH_DIVIDEND">Cash Dividend</SelectItem>
                            <SelectItem value="SPECIAL_DIVIDEND">Special Dividend</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      <td className="py-2 pr-2">
                        <DatePicker
                          label=""
                          value={ca.executionDate}
                          onChange={(v) => updateCorporateAction(index, 'executionDate', v)}
                          disabled={ca.action === 'delete'}
                        />
                      </td>

                      <td className="py-2 pr-2">
                        <Input
                          type="text"
                          value={ca.value}
                          onChange={(e) => updateCorporateAction(index, 'value', e.target.value)}
                          placeholder="0.00"
                          className="h-9"
                          disabled={ca.action === 'delete'}
                        />
                      </td>

                      <td className="py-2 pr-2">
                        <Select
                          value={ca.currency}
                          onValueChange={(v) => updateCorporateAction(index, 'currency', v)}
                          disabled={ca.action === 'delete'}
                        >
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Ccy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="NZD">NZD</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                            <SelectItem value="CHF">CHF</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      <td className="py-2">
                        <button
                          onClick={() => removeCorporateAction(index)}
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={addCorporateAction}
            className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Corporate Action
          </button>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CorporateActionsOverrides;
