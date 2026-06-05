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
import { Textarea } from "@/src/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Users,
  Briefcase,
  CreditCard,
  FileText,
  Save,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Types
interface CompanyProfile {
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  vatNumber: string;
  email: string;
  phone: string;
  mobile: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  foundedYear: string;
  employeeCount: string;
  industry: string;
  description: string;
  logo: string;
  coverImage: string;
  socialMedia: {
    twitter: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    sortCode: string;
    swiftCode: string;
  };
  taxDetails: {
    taxOffice: string;
    taxType: string;
    filingFrequency: string;
  };
}

// Mock initial data
const initialProfile: CompanyProfile = {
  name: "Enterprise Solutions Ltd",
  legalName: "Enterprise Solutions Limited",
  registrationNumber: "RC 1234567",
  taxId: "TAX-12345678-001",
  vatNumber: "NG-1234567-001",
  email: "info@enterprisesolutions.com",
  phone: "+234 123 456 7890",
  mobile: "+234 802 345 6789",
  website: "www.enterprisesolutions.com",
  address: {
    street: "123, Corporate Avenue",
    city: "Victoria Island",
    state: "Lagos",
    postalCode: "101241",
    country: "Nigeria",
  },
  foundedYear: "2015",
  employeeCount: "250",
  industry: "Technology & Software",
  description:
    "Enterprise Solutions Ltd is a leading provider of business software solutions, helping companies streamline their operations with innovative technology. Founded in 2015, we have grown to serve over 500 businesses across Nigeria and West Africa.",
  logo: "/logo.png",
  coverImage: "/cover.jpg",
  socialMedia: {
    twitter: "https://twitter.com/enterprisesol",
    linkedin: "https://linkedin.com/company/enterprise-solutions",
    facebook: "https://facebook.com/enterprisesolutions",
    instagram: "https://instagram.com/enterprisesolutions",
    youtube: "https://youtube.com/enterprisesolutions",
  },
  bankDetails: {
    bankName: "First Bank of Nigeria",
    accountName: "Enterprise Solutions Ltd",
    accountNumber: "2034567890",
    sortCode: "011234567",
    swiftCode: "FIRSTNGLA",
  },
  taxDetails: {
    taxOffice: "Lagos State Internal Revenue Service",
    taxType: "Company Income Tax",
    filingFrequency: "Monthly",
  },
};

