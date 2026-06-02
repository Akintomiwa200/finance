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
import { Progress } from "@/src/components/ui/progress";
import {
  Bell,
  Mail,
  Smartphone,
  Megaphone,
  Save,
  Send,
  Plus,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Server,
  Key,
  Shield,
  Users,
  RotateCcw,
  TestTube,
  Activity,
  Calendar,
  DollarSign,
  FileText,
  Receipt,
  Banknote,
  TrendingUp,
} from "lucide-react";

// Types
interface NotificationSetting {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
  push: boolean;
  roles: string[];
  frequency: "instant" | "daily" | "weekly";
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: string;
  lastModified: string;
  status: "active" | "inactive";
}

interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: "tls" | "ssl" | "none";
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

interface NotificationLog {
  id: number;
  type: string;
  recipient: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  timestamp: string;
  channel: "email" | "in-app" | "push";
}

// Initial Data
const initialSettings: NotificationSetting[] = [
  {
    id: "payroll-completed",
    category: "Payroll",
    label: "Payroll Run Completed",
    description: "Notify when a payroll run is processed and ready for review",
    email: true,
    inApp: true,
    push: false,
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE_MANAGER", "PAYROLL_OFFICER"],
    frequency: "instant",
  },
  {
    id: "payroll-approved",
    category: "Payroll",
    label: "Payroll Approval Required",
    description: "Notify when a payroll run needs your approval",
    email: true,
    inApp: true,
    push: true,
    roles: ["FINANCE_MANAGER", "DEPARTMENT_HEAD"],
    frequency: "instant",
  },
  {
    id: "expense-submitted",
    category: "Expenses",
    label: "Expense Report Submitted",
    description: "Notify when an employee submits an expense report",
    email: true,
    inApp: true,
    push: false,
    roles: ["FINANCE_MANAGER", "DEPARTMENT_HEAD", "AUDITOR"],
    frequency: "instant",
  },
  {
    id: "expense-approved",
    category: "Expenses",
    label: "Expense Report Approved/Rejected",
    description: "Notify when your expense report is approved or rejected",
    email: true,
    inApp: true,
    push: false,
    roles: ["EMPLOYEE"],
    frequency: "instant",
  },
  {
    id: "approval-required",
    category: "Approvals",
    label: "Approval Request",
    description: "Notify when your approval is required for any request",
    email: true,
    inApp: true,
    push: true,
    roles: ["FINANCE_MANAGER", "DEPARTMENT_HEAD", "ADMIN"],
    frequency: "instant",
  },
  {
    id: "invoice-overdue",
    category: "Invoices",
    label: "Invoice Overdue",
    description: "Notify when a customer invoice becomes overdue",
    email: true,
    inApp: true,
    push: false,
    roles: ["FINANCE_MANAGER", "ACCOUNTANT_RECEIVABLE", "ADMIN"],
    frequency: "daily",
  },
  {
    id: "invoice-payment-received",
    category: "Invoices",
    label: "Payment Received",
    description: "Notify when a customer payment is recorded",
    email: true,
    inApp: true,
    push: false,
    roles: ["FINANCE_MANAGER", "ACCOUNTANT_RECEIVABLE"],
    frequency: "instant",
  },
  {
    id: "budget-threshold",
    category: "Budget",
    label: "Budget Threshold Reached",
    description: "Notify when a department budget exceeds 80% utilization",
    email: true,
    inApp: true,
    push: true,
    roles: ["FINANCE_MANAGER", "BUDGET_ANALYST", "DEPARTMENT_HEAD", "ADMIN"],
    frequency: "instant",
  },
  {
    id: "budget-exceeded",
    category: "Budget",
    label: "Budget Exceeded",
    description: "Notify when a department exceeds its allocated budget",
    email: true,
    inApp: true,
    push: true,
    roles: ["FINANCE_MANAGER", "BUDGET_ANALYST", "DEPARTMENT_HEAD", "ADMIN"],
    frequency: "instant",
  },
  {
    id: "loan-application",
    category: "Loans",
    label: "New Loan Application",
    description: "Notify when an employee submits a loan application",
    email: true,
    inApp: true,
    push: false,
    roles: ["FINANCE_MANAGER", "HR", "ADMIN"],
    frequency: "instant",
  },
  {
    id: "loan-approved",
    category: "Loans",
    label: "Loan Approved/Rejected",
    description: "Notify when your loan application is approved or rejected",
    email: true,
    inApp: true,
    push: false,
    roles: ["EMPLOYEE"],
    frequency: "instant",
  },
  {
    id: "tax-filing-due",
    category: "Tax",
    label: "Tax Filing Due",
    description: "Reminder when tax filing deadline is approaching",
    email: true,
    inApp: true,
    push: true,
    roles: ["FINANCE_MANAGER", "TAX_SPECIALIST", "ADMIN"],
    frequency: "weekly",
  },
  {
    id: "payslip-available",
    category: "Payslips",
    label: "Payslip Available",
    description: "Notify employees when their payslip is available",
    email: true,
    inApp: true,
    push: true,
    roles: ["EMPLOYEE"],
    frequency: "instant",
  },
  {
    id: "vendor-invoice-due",
    category: "Payables",
    label: "Vendor Invoice Due",
    description: "Notify when a vendor invoice payment is due soon",
    email: true,
    inApp: true,
    push: false,
    roles: ["FINANCE_MANAGER", "ACCOUNTANT_PAYABLE", "ADMIN"],
    frequency: "daily",
  },
  {
    id: "reimbursement-status",
    category: "Reimbursements",
    label: "Reimbursement Status Change",
    description: "Notify when your reimbursement request status changes",
    email: true,
    inApp: true,
    push: false,
    roles: ["EMPLOYEE"],
    frequency: "instant",
  },
];

