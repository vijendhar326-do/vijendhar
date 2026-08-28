export type UserRole = 'admin' | 'manager' | 'driver';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  assignedTruckId?: string;
}

export type TruckStatus = 'available' | 'loading' | 'in_transit' | 'maintenance' | 'breakdown';

export interface Truck {
  id: string;
  registrationNumber: string; // e.g. TN 38 AB 4521
  truckType?: '10 Wheeler Tipper' | '12 Wheeler Multi-Axle' | '14 Wheeler Heavy Hauler' | '16 Wheeler Semi-Trailer' | string;
  model?: string;
  tonnageCapacity?: number;
  capacityTons?: number;
  ownerName?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: string;
  status: TruckStatus;
  totalTrips?: number;
  totalTons?: number;
  fuelUsedLitres?: number;
  fuelCost?: number;
  revenueGenerated?: number;
  maintenanceCost?: number;
  insuranceExpiry?: string; // YYYY-MM-DD
  permitExpiry?: string;
  fitnessExpiry?: string;
  pollutionExpiry?: string;
  fcExpiry?: string;
  odometerKm?: number;
  tyreConditionPercent?: number;
  fuelCapacityLitres?: number;
  currentFuelPercent?: number;
  currentSpeedKmH?: number;
  latitude?: number;
  longitude?: number;
  heading?: number;
  destination?: string;
}

export type DriverStatus = 'available' | 'on_trip' | 'leave' | 'off_duty';

export interface Driver {
  id: string;
  name: string;
  photo?: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedTruckId?: string;
  assignedTruckNumber?: string;
  status: DriverStatus;
  totalTrips: number;
  totalTons: number;
  monthlySalary: number;
  dailyBatta?: number;
  advancePaid?: number;
  advanceTaken?: number;
  balancePayable?: number;
  rating?: number; // 1 to 5
  joinedDate?: string;
}

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending';

export interface StoneTransferTrip {
  id: string;
  tripId: string; // e.g. TRP-2026-0891
  date: string; // YYYY-MM-DD
  customerId: string;
  customerName: string;
  customerPhone?: string;
  graniteType: string; // e.g. Black Galaxy, Tan Brown, Kashmir White, Absolute Black
  sourceQuarry: string; // e.g. Chimakurthy Quarry 2, Hosur Hill Block
  destination: string; // e.g. Chennai Port Yard, Hosur Polishing SEZ
  truckId: string;
  truckNumber: string;
  driverId: string;
  driverName: string;
  numberOfTrips?: number;
  tonsPerTrip?: number;
  totalTons: number;
  ratePerTon: number;
  stoneAmount?: number;
  loadingCharge?: number;
  unloadingCharge?: number;
  transportCharge?: number;
  otherCharge?: number;
  totalAmount: number;
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: 'Cash' | 'UPI' | 'NEFT/RTGS' | 'Cheque';
  remarks?: string;
  deliveryStatus: 'Booked' | 'Loading' | 'In Transit' | 'Delivered' | 'Completed' | string;
  podId?: string;
}

export type DeliveryStatus = 'Booked' | 'Loading' | 'In Transit' | 'Delivered' | 'Completed' | 'in_transit' | 'delivered' | 'delayed';

export interface FuelLog {
  id: string;
  date: string;
  truckId: string;
  truckNumber: string;
  driverId: string;
  driverName: string;
  fuelStation?: string;
  pumpStation?: string;
  litres: number;
  pricePerLitre?: number;
  ratePerLitre?: number;
  totalCost: number;
  openingKm?: number;
  closingKm?: number;
  odometerReading?: number;
  distanceKm?: number;
  totalKm?: number;
  mileageKmPerLitre?: number;
  mileageKmpl?: number;
  tripId?: string;
  fuelType?: string;
  fullTank?: boolean;
  paymentMode?: 'Cash' | 'Fleet Card' | 'UPI' | 'Credit' | string;
  paymentMethod?: string;
  receiptNumber?: string;
  slipNumber?: string;
}

