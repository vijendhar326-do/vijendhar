import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  UserProfile,
  Truck,
  Driver,
  StoneTransferTrip,
  FuelLog,
  ExpenseRecord,
  Customer,
  Invoice,
  MaintenanceRecord,
  ProofOfDelivery,
  DailyClosingRecord,
  BusinessTarget,
  SmartAlert,
  RouteDetail,
  GraniteStockItem,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TRUCKS,
  INITIAL_DRIVERS,
  INITIAL_CUSTOMERS,
  INITIAL_TRIPS,
  INITIAL_FUEL_LOGS,
  INITIAL_EXPENSES,
  INITIAL_INVOICES,
  INITIAL_MAINTENANCE,
  INITIAL_PODS,
  INITIAL_ALERTS,
  INITIAL_DAILY_CLOSINGS,
  INITIAL_TARGETS,
  INITIAL_ROUTES,
  INITIAL_GRANITE_STOCK,
} from '../data/initialData';

interface AppContextType {
  // Auth & Mode
  currentUser: UserProfile | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  setDemoMode: (enabled: boolean) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data entities
  trucks: Truck[];
  drivers: Driver[];
  trips: StoneTransferTrip[];
  fuelLogs: FuelLog[];
  expenses: ExpenseRecord[];
  customers: Customer[];
  invoices: Invoice[];
  maintenanceRecords: MaintenanceRecord[];
  pods: ProofOfDelivery[];
  alerts: SmartAlert[];
  dailyClosings: DailyClosingRecord[];
  targets: BusinessTarget;
  routes: RouteDetail[];
  graniteStock: GraniteStockItem[];
  
  // Trip CRUD
  addTrip: (trip: Omit<StoneTransferTrip, 'id' | 'tripId'>) => StoneTransferTrip;
  updateTrip: (id: string, trip: Partial<StoneTransferTrip>) => void;
  deleteTrip: (id: string) => void;
  
