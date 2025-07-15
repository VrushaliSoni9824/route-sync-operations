import { TmsLayout } from "@/components/TmsLayout";
import { RateEstimationPanel } from "@/components/rates/RateEstimationPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Quote {
  id: string;
  carrier: string;
  mode: string;
  equipmentType: string;
  transitTime: string;
  totalRate: number;
  breakdown: {
    linehaul: number;
    fuel: number;
    accessorials: number;
  };
  accessorials: string[];
  status: "estimated" | "accepted";
  tags: string[];
  contractType: "contract" | "spot";
}

export default function RateLookup() {
  const navigate = useNavigate();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const handleApplyQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleCreateOrder = () => {
    // Navigate to order creation with pre-filled quote data
    navigate("/orders/create", { 
      state: { 
        prefilledQuote: selectedQuote,
        fromRateLookup: true 
      }
    });
  };

  return (
    <TmsLayout
      breadcrumbs={[
        { label: "Rates", href: "/rates" },
        { label: "Rate Lookup" }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Rate Lookup Tool
            </h1>
            <p className="text-muted-foreground">
              Get instant rate quotes from multiple carriers and create orders
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Rate Estimation Panel */}
          <div className="lg:col-span-2">
            <RateEstimationPanel 
              onApplyQuote={handleApplyQuote}
              showHeader={false}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Selected Quote */}
            {selectedQuote && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="font-medium">{selectedQuote.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Rate:</span>
                      <span className="font-bold text-lg">${selectedQuote.totalRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transit Time:</span>
                      <span>{selectedQuote.transitTime}</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleCreateOrder} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Order
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Save Quote Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  Compare Lane History
                </Button>
              </CardContent>
            </Card>

            {/* Recent Lookups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Lookups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <div className="font-medium">LAX → PHX</div>
                    <div className="text-muted-foreground">15,000 lbs • Dry Van</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <div className="font-medium">CHI → DET</div>
                    <div className="text-muted-foreground">22,000 lbs • Reefer</div>
                    <div className="text-xs text-muted-foreground">1 day ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TmsLayout>
  );
}