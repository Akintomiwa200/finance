"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Mail,
  Shield,
  User,
  Loader2,
  Save,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Separator } from "@/src/components/ui/separator";
import { useToast } from "@/src/components/ui/use-toast";
import { useAuthStore } from "@/src/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
  formatProfileDate,
  formatRole,
  getInitials,
} from "@/src/lib/profile-utils";
import { ProfilePageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useOrganization } from "@/src/hooks/use-organization";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Must be a valid email"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ProfileEditorProps {
  workspaceLabel: string;
  accessLabel: string;
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  department: string | null;
  bio: string | null;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
  updatedAt: string | null;
}

export function ProfileEditor({ workspaceLabel, accessLabel }: ProfileEditorProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s._hydrated);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarCacheBust, setAvatarCacheBust] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const fetchedRef = useRef(false);
  const { data: organization } = useOrganization();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      department: "",
      bio: "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watched = profileForm.watch();
  const roleLabel = formatRole(user?.role || profileData?.role);
  const displayName =
    `${watched.firstName} ${watched.lastName}`.trim() || user?.name || "User";
  const displayEmail = watched.email || user?.email || "—";
  const displayInitials = getInitials(displayName);
  const avatarUrl = profileData?.avatarUrl || user?.avatarUrl;

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Profile fetch failed:", res.status, err);
        throw new Error(err.error || "Failed to fetch profile");
      }
      const data: ProfileData = await res.json();
      setProfileData(data);

      profileForm.reset({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        jobTitle: data.jobTitle || "",
        department: data.department || "",
        bio: data.bio || "",
      });

      updateProfile({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone ?? undefined,
        jobTitle: data.jobTitle ?? undefined,
        bio: data.bio ?? undefined,
        avatarUrl: data.avatarUrl ?? undefined,
        createdAt: data.createdAt ?? undefined,
        lastLoginAt: data.lastLoginAt ?? undefined,
        isActive: data.isActive,
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (user) {
        const nameParts = (user.name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        profileForm.reset({
          firstName,
          lastName,
          email: user.email ?? "",
          phone: user.phone ?? "",
          jobTitle: user.jobTitle ?? "",
          department: user.department ?? "",
          bio: user.bio ?? "",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, profileForm, updateProfile]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchProfile();
  }, [fetchProfile]);

  async function onProfileSubmit(data: ProfileFormValues) {
    setIsProfileSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName || "",
          email: data.email,
          phone: data.phone || null,
          jobTitle: data.jobTitle || null,
          bio: data.bio || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update profile");
      }

      const updated = await res.json();
      setProfileData((prev) => (prev ? { ...prev, ...updated } : prev));
      updateProfile({
        name: `${updated.firstName} ${updated.lastName}`,
        email: updated.email,
        phone: updated.phone ?? undefined,
        jobTitle: updated.jobTitle ?? undefined,
        bio: updated.bio ?? undefined,
      });

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsProfileSaving(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsPasswordLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update password");
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const url = reader.result as string;
      setAvatarPreview(url);
      try {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl: url }),
        });
        if (!res.ok) throw new Error("Failed to save avatar");

        setProfileData((prev) => (prev ? { ...prev, avatarUrl: url } : prev));
        updateProfile({ avatarUrl: url });
        setAvatarCacheBust((n) => n + 1);
        toast({
          title: "Avatar updated",
          description: "Your profile picture is now visible across the app.",
        });
      } catch {
        setAvatarPreview(null);
        toast({
          title: "Error",
          description: "Failed to update avatar",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleDeactivate() {
    setIsDeactivating(true);
    try {
      const res = await fetch("/api/profile/deactivate", { method: "POST" });
      if (!res.ok) throw new Error("Failed to deactivate");

      updateProfile({ isActive: false, activeSessions: 0 });
      toast({
        title: "Account deactivated",
        description: "Your account has been temporarily disabled.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to deactivate account",
        variant: "destructive",
      });
    } finally {
      setIsDeactivating(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/profile/delete", { method: "POST" });
      if (!res.ok) throw new Error("Failed to delete");

      logout();
      await signOut({ redirect: false });
      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted.",
        variant: "destructive",
      });
      router.push("/login");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  }

  if (!hydrated || !user || loading) {
    return <ProfilePageSkeleton />;
  }

  const avatarSrc = avatarPreview || (avatarUrl && !avatarUrl.startsWith("data:") ? `${avatarUrl}?v=${avatarCacheBust}` : avatarUrl);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="bg-brand-100 text-2xl font-semibold text-brand-700">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer hover:bg-black/60 transition-colors"
              >
                <Camera className="h-6 w-6 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <CardTitle>{displayName}</CardTitle>
              <CardDescription>{displayEmail}</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit">
              {roleLabel}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">
                {organization?.name || workspaceLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="break-all">{displayEmail}</span>
            </div>
            {watched.phone && watched.phone !== "null" && watched.phone !== "" ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wide">Phone</span>
                <span>{watched.phone}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4 shrink-0" />
              {accessLabel}
            </div>
            {watched.bio && watched.bio !== "null" && watched.bio !== "" ? (
              <p className="text-xs text-muted-foreground border-t border-dashed pt-3 leading-relaxed">
                {watched.bio}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Account Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Last login</span>
              <span className="font-medium text-right">
                {formatProfileDate(user.lastLoginAt)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Account created</span>
              <span className="font-medium text-right">
                {formatProfileDate(user.createdAt)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Sessions</span>
              <span className="font-medium">
                {user.isActive === false ? 0 : (user.activeSessions ?? 1)} active
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={user.isActive === false ? "default" : "success"}>
                {user.isActive === false ? "Deactivated" : "Active"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Changes save to the database and update the sidebar in real time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter job title" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Department" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Department is set by your administrator.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us about yourself..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Max 500 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2 md:col-span-2">
                    <Label>Role</Label>
                    <Input value={roleLabel} disabled />
                    <p className="text-xs text-muted-foreground">
                      Role cannot be changed from this screen.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={!profileForm.formState.isValid || isProfileSaving}>
                    {isProfileSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Confirm Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormDescription>
                        At least 8 characters with uppercase, lowercase, and numbers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="secondary" disabled={isPasswordLoading}>
                    {isPasswordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Deactivate Account</p>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable your account and access
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                disabled={user.isActive === false || isDeactivating}
                onClick={() => setShowDeactivateDialog(true)}
              >
                {isDeactivating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Deactivate"
                )}
              </Button>
            </div>

            {showDeactivateDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="absolute inset-0" onClick={() => setShowDeactivateDialog(false)} />
                <div className="relative z-10 w-full max-w-md mx-4 rounded-xl border border-border bg-background shadow-lg p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h2 className="text-lg font-semibold">Deactivate Account</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This will temporarily disable your account. You will be logged out and won&apos;t
                    be able to sign in until an administrator reactivates your account.
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowDeactivateDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        setShowDeactivateDialog(false);
                        handleDeactivate();
                      }}
                    >
                      Yes, Deactivate
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={() => setShowDeleteDialog(true)}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete Account"
                )}
              </Button>
            </div>

            {showDeleteDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="absolute inset-0" onClick={() => setShowDeleteDialog(false)} />
                <div className="relative z-10 w-full max-w-md mx-4 rounded-xl border border-border bg-background shadow-lg p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h2 className="text-lg font-semibold">Delete Account Permanently</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete your account,
                    all your expense reports, reimbursements, approvals, and payroll data.
                    You will be immediately logged out.
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setShowDeleteDialog(false);
                        handleDelete();
                      }}
                    >
                      Yes, Delete My Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
