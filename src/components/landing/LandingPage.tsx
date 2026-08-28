import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  Shield,
  BarChart3,
  TrendingUp,
  MapPin,
  Fuel,
  Receipt,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  FileSpreadsheet,
  CheckSquare,
  Compass,
  PlayCircle,
  HelpCircle,
  Phone,
  Mail,
  Building,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface LandingPageProps {
  onEnterApp: () => void;
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onGoToLogin }) => {
  const { loginAs } = useApp();
  const [trucksCount, setTrucksCount] = useState<number>(10);
  const [dailyTons, setDailyTons] = useState<number>(300);

  // Quick ROI calculator
  const monthlyRevenueEst = dailyTons * 1650 * 26;
  const monthlyFuelSavedEst = trucksCount * 8500; // estimated leakage prevented
  const monthlyNetGain = (dailyTons * 450 * 26) + monthlyFuelSavedEst;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-900/40 ring-1 ring-white/20">
              🪨
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">GraniteTrack</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Granite Transportation ERP</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-white transition-colors">Business Benefits</a>
            <a href="#roi-calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              id="btn-landing-login"
              onClick={onGoToLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              id="btn-landing-demo"
              onClick={() => {
                loginAs('admin');
                onEnterApp();
              }}
              className="px-5 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Live Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Slogan Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-400" />
            "Manage Every Ton. Every Truck. Every Rupee."
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            GraniteTrack <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Pro</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl text-slate-300 font-medium max-w-3xl mx-auto">
            Complete Granite Transportation & Fleet Management Platform
          </p>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Engineered specifically for quarry owners, fleet contractors, and stone exporters across Tamil Nadu, Andhra Pradesh, Karnataka & Telangana.
          </p>

          {/* Primary CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              id="btn-hero-get-started"
              onClick={() => {
                loginAs('admin');
                onEnterApp();
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2.5 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="btn-hero-view-dashboard"
              onClick={() => {
                loginAs('admin');
                onEnterApp();
              }}
              className="px-8 py-4 bg-slate-800/90 hover:bg-slate-700 text-slate-100 text-base font-bold rounded-2xl border border-slate-700 shadow-lg transition-all flex items-center gap-2.5"
            >
              <PlayCircle className="w-5 h-5 text-blue-400" />
              View Dashboard
            </button>

            <a
              href="#features"
              className="px-6 py-4 text-slate-400 hover:text-white text-base font-semibold transition-all flex items-center gap-1.5"
            >
              Explore Features
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Live Preview Stats Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 uppercase font-semibold">Today's Granite Dispatches</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">286.0 Tons</div>
              <div className="text-xs text-emerald-400 font-medium mt-1">↑ 24 Quarry Trips Active</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 uppercase font-semibold">Today's Revenue</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1">₹4,85,000</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Stone + Haulage Charges</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 uppercase font-semibold">Fuel Tracked</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">420 Litres</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Avg 3.8 KM/L Real Mileage</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 uppercase font-semibold">Today's Net Profit</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">₹3,12,500</div>
              <div className="text-xs text-emerald-400 font-medium mt-1">Auto Deducted Fuel & Wages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Enterprise Feature Suite</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Everything Required To Run a High-Volume Granite Fleet
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Replace messy paper trip sheets, weighbridge slips, and WhatsApp calculations with an end-to-end automated platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Layers,
              title: 'Granite Transfer Management',
              desc: 'Live calculation of stone tonnage, rate per ton, loading, unloading, and transport freight for every dispatch docket.',
              color: 'text-blue-400 bg-blue-950/40 border-blue-800/40',
            },
            {
              icon: Truck,
              title: 'Fleet Management',
              desc: 'Track 10 to 16 wheeler heavy haulers, capacity, live status, insurance expiry, fitness certificates, and maintenance history.',
              color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/40',
            },
            {
              icon: Users,
              title: 'Driver Management',
              desc: 'Driver rankings, license renewal alerts, trip performance, daily batta allowances, and monthly advance settlement.',
              color: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
            },
            {
              icon: Fuel,
              title: 'Fuel Tracking & Mileage',
              desc: 'Monitor diesel fill-ups, petrol pump slips, opening/closing KM, and automatic mileage calculations (KM/L).',
              color: 'text-red-400 bg-red-950/40 border-red-800/40',
            },
            {
              icon: TrendingUp,
              title: 'Daily Accounts & P&L',
              desc: 'Real-time profit & loss generated automatically as trips and expenses are logged throughout the day.',
              color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
            },
            {
              icon: Compass,
              title: 'GPS Tracking & Waypoints',
              desc: 'Simulated real-time vehicle telemetry along NH44, Madurai Melur corridor, and Chennai Port shipping yard.',
              color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
            },
            {
              icon: Receipt,
              title: 'Invoice & GST Billing',
              desc: 'Generate professional GST tax invoices (18% GST with CGST/SGST breakdown), print waybills, and export PDF slips.',
              color: 'text-purple-400 bg-purple-950/40 border-purple-800/40',
            },
            {
              icon: FileSpreadsheet,
              title: 'Reports & EOD Closing',
              desc: 'End of Day accounts lock wizard, daily audit logs, CSV exports, and 11+ management analytical reports.',
              color: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Workflow Simplicity</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              From Quarry Pit To Client Weighbridge In 6 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { step: '01', title: 'Add Truck', desc: 'Register vehicle registration and tonnage capacity' },
              { step: '02', title: 'Assign Driver', desc: 'Attach verified driver with valid HMV license' },
              { step: '03', title: 'Create Trip', desc: 'Select quarry source, customer, and granite color' },
              { step: '04', title: 'Record Tons', desc: 'Input weighbridge gross weight and tare weight' },
              { step: '05', title: 'Track Delivery', desc: 'Monitor highway transit and digital POD sign' },
              { step: '06', title: 'Calculate Profit', desc: 'Instant automated income, fuel & net profit' },
            ].map((step, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3">
                  {step.step}
                </div>
                <h4 className="font-bold text-white text-sm">{step.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section id="benefits" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Measurable Business Impact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
              Designed Specifically To Protect Your Margins On Every Single Haul
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Transportation of massive 25-ton rough granite blocks involves heavy diesel consumption, weighbridge discrepancies, and payment delays. GraniteTrack Pro stops revenue leakages.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { title: 'Reduce Fuel Waste & Theft', desc: 'Automatic KM/L mileage cross-checks between trip distances and pump slips.' },
                { title: 'Track Every Trip in Real-Time', desc: 'Instant visibility over which truck is loading at the quarry and which is en route.' },
                { title: 'Monitor Driver Safety & Compliance', desc: 'Automatic expiry alerts for HMV licenses, pollution certificates, and fitness.' },
                { title: 'Know Daily Income Instantly', desc: 'Know exact gross collection and outstanding customer dues by 8:00 PM every evening.' },
                { title: 'Control Spare Parts & Maintenance', desc: 'Log tyre replacements, hydraulic cylinder fixes, and engine oil costs per truck.' },
                { title: 'Calculate Profit Automatically', desc: 'Zero manual spreadsheet work. Net profit calculated with live formula.' },
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive ROI Calculator */}
          <div id="roi-calculator" className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Quarry Fleet ROI Calculator</h3>
                <p className="text-xs text-slate-400">Estimate your monthly savings with automated tracking</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Live Estimation
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Number of Trucks in Fleet:</span>
                  <span className="text-blue-400 font-bold">{trucksCount} Trucks</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={trucksCount}
                  onChange={(e) => setTrucksCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Average Daily Granite Tons Hauled:</span>
                  <span className="text-blue-400 font-bold">{dailyTons} Tons / day</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={dailyTons}
                  onChange={(e) => setDailyTons(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Est. Monthly Gross Revenue:</span>
                  <span className="font-semibold text-slate-200">{formatINR(monthlyRevenueEst)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Est. Diesel Leakage Prevented:</span>
                  <span className="font-semibold text-emerald-400">{formatINR(monthlyFuelSavedEst)} / mo</span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-400">Est. Monthly Net Value Added:</div>
                    <div className="text-2xl font-black text-emerald-400">{formatINR(monthlyNetGain)}</div>
                  </div>
                  <button
                    onClick={() => {
                      loginAs('admin');
                      onEnterApp();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Try Platform Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Transparent Commercial Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Tailored For Single Quarry Operations To Multi-Pit Fleets
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Quarry Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For single quarry operators with 1-5 trucks</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-black text-white">₹4,999</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Up to 5 Trucks & Drivers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Daily Stone Transfer Logs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Basic Fuel & Mileage Tracker</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> GST Invoicing & Waybills</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  loginAs('admin');
                  onEnterApp();
                }}
                className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
              >
                Launch Starter
              </button>
            </div>

            {/* Fleet Pro */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/60 to-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-900/30 relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Most Popular for Fleets
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Fleet Pro Enterprise</h3>
                <p className="text-xs text-blue-300/80 mt-1">For quarry contractors with 6-25 heavy haulers</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-black text-white">₹12,499</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 25 Heavy Trucks & Drivers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Profit & Loss Engine</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Simulated GPS & Waypoints</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Digital Signature POD Capture</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> End of Day Settlement Wizard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Driver Mobile App Access</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  loginAs('admin');
                  onEnterApp();
                }}
                className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
              >
                Launch Enterprise Demo
              </button>
            </div>

            {/* Custom Multi-Pit */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Custom Multi-Pit</h3>
                <p className="text-xs text-slate-400 mt-1">For stone export conglomerates & port yards</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-black text-white">₹24,999</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Unlimited Trucks, Drivers & Pits</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Custom Telematics & Weighbridge API</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Multi-Branch Audit & GST Filing</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  loginAs('admin');
                  onEnterApp();
                }}
                className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                🪨
              </div>
              <span className="font-extrabold text-base text-white">GraniteTrack Pro</span>
            </div>
            <p className="leading-relaxed">
              "Manage Every Ton. Every Truck. Every Rupee." Commercial SaaS solution built for modern granite logistics & fleet operations.
            </p>
            <p className="mt-4 text-[11px] text-slate-500">
              Active across Hosur, Madurai, Salem, Chimakurthy, Karimnagar, Bengaluru, and Chennai.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] mb-3">Platform Modules</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white">Daily Stone Transfer</a></li>
              <li><a href="#features" className="hover:text-white">Live Fleet GPS Tracking</a></li>
              <li><a href="#features" className="hover:text-white">Daily Accounts & P&L</a></li>
              <li><a href="#features" className="hover:text-white">Driver Performance & Batta</a></li>
              <li><a href="#features" className="hover:text-white">GST Invoicing & Reports</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { loginAs('admin'); onEnterApp(); }} className="hover:text-white text-left">
                  Admin Portal (Director)
                </button>
              </li>
              <li>
                <button onClick={() => { loginAs('manager'); onEnterApp(); }} className="hover:text-white text-left">
                  Manager Portal (Operations)
                </button>
              </li>
              <li>
                <button onClick={() => { loginAs('driver'); onEnterApp(); }} className="hover:text-white text-left">
                  Driver Mobile Interface
                </button>
              </li>
              <li><a href="#roi-calculator" className="hover:text-white">Fleet ROI Calculator</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] mb-3">Support & HQ</h4>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-400" /> +91 98421 88390 / +91 4344 268900</p>
            <p className="flex items-center gap-2 mt-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> support@granitepro.com</p>
            <p className="flex items-center gap-2 mt-2"><Building className="w-3.5 h-3.5 text-blue-400" /> Plot 48, SIPCOT Phase II, Hosur, Tamil Nadu 635126</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GraniteTrack Pro Logistics Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">GST Compliance</a>
            <a href="#" className="hover:text-white">Security Architecture</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
