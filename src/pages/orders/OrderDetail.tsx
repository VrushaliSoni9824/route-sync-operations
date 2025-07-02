import { TmsLayout } from "@/components/TmsLayout";
import { TmsMap } from "@/components/maps/TmsMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  Edit, 
  Download, 
  MapPin, 
  Package, 
  Truck, 
  Calendar, 
  FileText,
  User,
  Phone,
  Mail,
  Clock
} from "lucide-react";

// Sample order data
const orderData = {
  id: "ORD-001",
  status: "tendered" as const,
  customer: "ABC Logistics Inc.",
  poNumber: "PO-2024-001",
  createdDate: "2024-01-10",
  pickupDate: "2024-01-15",
  deliveryDate: "2024-01-18",
  
  contact: {
    name: "John Johnson",
    phone: "(555) 123-4567",
    email: "john@abclogistics.com"
  },
  
  origin: {
    company: "ABC Logistics Warehouse",
    address: "1234 Industrial Blvd",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
    contact: "Sarah Wilson",
    phone: "(555) 234-5678"
  },
  
  destination: {
    company: "Phoenix Distribution Center",
    address: "5678 Commerce Drive",
    city: "Phoenix", 
    state: "AZ",
    zip: "85001",
    contact: "Mike Davis",
    phone: "(555) 345-6789"
  },
  
  freight: {
    pallets: 10,
    weight: "15,000 lbs",
    dimensions: "48x40x48",
    commodity: "Electronics & Components",
    value: "$2,850.00",
    equipmentType: "Dry Van 53'"
  },
  
  accessorials: ["Liftgate - Destination", "Appointment Required"],
  
  instructions: "Handle with care. Electronics are fragile. Delivery appointment required 24 hours in advance.",
  
  documents: [
    { name: "Bill of Lading.pdf", uploadDate: "2024-01-10", type: "BOL" },
    { name: "Purchase Order.pdf", uploadDate: "2024-01-10", type: "PO" },
    { name: "Special Instructions.doc", uploadDate: "2024-01-11", type: "Instructions" }
  ]
};

const auditTrail = [
  { date: "2024-01-10 09:00 AM", user: "Jane Smith", action: "Order Created", details: "Initial order entry" },
  { date: "2024-01-10 09:15 AM", user: "Jane Smith", action: "Documents Uploaded", details: "BOL and PO attached" },
  { date: "2024-01-11 02:30 PM", user: "Mike Johnson", action: "Order Reviewed", details: "Validated address and pricing" },
  { date: "2024-01-12 10:45 AM", user: "System", action: "Shipment Created", details: "Added to shipment SHIP-001" },
  { date: "2024-01-13 03:20 PM", user: "Dispatch", action: "Carrier Assigned", details: "Tendered to Reliable Transport Co." }
];

export default function OrderDetail() {
  const mapLocations = [
    {
      id: "origin",
      coordinates: [-118.2437, 34.0522] as [number, number],
      type: "pickup" as const,
      label: `${orderData.origin.company} - Pickup`,
      status: "completed" as any
    },
    {
      id: "destination", 
      coordinates: [-112.0740, 33.4484] as [number, number],
      type: "delivery" as const,
      label: `${orderData.destination.company} - Delivery`,
      status: "pending" as any
    }
  ];

  return (
    <TmsLayout 
      title={`Order ${orderData.id}`}
      breadcrumbs={[
        { label: "Orders", href: "/" },
        { label: orderData.id }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusBadge status={orderData.status} />
            <Badge variant="outline">{orderData.customer}</Badge>
            <Badge variant="outline">{orderData.poNumber}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
            <Button variant="destructive" size="sm">
              Cancel Order
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="route">Route & Map</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Order Details */}
          <TabsContent value="details">
            <div className="grid grid-cols-3 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-medium">{orderData.customer}</div>
                    <div className="text-sm text-muted-foreground">Customer</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium">{orderData.contact.name}</div>
                    <div className="text-sm text-muted-foreground">Contact Person</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    {orderData.contact.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    {orderData.contact.email}
                  </div>
                </CardContent>
              </Card>

              {/* Origin Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    Origin
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-medium">{orderData.origin.company}</div>
                    <div className="text-sm text-muted-foreground">
                      {orderData.origin.address}<br />
                      {orderData.origin.city}, {orderData.origin.state} {orderData.origin.zip}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium">{orderData.origin.contact}</div>
                    <div className="text-sm text-muted-foreground">{orderData.origin.phone}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Pickup: {orderData.pickupDate}
                  </div>
                </CardContent>
              </Card>

              {/* Destination Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    Destination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-medium">{orderData.destination.company}</div>
                    <div className="text-sm text-muted-foreground">
                      {orderData.destination.address}<br />
                      {orderData.destination.city}, {orderData.destination.state} {orderData.destination.zip}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium">{orderData.destination.contact}</div>
                    <div className="text-sm text-muted-foreground">{orderData.destination.phone}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Delivery: {orderData.deliveryDate}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Freight Details */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Freight Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{orderData.freight.pallets}</div>
                      <div className="text-sm text-muted-foreground">Pallets</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{orderData.freight.weight}</div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                    </div>
                    <div>
                      <div className="font-medium">{orderData.freight.commodity}</div>
                      <div className="text-sm text-muted-foreground">Commodity</div>
                    </div>
                    <div>
                      <div className="font-medium">{orderData.freight.value}</div>
                      <div className="text-sm text-muted-foreground">Declared Value</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <div className="font-medium mb-2">Accessorials</div>
                    <div className="flex flex-wrap gap-1">
                      {orderData.accessorials.map((accessorial) => (
                        <Badge key={accessorial} variant="secondary">
                          {accessorial}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Equipment & Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-medium">{orderData.freight.equipmentType}</div>
                    <div className="text-sm text-muted-foreground">Equipment Type</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-2">Special Instructions</div>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {orderData.instructions}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Route & Map */}
          <TabsContent value="route">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TmsMap 
                  locations={mapLocations}
                  showRoutes={true}
                />
                
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">425</div>
                    <div className="text-sm text-muted-foreground">Miles</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">6.5</div>
                    <div className="text-sm text-muted-foreground">Hours</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-muted-foreground">Stops</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">$1,250</div>
                    <div className="text-sm text-muted-foreground">Est. Cost</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attached Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.documents.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order Status Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Order Created</div>
                      <div className="text-sm text-muted-foreground">January 10, 2024 at 9:00 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Order Planned</div>
                      <div className="text-sm text-muted-foreground">January 12, 2024 at 10:45 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Carrier Assigned</div>
                      <div className="text-sm text-muted-foreground">January 13, 2024 at 3:20 PM</div>
                      <div className="text-sm text-muted-foreground">Reliable Transport Co.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-muted/50 border border-muted rounded">
                    <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-muted-foreground">Pickup Scheduled</div>
                      <div className="text-sm text-muted-foreground">January 15, 2024 - Pending</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-muted/50 border border-muted rounded">
                    <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-muted-foreground">Delivery Scheduled</div>
                      <div className="text-sm text-muted-foreground">January 18, 2024 - Pending</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditTrail.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.action}</Badge>
                        </TableCell>
                        <TableCell>{entry.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TmsLayout>
  );
}