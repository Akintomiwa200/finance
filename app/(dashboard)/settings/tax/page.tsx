"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Shield,
  Calculator,
  Landmark,
  Percent,
  DollarSign,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  Receipt,
} from "lucide-react";

// Types
interface TaxBracket {
  id: number;
  name: string;
  type: "paye" | "vat" | "withholding" | "other";
  rate: number;
  minThreshold: number;
  maxThreshold: number;
  description: string;
  status: "active" | "inactive";
  effectiveDate: string;
  expiryDate?: string;
}

interface StatutoryDeduction {
  id: number;
  name: string;
  type:
    | "pension_employee"
    | "pension_employer"
    | "nhf"
    | "nsitf"
    | "itf"
    | "other";
  rate: number;
  rateType: "percentage" | "fixed";
  baseAmount: "basic_salary" | "gross_salary" | "net_salary";
  description: string;
  status: "active" | "inactive";
}

interface FiscalYearConfig {
  id: number;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  status: "active" | "closed" | "planned";
  taxYear: string;
  isCurrent: boolean;
}

interface TaxConfig {
  organizationName: string;
  taxIdNumber: string;
  vatRegistrationNumber: string;
  pensionPin: string;
  taxOffice: string;
  currency: string;
}

// Initial Data
const initialBrackets: TaxBracket[] = [
  {
    id: 1,
    name: "PAYE Basic Rate",
    type: "paye",
    rate: 7.5,
    minThreshold: 0,
    maxThreshold: 300000,
    description: "First ₦300,000 of annual taxable income",
    status: "active",
    effectiveDate: "2025-01-01",
  },
  {
    id: 2,
    name: "PAYE Mid Rate",
    type: "paye",
    rate: 15,
    minThreshold: 300001,
    maxThreshold: 600000,
    description: "Next ₦300,000 of annual taxable income",
    status: "active",
    effectiveDate: "2025-01-01",
  },
  {
    id: 3,
    name: "PAYE High Rate",
    type: "paye",
    rate: 21,
    minThreshold: 600001,
    maxThreshold: 1100000,
    description: "Next ₦500,000 of annual taxable income",
    status: "active",
    effectiveDate: "2025-01-01",
  },
  {
    id: 4,
    name: "PAYE Top Rate",
    type: "paye",
    rate: 24,
    minThreshold: 1100001,
    maxThreshold: 5000000,
    description: "Above ₦1,100,000 of annual taxable income",
    status: "active",
    effectiveDate: "2025-01-01",
  },
  {
    id: 5,
    name: "VAT Standard Rate",
    type: "vat",
    rate: 7.5,
    minThreshold: 0,
    maxThreshold: 0,
    description:
      "Standard VAT rate applicable to all taxable goods and services",
    status: "active",
    effectiveDate: "2020-02-01",
  },
  {
    id: 6,
    name: "Withholding Tax - Professional Services",
    type: "withholding",
    rate: 10,
    minThreshold: 0,
    maxThreshold: 0,
    description: "WHT on professional and consultancy services",
    status: "active",
    effectiveDate: "2025-01-01",
  },
  {
    id: 7,
    name: "Withholding Tax - Rent",
    type: "withholding",
    rate: 10,
    minThreshold: 0,
    maxThreshold: 0,
    description: "WHT on rent and lease payments",
    status: "active",
    effectiveDate: "2025-01-01",
  },
  {
    id: 8,
    name: "Withholding Tax - Dividends",
    type: "withholding",
    rate: 10,
    minThreshold: 0,
    maxThreshold: 0,
    description: "WHT on dividend payments",
    status: "active",
    effectiveDate: "2025-01-01",
  },
  {
    id: 9,
    name: "PAYE Legacy Rate",
    type: "paye",
    rate: 19,
    minThreshold: 600001,
    maxThreshold: 1100000,
    description: "Previous PAYE high rate (expired)",
    status: "inactive",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
  },
];