const initialTemplates: EmailTemplate[] = [
  {
    id: "TPL-001",
    name: "Payroll Completed",
    subject: "Payroll for {{period}} has been processed",
    type: "Payroll",
    lastModified: "2026-05-15",
    status: "active",
  },
  {
    id: "TPL-002",
    name: "Expense Approved",
    subject: "Your expense report {{report_id}} has been approved",
    type: "Expenses",
    lastModified: "2026-04-20",
    status: "active",
  },
  {
    id: "TPL-003",
    name: "Approval Required",
    subject: "Action Required: {{entity_type}} needs your approval",
    type: "Approvals",
    lastModified: "2026-05-01",
    status: "active",
  },
  {
    id: "TPL-004",
    name: "Invoice Overdue",
    subject: "Invoice {{invoice_number}} is overdue",
    type: "Invoices",
    lastModified: "2026-03-10",
    status: "active",
  },
  {
    id: "TPL-005",
    name: "Budget Alert",
    subject: "Budget Alert: {{department}} has reached {{percentage}}%",
    type: "Budget",
    lastModified: "2026-05-20",
    status: "active",
  },
  {
    id: "TPL-006",
    name: "Payslip Available",
    subject: "Your payslip for {{period}} is now available",
    type: "Payslips",
    lastModified: "2026-05-25",
    status: "active",
  },
  {
    id: "TPL-007",
    name: "Welcome Email",
    subject: "Welcome to AcmeCorp, {{employee_name}}!",
    type: "System",
    lastModified: "2026-01-15",
    status: "active",
  },
  {
    id: "TPL-008",
    name: "Password Reset",
    subject: "Password Reset Request",
    type: "System",
    lastModified: "2026-02-01",
    status: "active",
  },
];

const initialSmtpConfig: SmtpConfig = {
  host: "smtp.acmecorp.com",
  port: 587,
  username: "notifications@acmecorp.com",
  password: "••••••••••••",
  encryption: "tls",
  fromEmail: "notifications@acmecorp.com",
  fromName: "AcmeCorp Finance System",
  replyTo: "support@acmecorp.com",
};

