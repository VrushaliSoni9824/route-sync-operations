
import { TmsLayout } from "@/components/TmsLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { TmsMap } from "@/components/maps/TmsMap";
import { Separator } from "@/components/ui/separator";
import { FileText, MapPin, Truck, Clock, User, Edit, X, CheckCircle } from "lucide-react";

// Sample order data - in real app this would come from API/router params
const orderData = {
  id: "ORD-001",
  customer: "ABC Logistics Inc.",
  poNumber: "PO-2024-001",
  pickupDate: "2024-01-15",
  deliveryDate: "2024-01-18",
  status: "created" as const,
  division: "West",
  origin: {
    address: "1234 Industrial Blvd",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
    coordinates: [-118.2437, 34.0522] as [number, number]
  },
  destination: {
    address: "5678 Commerce Way", 
    city: "Phoenix",
    state: "AZ",
    zip: "85001",
    coordinates: [-112.0740, 33.4484] as [number, number]
  },
  freight: {
    pallets: 15,
    weight: "15,000 lbs",
    commodity: "Electronics",
    dimensions: "48x40x48"
  },
  equipment: "Dry Van (53')",
  value: "$2,850.00",
  accessorials: ["Liftgate - Origin", "Appointment Required"],
  specialInstructions: "Handle with care - fragile electronics. Call 2 hours before delivery.",
  internalNotes: "High-value customer - priority handling"
};

const auditTrail = [
  { timestamp: "2024-01-14 09:15", user: "John Dispatcher", action: "Order Created", details: "Initial order entry completed" },
  { timestamp: "2024-01-14 09:20", user: "System", action: "Validation Passed", details: "All required fields validated" },
  { timestamp: "2024-01-14 10:30", user: "Jane CSR", action: "Customer Contacted", details: "Confirmed pickup window with customer" },
  { timestamp: "2024-01-14 14:45", user: "Mike Planner", action: "Rate Quoted", details: "Rate of $2,850 quoted and accepted" }
];

const attachedDocuments = [
  { name: "BOL_ORD001.pdf", type: "Bill of Lading", size: "245 KB", uploadedBy: "John Dispatcher", uploadedAt: "2024-01-14 09:25" },
  { name: "Special_Instructions.docx", type: "Instructions", size: "12 KB", uploadedBy: "Jane CSR", uploadedAt: "2024-01-14 10:35" }
];