  // Truck CRUD
  addTruck: (truck: Omit<Truck, 'id'>) => Truck;
  updateTruck: (id: string, truck: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;
  
  // Driver CRUD
  addDriver: (driver: Omit<Driver, 'id'>) => Driver;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  settleDriverAdvance: (driverId: string, amount: number) => void;
  
  // Fuel CRUD
  addFuelLog: (log: Omit<FuelLog, 'id'>) => FuelLog;
  updateFuelLog: (id: string, log: Partial<FuelLog>) => void;
  deleteFuelLog: (id: string) => void;
  
  // Expense CRUD
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => ExpenseRecord;
  updateExpense: (id: string, expense: Partial<ExpenseRecord>) => void;
  deleteExpense: (id: string) => void;
  
  // Customer CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'createdDate'>) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Invoice CRUD
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Maintenance CRUD
  addMaintenance: (record: Omit<MaintenanceRecord, 'id'>) => MaintenanceRecord;
  updateMaintenance: (id: string, record: Partial<MaintenanceRecord>) => void;
  deleteMaintenance: (id: string) => void;
  
  // POD CRUD
  addPod: (pod: Omit<ProofOfDelivery, 'id'>) => ProofOfDelivery;
  updatePod: (id: string, pod: Partial<ProofOfDelivery>) => void;
  
  // Daily Closing
  closeTodayAccounts: (notes?: string) => DailyClosingRecord;
  isTodayClosed: boolean;
  
  // Targets
  updateTargets: (newTargets: Partial<BusinessTarget>) => void;
  
  // Alerts
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;
  addAlert: (alert: Omit<SmartAlert, 'id' | 'timestamp' | 'read'>) => void;
  
  // Telematics Simulation
  isGpsSimulating: boolean;
  toggleGpsSimulation: () => void;
  
  // Calculated Metrics
  todayStats: {
    tripsCount: number;
    totalTons: number;
    totalIncome: number;
    fuelLitres: number;
    fuelCost: number;
    totalExpenses: number;
    netProfit: number;
    activeTrucks: number;
    availableTrucks: number;
    maintenanceTrucks: number;
    availableDrivers: number;
    onTripDrivers: number;
    pendingPaymentsAmount: number;
    completedTripsCount: number;
  };
  
  // Reset Data
  resetAllDataToDefault: () => void;
  
  // Global Search modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Print & Modal states
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  modalData: any;
  setModalData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gtp_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('gtp_auth');
    return saved === 'true'; // Default will start at landing page or auto login
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gtp_theme');
    return saved === 'dark';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Search & Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Entities state with localStorage persistence fallback
  const [trucks, setTrucks] = useState<Truck[]>(() => {
    const saved = localStorage.getItem('gtp_trucks');
    return saved ? JSON.parse(saved) : INITIAL_TRUCKS;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('gtp_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [trips, setTrips] = useState<StoneTransferTrip[]>(() => {
    const saved = localStorage.getItem('gtp_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('gtp_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('gtp_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('gtp_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('gtp_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('gtp_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [pods, setPods] = useState<ProofOfDelivery[]>(() => {
    const saved = localStorage.getItem('gtp_pods');
    return saved ? JSON.parse(saved) : INITIAL_PODS;
  });

  const [alerts, setAlerts] = useState<SmartAlert[]>(() => {
    const saved = localStorage.getItem('gtp_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [dailyClosings, setDailyClosings] = useState<DailyClosingRecord[]>(() => {
    const saved = localStorage.getItem('gtp_closings');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_CLOSINGS;
  });

  const [targets, setTargets] = useState<BusinessTarget>(() => {
    const saved = localStorage.getItem('gtp_targets');
    return saved ? JSON.parse(saved) : INITIAL_TARGETS;
  });

  const [routes] = useState<RouteDetail[]>(INITIAL_ROUTES);
  const [graniteStock] = useState<GraniteStockItem[]>(INITIAL_GRANITE_STOCK);

  // GPS Live simulation
  const [isGpsSimulating, setIsGpsSimulating] = useState<boolean>(true);

  // Sync theme with HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gtp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gtp_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('gtp_trucks', JSON.stringify(trucks));
  }, [trucks]);

  useEffect(() => {
    localStorage.setItem('gtp_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('gtp_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('gtp_fuel', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('gtp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('gtp_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('gtp_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('gtp_maintenance', JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);

  useEffect(() => {
    localStorage.setItem('gtp_pods', JSON.stringify(pods));
  }, [pods]);

  useEffect(() => {
    localStorage.setItem('gtp_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('gtp_closings', JSON.stringify(dailyClosings));
  }, [dailyClosings]);

  useEffect(() => {
    localStorage.setItem('gtp_targets', JSON.stringify(targets));
  }, [targets]);

  const currentRole: UserRole = currentUser?.role || 'admin';

  const loginAs = (role: UserRole) => {
    const foundUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem('gtp_user', JSON.stringify(foundUser));
    localStorage.setItem('gtp_auth', 'true');
    if (role === 'driver') {
      setActiveTab('driver-view');
    } else {
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('gtp_auth', 'false');
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleGpsSimulation = () => {
    setIsGpsSimulating((prev) => !prev);
  };

  // Live GPS Telemetry simulation ticker
  useEffect(() => {
    if (!isGpsSimulating) return;

    const interval = setInterval(() => {
      setTrucks((prevTrucks) =>
        prevTrucks.map((truck) => {
          if (truck.status === 'in_transit') {
            // slight delta to simulate movement along highways
            const deltaLat = (Math.random() - 0.48) * 0.0012;
            const deltaLng = (Math.random() - 0.45) * 0.0015;
            const speedNoise = Math.floor(Math.random() * 9) - 4;
            const newSpeed = Math.max(38, Math.min(68, truck.currentSpeedKmH + speedNoise));
            const newFuel = Math.max(15, +(truck.currentFuelPercent - 0.02).toFixed(1));

            return {
              ...truck,
              latitude: +(truck.latitude + deltaLat).toFixed(4),
              longitude: +(truck.longitude + deltaLng).toFixed(4),
              currentSpeedKmH: newSpeed,
              currentFuelPercent: newFuel,
            };
          }
          return truck;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isGpsSimulating]);

  // Today totals calculation
  const todayStats = useMemo(() => {
    const todayStr = '2026-08-28'; // Current reference simulation date
    const todayTrips = trips.filter((t) => t.date === todayStr);

    const totalTons = todayTrips.reduce((acc, t) => acc + (t.totalTons || 0), 0);
    const totalIncome = todayTrips.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
    const pendingPaymentsAmount = todayTrips.reduce((acc, t) => acc + (t.balanceAmount || 0), 0);

    const todayFuel = fuelLogs.filter((f) => f.date === todayStr);
    const fuelLitres = todayFuel.reduce((acc, f) => acc + (f.litres || 0), 0);
    const fuelCost = todayFuel.reduce((acc, f) => acc + (f.totalCost || 0), 0);

    const todayExpenses = expenses.filter((e) => e.date === todayStr);
    const totalExpenses = todayExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;

    const activeTrucks = trucks.filter((t) => t.status === 'in_transit' || t.status === 'loading').length;
    const availableTrucks = trucks.filter((t) => t.status === 'available').length;
    const maintenanceTrucks = trucks.filter((t) => t.status === 'maintenance' || t.status === 'breakdown').length;

    const availableDrivers = drivers.filter((d) => d.status === 'available').length;
    const onTripDrivers = drivers.filter((d) => d.status === 'on_trip').length;
    const completedTripsCount = todayTrips.filter((t) => t.deliveryStatus === 'Completed' || t.deliveryStatus === 'Delivered').length;

    return {
      tripsCount: todayTrips.length || 24,
      totalTons: totalTons || 286,
      totalIncome: totalIncome || 485000,
      fuelLitres: fuelLitres || 420,
      fuelCost: fuelCost || 39730,
      totalExpenses: totalExpenses || 172500,
      netProfit: netProfit || 312500,
      activeTrucks,
      availableTrucks,
      maintenanceTrucks,
      availableDrivers,
      onTripDrivers,
      pendingPaymentsAmount,
      completedTripsCount,
    };
  }, [trips, fuelLogs, expenses, trucks, drivers]);

  const isTodayClosed = useMemo(() => {
    return dailyClosings.some((c) => c.date === '2026-08-28');
  }, [dailyClosings]);

  // Trip CRUD
  const addTrip = (tripData: Omit<StoneTransferTrip, 'id' | 'tripId'>) => {
    const nextIndex = trips.length + 900;
    const newTrip: StoneTransferTrip = {
      ...tripData,
      id: `trp_${Date.now()}`,
      tripId: `TRP-2026-0${nextIndex}`,
    };
    setTrips((prev) => [newTrip, ...prev]);

    // Update customer revenue and pending
    setCustomers((prevCusts) =>
      prevCusts.map((c) => {
        if (c.id === newTrip.customerId) {
          return {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalTons: c.totalTons + newTrip.totalTons,
            totalRevenue: c.totalRevenue + newTrip.totalAmount,
            totalPaid: c.totalPaid + newTrip.paidAmount,
            pendingBalance: c.pendingBalance + newTrip.balanceAmount,
          };
        }
        return c;
      })
    );

    // Update truck stats
    setTrucks((prevTrucks) =>
      prevTrucks.map((t) => {
        if (t.id === newTrip.truckId) {
          return {
            ...t,
            totalTrips: t.totalTrips + 1,
            totalTons: t.totalTons + newTrip.totalTons,
            revenueGenerated: t.revenueGenerated + newTrip.totalAmount,
            status: newTrip.deliveryStatus === 'Completed' ? 'available' : 'in_transit',
            destination: newTrip.destination,
          };
        }
        return t;
      })
    );

    // Update driver stats
    setDrivers((prevDrivers) =>
      prevDrivers.map((d) => {
        if (d.id === newTrip.driverId) {
          return {
            ...d,
            totalTrips: d.totalTrips + 1,
            totalTons: d.totalTons + newTrip.totalTons,
            status: newTrip.deliveryStatus === 'Completed' ? 'available' : 'on_trip',
          };
        }
        return d;
      })
    );

    return newTrip;
  };

  const updateTrip = (id: string, updatedFields: Partial<StoneTransferTrip>) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, ...updatedFields };
        }
        return t;
      })
    );
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  // Truck CRUD
  const addTruck = (truckData: Omit<Truck, 'id'>) => {
    const newTruck: Truck = {
      ...truckData,
      id: `trk_${Date.now()}`,
    };
    setTrucks((prev) => [newTruck, ...prev]);
    return newTruck;
  };

  const updateTruck = (id: string, updatedFields: Partial<Truck>) => {
    setTrucks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, ...updatedFields };
        }
        return t;
      })
    );
  };

  const deleteTruck = (id: string) => {
    setTrucks((prev) => prev.filter((t) => t.id !== id));
  };

  // Driver CRUD
  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `drv_${Date.now()}`,
    };
    setDrivers((prev) => [newDriver, ...prev]);
    return newDriver;
  };

  const updateDriver = (id: string, updatedFields: Partial<Driver>) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, ...updatedFields };
        }
        return d;
      })
    );
  };

  const deleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  const settleDriverAdvance = (driverId: string, amount: number) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const newAdvance = Math.max(0, d.advanceTaken - amount);
          const newBalance = d.monthlySalary - newAdvance;
          return {
            ...d,
            advanceTaken: newAdvance,
            balancePayable: newBalance,
          };
        }
        return d;
      })
    );
  };

  // Fuel CRUD
  const addFuelLog = (logData: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = {
      ...logData,
      id: `fl_${Date.now()}`,
    };
    setFuelLogs((prev) => [newLog, ...prev]);

    // Also record an expense under Fuel
    const expenseRec: ExpenseRecord = {
      id: `exp_${Date.now()}`,
      date: newLog.date,
      category: 'Fuel',
      truckId: newLog.truckId,
      truckNumber: newLog.truckNumber,
      driverId: newLog.driverId,
      driverName: newLog.driverName,
      description: `Fuel: ${newLog.litres}L @ ${newLog.fuelStation}`,
      amount: newLog.totalCost,
      paymentMethod: 'Company Card',
      receiptNumber: newLog.receiptNumber,
    };
    setExpenses((prev) => [expenseRec, ...prev]);

    // Update truck fuel stats
    setTrucks((prev) =>
      prev.map((t) => {
        if (t.id === newLog.truckId) {
          return {
            ...t,
            fuelUsedLitres: t.fuelUsedLitres + newLog.litres,
            fuelCost: t.fuelCost + newLog.totalCost,
            currentFuelPercent: 95,
          };
        }
        return t;
      })
    );

    return newLog;
  };

  const updateFuelLog = (id: string, updatedFields: Partial<FuelLog>) => {
    setFuelLogs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    );
  };

  const deleteFuelLog = (id: string) => {
    setFuelLogs((prev) => prev.filter((f) => f.id !== id));
  };

  // Expense CRUD
  const addExpense = (expenseData: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = {
      ...expenseData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
    return newExp;
  };

  const updateExpense = (id: string, updatedFields: Partial<ExpenseRecord>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Customer CRUD
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdDate'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updatedFields: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Invoice CRUD
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const nextInvNum = `GTP/INV/2026/0${invoices.length + 415}`;
    const newInv: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      invoiceNumber: nextInvNum,
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updatedFields } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  // Maintenance CRUD
  const addMaintenance = (recordData: Omit<MaintenanceRecord, 'id'>) => {
    const newMnt: MaintenanceRecord = {
      ...recordData,
      id: `mnt_${Date.now()}`,
    };
    setMaintenanceRecords((prev) => [newMnt, ...prev]);

    // Record maintenance expense
    addExpense({
      date: newMnt.serviceDate,
      category: 'Maintenance',
      truckId: newMnt.truckId,
      truckNumber: newMnt.truckNumber,
      description: `${newMnt.serviceType}: ${newMnt.partsReplaced}`,
      amount: newMnt.cost,
      paymentMethod: 'NEFT/RTGS',
    });

    // Update truck maintenance cost & status
    setTrucks((prev) =>
      prev.map((t) => {
        if (t.id === newMnt.truckId) {
          return {
            ...t,
            maintenanceCost: t.maintenanceCost + newMnt.cost,
            status: newMnt.status === 'Completed' ? 'available' : 'maintenance',
          };
        }
        return t;
      })
    );

    return newMnt;
  };

  const updateMaintenance = (id: string, updatedFields: Partial<MaintenanceRecord>) => {
    setMaintenanceRecords((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  const deleteMaintenance = (id: string) => {
    setMaintenanceRecords((prev) => prev.filter((m) => m.id !== id));
  };

  // POD CRUD
  const addPod = (podData: Omit<ProofOfDelivery, 'id'>) => {
    const newPod: ProofOfDelivery = {
      ...podData,
      id: `pod_${Date.now()}`,
    };
    setPods((prev) => [newPod, ...prev]);

    // Update trip delivery status to Delivered
    if (newPod.tripId) {
      updateTrip(newPod.tripId, {
        deliveryStatus: 'Delivered',
        podId: newPod.id,
      });
    }

    return newPod;
  };

  const updatePod = (id: string, updatedFields: Partial<ProofOfDelivery>) => {
    setPods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  // Close today's accounts
  const closeTodayAccounts = (notes?: string) => {
    const newClosing: DailyClosingRecord = {
      id: `dc_${Date.now()}`,
      date: '2026-08-28',
      closedAt: new Date().toISOString(),
      closedBy: `${currentUser?.name || 'Admin'} (${currentUser?.role || 'admin'})`,
      totalTrips: todayStats.tripsCount,
      totalTons: todayStats.totalTons,
      totalIncome: todayStats.totalIncome,
      fuelCost: todayStats.fuelCost,
      driverCost: 12500,
      otherExpenses: todayStats.totalExpenses - todayStats.fuelCost - 12500,
      totalExpenses: todayStats.totalExpenses,
      netProfit: todayStats.netProfit,
      pendingPayments: todayStats.pendingPaymentsAmount,
      cashInHand: 42000,
      bankSettlements: todayStats.totalIncome - todayStats.pendingPaymentsAmount - 42000,
      closingNotes: notes || 'Day closed successfully. All quarry dockets and weighbridge slips verified.',
      status: 'Closed',
    };

    setDailyClosings((prev) => [newClosing, ...prev]);

    // Add alert
    addAlert({
      title: "Daily Accounts Successfully Closed",
      description: `EOD closed: 286 Tons, Net Profit ₹3,12,500 recorded. Accounts locked for 28-Aug-2026.`,
      category: 'system',
      severity: 'success',
      actionUrl: '/daily-closing',
    });

    return newClosing;
  };

  // Targets
  const updateTargets = (newTargets: Partial<BusinessTarget>) => {
    setTargets((prev) => ({ ...prev, ...newTargets }));
  };

  // Alerts
  const markAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const addAlert = (alertData: Omit<SmartAlert, 'id' | 'timestamp' | 'read'>) => {
    const newAlt: SmartAlert = {
      ...alertData,
      id: `alt_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setAlerts((prev) => [newAlt, ...prev]);
  };

  // Reset demo data
  const resetAllDataToDefault = () => {
    localStorage.clear();
    setTrucks(INITIAL_TRUCKS);
    setDrivers(INITIAL_DRIVERS);
    setTrips(INITIAL_TRIPS);
    setFuelLogs(INITIAL_FUEL_LOGS);
    setExpenses(INITIAL_EXPENSES);
    setCustomers(INITIAL_CUSTOMERS);
    setInvoices(INITIAL_INVOICES);
    setMaintenanceRecords(INITIAL_MAINTENANCE);
    setPods(INITIAL_PODS);
    setAlerts(INITIAL_ALERTS);
    setDailyClosings(INITIAL_DAILY_CLOSINGS);
    setTargets(INITIAL_TARGETS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        isDemoMode,
        loginAs,
        logout,
        setDemoMode: setIsDemoMode,
        isDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        trucks,
        drivers,
        trips,
        fuelLogs,
        expenses,
        customers,
        invoices,
        maintenanceRecords,
        pods,
        alerts,
        dailyClosings,
        targets,
        routes,
        graniteStock,
        addTrip,
        updateTrip,
        deleteTrip,
        addTruck,
        updateTruck,
        deleteTruck,
        addDriver,
        updateDriver,
        deleteDriver,
        settleDriverAdvance,
        addFuelLog,
        updateFuelLog,
        deleteFuelLog,
        addExpense,
        updateExpense,
        deleteExpense,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addMaintenance,
        updateMaintenance,
        deleteMaintenance,
        addPod,
        updatePod,
        closeTodayAccounts,
        isTodayClosed,
        updateTargets,
        markAlertAsRead,
        clearAllAlerts,
        addAlert,
        isGpsSimulating,
        toggleGpsSimulation,
        todayStats,
        resetAllDataToDefault,
        isSearchOpen,
        setIsSearchOpen,
        activeModal,
        setActiveModal,
        modalData,
        setModalData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
