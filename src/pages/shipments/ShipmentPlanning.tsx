import { useState } from "react";
import { TmsLayout } from "@/components/TmsLayout";
import { TmsMap } from "@/components/maps/TmsMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Plus, 
  Link as LinkIcon,
  Route,
  Settings,
  GripVertical
} from "lucide-react";

// Sample unplanned orders
const unplannedOrders = [
  {
    id: "ORD-001",
    customer: "ABC Logistics Inc.",
    poNumber: "PO-2024-001",
    origin: "Los Angeles, CA 90210",
    destination: "Phoenix, AZ 85001",
    pickupDate: "2024-01-15",
    weight: "15,000 lbs",
    pallets: 10,
    equipment: "Dry Van",
    priority: "Standard"
  },
  {
    id: "ORD-002", 
    customer: "Global Supply Chain",
    origin: "Los Angeles, CA 90028",
    destination: "Las Vegas, NV 89101",
    pickupDate: "2024-01-15",
    weight: "8,500 lbs",
    pallets: 6,
    equipment: "Dry Van",
    priority: "High"
  },
  {
    id: "ORD-003",
    customer: "TechCorp Solutions",
    origin: "Los Angeles, CA 90045",
    destination: "San Diego, CA 92101",
    pickupDate: "2024-01-16",
    weight: "12,200 lbs",
    pallets: 8,
    equipment: "Dry Van",
    priority: "Standard"
  }
];

const existingShipments = [
  {
    id: "SHIP-001",
    status: "planned" as const,
    orderCount: 2,
    totalWeight: "23,500 lbs",
    equipment: "Dry Van 53'",
    route: "LA → Vegas → Phoenix",
    driver: "John Smith",
    estimatedMiles: 425
  },
  {
    id: "SHIP-002", 
    status: "tendered" as const,
    orderCount: 1,
    totalWeight: "15,000 lbs",
    equipment: "Reefer 53'",
    route: "LA → San Francisco",
    driver: "Maria Garcia",
    estimatedMiles: 380
  }
];

export default function ShipmentPlanning() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [newShipment, setNewShipment] = useState({
    equipmentType: "",
    executionMode: "",
    serviceLevel: ""
  });

  const [stops, setStops] = useState([
    { id: "stop-1", type: "pickup", address: "Los Angeles, CA", orderIds: ["ORD-001"] },
    { id: "stop-2", type: "pickup", address: "Los Angeles, CA", orderIds: ["ORD-002"] },
    { id: "stop-3", type: "delivery", address: "Las Vegas, NV", orderIds: ["ORD-002"] },
    { id: "stop-4", type: "delivery", address: "Phoenix, AZ", orderIds: ["ORD-001"] }
  ]);

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const createShipment = () => {
    if (selectedOrders.length === 0) return;
    
    console.log("Creating shipment with orders:", selectedOrders);
    console.log("Shipment config:", newShipment);
    // Handle shipment creation
  };

  const mapLocations = stops.map((stop, index) => ({
    id: stop.id,
    coordinates: [
      stop.address.includes("Los Angeles") ? -118.2437 : 
      stop.address.includes("Las Vegas") ? -115.1398 :
      stop.address.includes("Phoenix") ? -112.0740 : -118.2437,
      stop.address.includes("Los Angeles") ? 34.0522 :
      stop.address.includes("Las Vegas") ? 36.1699 :
      stop.address.includes("Phoenix") ? 33.4484 : 34.0522
    ] as [number, number],
    type: stop.type as 'pickup' | 'delivery',
    label: `${stop.type} - ${stop.address}`,
    status: index < 2 ? 'completed' : 'pending' as any
  }));

  return (
    <TmsLayout 
      title="Shipment Planning"
      breadcrumbs={[
        { label: "Shipments", href: "/shipments" },
        { label: "Planning" }
      ]}
    >
      <div className="p-6 space-y-6">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Order Selection</TabsTrigger>
            <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
            <TabsTrigger value="route">Route Planning</TabsTrigger>
          </TabsList>

          {/* Order Selection Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Unplanned Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Unplanned Orders ({unplannedOrders.length})
                    </div>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Auto-Suggest
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unplannedOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                          />
                          <span className="font-medium text-primary">{order.id}</span>
                          <Badge variant={order.priority === "High" ? "destructive" : "secondary"}>
                            {order.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>{order.customer}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {order.origin} → {order.destination}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span>{order.weight}</span>
                            <span>{order.pallets} pallets</span>
                            <span>{order.equipment}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipment Builder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    New Shipment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedOrders.length > 0 && (
                    <div>
                      <Label>Selected Orders ({selectedOrders.length})</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedOrders.map((orderId) => (
                          <Badge key={orderId} variant="secondary">
                            {orderId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="equipment">Equipment Type</Label>
                    <Select value={newShipment.equipmentType} onValueChange={(value) => 
                      setNewShipment(prev => ({ ...prev, equipmentType: value }))
                    }>
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

                  <div>
                    <Label htmlFor="execution">Execution Mode</Label>
                    <Select value={newShipment.executionMode} onValueChange={(value) => 
                      setNewShipment(prev => ({ ...prev, executionMode: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asset">Asset-Based</SelectItem>
                        <SelectItem value="brokered">Brokered</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="service">Service Level</Label>
                    <Select value={newShipment.serviceLevel} onValueChange={(value) => 
                      setNewShipment(prev => ({ ...prev, serviceLevel: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="expedited">Expedited</SelectItem>
                        <SelectItem value="white-glove">White Glove</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={createShipment} 
                    disabled={selectedOrders.length === 0}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Shipment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Shipments Tab */}
          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle>Active Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Miles</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existingShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>
                          <StatusBadge status={shipment.status} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{shipment.orderCount} orders</Badge>
                        </TableCell>
                        <TableCell>{shipment.totalWeight}</TableCell>
                        <TableCell>{shipment.equipment}</TableCell>
                        <TableCell>{shipment.route}</TableCell>
                        <TableCell>{shipment.driver}</TableCell>
                        <TableCell>{shipment.estimatedMiles} mi</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route Planning Tab */}
          <TabsContent value="route" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Stop Sequence */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Stop Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center gap-2 p-2 border rounded">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={stop.type === 'pickup' ? 'default' : 'secondary'}>
                              {stop.type}
                            </Badge>
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{stop.address}</div>
                          <div className="text-xs text-muted-foreground">
                            Orders: {stop.orderIds.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </CardContent>
              </Card>

              {/* Route Map */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Route Visualization
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Est. 6.5 hours
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TmsMap 
                    locations={mapLocations}
                    showRoutes={true}
                  />
                  
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    <div className="p-3 bg-muted rounded">
                      <div className="text-2xl font-bold">425</div>
                      <div className="text-sm text-muted-foreground">Total Miles</div>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-sm text-muted-foreground">Stops</div>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <div className="text-2xl font-bold">6.5</div>
                      <div className="text-sm text-muted-foreground">Est. Hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TmsLayout>
  );
}