export default function OrderDetail() {
  const mapLocations = [
    {
      id: 'pickup',
      coordinates: orderData.origin.coordinates,
      type: 'pickup' as const,
      label: `${orderData.origin.city}, ${orderData.origin.state}`,
      status: 'pending' as const
    },
    {
      id: 'delivery',
      coordinates: orderData.destination.coordinates,
      type: 'delivery' as const,
      label: `${orderData.destination.city}, ${orderData.destination.state}`,
      status: 'pending' as const
    }
  ];
  type TripStatus = "created" | "dispatched" | "in-progress" | "delivered" | "closed";

  const sampleTrip = {
    id: "TRP-001",
    shipmentId: "SHP-001",
    status: "in-progress" as TripStatus,
    driver: {
      name: "John Doe",
      phone: "(555) 123-4567",
      license: "CDL-A",
      terminal: "Northeast Hub"
    },
    equipment: {
      tractorId: "TRC-001",
      trailerId: "TRL-001",
      type: "Dry Van",
      capacity: "48,000 lbs"
    },
    route: {
      origin: "New York, NY",
      destination: "Boston, MA",
      distance: "215 miles",
      estimatedDuration: "4-6 hours"
    },
    stops: [
      {
        id: "1",
        type: "pickup" as const,
        location: "Warehouse A, 123 Main St, New York, NY",
        coordinates: [-74.0, 40.7] as [number, number],
        scheduledTime: "08:00",
        actualTime: "08:15",
        status: "completed",
        notes: "Loaded 10 pallets"
      },
      {
        id: "2", 
        type: "delivery" as const,
        location: "Distribution Center, 456 Oak Ave, Boston, MA",
        coordinates: [-71.0, 42.3] as [number, number],
        scheduledTime: "16:00",
        actualTime: null,
        status: "in-progress",
        notes: ""
      }
    ],
    currentLocation: [-72.5, 41.5] as [number, number],
    createdAt: "2024-01-15T06:00:00Z",
    dispatchedAt: "2024-01-15T07:30:00Z",
    estimatedArrival: "2024-01-15T16:30:00Z"
  };
  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === sampleTrip.status);
  };
  const statusSteps = [
    { key: "created", label: "Created", icon: FileText },
    { key: "dispatched", label: "Dispatched", icon: Truck },
    { key: "in-progress", label: "In Progress", icon: MapPin },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
    { key: "closed", label: "Closed", icon: FileText }
  ];
  return (
    <TmsLayout 
      title="Order Details"
      breadcrumbs={[
        { label: "Orders", href: "/" },
        { label: orderData.id }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{orderData.id}</h1>
              <p className="text-muted-foreground">{orderData.customer}</p>
            </div>
            <StatusBadge status={orderData.status} />
            <Badge variant="outline">{orderData.division}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
            <Button variant="outline" size="sm">
              Duplicate
            </Button>
            <Button variant="destructive" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          </div>
        </div>
        <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const isCompleted = index < getCurrentStepIndex();
              const isCurrent = index === getCurrentStepIndex();
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted ? "bg-green-100 text-green-600" :
                    isCurrent ? "bg-blue-100 text-blue-600" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-2 text-sm">
                    <p className={`font-medium ${isCurrent ? "text-blue-600" : ""}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`mx-4 h-px w-16 ${
                      isCompleted ? "bg-green-300" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="stops">Stops & Route</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid grid-cols-3 gap-6">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">PO Number:</span>
                      <p>{orderData.poNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium">Equipment:</span>
                      <p>{orderData.equipment}</p>
                    </div>
                    <div>
                      <span className="font-medium">Pickup Date:</span>
                      <p>{orderData.pickupDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Delivery Date:</span>
                      <p>{orderData.deliveryDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Value:</span>
                      <p className="font-semibold text-green-600">{orderData.value}</p>
                    </div>
                    <div>
                      <span className="font-medium">Division:</span>
                      <p>{orderData.division}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Freight Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Freight Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Pallets:</span>
                      <p>{orderData.freight.pallets}</p>
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span>
                      <p>{orderData.freight.weight}</p>
                    </div>
                    <div>
                      <span className="font-medium">Commodity:</span>
                      <p>{orderData.freight.commodity}</p>
                    </div>
                    <div>
                      <span className="font-medium">Dimensions:</span>
                      <p>{orderData.freight.dimensions}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="font-medium text-sm">Accessorials:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {orderData.accessorials.map((accessorial) => (
                        <Badge key={accessorial} variant="secondary" className="text-xs">
                          {accessorial}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium text-sm">Origin</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-5">
                      <p>{orderData.origin.address}</p>
                      <p>{orderData.origin.city}, {orderData.origin.state} {orderData.origin.zip}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium text-sm">Destination</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-5">
                      <p>{orderData.destination.address}</p>
                      <p>{orderData.destination.city}, {orderData.destination.state} {orderData.destination.zip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{orderData.specialInstructions}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{orderData.internalNotes}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stops & Route Tab */}
          <TabsContent value="stops">
            <div className="space-y-6">
              <TmsMap locations={mapLocations} showRoutes={true} />
              
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      Pickup Stop
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{orderData.origin.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.origin.city}, {orderData.origin.state} {orderData.origin.zip}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Scheduled: {orderData.pickupDate} 08:00 - 17:00</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      Delivery Stop
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{orderData.destination.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.destination.city}, {orderData.destination.state} {orderData.destination.zip}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Scheduled: {orderData.deliveryDate} 08:00 - 17:00</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Attached Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attachedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditTrail.map((entry, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.action}</span>
                            <Badge variant="outline" className="text-xs">{entry.user}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {entry.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TmsLayout>
  );
}
