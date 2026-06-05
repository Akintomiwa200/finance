"use client";

import { useState, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
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
import { Switch } from "@/src/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  UserPlus,
  UserCheck,
  GitBranch,
  GitMerge,
  Layers,
  Zap,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  Play,
  Pause,
  Archive,
  MoreHorizontal,
  MoveUp,
  MoveDown,
  PlusCircle,
  MinusCircle,
  Save,
  X,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
interface ApprovalStep {
  id: number;
  level: number;
  name: string;
  approvers: string[];
  approverRoles: string[];
  requiresAll: boolean; // If true, all approvers must approve; if false, any one can approve
  timeoutDays?: number;
  timeoutAction?: "auto_approve" | "auto_reject" | "escalate";
  escalateTo?: string[];
  conditions?: WorkflowCondition[];
}

interface WorkflowCondition {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
  value: any;
}

interface ApprovalWorkflow {
  id: number;
  name: string;
  description: string;
  requestType: "expense" | "purchase" | "leave" | "budget" | "contract";
  status: "active" | "inactive" | "draft";
  steps: ApprovalStep[];
  conditions?: WorkflowCondition[];
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  department?: string;
  minAmount?: number;
  maxAmount?: number;
  applicableDepartments?: string[];
  autoApprovalEnabled?: boolean;
  notificationTemplate?: string;
  version: number;
  isDefault?: boolean;
}

// Mock Data
const mockWorkflows: ApprovalWorkflow[] = [
  {
    id: 1,
    name: "Expense Approval - Standard",
    description: "Standard workflow for expense approvals up to ₦5M",
    requestType: "expense",
    status: "active",
    steps: [
      {
        id: 1,
        level: 1,
        name: "Department Head Review",
        approvers: ["Department Head"],
        approverRoles: ["department_head"],
        requiresAll: false,
        timeoutDays: 3,
        timeoutAction: "escalate",
        escalateTo: ["Division Head"],
      },
      {
        id: 2,
        level: 2,
        name: "Finance Review",
        approvers: ["Finance Manager", "Finance Controller"],
        approverRoles: ["finance_manager", "finance_controller"],
        requiresAll: true,
        timeoutDays: 2,
        timeoutAction: "auto_approve",
      },
      {
        id: 3,
        level: 3,
        name: "VP Approval",
        approvers: ["VP of Operations"],
        approverRoles: ["vp_operations"],
        requiresAll: false,
        timeoutDays: 2,
        timeoutAction: "escalate",
        escalateTo: ["CFO"],
      },
    ],
    priority: 1,
    createdAt: "2024-01-15",
    updatedAt: "2026-01-10",
    createdBy: "Admin User",
    minAmount: 0,
    maxAmount: 5000000,
    autoApprovalEnabled: false,
    version: 2,
    isDefault: true,
  },
  {
    id: 2,
    name: "Expense Approval - High Value",
    description: "Extended workflow for high-value expenses above ₦5M",
    requestType: "expense",
    status: "active",
    steps: [
      {
        id: 1,
        level: 1,
        name: "Department Head Review",
        approvers: ["Department Head"],
        approverRoles: ["department_head"],
        requiresAll: false,
        timeoutDays: 3,
        timeoutAction: "escalate",
        escalateTo: ["Division Head"],
      },
      {
        id: 2,
        level: 2,
        name: "Finance Committee",
        approvers: ["Finance Manager", "Finance Controller", "CFO"],
        approverRoles: ["finance_manager", "finance_controller", "cfo"],
        requiresAll: true,
        timeoutDays: 5,
        timeoutAction: "auto_reject",
      },
      {
        id: 3,
        level: 3,
        name: "Executive Review",
        approvers: ["CEO", "COO"],
        approverRoles: ["ceo", "coo"],
        requiresAll: true,
        timeoutDays: 3,
        timeoutAction: "escalate",
        escalateTo: ["Board Member"],
      },
    ],
    priority: 2,
    createdAt: "2024-02-01",
    updatedAt: "2026-01-15",
    createdBy: "Admin User",
    minAmount: 5000000,
    maxAmount: 50000000,
    autoApprovalEnabled: false,
    version: 1,
  },
  {
    id: 3,
    name: "Purchase Request - IT Equipment",
    description: "Workflow for IT equipment purchases",
    requestType: "purchase",
    status: "active",
    steps: [
      {
        id: 1,
        level: 1,
        name: "IT Manager Review",
        approvers: ["IT Manager"],
        approverRoles: ["it_manager"],
        requiresAll: false,
        timeoutDays: 2,
        timeoutAction: "escalate",
        escalateTo: ["IT Director"],
      },
      {
        id: 2,
        level: 2,
        name: "Procurement Review",
        approvers: ["Procurement Officer", "Procurement Manager"],
        approverRoles: ["procurement_officer", "procurement_manager"],
        requiresAll: false,
        timeoutDays: 3,
        timeoutAction: "auto_approve",
      },
    ],
    priority: 1,
    createdAt: "2024-03-01",
    updatedAt: "2026-02-01",
    createdBy: "IT Admin",
    department: "IT",
    minAmount: 0,
    maxAmount: 10000000,
    autoApprovalEnabled: true,
    version: 3,
  },
  {
    id: 4,
    name: "Leave Request - Standard",
    description: "Standard leave request approval workflow",
    requestType: "leave",
    status: "active",
    steps: [
      {
        id: 1,
        level: 1,
        name: "Team Lead Approval",
        approvers: ["Team Lead"],
        approverRoles: ["team_lead"],
        requiresAll: false,
        timeoutDays: 2,
        timeoutAction: "auto_approve",
      },
      {
        id: 2,
        level: 2,
        name: "HR Review",
        approvers: ["HR Manager"],
        approverRoles: ["hr_manager"],
        requiresAll: false,
        timeoutDays: 1,
        timeoutAction: "auto_approve",
      },
    ],
    priority: 1,
    createdAt: "2024-01-20",
    updatedAt: "2026-01-20",
    createdBy: "HR Admin",
    autoApprovalEnabled: true,
    version: 2,
    isDefault: true,
  },
  {
    id: 5,
    name: "Budget Approval - Annual",
    description: "Annual budget approval workflow requiring executive sign-off",
    requestType: "budget",
    status: "active",
    steps: [
      {
        id: 1,
        level: 1,
        name: "Department Head",
        approvers: ["Department Head"],
        approverRoles: ["department_head"],
        requiresAll: false,
        timeoutDays: 5,
        timeoutAction: "escalate",
        escalateTo: ["Division Head"],
      },
      {
        id: 2,
        level: 2,
        name: "Finance Review",
        approvers: ["Finance Director", "CFO"],
        approverRoles: ["finance_director", "cfo"],
        requiresAll: true,
        timeoutDays: 7,
        timeoutAction: "auto_reject",
      },
      {
        id: 3,
        level: 3,
        name: "Board Approval",
        approvers: ["Board Member", "CEO"],
        approverRoles: ["board_member", "ceo"],
        requiresAll: true,
        timeoutDays: 10,
        timeoutAction: "escalate",
        escalateTo: ["Executive Committee"],
      },
    ],
    priority: 3,
    createdAt: "2024-01-10",
    updatedAt: "2026-01-05",
    createdBy: "Finance Admin",
    minAmount: 10000000,
    autoApprovalEnabled: false,
    version: 3,
  },
  {
    id: 6,
    name: "Contract Review - Legal",
    description: "Legal contract review and approval workflow",
    requestType: "contract",
    status: "draft",
    steps: [
      {
        id: 1,
        level: 1,
        name: "Legal Review",
        approvers: ["Legal Counsel"],
        approverRoles: ["legal_counsel"],
        requiresAll: false,
        timeoutDays: 5,
        timeoutAction: "escalate",
        escalateTo: ["Legal Director"],
      },
      {
        id: 2,
        level: 2,
        name: "Compliance Review",
        approvers: ["Compliance Officer"],
        approverRoles: ["compliance_officer"],
        requiresAll: false,
        timeoutDays: 3,
        timeoutAction: "auto_reject",
      },
    ],
    priority: 2,
    createdAt: "2024-04-01",
    updatedAt: "2026-03-01",
    createdBy: "Legal Admin",
    autoApprovalEnabled: false,
    version: 1,
  },
];

const requestTypes = ["expense", "purchase", "leave", "budget", "contract"];
const statuses = ["all", "active", "inactive", "draft"];
const departments = [
  "all",
  "Finance",
  "Engineering",
  "HR",
  "Sales",
  "Marketing",
  "IT",
  "Operations",
  "Legal",
];

// Available approver roles
const availableRoles = [
  { value: "department_head", label: "Department Head" },
  { value: "division_head", label: "Division Head" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "finance_controller", label: "Finance Controller" },
  { value: "finance_director", label: "Finance Director" },
  { value: "cfo", label: "CFO" },
  { value: "ceo", label: "CEO" },
  { value: "coo", label: "COO" },
  { value: "it_manager", label: "IT Manager" },
  { value: "it_director", label: "IT Director" },
  { value: "hr_manager", label: "HR Manager" },
  { value: "hr_director", label: "HR Director" },
  { value: "procurement_officer", label: "Procurement Officer" },
  { value: "procurement_manager", label: "Procurement Manager" },
  { value: "legal_counsel", label: "Legal Counsel" },
  { value: "legal_director", label: "Legal Director" },
  { value: "compliance_officer", label: "Compliance Officer" },
  { value: "team_lead", label: "Team Lead" },
  { value: "vp_operations", label: "VP of Operations" },
  { value: "board_member", label: "Board Member" },
];

export default function ApprovalWorkflows() {
  const router = useRouter();

  // State
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ApprovalWorkflow;
    direction: "asc" | "desc";
  }>({ key: "priority", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<ApprovalWorkflow | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ApprovalWorkflow>>({
    name: "",
    description: "",
    requestType: "expense",
    status: "draft",
    steps: [],
    priority: 1,
    minAmount: 0,
    maxAmount: undefined,
    autoApprovalEnabled: false,
    applicableDepartments: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalWorkflows = workflows.length;
    const activeCount = workflows.filter((w) => w.status === "active").length;
    const inactiveCount = workflows.filter(
      (w) => w.status === "inactive",
    ).length;
    const draftCount = workflows.filter((w) => w.status === "draft").length;
    const avgSteps =
      workflows.reduce((sum, w) => sum + w.steps.length, 0) / totalWorkflows;

    return {
      totalWorkflows,
      activeCount,
      inactiveCount,
      draftCount,
      avgSteps: avgSteps.toFixed(1),
    };
  }, [workflows]);

  // Filter and sort
  const filteredWorkflows = useMemo(() => {
    let result = [...workflows];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.description.toLowerCase().includes(query) ||
          w.createdBy.toLowerCase().includes(query),
      );
    }

    if (requestTypeFilter !== "all") {
      result = result.filter((w) => w.requestType === requestTypeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((w) => w.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter(
        (w) =>
          w.department === departmentFilter ||
          w.applicableDepartments?.includes(departmentFilter),
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [
    workflows,
    searchQuery,
    requestTypeFilter,
    statusFilter,
    departmentFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage);
  const paginatedWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof ApprovalWorkflow) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewWorkflow = (workflow: ApprovalWorkflow) => {
    setSelectedWorkflow(workflow);
    setIsViewModalOpen(true);
  };

  const handleEditWorkflow = (workflow: ApprovalWorkflow) => {
    setSelectedWorkflow(workflow);
    setFormData(workflow);
    setIsEditModalOpen(true);
  };

  const handleCreateWorkflow = () => {
    if (!validateForm()) return;

    const newWorkflow: ApprovalWorkflow = {
      id: Math.max(...workflows.map((w) => w.id), 0) + 1,
      name: formData.name!,
      description: formData.description!,
      requestType: formData.requestType as any,
      status: formData.status as any,
      steps: formData.steps || [],
      priority: formData.priority || workflows.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
      minAmount: formData.minAmount,
      maxAmount: formData.maxAmount,
      autoApprovalEnabled: formData.autoApprovalEnabled,
      applicableDepartments: formData.applicableDepartments,
      version: 1,
    };

    setWorkflows((prev) => [...prev, newWorkflow]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateWorkflow = () => {
    if (!validateForm() || !selectedWorkflow) return;

    const updatedWorkflow: ApprovalWorkflow = {
      ...selectedWorkflow,
      ...formData,
      updatedAt: new Date().toISOString().split("T")[0],
      version: selectedWorkflow.version + 1,
    };

    setWorkflows((prev) =>
      prev.map((w) => (w.id === selectedWorkflow.id ? updatedWorkflow : w)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedWorkflow(null);
  };

  const handleDeleteWorkflow = () => {
    if (!selectedWorkflow) return;
    setWorkflows((prev) => prev.filter((w) => w.id !== selectedWorkflow.id));
    setIsDeleteDialogOpen(false);
    setSelectedWorkflow(null);
  };

  const handleDuplicateWorkflow = () => {
    if (!selectedWorkflow) return;

    const duplicatedWorkflow: ApprovalWorkflow = {
      ...selectedWorkflow,
      id: Math.max(...workflows.map((w) => w.id), 0) + 1,
      name: `${selectedWorkflow.name} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      version: 1,
    };

    setWorkflows((prev) => [...prev, duplicatedWorkflow]);
    setIsDuplicateDialogOpen(false);
    setSelectedWorkflow(null);
  };

  const handleToggleStatus = (workflow: ApprovalWorkflow) => {
    const newStatus = workflow.status === "active" ? "inactive" : "active";
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflow.id
          ? {
              ...w,
              status: newStatus,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : w,
      ),
    );
  };

  const handleAddStep = () => {
    const newStep: ApprovalStep = {
      id: Date.now(),
      level: (formData.steps?.length || 0) + 1,
      name: "",
      approvers: [],
      approverRoles: [],
      requiresAll: false,
      timeoutDays: 3,
      timeoutAction: "escalate",
    };
    setFormData((prev) => ({
      ...prev,
      steps: [...(prev.steps || []), newStep],
    }));
  };

  const handleRemoveStep = (stepId: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps?.filter((step) => step.id !== stepId) || [],
    }));
  };

  const handleUpdateStep = (stepId: number, updates: Partial<ApprovalStep>) => {
    setFormData((prev) => ({
      ...prev,
      steps:
        prev.steps?.map((step) =>
          step.id === stepId ? { ...step, ...updates } : step,
        ) || [],
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) errors.name = "Workflow name is required";
    if (!formData.requestType) errors.requestType = "Request type is required";
    if (!formData.steps || formData.steps.length === 0) {
      errors.steps = "At least one approval step is required";
    } else {
      formData.steps.forEach((step, index) => {
        if (!step.name?.trim()) {
          errors[`step_${index}_name`] = `Step ${index + 1} name is required`;
        }
        if (step.approverRoles.length === 0 && step.approvers.length === 0) {
          errors[`step_${index}_approvers`] =
            `At least one approver is required for step ${index + 1}`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      requestType: "expense",
      status: "draft",
      steps: [],
      priority: 1,
      minAmount: 0,
      maxAmount: undefined,
      autoApprovalEnabled: false,
      applicableDepartments: [],
    });
    setFormErrors({});
  };

  const getStatusBadge = (status: ApprovalWorkflow["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      draft: "bg-yellow-100 text-yellow-700",
    };

    const labels = {
      active: "Active",
      inactive: "Inactive",
      draft: "Draft",
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getRequestTypeBadge = (type: ApprovalWorkflow["requestType"]) => {
    const styles = {
      expense: "bg-blue-100 text-blue-700",
      purchase: "bg-purple-100 text-purple-700",
      leave: "bg-green-100 text-green-700",
      budget: "bg-orange-100 text-orange-700",
      contract: "bg-red-100 text-red-700",
    };

    const labels = {
      expense: "Expense",
      purchase: "Purchase",
      leave: "Leave",
      budget: "Budget",
      contract: "Contract",
    };

    return (
      <Badge variant="secondary" className={styles[type]}>
        {labels[type]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRefresh = () => {
    setWorkflows([...mockWorkflows]);
    setCurrentPage(1);
    setSearchQuery("");
    setRequestTypeFilter("all");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  // Workflow Step Editor Component
  const StepEditor = ({
    step,
    index,
    onUpdate,
    onRemove,
  }: {
    step: ApprovalStep;
    index: number;
    onUpdate: (updates: Partial<ApprovalStep>) => void;
    onRemove: () => void;
  }) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
      step.approverRoles,
    );

    const handleRoleChange = (roles: string[]) => {
      setSelectedRoles(roles);
      onUpdate({ approverRoles: roles });
    };

    return (
      <div className="border rounded-lg p-4 mb-4 relative">
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <MinusCircle className="h-4 w-4 text-red-600" />
          </Button>
        </div>

        <div className="mb-3">
          <Label className="text-sm font-semibold">
            Step {index + 1}: Level {step.level}
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Step Name *</Label>
            <Input
              value={step.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g., Department Head Review"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Approvers *</Label>
            <Select
              value={selectedRoles[0] || ""}
              onValueChange={(value) => handleRoleChange([value])}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select approver role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {step.approverRoles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {step.approverRoles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {availableRoles.find((r) => r.value === role)?.label ||
                      role}
                    <button
                      className="ml-1 hover:text-red-600"
                      onClick={() =>
                        handleRoleChange(
                          step.approverRoles.filter((r) => r !== role),
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Approval Type</Label>
            <Select
              value={step.requiresAll ? "all" : "any"}
              onValueChange={(value) =>
                onUpdate({ requiresAll: value === "all" })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Approver</SelectItem>
                <SelectItem value="all">All Approvers</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {step.requiresAll
                ? "All approvers must approve"
                : "Any single approver can approve"}
            </p>
          </div>

          <div>
            <Label>Timeout (Days)</Label>
            <Input
              type="number"
              value={step.timeoutDays || ""}
              onChange={(e) =>
                onUpdate({ timeoutDays: parseInt(e.target.value) || 0 })
              }
              className="mt-1"
              placeholder="3"
            />
          </div>

          <div>
            <Label>Timeout Action</Label>
            <Select
              value={step.timeoutAction || "escalate"}
              onValueChange={(value: any) => onUpdate({ timeoutAction: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto_approve">Auto Approve</SelectItem>
                <SelectItem value="auto_reject">Auto Reject</SelectItem>
                <SelectItem value="escalate">Escalate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              Approval Workflows
              <Badge variant="secondary" className="ml-2">
                {stats.totalWorkflows}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure and manage multi-level approval workflows
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{stats.totalWorkflows}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <GitBranch className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Play className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.inactiveCount}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <Pause className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Steps per Workflow
                </p>
                <p className="text-2xl font-bold">{stats.avgSteps}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={requestTypeFilter}
              onValueChange={(v) => {
                setRequestTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {requestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all"
                      ? "All Status"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={departmentFilter}
              onValueChange={(v) => {
                setDepartmentFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflows</CardTitle>
          <CardDescription>
            {filteredWorkflows.length} workflow
            {filteredWorkflows.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("steps")}
                    >
                      Steps
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("updatedAt")}
                    >
                      Last Updated
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWorkflows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <GitBranch className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No workflows found
                        </p>
                        <Button
                          variant="link"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          Create your first workflow
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{workflow.name}</span>
                          {workflow.isDefault && (
                            <Badge
                              variant="outline"
                              className="w-fit text-xs mt-1"
                            >
                              Default
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRequestTypeBadge(workflow.requestType)}
                      </TableCell>
                      <TableCell
                        className="max-w-[300px] truncate"
                        title={workflow.description}
                      >
                        {workflow.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {workflow.steps.length} step
                          {workflow.steps.length !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                      <TableCell>v{workflow.version}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(workflow.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewWorkflow(workflow)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditWorkflow(workflow)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(workflow)}
                          >
                            {workflow.status === "active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedWorkflow(workflow);
                              setIsDuplicateDialogOpen(true);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredWorkflows.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(v) => {
                    setItemsPerPage(parseInt(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredWorkflows.length,
                  )}{" "}
                  of {filteredWorkflows.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Workflow Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedWorkflow?.name}</span>
              {selectedWorkflow && getStatusBadge(selectedWorkflow.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedWorkflow?.requestType.toUpperCase()} Workflow - Version{" "}
              {selectedWorkflow?.version}
            </DialogDescription>
          </DialogHeader>

          {selectedWorkflow && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedWorkflow.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <p>{selectedWorkflow.priority}</p>
                </div>
                {selectedWorkflow.minAmount !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Amount Range
                    </p>
                    <p>
                      {selectedWorkflow.minAmount?.toLocaleString()} -
                      {selectedWorkflow.maxAmount?.toLocaleString() || "No Max"}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Auto Approval</p>
                  <p>
                    {selectedWorkflow.autoApprovalEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>
                    {formatDate(selectedWorkflow.createdAt)} by{" "}
                    {selectedWorkflow.createdBy}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p>{formatDate(selectedWorkflow.updatedAt)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Approval Steps
                </h3>
                <div className="space-y-4">
                  {selectedWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className="mb-2">Level {step.level}</Badge>
                          <h4 className="font-semibold">{step.name}</h4>
                        </div>
                        <Badge variant="outline">
                          {step.requiresAll ? "All Approvers" : "Any Approver"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Approvers:
                          </span>
                          <div className="mt-1">
                            {step.approverRoles.map((role) => {
                              const roleLabel =
                                availableRoles.find((r) => r.value === role)
                                  ?.label || role;
                              return (
                                <Badge
                                  key={role}
                                  variant="secondary"
                                  className="mr-1"
                                >
                                  {roleLabel}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        {step.timeoutDays && (
                          <div>
                            <span className="text-muted-foreground">
                              Timeout:
                            </span>
                            <p>
                              {step.timeoutDays} days -{" "}
                              {step.timeoutAction?.replace("_", " ")}
                            </p>
                          </div>
                        )}
                        {step.escalateTo && step.escalateTo.length > 0 && (
                          <div>
                            <span className="text-muted-foreground">
                              Escalate To:
                            </span>
                            <p>{step.escalateTo.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                handleEditWorkflow(selectedWorkflow!);
              }}
            >
              Edit Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Workflow Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? "Create New Workflow" : "Edit Workflow"}
            </DialogTitle>
            <DialogDescription>
              Configure the approval steps and rules for this workflow
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Workflow Name *</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Expense Approval - Standard"
                  className="mt-1"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <Label>Request Type *</Label>
                <Select
                  value={formData.requestType}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, requestType: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.requestType && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.requestType}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the purpose and scope of this workflow"
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Input
                  type="number"
                  value={formData.priority || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="mt-1"
                  min="1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers have higher priority
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Min Amount (Optional)</Label>
                <Input
                  type="number"
                  value={formData.minAmount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minAmount: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Max Amount (Optional)</Label>
                <Input
                  type="number"
                  value={formData.maxAmount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxAmount: parseInt(e.target.value) || undefined,
                    }))
                  }
                  className="mt-1"
                  placeholder="No max"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto Approval Enabled</Label>
                <Switch
                  checked={formData.autoApprovalEnabled || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      autoApprovalEnabled: checked,
                    }))
                  }
                />
              </div>
            </div>

            {/* Approval Steps */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Approval Steps</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddStep}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              {formData.steps && formData.steps.length > 0 ? (
                <div className="space-y-4">
                  {formData.steps.map((step, index) => (
                    <StepEditor
                      key={step.id}
                      step={step}
                      index={index}
                      onUpdate={(updates) => handleUpdateStep(step.id, updates)}
                      onRemove={() => handleRemoveStep(step.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <GitBranch className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No approval steps configured
                  </p>
                  <Button variant="link" onClick={handleAddStep}>
                    Add your first step
                  </Button>
                </div>
              )}
              {formErrors.steps && (
                <p className="text-sm text-red-500">{formErrors.steps}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                isCreateModalOpen ? handleCreateWorkflow : handleUpdateWorkflow
              }
            >
              {isCreateModalOpen ? "Create Workflow" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete "{selectedWorkflow?.name}"? This action cannot
              be undone.
              {selectedWorkflow?.isDefault && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This is a default workflow. Deleting it may affect existing
                  requests.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkflow}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate Confirmation */}
      <AlertDialog
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Create a copy of "{selectedWorkflow?.name}"? The new workflow will
              be created in Draft status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicateWorkflow}>
              Duplicate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
