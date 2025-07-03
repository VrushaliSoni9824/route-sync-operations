import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Truck, MapPin, Package, Clock, Route, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TmsLayout } from "@/components/TmsLayout";

// import { StatusBadge } from "./StatusBadge";
import { StatusBadge } from "./StatusBadge";
const sampleShipment = {
  id: "SHP-001",
  orders: [
    { id: "ORD-001", customer: "ACME Corp", poNumber: "PO123456" },
    { id: "ORD-002", customer: "ACME Corp", poNumber: "PO123457" }
  ],
  status: "in-transit" as const,
  executionMode: "Asset",
  equipment: "Dry Van 53'",
  driver: {
    name: "John Doe",
    phone: "(555) 123-4567",
    license: "CDL-A-12345"
  },
  vehicle: {
    truck: "T-4567",
    trailer: "TR-8901"
  },
  route: {
    origin: "New York, NY",
    destination: "Boston, MA",
    totalMiles: 215,
    estimatedTime: "4h 15m"
  },
  stops: [
    {
      id: "1",
      type: "pickup",
      sequence: 1,
      location: "ACME Warehouse",
      address: "123 Industrial Blvd, Brooklyn, NY 11201",
      timeWindow: "08:00 - 12:00",
      actualTime: "09:15",
      status: "completed",
      orderId: "ORD-001",
      contact: "Mike Johnson",
      phone: "(555) 987-6543"
    },
    {
      id: "2", 
      type: "pickup",
      sequence: 2,
      location: "ACME Distribution",
      address: "456 Warehouse Ave, Queens, NY 11375",
      timeWindow: "13:00 - 17:00",
      actualTime: "14:30",
      status: "completed",
      orderId: "ORD-002",
      contact: "Sarah Smith",
      phone: "(555) 456-7890"
    },
    {
      id: "3",
      type: "delivery",
      sequence: 3,
      location: "Boston Regional DC",
      address: "789 Commerce St, Boston, MA 02101",
      timeWindow: "08:00 - 17:00",
      actualTime: null,
      status: "in-transit",
      orderId: "ORD-001,ORD-002",
      contact: "Tom Wilson",
      phone: "(555) 234-5678"
    }
  ],
  legs: [
    {
      id: "LEG-001",
      from: "Brooklyn, NY",
      to: "Queens, NY", 
      miles: 25,
      estimatedTime: "45m",
      actualTime: "52m",
      status: "completed"
    },
    {
      id: "LEG-002",
      from: "Queens, NY",
      to: "Boston, MA",
      miles: 190,
      estimatedTime: "3h 30m",
      actualTime: null,
      status: "in-progress"
    }
  ],
  timeline: [
    { time: "2024-01-15 08:00", event: "Shipment created", description: "Orders consolidated into shipment" },
    { time: "2024-01-15 08:30", event: "Driver assigned", description: "John Doe assigned to shipment" },
    { time: "2024-01-15 09:15", event: "First pickup completed", description: "Pickup at ACME Warehouse" },
    { time: "2024-01-15 14:30", event: "Second pickup completed", description: "Pickup at ACME Distribution" },
    { time: "2024-01-15 15:00", event: "En route to delivery", description: "Heading to Boston Regional DC" }
  ],
  costs: {
    baserate: 1850,
    fuel: 278,
    accessorials: 125,
    total: 2253
  }
};

const getStopStatusBadge = (status: string) => {
  const statusMap: Record<string, any> = {
    completed: "delivered",
    "in-transit": "in-transit", 
    pending: "planned"
  };
  return <StatusBadge status={statusMap[status] || "planned"} />;
};

export function ShipmentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
     <TmsLayout 
          title="Shipment Management"
          breadcrumbs={[
            { label: "Shipments" }
          ]}
        >
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/shipments")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shipments
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{sampleShipment.id}</h1>
            <p className="text-muted-foreground">
              {sampleShipment.orders.length} orders • {sampleShipment.route.totalMiles} miles
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status="in-transit" />
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Shipment
          </Button>
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            Track Live
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stops">Stops & Route</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Shipment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Execution Mode</label>
                      <p className="font-medium">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {sampleShipment.executionMode}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Equipment</label>
                      <p className="font-medium">{sampleShipment.equipment}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Total Distance</label>
                      <p className="font-medium">{sampleShipment.route.totalMiles} miles</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estimated Time</label>
                      <p className="font-medium">{sampleShipment.route.estimatedTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Linked Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Linked Orders</CardTitle>
                  <CardDescription>Orders consolidated in this shipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sampleShipment.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{order.id}</span>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">PO: {order.poNumber}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Route Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Route className="h-5 w-5" />
                    <span>Route Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{sampleShipment.route.origin}</p>
                        <p className="text-sm text-muted-foreground">Origin</p>
                      </div>
                    </div>
                    <div className="ml-1.5 w-0.5 h-8 bg-muted"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{sampleShipment.route.destination}</p>
                        <p className="text-sm text-muted-foreground">Destination</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Driver & Vehicle Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Driver & Vehicle</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Driver</label>
                    <p className="font-medium">{sampleShipment.driver.name}</p>
                    <p className="text-sm text-muted-foreground">{sampleShipment.driver.phone}</p>
                    <p className="text-sm text-muted-foreground">{sampleShipment.driver.license}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Equipment</label>
                    <div className="space-y-1">
                      <p className="font-medium">Truck: {sampleShipment.vehicle.truck}</p>
                      <p className="font-medium">Trailer: {sampleShipment.vehicle.trailer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">2/3</div>
                      <div className="text-xs text-muted-foreground">Stops Complete</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">67%</div>
                      <div className="text-xs text-muted-foreground">Route Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Cost Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Rate</span>
                    <span>${sampleShipment.costs.baserate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fuel Surcharge</span>
                    <span>${sampleShipment.costs.fuel.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accessorials</span>
                    <span>${sampleShipment.costs.accessorials.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${sampleShipment.costs.total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stops" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stop Sequence</CardTitle>
              <CardDescription>Planned route with pickup and delivery stops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleShipment.stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {stop.sequence}
                      </div>
                      {index < sampleShipment.stops.length - 1 && (
                        <div className="w-0.5 h-12 bg-muted mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{stop.location}</h4>
                          <Badge variant="outline" className="capitalize">{stop.type}</Badge>
                          {getStopStatusBadge(stop.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stop.actualTime || stop.timeWindow}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{stop.address}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Contact: </span>
                          <span>{stop.contact}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone: </span>
                          <span>{stop.phone}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Order: </span>
                          <span>{stop.orderId}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Window: </span>
                          <span>{stop.timeWindow}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Timeline</CardTitle>
              <CardDescription>Complete activity history and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleShipment.timeline.map((event, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.event}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Detailed shipment cost analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Rate</span>
                    <span className="font-medium">${sampleShipment.costs.baserate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Surcharge (15%)</span>
                    <span className="font-medium">${sampleShipment.costs.fuel.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accessorials</span>
                    <span className="font-medium">${sampleShipment.costs.accessorials.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Total Cost</span>
                    <span className="font-bold">${sampleShipment.costs.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Metrics</CardTitle>
                <CardDescription>Performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost per Mile</span>
                    <span className="font-medium">${(sampleShipment.costs.total / sampleShipment.route.totalMiles).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue per Order</span>
                    <span className="font-medium">${(sampleShipment.costs.total / sampleShipment.orders.length).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margin Estimate</span>
                    <span className="font-medium text-green-600">18.5%</span>
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