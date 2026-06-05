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
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
  Hash,
  type Icon as LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChartOfAccountsSettings() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Account Code Settings
  const [codeSettings, setCodeSettings] = useState({
    prefix: {
      asset: "1",
      liability: "2",
      equity: "3",
      revenue: "4",
      expense: "5",
    },
    separator: "-",
    autoGenerate: true,
    startingNumber: 1000,
    incrementBy: 10,
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    showFullCode: true,
    showAccountType: true,
    showBalance: true,
    groupByType: true,
    defaultView: "list",
  });

  // Default Accounts
  const [defaultAccounts, setDefaultAccounts] = useState({
    cash: "",
    accountsReceivable: "",
    inventory: "",
    accountsPayable: "",
    retainedEarnings: "",
    salesRevenue: "",
    costOfSales: "",
  });

  // Account Types Configuration
  const [accountTypes, setAccountTypes] = useState([
    { id: "asset", name: "Assets", enabled: true, icon: "Wallet" },
    { id: "liability", name: "Liabilities", enabled: true, icon: "CreditCard" },
    { id: "equity", name: "Equity", enabled: true, icon: "PiggyBank" },
    { id: "revenue", name: "Revenue", enabled: true, icon: "TrendingUp" },
    { id: "expense", name: "Expenses", enabled: true, icon: "TrendingDown" },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
              <Settings className="h-6 w-6" />
              Chart of Accounts Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure account numbering, display options, and defaults
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.refresh()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span>Settings saved successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="numbering" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="numbering">Account Numbering</TabsTrigger>
          <TabsTrigger value="display">Display Settings</TabsTrigger>
          <TabsTrigger value="defaults">Default Accounts</TabsTrigger>
          <TabsTrigger value="types">Account Types</TabsTrigger>
        </TabsList>

        {/* Account Numbering Tab */}
        <TabsContent value="numbering" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Code Prefixes</CardTitle>
              <CardDescription>
                Define the prefix for each account type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Assets Prefix</Label>
                  <Input
                    value={codeSettings.prefix.asset}
                    onChange={(e) =>
                      setCodeSettings((prev) => ({
                        ...prev,
                        prefix: { ...prev.prefix, asset: e.target.value },
                      }))
                    }
                    className="mt-1 font-mono"
                    placeholder="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Accounts will start with this prefix (e.g., 1-1000)
                  </p>
                </div>
                <div>
                  <Label>Liabilities Prefix</Label>
                  <Input
                    value={codeSettings.prefix.liability}
                    onChange={(e) =>
                      setCodeSettings((prev) => ({
                        ...prev,
                        prefix: { ...prev.prefix, liability: e.target.value },
                      }))
                    }
                    className="mt-1 font-mono"
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label>Equity Prefix</Label>
                  <Input
                    value={codeSettings.prefix.equity}
                    onChange={(e) =>
                      setCodeSettings((prev) => ({
                        ...prev,
                        prefix: { ...prev.prefix, equity: e.target.value },
                      }))
                    }
                    className="mt-1 font-mono"
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label>Revenue Prefix</Label>
                  <Input
                    value={codeSettings.prefix.revenue}
                    onChange={(e) =>
                      setCodeSettings((prev) => ({
                        ...prev,
                        prefix: { ...prev.prefix, revenue: e.target.value },
                      }))
                    }
                    className="mt-1 font-mono"
                    placeholder="4"
                  />
                </div>
                <div>
                  <Label>Expenses Prefix</Label>
                  <Input
                    value={codeSettings.prefix.expense}
                    onChange={(e) =>
                      setCodeSettings((prev) => ({
                        ...prev,
                        prefix: { ...prev.prefix, expense: e.target.value },
                      }))
                    }
                    className="mt-1 font-mono"
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label>Code Separator</Label>
                  <Input
                    value={codeSettings.separator}
                    onChange={(e) =>
                      setCodeSettings((prev) => ({
                        ...prev,
                        separator: e.target.value,
                      }))
                    }
                    className="mt-1 font-mono"
                    placeholder="-"
                    maxLength={1}
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-4">Auto-generation Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-generate Account Codes</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically generate account codes based on prefix and
                        numbering
                      </p>
                    </div>
                    <Switch
                      checked={codeSettings.autoGenerate}
                      onCheckedChange={(checked) =>
                        setCodeSettings((prev) => ({
                          ...prev,
                          autoGenerate: checked,
                        }))
                      }
                    />
                  </div>

                  {codeSettings.autoGenerate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Starting Number</Label>
                        <Input
                          type="number"
                          value={codeSettings.startingNumber}
                          onChange={(e) =>
                            setCodeSettings((prev) => ({
                              ...prev,
                              startingNumber: parseInt(e.target.value) || 1000,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Increment By</Label>
                        <Input
                          type="number"
                          value={codeSettings.incrementBy}
                          onChange={(e) =>
                            setCodeSettings((prev) => ({
                              ...prev,
                              incrementBy: parseInt(e.target.value) || 10,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Preview</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Next asset account code: {codeSettings.prefix.asset}
                      {codeSettings.separator}
                      {codeSettings.startingNumber}
                      <br />
                      Next liability account code:{" "}
                      {codeSettings.prefix.liability}
                      {codeSettings.separator}
                      {codeSettings.startingNumber}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings Tab */}
        <TabsContent value="display" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Configure how the chart of accounts is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Full Account Code</Label>
                    <p className="text-xs text-muted-foreground">
                      Display the complete account code including prefix
                    </p>
                  </div>
                  <Switch
                    checked={displaySettings.showFullCode}
                    onCheckedChange={(checked) =>
                      setDisplaySettings((prev) => ({
                        ...prev,
                        showFullCode: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Account Type</Label>
                    <p className="text-xs text-muted-foreground">
                      Display account type badge next to each account
                    </p>
                  </div>
                  <Switch
                    checked={displaySettings.showAccountType}
                    onCheckedChange={(checked) =>
                      setDisplaySettings((prev) => ({
                        ...prev,
                        showAccountType: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Account Balance</Label>
                    <p className="text-xs text-muted-foreground">
                      Display current balance in the accounts list
                    </p>
                  </div>
                  <Switch
                    checked={displaySettings.showBalance}
                    onCheckedChange={(checked) =>
                      setDisplaySettings((prev) => ({
                        ...prev,
                        showBalance: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Group by Account Type</Label>
                    <p className="text-xs text-muted-foreground">
                      Organize accounts by their type in the list view
                    </p>
                  </div>
                  <Switch
                    checked={displaySettings.groupByType}
                    onCheckedChange={(checked) =>
                      setDisplaySettings((prev) => ({
                        ...prev,
                        groupByType: checked,
                      }))
                    }
                  />
                </div>

                <div className="border-t pt-4">
                  <Label>Default View</Label>
                  <Select
                    value={displaySettings.defaultView}
                    onValueChange={(value) =>
                      setDisplaySettings((prev) => ({
                        ...prev,
                        defaultView: value as "list" | "hierarchy",
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="hierarchy">Hierarchy View</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Default view when opening the chart of accounts page
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Default Accounts Tab */}
        <TabsContent value="defaults" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Accounts</CardTitle>
              <CardDescription>
                Set default accounts for common transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default Cash Account</Label>
                  <Select
                    value={defaultAccounts.cash}
                    onValueChange={(value) =>
                      setDefaultAccounts((prev) => ({
                        ...prev,
                        cash: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1110">
                        1110 - Cash - Operating
                      </SelectItem>
                      <SelectItem value="1120">
                        1120 - Cash - Savings
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for cash transactions and journal entries
                  </p>
                </div>

                <div>
                  <Label>Default Accounts Receivable</Label>
                  <Select
                    value={defaultAccounts.accountsReceivable}
                    onValueChange={(value) =>
                      setDefaultAccounts((prev) => ({
                        ...prev,
                        accountsReceivable: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1130">
                        1130 - Accounts Receivable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Default Inventory Account</Label>
                  <Select
                    value={defaultAccounts.inventory}
                    onValueChange={(value) =>
                      setDefaultAccounts((prev) => ({
                        ...prev,
                        inventory: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1140">1140 - Inventory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Default Accounts Payable</Label>
                  <Select
                    value={defaultAccounts.accountsPayable}
                    onValueChange={(value) =>
                      setDefaultAccounts((prev) => ({
                        ...prev,
                        accountsPayable: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2100">
                        2100 - Accounts Payable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Default Retained Earnings</Label>
                  <Select
                    value={defaultAccounts.retainedEarnings}
                    onValueChange={(value) =>
                      setDefaultAccounts((prev) => ({
                        ...prev,
                        retainedEarnings: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3200">
                        3200 - Retained Earnings
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Default Sales Revenue</Label>
                  <Select
                    value={defaultAccounts.salesRevenue}
                    onValueChange={(value) =>
                      setDefaultAccounts((prev) => ({
                        ...prev,
                        salesRevenue: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4100">4100 - Sales Revenue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Default Cost of Sales</Label>
                  <Select
                    value={defaultAccounts.costOfSales}
                    onValueChange={(value) =>
                      setDefaultAccounts((prev) => ({
                        ...prev,
                        costOfSales: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5100">5100 - Cost of Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg mt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Why set default accounts?
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Default accounts will be automatically selected when
                      creating new transactions, saving time and ensuring
                      consistency across your accounting entries.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Types Tab */}
        <TabsContent value="types" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Types Configuration</CardTitle>
              <CardDescription>
                Enable or disable account types and configure their properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {accountTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            type.id === "asset"
                              ? "bg-blue-500"
                              : type.id === "liability"
                                ? "bg-red-500"
                                : type.id === "equity"
                                  ? "bg-green-500"
                                  : type.id === "revenue"
                                    ? "bg-purple-500"
                                    : "bg-orange-500"
                          }`}
                        />
                        <Label className="font-medium">{type.name}</Label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.id === "asset" &&
                          "Resources owned by the company"}
                        {type.id === "liability" &&
                          "Obligations owed to others"}
                        {type.id === "equity" &&
                          "Owner's interest in the company"}
                        {type.id === "revenue" &&
                          "Income from business operations"}
                        {type.id === "expense" &&
                          "Costs incurred to generate revenue"}
                      </p>
                    </div>
                    <Switch
                      checked={type.enabled}
                      onCheckedChange={(checked) =>
                        setAccountTypes((prev) =>
                          prev.map((t) =>
                            t.id === type.id ? { ...t, enabled: checked } : t,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Normal Balances</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Assets & Expenses</p>
                    <p className="text-xs text-muted-foreground">
                      Normal Balance:{" "}
                      <span className="text-blue-600 font-medium">Debit</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Increases are recorded as debits
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      Liabilities, Equity & Revenue
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Normal Balance:{" "}
                      <span className="text-red-600 font-medium">Credit</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Increases are recorded as credits
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