const initialLogs: NotificationLog[] = [
  {
    id: 1,
    type: "Payroll Completed",
    recipient: "jane@acmecorp.com",
    subject: "Payroll for May 2026 has been processed",
    status: "sent",
    timestamp: "2026-06-02T14:30:00",
    channel: "email",
  },
  {
    id: 2,
    type: "Approval Required",
    recipient: "jane@acmecorp.com",
    subject: "Action Required: Expense Report needs your approval",
    status: "sent",
    timestamp: "2026-06-02T11:15:00",
    channel: "email",
  },
  {
    id: 3,
    type: "Payslip Available",
    recipient: "john@acmecorp.com",
    subject: "Your payslip for May 2026 is now available",
    status: "sent",
    timestamp: "2026-06-02T10:00:00",
    channel: "push",
  },
  {
    id: 4,
    type: "Budget Alert",
    recipient: "jane@acmecorp.com",
    subject: "Budget Alert: Sales has reached 93%",
    status: "sent",
    timestamp: "2026-06-01T16:00:00",
    channel: "email",
  },
  {
    id: 5,
    type: "Invoice Overdue",
    recipient: "alice@acmecorp.com",
    subject: "Invoice INV-2026-003 is overdue",
    status: "sent",
    timestamp: "2026-06-01T09:00:00",
    channel: "in-app",
  },
  {
    id: 6,
    type: "Welcome Email",
    recipient: "emma@acmecorp.com",
    subject: "Welcome to AcmeCorp, Emma Wilson!",
    status: "failed",
    timestamp: "2026-05-28T11:00:00",
    channel: "email",
  },
  {
    id: 7,
    type: "Password Reset",
    recipient: "bob@acmecorp.com",
    subject: "Password Reset Request",
    status: "sent",
    timestamp: "2026-05-27T14:00:00",
    channel: "email",
  },
  {
    id: 8,
    type: "Tax Filing Due",
    recipient: "jane@acmecorp.com",
    subject: "Reminder: PAYE filing due June 10",
    status: "sent",
    timestamp: "2026-05-26T08:00:00",
    channel: "email",
  },
];