export default function OrganizationProfile() {
  const router = useRouter();

  // State
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value },
    }));
  };

  const handleTaxDetailsChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      taxDetails: { ...prev.taxDetails, [field]: value },
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!profile.name) errors.name = "Company name is required";
    if (!profile.email) errors.email = "Email is required";
    if (!profile.phone) errors.phone = "Phone number is required";
    if (!profile.address.street) errors.street = "Street address is required";
    if (!profile.address.city) errors.city = "City is required";
    if (!profile.address.state) errors.state = "State is required";
    if (!profile.address.country) errors.country = "Country is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleLogoUpload = () => {
    // Implement logo upload logic
    console.log("Upload logo");
  };

  const handleCoverUpload = () => {
    // Implement cover image upload logic
    console.log("Upload cover image");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
              <Building2 className="h-6 w-6" />
              Company Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your organization's profile information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span>Profile updated successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cover Image & Logo */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          {isEditing && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4"
              onClick={handleCoverUpload}
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Cover
            </Button>
          )}
        </div>
        <div className="relative px-6 pb-6">
          <div className="absolute -top-12 left-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background bg-white">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  onClick={handleLogoUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="tax">Tax Info</TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic company information and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Legal Name</Label>
                  <Input
                    value={profile.legalName}
                    onChange={(e) =>
                      handleInputChange("legalName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Registration Number</Label>
                  <Input
                    value={profile.registrationNumber}
                    onChange={(e) =>
                      handleInputChange("registrationNumber", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Tax ID / TIN</Label>
                  <Input
                    value={profile.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>VAT Number</Label>
                  <Input
                    value={profile.vatNumber}
                    onChange={(e) =>
                      handleInputChange("vatNumber", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input
                    value={profile.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Founded Year</Label>
                  <Input
                    value={profile.foundedYear}
                    onChange={(e) =>
                      handleInputChange("foundedYear", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Employee Count</Label>
                  <Input
                    value={profile.employeeCount}
                    onChange={(e) =>
                      handleInputChange("employeeCount", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label>Company Description</Label>
                <Textarea
                  value={profile.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={!isEditing}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone
                  </Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Mobile Phone</Label>
                  <Input
                    value={profile.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>
                    <Globe className="h-4 w-4 inline mr-2" />
                    Website
                  </Label>
                  <Input
                    value={profile.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>
                Company physical address and location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Street Address *</Label>
                <Input
                  value={profile.address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                  disabled={!isEditing}
                  className={formErrors.street ? "border-red-500" : ""}
                />
                {formErrors.street && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.street}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    value={profile.address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    disabled={!isEditing}
                    className={formErrors.city ? "border-red-500" : ""}
                  />
                  {formErrors.city && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label>State *</Label>
                  <Input
                    value={profile.address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    disabled={!isEditing}
                    className={formErrors.state ? "border-red-500" : ""}
                  />
                  {formErrors.state && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.state}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input
                    value={profile.address.postalCode}
                    onChange={(e) =>
                      handleAddressChange("postalCode", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Country *</Label>
                  <Input
                    value={profile.address.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                    disabled={!isEditing}
                    className={formErrors.country ? "border-red-500" : ""}
                  />
                  {formErrors.country && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.country}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    <X className="h-4 w-4 inline mr-2 text-blue-400" />
                    X (Twitter)
                  </Label>
                  <Input
                    value={profile.socialMedia.twitter}
                    onChange={(e) =>
                      handleSocialMediaChange("twitter", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <Label>
                    <ExternalLink className="h-4 w-4 inline mr-2 text-blue-700" />
                    LinkedIn
                  </Label>
                  <Input
                    value={profile.socialMedia.linkedin}
                    onChange={(e) =>
                      handleSocialMediaChange("linkedin", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div>
                  <Label>
                    <Globe className="h-4 w-4 inline mr-2 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    value={profile.socialMedia.facebook}
                    onChange={(e) =>
                      handleSocialMediaChange("facebook", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <Label>
                    <Camera className="h-4 w-4 inline mr-2 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    value={profile.socialMedia.instagram}
                    onChange={(e) =>
                      handleSocialMediaChange("instagram", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <Label>
                    <Play className="h-4 w-4 inline mr-2 text-red-600" />
                    YouTube
                  </Label>
                  <Input
                    value={profile.socialMedia.youtube}
                    onChange={(e) =>
                      handleSocialMediaChange("youtube", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Account Details</CardTitle>
              <CardDescription>Company banking information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={profile.bankDetails.bankName}
                    onChange={(e) =>
                      handleBankDetailsChange("bankName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input
                    value={profile.bankDetails.accountName}
                    onChange={(e) =>
                      handleBankDetailsChange("accountName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={profile.bankDetails.accountNumber}
                    onChange={(e) =>
                      handleBankDetailsChange("accountNumber", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Sort Code</Label>
                  <Input
                    value={profile.bankDetails.sortCode}
                    onChange={(e) =>
                      handleBankDetailsChange("sortCode", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>SWIFT Code</Label>
                  <Input
                    value={profile.bankDetails.swiftCode}
                    onChange={(e) =>
                      handleBankDetailsChange("swiftCode", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Info Tab */}
        <TabsContent value="tax" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>
                Tax registration and filing details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tax Office</Label>
                  <Input
                    value={profile.taxDetails.taxOffice}
                    onChange={(e) =>
                      handleTaxDetailsChange("taxOffice", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Tax Type</Label>
                  <Input
                    value={profile.taxDetails.taxType}
                    onChange={(e) =>
                      handleTaxDetailsChange("taxType", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Filing Frequency</Label>
                  <Input
                    value={profile.taxDetails.filingFrequency}
                    onChange={(e) =>
                      handleTaxDetailsChange("filingFrequency", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Section (Read-only mode) */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
            <CardDescription>
              How your company profile appears to others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.industry}</p>
                  <p className="text-sm mt-2">{profile.description}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {profile.address.city}, {profile.address.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.website}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
