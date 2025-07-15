import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw, TrendingUp, Clock, Award, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

interface RateEstimationPanelProps {
  orderData?: {
    origin: { city: string; state: string };
    destination: { city: string; state: string };
    freight: { weight: string };
    equipment: string;
  };
  onApplyQuote?: (quote: Quote) => void;
  showHeader?: boolean;
  isEmbedded?: boolean;
}

const sampleQuotes: Quote[] = [
  {
    id: "Q-001",
    carrier: "Swift Transportation",
    mode: "FTL",
    equipmentType: "Dry Van 53'",
    transitTime: "2-3 days",
    totalRate: 2850,
    breakdown: { linehaul: 2400, fuel: 350, accessorials: 100 },
    accessorials: ["Liftgate - Origin"],
    status: "estimated",
    tags: ["Best Value", "Contract"],
    contractType: "contract"
  },
  {
    id: "Q-002", 
    carrier: "JB Hunt",
    mode: "FTL",
    equipmentType: "Dry Van 53'",
    transitTime: "1-2 days",
    totalRate: 3150,
    breakdown: { linehaul: 2700, fuel: 350, accessorials: 100 },
    accessorials: ["Liftgate - Origin"],
    status: "estimated",
    tags: ["Fastest"],
    contractType: "spot"
  },
  {
    id: "Q-003",
    carrier: "Schneider",
    mode: "FTL", 
    equipmentType: "Dry Van 53'",
    transitTime: "2-3 days",
    totalRate: 2950,
    breakdown: { linehaul: 2500, fuel: 350, accessorials: 100 },
    accessorials: ["Liftgate - Origin"],
    status: "estimated",
    tags: ["Contract"],
    contractType: "contract"
  }
];

export function RateEstimationPanel({ 
  orderData, 
  onApplyQuote, 
  showHeader = true,
  isEmbedded = false 
}: RateEstimationPanelProps) {
  const [quotes, setQuotes] = useState<Quote[]>(sampleQuotes);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isEmbedded);
  
  const [formData, setFormData] = useState({
    origin: orderData?.origin ? `${orderData.origin.city}, ${orderData.origin.state}` : "",
    destination: orderData?.destination ? `${orderData.destination.city}, ${orderData.destination.state}` : "",
    weight: orderData?.freight?.weight || "",
    equipment: orderData?.equipment || ""
  });

  const handleGetQuotes = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real app, this would update quotes from API
    }, 2000);
  };

  const handleRefreshQuote = (quoteId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "Best Value": return <Award className="h-3 w-3" />;
      case "Fastest": return <Zap className="h-3 w-3" />;
      case "Contract": return <TrendingUp className="h-3 w-3" />;
      default: return null;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Best Value": return "bg-status-delivered text-white";
      case "Fastest": return "bg-accent text-accent-foreground";
      case "Contract": return "bg-primary text-primary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  if (isEmbedded) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Rate Quotes ({quotes.length})
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="space-y-3">
            {quotes.map((quote) => (
              <Card key={quote.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{quote.carrier}</span>
                    <div className="flex gap-1">
                      {quote.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className={`text-xs ${getTagColor(tag)}`}>
                          {getTagIcon(tag)}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="font-bold text-lg">${quote.totalRate.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{quote.transitTime}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleRefreshQuote(quote.id)}>
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    {onApplyQuote && (
                      <Button size="sm" onClick={() => onApplyQuote(quote)}>
                        Use
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Rate Estimation
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Input Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Origin</Label>
            <Input
              value={formData.origin}
              onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
              placeholder="Los Angeles, CA"
            />
          </div>
          <div className="space-y-2">
            <Label>Destination</Label>
            <Input
              value={formData.destination}
              onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="Phoenix, AZ"
            />
          </div>
          <div className="space-y-2">
            <Label>Weight</Label>
            <Input
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="15,000 lbs"
            />
          </div>
          <div className="space-y-2">
            <Label>Equipment Type</Label>
            <Select value={formData.equipment} onValueChange={(value) => setFormData(prev => ({ ...prev, equipment: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry-van-53">Dry Van 53'</SelectItem>
                <SelectItem value="reefer-53">Reefer 53'</SelectItem>
                <SelectItem value="flatbed-48">Flatbed 48'</SelectItem>
                <SelectItem value="step-deck">Step Deck</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleGetQuotes} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Getting Quotes...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Get Rate Quotes
            </>
          )}
        </Button>

        {/* Quotes Table */}
        <div className="space-y-3">
          {quotes.map((quote) => (
            <Card key={quote.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-semibold">{quote.carrier}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{quote.mode}</span>
                        <span>•</span>
                        <span>{quote.equipmentType}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {quote.tags.map((tag) => (
                        <Badge key={tag} className={`text-xs ${getTagColor(tag)}`}>
                          {getTagIcon(tag)}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${quote.totalRate.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {quote.transitTime}
                    </div>
                  </div>
                </div>

                {/* Rate Breakdown */}
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Linehaul:</span>
                    <span className="ml-1 font-medium">${quote.breakdown.linehaul.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fuel:</span>
                    <span className="ml-1 font-medium">${quote.breakdown.fuel.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accessorials:</span>
                    <span className="ml-1 font-medium">${quote.breakdown.accessorials.toLocaleString()}</span>
                  </div>
                </div>

                {/* Accessorials */}
                {quote.accessorials.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm text-muted-foreground">Accessorials: </span>
                    {quote.accessorials.map((acc, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1">
                        {acc}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Badge variant={quote.contractType === "contract" ? "default" : "secondary"}>
                    {quote.contractType.toUpperCase()}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleRefreshQuote(quote.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                    {onApplyQuote && (
                      <Button size="sm" onClick={() => onApplyQuote(quote)}>
                        Use Quote
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}