export default function NotificationSettingsPage() {
  // State
  const [settings, setSettings] =
    useState<NotificationSetting[]>(initialSettings);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(initialSmtpConfig);
  const [logs, setLogs] = useState<NotificationLog[]>(initialLogs);
  const [isSmtpEditing, setIsSmtpEditing] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [activeTab, setActiveTab] = useState("preferences");
  const [saveMessage, setSaveMessage] = useState("");

  // SMTP form state
  const [smtpForm, setSmtpForm] = useState<SmtpConfig>(initialSmtpConfig);

  // Statistics
  const enabledCount = settings.filter(
    (s) => s.email || s.inApp || s.push,
  ).length;
  const activeTemplates = templates.filter((t) => t.status === "active").length;
  const sentToday = logs.filter(
    (l) => l.status === "sent" && l.timestamp.startsWith("2026-06-02"),
  ).length;

  const handleToggle = (id: string, channel: "email" | "inApp" | "push") => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s)),
    );
  };

  const handleFrequencyChange = (
    id: string,
    frequency: NotificationSetting["frequency"],
  ) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, frequency } : s)),
    );
  };

  const handleSavePreferences = () => {
    setSaveMessage("Notification preferences saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSaveSmtp = () => {
    setSmtpConfig(smtpForm);
    setIsSmtpEditing(false);
    setSaveMessage("SMTP configuration saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleTestSmtp = () => {
    if (!testEmail) return;
    setIsTestDialogOpen(false);
    setSaveMessage(`Test email sent to ${testEmail}`);
    setTimeout(() => setSaveMessage(""), 3000);
    setTestEmail("");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Payroll":
        return <Banknote className="h-4 w-4" />;
      case "Expenses":
        return <Receipt className="h-4 w-4" />;
      case "Approvals":
        return <CheckCircle className="h-4 w-4" />;
      case "Invoices":
        return <FileText className="h-4 w-4" />;
      case "Budget":
        return <TrendingUp className="h-4 w-4" />;
      case "Loans":
        return <DollarSign className="h-4 w-4" />;
      case "Tax":
        return <Shield className="h-4 w-4" />;
      case "Payslips":
        return <FileText className="h-4 w-4" />;
      case "Payables":
        return <DollarSign className="h-4 w-4" />;
      case "Reimbursements":
        return <Receipt className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-600">Inactive</Badge>;
      default:
        return null;
    }
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "email":
        return (
          <Badge variant="outline" className="text-xs">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Badge>
        );
      case "in-app":
        return (
          <Badge variant="outline" className="text-xs">
            <Bell className="h-3 w-3 mr-1" />
            In-App
          </Badge>
        );
      case "push":
        return (
          <Badge variant="outline" className="text-xs">
            <Smartphone className="h-3 w-3 mr-1" />
            Push
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group settings by category
  const groupedSettings = settings.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) acc[setting.category] = [];
      acc[setting.category].push(setting);
      return acc;
    },
    {} as Record<string, NotificationSetting[]>,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Notification Preferences
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure email and in-app notification settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSaveMessage("")}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSavePreferences}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          {saveMessage}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Notifications Enabled
            </p>
            <p className="text-2xl font-bold">
              {enabledCount}/{settings.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Templates</p>
            <p className="text-2xl font-bold">{activeTemplates}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Sent Today</p>
            <p className="text-2xl font-bold">{sentToday}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="preferences">
            <Bell className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="smtp">
            <Server className="h-4 w-4 mr-2" />
            SMTP Configuration
          </TabsTrigger>
          <TabsTrigger value="history">
            <Activity className="h-4 w-4 mr-2" />
            Notification History
          </TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          {Object.entries(groupedSettings).map(
            ([category, categorySettings]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getCategoryIcon(category)}
                    {category} Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure how you want to receive {category.toLowerCase()}{" "}
                    notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySettings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{setting.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {setting.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {setting.roles.length} role
                            {setting.roles.length !== 1 ? "s" : ""}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {setting.frequency}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Email Toggle */}
                        <button
                          onClick={() => handleToggle(setting.id, "email")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            setting.email
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </button>

                        {/* In-App Toggle */}
                        <button
                          onClick={() => handleToggle(setting.id, "inApp")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            setting.inApp
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Bell className="h-3.5 w-3.5" />
                          In-App
                        </button>

                        {/* Push Toggle */}
                        <button
                          onClick={() => handleToggle(setting.id, "push")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            setting.push
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          Push
                        </button>

                        {/* Frequency */}
                        <Select
                          value={setting.frequency}
                          onValueChange={(v) =>
                            handleFrequencyChange(
                              setting.id,
                              v as NotificationSetting["frequency"],
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instant">Instant</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ),
          )}
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>
                    Manage email notification templates
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium text-sm">
                        {template.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {template.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                        {template.subject}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(template.lastModified)}
                      </TableCell>
                      <TableCell>{getStatusBadge(template.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" title="Preview">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Test">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP Configuration Tab */}
        <TabsContent value="smtp" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>SMTP Configuration</CardTitle>
                  <CardDescription>
                    Configure SMTP server settings for sending email
                    notifications
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {!isSmtpEditing && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTestDialogOpen(true)}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSmtpForm(smtpConfig);
                          setIsSmtpEditing(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Configuration
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isSmtpEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={smtpForm.host}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, host: e.target.value })
                        }
                        placeholder="smtp.company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        type="number"
                        value={smtpForm.port}
                        onChange={(e) =>
                          setSmtpForm({
                            ...smtpForm,
                            port: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={smtpForm.username}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, username: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={smtpForm.password}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Encryption</Label>
                      <Select
                        value={smtpForm.encryption}
                        onValueChange={(v) =>
                          setSmtpForm({
                            ...smtpForm,
                            encryption: v as "tls" | "ssl" | "none",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>From Email</Label>
                      <Input
                        value={smtpForm.fromEmail}
                        onChange={(e) =>
                          setSmtpForm({
                            ...smtpForm,
                            fromEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>From Name</Label>
                      <Input
                        value={smtpForm.fromName}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, fromName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reply-To</Label>
                      <Input
                        value={smtpForm.replyTo}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, replyTo: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsSmtpEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSmtp}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">SMTP Host</p>
                    <p className="font-medium">
                      {smtpConfig.host}:{smtpConfig.port}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Encryption</p>
                    <p className="font-medium uppercase">
                      {smtpConfig.encryption}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Username</p>
                    <p className="font-medium">{smtpConfig.username}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">From Address</p>
                    <p className="font-medium">{smtpConfig.fromEmail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">From Name</p>
                    <p className="font-medium">{smtpConfig.fromName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reply-To</p>
                    <p className="font-medium">{smtpConfig.replyTo}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Connection Status</p>
                    <Badge className="bg-green-100 text-green-700 mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification History Tab */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                Recent notification delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </TableCell>
                        <TableCell className="text-sm">{log.type}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.recipient}
                        </TableCell>
                        <TableCell className="text-sm max-w-[250px] truncate">
                          {log.subject}
                        </TableCell>
                        <TableCell>{getChannelBadge(log.channel)}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Email Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Test SMTP Connection</DialogTitle>
            <DialogDescription>
              Send a test email to verify your SMTP configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Send Test Email To</Label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your.email@company.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTestDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleTestSmtp} disabled={!testEmail}>
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
