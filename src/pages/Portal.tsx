
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileChartLine, ShoppingBasket, Briefcase, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserMenu } from '@/components/UserMenu';

const Portal = () => {
  const navigate = useNavigate();

  const applications = [
    {
      id: 'index-insights',
      name: 'Index Insights',
      description: 'View and manage index data, simulations and dashboards',
      icon: FileChartLine,
      path: '/inventory',
      active: true,
    },
    {
      id: 'basket-insights',
      name: 'Basket Insights',
      description: 'Analyze and manage basket instruments',
      icon: ShoppingBasket,
      path: '/basket-insights',
      active: false,
    },
    {
      id: 'corporate-action-insights',
      name: 'Corporate Action Insights',
      description: 'Monitor and handle corporate actions',
      icon: Briefcase,
      path: '/corporate-action-insights',
      active: false,
    },
    {
      id: 'index-platform',
      name: 'Index Platform',
      description: 'Comprehensive index management platform',
      icon: Database,
      path: '/index-platform',
      active: false,
    },
  ];

  const handleAppClick = (app: typeof applications[0]) => {
    if (app.active) {
      navigate(app.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="font-semibold text-teal-600 text-lg">SOLACTIVE PORTAL</div>
        <UserMenu />
      </div>
      
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome to Solactive Portal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {applications.map((app) => (
            <Card 
              key={app.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                app.active ? 'border-teal-500' : 'opacity-60'
              }`}
              onClick={() => handleAppClick(app)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-4 ${
                  app.active ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <app.icon size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                <p className="text-sm text-gray-500">{app.description}</p>
                {!app.active && (
                  <div className="mt-3 text-xs py-1 px-2 bg-gray-100 rounded-full">
                    Coming soon
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portal;
