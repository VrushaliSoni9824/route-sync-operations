
// Sample unplanned orders
export const unplannedOrders = [
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

export const existingShipments = [
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
