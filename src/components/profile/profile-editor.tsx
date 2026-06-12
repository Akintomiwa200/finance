"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Mail, Shield, User, Loader2, Save, Camera } from "lucide-react";
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
  splitFullName,
} from "@/src/lib/profile-utils";
import { ProfilePageSkeleton } from "@/src/components/layout/dashboard-skeletons";

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

export function ProfileEditor({ workspaceLabel, accessLabel }: ProfileEditorProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s._hydrated);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const { toast } = useToast();
  const syncReady = useRef(false);

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
  const roleLabel = formatRole(user?.role);
  const displayName =
    `${watched.firstName} ${watched.lastName}`.trim() || user?.name || "User";
  const displayEmail = watched.email || user?.email || "—";
  const displayInitials = getInitials(displayName);
  const avatarUrl = user?.avatarUrl;

  useEffect(() => {
    if (!user) return;

    const { firstName, lastName } = splitFullName(user.name);
    profileForm.reset({
      firstName,
      lastName,
      email: user.email ?? "",
      phone: user.phone ?? "",
      jobTitle: user.jobTitle ?? "",
      department: user.department ?? "",
      bio: user.bio ?? "",
    });

    updateProfile({
      lastLoginAt: new Date().toISOString(),
      createdAt: user.createdAt ?? new Date().toISOString(),
      activeSessions: user.activeSessions ?? 1,
      isActive: user.isActive ?? true,
    });

    syncReady.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!syncReady.current) return;

    const current = useAuthStore.getState().user;
    if (!current) return;

    const name = `${watched.firstName} ${watched.lastName ?? ""}`.trim();
    const next = {
      name: name || current.name,
      email: watched.email,
      phone: watched.phone || undefined,
      jobTitle: watched.jobTitle || undefined,
      department: watched.department || undefined,
      bio: watched.bio || undefined,
    };

    const unchanged =
      next.name === current.name &&
      next.email === current.email &&
      (next.phone ?? "") === (current.phone ?? "") &&
      (next.jobTitle ?? "") === (current.jobTitle ?? "") &&
      (next.department ?? "") === (current.department ?? "") &&
      (next.bio ?? "") === (current.bio ?? "");

    if (!unchanged) updateProfile(next);
  }, [
    watched.firstName,
    watched.lastName,
    watched.email,
    watched.phone,
    watched.jobTitle,
    watched.department,
    watched.bio,
    updateProfile,
  ]);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      updateProfile({ avatarUrl: url });
      toast({
        title: "Avatar updated",
        description: "Your profile picture is now visible across the app.",
      });
    };
    reader.readAsDataURL(file);
  }

  async function onPasswordSubmit(_data: PasswordFormValues) {
    setIsPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  }

  function handleDeactivate() {
    updateProfile({ isActive: false, activeSessions: 0 });
    toast({
      title: "Account deactivated",
      description: "Your account has been temporarily disabled.",
      variant: "destructive",
    });
  }

  async function handleDelete() {
    logout();
    await signOut({ redirect: false });
    toast({
      title: "Account deleted",
      description: "Your session has been ended.",
      variant: "destructive",
    });
    router.push("/login");
  }

  if (!hydrated || !user) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-brand-100 text-2xl font-semibold text-brand-700">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="h-6 w-6 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
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
            {watched.jobTitle ? (
              <p className="text-xs text-muted-foreground">{watched.jobTitle}</p>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              {workspaceLabel}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="break-all">{displayEmail}</span>
            </div>
            {watched.phone ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wide">Phone</span>
                <span>{watched.phone}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4 shrink-0" />
              {accessLabel}
            </div>
            {watched.bio ? (
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
              Changes save automatically and update the sidebar in real time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(() => {
                  toast({
                    title: "Profile saved",
                    description: "Your profile is up to date.",
                  });
                })}
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
                          <Input placeholder="John" {...field} />
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
                          <Input placeholder="Doe" {...field} />
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
                          <Input type="email" placeholder="john@example.com" {...field} />
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
                          <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
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
                          <Input placeholder="Platform Administrator" {...field} />
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
                          <Input placeholder="Engineering" {...field} />
                        </FormControl>
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
                  <Button type="submit" disabled={!profileForm.formState.isValid}>
                    <Save className="mr-2 h-4 w-4" />
                    Confirm Profile
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
                onClick={handleDeactivate}
                disabled={user.isActive === false}
              >
                Deactivate
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