const initialDeductions: StatutoryDeduction[] = [
  {
    id: 1,
    name: "Employee Pension Contribution",
    type: "pension_employee",
    rate: 8,
    rateType: "percentage",
    baseAmount: "basic_salary",
    description:
      "Mandatory employee pension contribution as per Pension Reform Act",
    status: "active",
  },
  {
    id: 2,
    name: "Employer Pension Contribution",
    type: "pension_employer",
    rate: 10,
    rateType: "percentage",
    baseAmount: "basic_salary",
    description:
      "Mandatory employer pension contribution as per Pension Reform Act",
    status: "active",
  },
  {
    id: 3,
    name: "National Housing Fund (NHF)",
    type: "nhf",
    rate: 2.5,
    rateType: "percentage",
    baseAmount: "basic_salary",
    description: "Mandatory contribution to the National Housing Fund",
    status: "active",
  },
  {
    id: 4,
    name: "NSITF Contribution",
    type: "nsitf",
    rate: 1,
    rateType: "percentage",
    baseAmount: "gross_salary",
    description: "Nigeria Social Insurance Trust Fund employer contribution",
    status: "active",
  },
  {
    id: 5,
    name: "Industrial Training Fund (ITF)",
    type: "itf",
    rate: 1,
    rateType: "percentage",
    baseAmount: "gross_salary",
    description: "ITF contribution for employee training and development",
    status: "active",
  },
];

const initialFiscalYears: FiscalYearConfig[] = [
  {
    id: 1,
    fiscalYear: "FY 2024",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "closed",
    taxYear: "2024",
    isCurrent: false,
  },
  {
    id: 2,
    fiscalYear: "FY 2025",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "closed",
    taxYear: "2025",
    isCurrent: false,
  },
  {
    id: 3,
    fiscalYear: "FY 2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "active",
    taxYear: "2026",
    isCurrent: true,
  },
  {
    id: 4,
    fiscalYear: "FY 2027",
    startDate: "2027-01-01",
    endDate: "2027-12-31",
    status: "planned",
    taxYear: "2027",
    isCurrent: false,
  },
];

const initialTaxConfig: TaxConfig = {
  organizationName: "Acme Corporation Ltd",
  taxIdNumber: "TIN-12345678-0001",
  vatRegistrationNumber: "VAT-98765432-0001",
  pensionPin: "PEN-11223344",
  taxOffice: "Lagos Island Tax Office",
  currency: "NGN",
};

const taxTypes = [
  { value: "paye", label: "PAYE" },
  { value: "vat", label: "VAT" },
  { value: "withholding", label: "Withholding Tax" },
  { value: "other", label: "Other" },
];

const deductionTypes = [
  { value: "pension_employee", label: "Employee Pension" },
  { value: "pension_employer", label: "Employer Pension" },
  { value: "nhf", label: "NHF" },
  { value: "nsitf", label: "NSITF" },
  { value: "itf", label: "ITF" },
  { value: "other", label: "Other" },
];

const baseAmountTypes = [
  { value: "basic_salary", label: "Basic Salary" },
  { value: "gross_salary", label: "Gross Salary" },
  { value: "net_salary", label: "Net Salary" },
];

