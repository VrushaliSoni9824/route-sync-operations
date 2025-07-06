
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { existingShipments } from "@/data/shipmentPlanningData";

export function ActiveShipmentsTab() {
  return (
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
  );
}
