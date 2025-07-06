import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, MoreHorizontal, Download, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

const orders = [
  {
    id: "ORD-001",
    customer: "ABC Logistics Inc.",
    poNumber: "PO-2024-001",
    pickupDate: "2024-01-15",
    deliveryDate: "2024-01-18",
    status: "created" as const,
    division: "West",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    weight: "15,000 lbs",
    value: "$2,850.00",
    trip: "N/A"
  },
  {
    id: "ORD-002", 
    customer: "Global Supply Chain",
    poNumber: "PO-2024-002",
    pickupDate: "2024-01-16",
    deliveryDate: "2024-01-19",
    status: "planned" as const,
    division: "East",
    origin: "Atlanta, GA",
    destination: "Miami, FL", 
    weight: "22,500 lbs",
    value: "$3,200.00",
     trip: "N/A"
  },
  {
    id: "ORD-003",
    customer: "TechCorp Solutions",
    poNumber: "PO-2024-003", 
    pickupDate: "2024-01-14",
    deliveryDate: "2024-01-17",
    status: "tendered" as const,
    division: "Central",
    origin: "Chicago, IL",
    destination: "Denver, CO",
    weight: "18,750 lbs", 
    value: "$4,100.00",
    trip: "N/A"
  },
  {
    id: "ORD-004",
    customer: "Manufacturing Plus",
    poNumber: "PO-2024-004",
    pickupDate: "2024-01-13",
    deliveryDate: "2024-01-16", 
    status: "in-transit" as const,
    division: "West",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    weight: "12,000 lbs",
    value: "$1,950.00",
    trip: "N/A"
  },
  {
    id: "ORD-005",
    customer: "Retail Network LLC",
    poNumber: "PO-2024-005",
    pickupDate: "2024-01-12",
    deliveryDate: "2024-01-15",
    status: "delivered" as const,
    division: "South",
    origin: "Houston, TX", 
    destination: "Dallas, TX",
    weight: "8,500 lbs",
    value: "$1,200.00",
    trip: "N/A"
  }
];


export function OrderList() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [drawerOrder, setDrawerOrder] = useState<typeof orders[0] | null>(null);
  const navigate = useNavigate();
  let clickTimeout: NodeJS.Timeout;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDivision = divisionFilter === "all" || order.division === divisionFilter;

    return matchesSearch && matchesStatus && matchesDivision;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header and filters... */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="tendered">Tendered</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

        </div>

        <div className="flex items-center gap-2">
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <Badge variant="secondary">{selectedOrders.length} selected</Badge>
              <Button variant="outline" size="sm">
                Bulk Edit
              </Button>
              <Button variant="outline" size="sm">
                Cancel Selected
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button asChild>
            <Link to="/orders/create">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === orders.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    clearTimeout(clickTimeout);
                    clickTimeout = setTimeout(() => setDrawerOrder(order), 200);
                  }}
                  onDoubleClick={() => {
                    clearTimeout(clickTimeout);
                    navigate(`/orders/${order.id}`);
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-primary">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.poNumber}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.origin}</div>
                      <div className="text-muted-foreground">→ {order.destination}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.weight}</TableCell>
                  <TableCell className="font-medium">{order.value}</TableCell>
                  <TableCell className="font-medium">{order.trip}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                 
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Link to="/orders/SHP-001">View Details</Link></DropdownMenuItem>
                        <DropdownMenuItem>Edit Order</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drawer Backdrop */}
      {drawerOrder && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDrawerOrder(null)}></div>
      )}

      {/* Slide-Out Drawer */}
      {drawerOrder && (
        <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-xl z-50 border-l overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <Button variant="ghost" onClick={() => setDrawerOrder(null)}>Close</Button>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div><strong>Order ID:</strong> {drawerOrder.id}</div>
            <div><strong>Customer:</strong> {drawerOrder.customer}</div>
            <div><strong>PO Number:</strong> {drawerOrder.poNumber}</div>
            <div><strong>Status:</strong> {drawerOrder.status}</div>
            <div><strong>Pickup:</strong> {drawerOrder.pickupDate} – {drawerOrder.origin}</div>
            <div><strong>Delivery:</strong> {drawerOrder.deliveryDate} – {drawerOrder.destination}</div>
            <div><strong>Weight:</strong> {drawerOrder.weight}</div>
            <div><strong>Value:</strong> {drawerOrder.value}</div>
            <div><strong>Trip:</strong> {drawerOrder.trip}</div>
          </div>
        </div>
      )}
    </div>
  );
}
