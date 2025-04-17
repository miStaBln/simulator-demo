
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, LayoutDashboard, FileBarChart, BarChart2 } from 'lucide-react';

const WHATS_NEW_VERSION = '1.0'; // Increment this whenever you add new features

const WhatsNewModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the user has seen this version of the "What's New" modal
    const hasSeenWhatsNew = localStorage.getItem('whatsNewVersion') === WHATS_NEW_VERSION;
    
    if (!hasSeenWhatsNew) {
      // Slight delay to avoid immediate popup on first load
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Mark this version as seen
    localStorage.setItem('whatsNewVersion', WHATS_NEW_VERSION);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold">
            <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
            What's New
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <h3 className="text-lg font-semibold">New Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-md">
                <LayoutDashboard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Customizable Dashboards</h4>
                <p className="text-sm text-muted-foreground">
                  Create your own dashboards with widgets for starred indices and upcoming events.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-md">
                <BarChart2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Enhanced Simulator</h4>
                <p className="text-sm text-muted-foreground">
                  Use the new simulation tab to test your index compositions with advanced features.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-md">
                <FileBarChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Detailed Index Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Check out the new Report tab in Index Details for comprehensive analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsNewModal;