export type ExpenseCategory =
  | 'Fuel'
  | 'Driver Payment'
  | 'Maintenance'
  | 'Toll'
  | 'Loading'
  | 'Unloading'
  | 'Tyres'
  | 'Spare Parts'
  | 'Parking'
  | 'Food'
  | 'Office'
  | 'Other'
  | string;

export interface ExpenseRecord {
  id: string;
  date: string;
  category: ExpenseCategory;
  truckId?: string;
  truckNumber?: string;
  driverId?: string;
  driverName?: string;
  description: string;
  amount: number;
  paymentMethod?: 'Cash' | 'UPI' | 'NEFT/RTGS' | 'Company Card' | 'Cheque' | string;
  paymentMode?: string;
  receiptUrl?: string;
  receiptNumber?: string;
  remarks?: string;
}

export type Expense = ExpenseRecord;

export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked' | 'active' | 'inactive';

export interface Customer {
  id: string;
  name?: string;
  companyName: string;
  contactPerson?: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  gstNumber?: string;
  gstin?: string;
  totalOrders?: number;
  totalTons?: number;
  totalRevenue?: number;
  totalInvoiced?: number;
  totalPaid?: number;
  pendingBalance?: number;
  balanceDue?: number;
  creditLimit?: number;
  status: CustomerStatus;
  createdDate?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  graniteType?: string;
  tons?: number;
  quantityTons?: number;
  ratePerTon: number;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'Draft' | 'Sent' | 'Paid' | 'Partial' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0412
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerCompany?: string;
  customerGst?: string;
  customerGstin?: string;
  customerAddress: string;
  tripId?: string;
  graniteType?: string;
  items?: InvoiceItem[];
  totalTons?: number;
  stoneAmount?: number;
  transportCharge?: number;
  loadingCharge?: number;
  unloadingCharge?: number;
  otherCharge?: number;
  subTotal?: number;
  subtotal?: number;
  taxRatePercent?: number;
  gstRatePercent?: number;
  taxAmount?: number;
  gstAmount?: number;
  grandTotal?: number;
  totalAmount?: number;
  paidAmount?: number;
  advancePaid?: number;
  balanceAmount?: number;
  balanceDue?: number;
  paymentStatus?: PaymentStatus;
  status?: InvoiceStatus;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
  notes?: string;
  terms?: string;
}

export type MaintenanceType =
  | 'Oil Change'
  | 'Brake Pad & Liner'
  | 'Hydraulic Tipper Lift'
  | 'Tyre Replacement'
  | 'Engine Overhaul'
  | 'Suspension / Leaf Spring'
  | 'Battery / Electrical'
  | 'Engine Oil & Filter'
  | 'Brake Overhaul'
  | 'Hydraulic Cylinder Repair'
  | 'Suspension & Leaf Springs'
  | 'Electrical & Lights'
  | 'Full Fleet Overhaul'
  | string;

export type MaintenanceStatus = 'completed' | 'in_progress' | 'scheduled' | 'Completed' | 'In Progress' | 'Scheduled';

export interface MaintenanceRecord {
  id: string;
  truckId: string;
  truckNumber: string;
  serviceDate: string;
  serviceType: MaintenanceType;
  partsReplaced: string;
  cost: number;
  odometerReadingKm?: number;
  nextDueKm?: number;
  nextDueDate?: string;
  nextServiceDate?: string;
  nextServiceKm?: number;
  serviceCenter?: string;
  workshopName?: string;
  status: MaintenanceStatus;
  remarks?: string;
  description?: string;
}

export type MaintenanceLog = MaintenanceRecord;

export interface ProofOfDelivery {
  id: string;
  tripId: string;
  shipmentId?: string;
  truckNumber?: string;
  driverName?: string;
  customerName: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveredAt?: string;
  location?: string;
  receivedBy?: string;
  receiverName?: string;
  receiverPhone?: string;
  tonsDelivered?: number;
  weighbridgeWeightTons?: number;
  slipNumber?: string;
  weighbridgeSlipNumber?: string;
  grossWeightTons?: number;
  tareWeightTons?: number;
  netWeightTons?: number;
  signatureDataUrl?: string;
  signatureUrl?: string;
  photoUrl?: string;
  weighbridgePhotoUrl?: string;
  unloadingPhotoUrl?: string;
  remarks?: string;
  notes?: string;
  status?: 'Verified' | 'Pending Review' | 'Disputed' | string;
}

