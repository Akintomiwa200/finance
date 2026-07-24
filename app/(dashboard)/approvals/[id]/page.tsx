"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
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
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import { useApprovalStore } from "@/src/store/approval-store";
import {
  APPROVAL_STATUS_OPTIONS,
  APPROVAL_PRIORITY_OPTIONS,
  type ApprovalStatusType,
  type ApprovalPriority,
} from "@/src/types/approval";

const STATUS_COLORS: Record<ApprovalStatusType, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const PRIORITY_COLORS: Record<ApprovalPriority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  NORMAL: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-200 text-red-800",
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function ApprovalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { approvals, loading, fetchApprovals, getApprovalById, approveRequest, rejectRequest } = useApprovalStore();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!approvals.length) fetchApprovals();
  }, [approvals.length, fetchApprovals]);

  const approval = getApprovalById(id);

  const handleApprove = async () => {
    setActionLoading(true);
    await approveRequest(id, approveComment || undefined);
    setActionLoading(false);
    setApproveDialogOpen(false);
    setApproveComment("");
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    await rejectRequest(id, rejectReason);
    setActionLoading(false);
    setRejectDialogOpen(false);
    setRejectReason("");
  };

  if (loading && !approval) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/approvals")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Approvals
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Approval request not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Approvals</span>
        <span>/</span>
        <span className="text-foreground">{approval.title}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/approvals")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{approval.title}</h1>
              <Badge className={STATUS_COLORS[approval.status]}>
                {approval.status.charAt(0) + approval.status.slice(1).toLowerCase()}
              </Badge>
              <Badge className={PRIORITY_COLORS[approval.priority]}>
                {approval.priority.charAt(0) + approval.priority.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{approval.type}</p>
          </div>
        </div>
        {approval.status === "PENDING" && (
          <div className="flex gap-2">
            <Button variant="outline" className="text-destructive gap-2" onClick={() => { setRejectReason(""); setRejectDialogOpen(true); }}>
              <XCircle className="h-4 w-4" /> Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => { setApproveComment(""); setApproveDialogOpen(true); }}>
              <CheckCircle className="h-4 w-4" /> Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Requester</p>
                <p className="text-lg font-bold">{approval.requesterName}</p>
                <p className="text-xs text-muted-foreground">{approval.requesterEmail}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-lg font-bold">{approval.departmentName}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-lg font-bold">{formatDate(approval.createdAt)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {approval.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{approval.description}</p>
          </CardContent>
        </Card>
      )}

      {approval.approvedAt && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-700">Approved by {approval.approverName}</p>
                <p className="text-sm text-green-600">{formatDate(approval.approvedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {approval.comments && (
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{approval.comments}</p>
          </CardContent>
        </Card>
      )}

      {approval.steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Approval Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approval.steps.map((step) => (
                <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Step {step.stepOrder}</span>
                    <Badge variant="outline">{step.role}</Badge>
                  </div>
                  <Badge className={STATUS_COLORS[step.status]}>
                    {step.status.charAt(0) + step.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Request</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to approve &quot;{approval.title}&quot;?</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Comment (optional)</Label>
            <Textarea value={approveComment} onChange={(e) => setApproveComment(e.target.value)} placeholder="Add a comment..." className="mt-2" rows={2} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
              {actionLoading ? "Approving..." : "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>Provide a reason for rejecting &quot;{approval.title}&quot;.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Rejection Reason *</Label>
            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." className="mt-2" rows={3} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={actionLoading || !rejectReason.trim()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {actionLoading ? "Rejecting..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