export default function TaxSettingsPage() {
  // State
  const [brackets, setBrackets] = useState<TaxBracket[]>(initialBrackets);
  const [deductions, setDeductions] =
    useState<StatutoryDeduction[]>(initialDeductions);
  const [fiscalYears, setFiscalYears] =
    useState<FiscalYearConfig[]>(initialFiscalYears);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(initialTaxConfig);
  const [activeTab, setActiveTab] = useState("brackets");
  const [saveMessage, setSaveMessage] = useState("");

  // Bracket Modal State
  const [isBracketModalOpen, setIsBracketModalOpen] = useState(false);
  const [editingBracket, setEditingBracket] = useState<TaxBracket | null>(null);
  const [bracketForm, setBracketForm] = useState<Partial<TaxBracket>>({
    name: "",
    type: "paye",
    rate: 0,
    minThreshold: 0,
    maxThreshold: 0,
    description: "",
    status: "active",
    effectiveDate: new Date().toISOString().split("T")[0],
  });
  const [isDeleteBracketOpen, setIsDeleteBracketOpen] = useState(false);
  const [deletingBracketId, setDeletingBracketId] = useState<number | null>(
    null,
  );

  // Deduction Modal State
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [editingDeduction, setEditingDeduction] =
    useState<StatutoryDeduction | null>(null);
  const [deductionForm, setDeductionForm] = useState<
    Partial<StatutoryDeduction>
  >({
    name: "",
    type: "pension_employee",
    rate: 0,
    rateType: "percentage",
    baseAmount: "basic_salary",
    description: "",
    status: "active",
  });
  const [isDeleteDeductionOpen, setIsDeleteDeductionOpen] = useState(false);
  const [deletingDeductionId, setDeletingDeductionId] = useState<number | null>(
    null,
  );

  // Fiscal Year Modal State
  const [isFiscalYearModalOpen, setIsFiscalYearModalOpen] = useState(false);
  const [editingFiscalYear, setEditingFiscalYear] =
    useState<FiscalYearConfig | null>(null);
  const [fiscalYearForm, setFiscalYearForm] = useState<
    Partial<FiscalYearConfig>
  >({
    fiscalYear: "",
    startDate: "",
    endDate: "",
    status: "planned",
    taxYear: "",
    isCurrent: false,
  });

  // Handlers - Brackets
  const openAddBracket = () => {
    setEditingBracket(null);
    setBracketForm({
      name: "",
      type: "paye",
      rate: 0,
      minThreshold: 0,
      maxThreshold: 0,
      description: "",
      status: "active",
      effectiveDate: new Date().toISOString().split("T")[0],
    });
    setIsBracketModalOpen(true);
  };

  const openEditBracket = (bracket: TaxBracket) => {
    setEditingBracket(bracket);
    setBracketForm({ ...bracket });
    setIsBracketModalOpen(true);
  };

  const handleSaveBracket = () => {
    if (!bracketForm.name || bracketForm.rate === undefined) return;

    if (editingBracket) {
      setBrackets((prev) =>
        prev.map((b) =>
          b.id === editingBracket.id
            ? ({ ...b, ...bracketForm } as TaxBracket)
            : b,
        ),
      );
    } else {
      const newBracket: TaxBracket = {
        id: Math.max(...brackets.map((b) => b.id), 0) + 1,
        ...bracketForm,
      } as TaxBracket;
      setBrackets((prev) => [...prev, newBracket]);
    }

    setIsBracketModalOpen(false);
    showSaveMessage("Tax bracket saved successfully!");
  };

  const handleDeleteBracket = () => {
    if (deletingBracketId === null) return;
    setBrackets((prev) => prev.filter((b) => b.id !== deletingBracketId));
    setIsDeleteBracketOpen(false);
    setDeletingBracketId(null);
    showSaveMessage("Tax bracket deleted successfully!");
  };

  // Handlers - Deductions
  const openAddDeduction = () => {
    setEditingDeduction(null);
    setDeductionForm({
      name: "",
      type: "pension_employee",
      rate: 0,
      rateType: "percentage",
      baseAmount: "basic_salary",
      description: "",
      status: "active",
    });
    setIsDeductionModalOpen(true);
  };

  const openEditDeduction = (deduction: StatutoryDeduction) => {
    setEditingDeduction(deduction);
    setDeductionForm({ ...deduction });
    setIsDeductionModalOpen(true);
  };

  const handleSaveDeduction = () => {
    if (!deductionForm.name || deductionForm.rate === undefined) return;

    if (editingDeduction) {
      setDeductions((prev) =>
        prev.map((d) =>
          d.id === editingDeduction.id
            ? ({ ...d, ...deductionForm } as StatutoryDeduction)
            : d,
        ),
      );
    } else {
      const newDeduction: StatutoryDeduction = {
        id: Math.max(...deductions.map((d) => d.id), 0) + 1,
        ...deductionForm,
      } as StatutoryDeduction;
      setDeductions((prev) => [...prev, newDeduction]);
    }

    setIsDeductionModalOpen(false);
    showSaveMessage("Statutory deduction saved successfully!");
  };

  const handleDeleteDeduction = () => {
    if (deletingDeductionId === null) return;
    setDeductions((prev) => prev.filter((d) => d.id !== deletingDeductionId));
    setIsDeleteDeductionOpen(false);
    setDeletingDeductionId(null);
    showSaveMessage("Statutory deduction deleted successfully!");
  };

  // Handlers - Fiscal Years
  const openAddFiscalYear = () => {
    setEditingFiscalYear(null);
    setFiscalYearForm({
      fiscalYear: "",
      startDate: "",
      endDate: "",
      status: "planned",
      taxYear: "",
      isCurrent: false,
    });
    setIsFiscalYearModalOpen(true);
  };

  const handleSaveFiscalYear = () => {
    if (
      !fiscalYearForm.fiscalYear ||
      !fiscalYearForm.startDate ||
      !fiscalYearForm.endDate
    )
      return;

    if (editingFiscalYear) {
      setFiscalYears((prev) =>
        prev.map((f) =>
          f.id === editingFiscalYear.id
            ? ({ ...f, ...fiscalYearForm } as FiscalYearConfig)
            : f,
        ),
      );
    } else {
      const newFiscalYear: FiscalYearConfig = {
        id: Math.max(...fiscalYears.map((f) => f.id), 0) + 1,
        ...fiscalYearForm,
      } as FiscalYearConfig;
      setFiscalYears((prev) => [...prev, newFiscalYear]);
    }

    setIsFiscalYearModalOpen(false);
    showSaveMessage("Fiscal year saved successfully!");
  };

  const handleSetCurrentFiscalYear = (id: number) => {
    setFiscalYears((prev) =>
      prev.map((f) => ({
        ...f,
        isCurrent: f.id === id,
        status: f.id === id ? ("active" as const) : f.status,
      })),
    );
    showSaveMessage("Current fiscal year updated!");
  };

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-600">
            <Clock className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case "closed":
        return <Badge className="bg-gray-200 text-gray-700">Closed</Badge>;
      case "planned":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Calendar className="h-3 w-3 mr-1" />
            Planned
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      paye: "bg-blue-100 text-blue-700",
      vat: "bg-green-100 text-green-700",
      withholding: "bg-orange-100 text-orange-700",
      other: "bg-purple-100 text-purple-700",
    };
    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-700"}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Tax Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure tax brackets, rates, and thresholds
          </p>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          {saveMessage}
        </div>
      )}

      {/* Organization Tax Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Tax Information
          </CardTitle>
          <CardDescription>
            Basic tax registration details for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Organization Name</Label>
              <Input
                value={taxConfig.organizationName}
                onChange={(e) =>
                  setTaxConfig({
                    ...taxConfig,
                    organizationName: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">
                Tax ID Number (TIN)
              </Label>
              <Input
                value={taxConfig.taxIdNumber}
                onChange={(e) =>
                  setTaxConfig({ ...taxConfig, taxIdNumber: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">
                VAT Registration Number
              </Label>
              <Input
                value={taxConfig.vatRegistrationNumber}
                onChange={(e) =>
                  setTaxConfig({
                    ...taxConfig,
                    vatRegistrationNumber: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Pension PIN</Label>
              <Input
                value={taxConfig.pensionPin}
                onChange={(e) =>
                  setTaxConfig({ ...taxConfig, pensionPin: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Tax Office</Label>
              <Input
                value={taxConfig.taxOffice}
                onChange={(e) =>
                  setTaxConfig({ ...taxConfig, taxOffice: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Currency</Label>
              <Select
                value={taxConfig.currency}
                onValueChange={(v) =>
                  setTaxConfig({ ...taxConfig, currency: v })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={() =>
                showSaveMessage("Organization tax information saved!")
              }
            >
              <Save className="h-4 w-4 mr-2" />
              Save Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="brackets">
            <Percent className="h-4 w-4 mr-2" />
            Tax Brackets
          </TabsTrigger>
          <TabsTrigger value="deductions">
            <Shield className="h-4 w-4 mr-2" />
            Statutory Deductions
          </TabsTrigger>
          <TabsTrigger value="fiscal-years">
            <Calendar className="h-4 w-4 mr-2" />
            Fiscal Years
          </TabsTrigger>
        </TabsList>

        {/* Tax Brackets Tab */}
        <TabsContent value="brackets" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button onClick={openAddBracket}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Bracket
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Brackets</CardTitle>
              <CardDescription>
                Progressive tax brackets for PAYE, VAT, and withholding tax
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Min Threshold</TableHead>
                      <TableHead>Max Threshold</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brackets.map((bracket) => (
                      <TableRow key={bracket.id}>
                        <TableCell className="font-medium">
                          {bracket.name}
                        </TableCell>
                        <TableCell>{getTypeBadge(bracket.type)}</TableCell>
                        <TableCell className="font-bold">
                          {bracket.rate}%
                        </TableCell>
                        <TableCell>
                          {bracket.minThreshold > 0
                            ? formatCurrency(bracket.minThreshold)
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {bracket.maxThreshold > 0
                            ? formatCurrency(bracket.maxThreshold)
                            : "Unlimited"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(bracket.effectiveDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {bracket.expiryDate
                            ? new Date(bracket.expiryDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(bracket.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditBracket(bracket)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => {
                                setDeletingBracketId(bracket.id);
                                setIsDeleteBracketOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* PAYE Summary */}
              {brackets.filter(
                (b) => b.type === "paye" && b.status === "active",
              ).length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    PAYE Quick Reference
                  </p>
                  <div className="space-y-1 text-sm text-blue-800">
                    {brackets
                      .filter((b) => b.type === "paye" && b.status === "active")
                      .sort((a, b) => a.minThreshold - b.minThreshold)
                      .map((b, i) => (
                        <div key={b.id} className="flex justify-between">
                          <span>
                            {b.minThreshold === 0 ? "First" : "Next"}{" "}
                            {b.maxThreshold > 0
                              ? formatCurrency(
                                  b.maxThreshold - b.minThreshold + 1,
                                )
                              : "Balance"}
                            :
                          </span>
                          <span className="font-bold">{b.rate}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statutory Deductions Tab */}
        <TabsContent value="deductions" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button onClick={openAddDeduction}>
              <Plus className="h-4 w-4 mr-2" />
              Add Statutory Deduction
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statutory Deductions</CardTitle>
              <CardDescription>
                Mandatory contributions and deductions as per Nigerian law
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Rate Type</TableHead>
                      <TableHead>Base Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deductions.map((deduction) => (
                      <TableRow key={deduction.id}>
                        <TableCell className="font-medium">
                          {deduction.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {deductionTypes.find(
                              (t) => t.value === deduction.type,
                            )?.label || deduction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {deduction.rateType === "percentage"
                            ? `${deduction.rate}%`
                            : formatCurrency(deduction.rate)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {deduction.rateType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {baseAmountTypes.find(
                              (b) => b.value === deduction.baseAmount,
                            )?.label || deduction.baseAmount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                          {deduction.description}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(deduction.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDeduction(deduction)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => {
                                setDeletingDeductionId(deduction.id);
                                setIsDeleteDeductionOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total Deduction Summary */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900 mb-2">
                  Total Statutory Deductions Summary
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-purple-800">
                    <span>Total Employee Deductions:</span>
                    <span className="font-bold">
                      {deductions
                        .filter(
                          (d) =>
                            ["pension_employee", "nhf"].includes(d.type) &&
                            d.status === "active",
                        )
                        .reduce((sum, d) => sum + d.rate, 0)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between text-purple-800">
                    <span>Total Employer Contributions:</span>
                    <span className="font-bold">
                      {deductions
                        .filter(
                          (d) =>
                            ["pension_employer", "nsitf", "itf"].includes(
                              d.type,
                            ) && d.status === "active",
                        )
                        .reduce((sum, d) => sum + d.rate, 0)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fiscal Years Tab */}
        <TabsContent value="fiscal-years" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button onClick={openAddFiscalYear}>
              <Plus className="h-4 w-4 mr-2" />
              Add Fiscal Year
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fiscal Years</CardTitle>
              <CardDescription>
                Configure fiscal years for tax reporting and financial periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fiscalYears.map((fy) => (
                  <Card
                    key={fy.id}
                    className={`hover:shadow-md transition-shadow ${fy.isCurrent ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {fy.fiscalYear}
                        </CardTitle>
                        {fy.isCurrent && (
                          <Badge className="bg-blue-100 text-blue-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Current
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Period:</span>
                        <span className="font-medium">
                          {new Date(fy.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(fy.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax Year:</span>
                        <span className="font-medium">{fy.taxYear}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(fy.status)}
                      </div>
                      {!fy.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleSetCurrentFiscalYear(fy.id)}
                        >
                          Set as Current
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bracket Modal */}
      <Dialog open={isBracketModalOpen} onOpenChange={setIsBracketModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBracket ? "Edit Tax Bracket" : "Add Tax Bracket"}
            </DialogTitle>
            <DialogDescription>
              Configure tax bracket rates and thresholds.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Bracket Name *</Label>
              <Input
                value={bracketForm.name || ""}
                onChange={(e) =>
                  setBracketForm({ ...bracketForm, name: e.target.value })
                }
                placeholder="e.g., PAYE Basic Rate"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={bracketForm.type || "paye"}
                  onValueChange={(v) =>
                    setBracketForm({
                      ...bracketForm,
                      type: v as TaxBracket["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taxTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rate (%) *</Label>
                <Input
                  type="number"
                  value={bracketForm.rate || ""}
                  onChange={(e) =>
                    setBracketForm({
                      ...bracketForm,
                      rate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="7.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Threshold (₦)</Label>
                <Input
                  type="number"
                  value={bracketForm.minThreshold || ""}
                  onChange={(e) =>
                    setBracketForm({
                      ...bracketForm,
                      minThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Threshold (₦)</Label>
                <Input
                  type="number"
                  value={bracketForm.maxThreshold || ""}
                  onChange={(e) =>
                    setBracketForm({
                      ...bracketForm,
                      maxThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="300000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={bracketForm.description || ""}
                onChange={(e) =>
                  setBracketForm({
                    ...bracketForm,
                    description: e.target.value,
                  })
                }
                placeholder="Bracket description..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Effective Date *</Label>
                <Input
                  type="date"
                  value={bracketForm.effectiveDate || ""}
                  onChange={(e) =>
                    setBracketForm({
                      ...bracketForm,
                      effectiveDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={bracketForm.status || "active"}
                  onValueChange={(v) =>
                    setBracketForm({
                      ...bracketForm,
                      status: v as "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBracketModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveBracket}>
              <Save className="h-4 w-4 mr-2" />
              {editingBracket ? "Update Bracket" : "Add Bracket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deduction Modal */}
      <Dialog
        open={isDeductionModalOpen}
        onOpenChange={setIsDeductionModalOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingDeduction
                ? "Edit Statutory Deduction"
                : "Add Statutory Deduction"}
            </DialogTitle>
            <DialogDescription>
              Configure mandatory statutory deductions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Deduction Name *</Label>
              <Input
                value={deductionForm.name || ""}
                onChange={(e) =>
                  setDeductionForm({ ...deductionForm, name: e.target.value })
                }
                placeholder="e.g., Employee Pension Contribution"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={deductionForm.type || "pension_employee"}
                  onValueChange={(v) =>
                    setDeductionForm({
                      ...deductionForm,
                      type: v as StatutoryDeduction["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deductionTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rate *</Label>
                <Input
                  type="number"
                  value={deductionForm.rate || ""}
                  onChange={(e) =>
                    setDeductionForm({
                      ...deductionForm,
                      rate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rate Type</Label>
                <Select
                  value={deductionForm.rateType || "percentage"}
                  onValueChange={(v) =>
                    setDeductionForm({
                      ...deductionForm,
                      rateType: v as "percentage" | "fixed",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base Amount</Label>
                <Select
                  value={deductionForm.baseAmount || "basic_salary"}
                  onValueChange={(v) =>
                    setDeductionForm({
                      ...deductionForm,
                      baseAmount: v as StatutoryDeduction["baseAmount"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {baseAmountTypes.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={deductionForm.description || ""}
                onChange={(e) =>
                  setDeductionForm({
                    ...deductionForm,
                    description: e.target.value,
                  })
                }
                placeholder="Deduction description..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeductionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDeduction}>
              <Save className="h-4 w-4 mr-2" />
              {editingDeduction ? "Update Deduction" : "Add Deduction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bracket Confirmation */}
      <AlertDialog
        open={isDeleteBracketOpen}
        onOpenChange={setIsDeleteBracketOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tax Bracket</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete this tax bracket? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBracket}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Deduction Confirmation */}
      <AlertDialog
        open={isDeleteDeductionOpen}
        onOpenChange={setIsDeleteDeductionOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Statutory Deduction</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete this statutory deduction? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDeduction}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