export type DeliveryProofRecord = ProofOfDelivery;

export interface DailyClosingRecord {
  id: string;
  date: string; // YYYY-MM-DD
  closedAt?: string; // ISO timestamp
  closingTime?: string;
  closedBy: string;
  totalTrips: number;
  totalTons: number;
  totalIncome?: number;
  grossIncome?: number;
  fuelCost: number;
  fuelLitres?: number;
  driverCost?: number;
  otherExpenses: number;
  totalExpenses?: number;
  netProfit: number;
  pendingPayments?: number;
  cashInHand: number;
  bankSettlements?: number;
  closingNotes?: string;
  varianceNotes?: string;
  status: 'Closed' | 'Audited' | 'locked' | string;
}

export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Cash' | 'Cheque' | 'Fleet Card' | 'Credit' | string;

export interface PaymentRecord {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount: number;
  paymentDate: string;
  paymentMode: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

export type GraniteType =
  | 'Absolute Black (Hosur Premium)'
  | 'Black Galaxy (Chimakurthy Gold Star)'
  | 'Tan Brown (Karimnagar)'
  | 'Kashmir White (Madurai Melur)'
  | 'Vizag Blue (Srikakulam)'
  | 'Hassan Green'
  | 'Steel Grey (Ongole)'
  | 'Paradiso Multi-Color (Krishnagiri)'
  | string;

export type StoneGrade =
  | 'A+ Export Grade'
  | 'Commercial Grade B'
  | 'Standard Domestic'
  | 'Quarry Waste Grit / Slag'
  | 'Export Premium'
  | 'Commercial Standard'
  | 'Monumental Grade'
  | string;

export type InventoryStatus = 'in_stock' | 'in_transit' | 'delivered' | 'sold';

export interface GraniteInventoryItem {
  id: string;
  blockNumber: string;
  graniteType: GraniteType;
  grade: StoneGrade;
  lengthM: number;
  widthM: number;
  heightM: number;
  volumeCbm: number;
  weightTons: number;
  quarryLocation: string;
  status: InventoryStatus;
  pricePerTon: number;
  totalValue: number;
}

export interface RouteWayPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface RouteDetail {
  id: string;
  name: string;
  source: string;
  sourceQuarry?: string;
  destination: string;
  distanceKm: number;
  avgDurationHours?: number;
  estimatedDurationHours?: number;
  typicalTollCharges?: number;
  estimatedTollCost?: number;
  tollCount?: number;
  standardRatePerTon?: number;
  roadCondition?: string;
  permitRequirements?: string;
  condition?: 'Excellent' | 'Good' | 'Heavy Traffic' | 'Rough Hill Terrain';
  waypoints?: RouteWayPoint[];
}

export type Route = RouteDetail;

export interface GraniteStockItem {
  id: string;
  code: string;
  name: string;
  colorFamily: string;
  quarryOrigin: string;
  stockTons: number;
  pricePerTon: number;
  qualityGrade: 'Export Premium' | 'Commercial Standard' | 'Monumental Grade';
  imagePlaceholder: string;
}

export interface BusinessTarget {
  month: string; // e.g. "August 2026"
  tonsTarget: number;
  tonsAchieved: number;
  revenueTarget: number;
  revenueAchieved: number;
  profitTarget: number;
  profitAchieved: number;
  fuelEfficiencyTargetKmPerL: number;
  fuelEfficiencyAchieved: number;
}

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  category: 'payment' | 'breakdown' | 'license' | 'insurance' | 'maintenance' | 'fuel' | 'delivery' | 'system';
  severity: AlertSeverity;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedEntityId?: string;
}
