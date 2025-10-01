"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Feature {
  icon: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface WhyChooseUsData {
  mainTitle: string;
  mainDescription: string;
  image: string;
  features: Feature[];
}

const ICON_OPTIONS = [
  "Users",
  "Star",
  "MapPin",
  "Award",
  "Heart",
  "Globe",
  "Shield",
  "Zap",
  "TrendingUp",
  "Clock",
];

const EditWhyChooseUs = () => {
  const [data, setData] = useState<WhyChooseUsData>({
    mainTitle: "",
    mainDescription: "",
    image: "",
    features: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/why-choose-us");
      if (response.ok) {
        const content = await response.json();
        setData(content);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/content/why-choose-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert("Content updated successfully!");
      } else {
        alert("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/content/why-choose-us", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData({ ...data, image: result.imageUrl });
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const addFeature = () => {
    setData({
      ...data,
      features: [
        ...data.features,
        {
          icon: "Users",
          title: "",
          description: "",
          order: data.features.length,
          isActive: true,
        },
      ],
    });
  };

  const removeFeature = (index: number) => {
    setData({
      ...data,
      features: data.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, field: keyof Feature, value: any) => {
    const updated = [...data.features];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, features: updated });
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Why Choose Us" subtitle="Manage why choose us section">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Why Choose Us" subtitle="Manage why choose us section content">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Main Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Main Title</Label>
              <Input
                value={data.mainTitle}
                onChange={(e) => setData({ ...data, mainTitle: e.target.value })}
                placeholder="Why Choose glowetsu?"
              />
            </div>

            <div>
              <Label>Main Description</Label>
              <Textarea
                value={data.mainDescription}
                onChange={(e) => setData({ ...data, mainDescription: e.target.value })}
                placeholder="Description text..."
                rows={4}
              />
            </div>

            <div>
              <Label>Image</Label>
              {data.image && (
                <img
                  src={data.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <p className="text-sm text-gray-500 mt-1">Uploading...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <Button onClick={addFeature} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>

          {data.features.map((feature, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Feature {index + 1}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Icon</Label>
                  <Select
                    value={feature.icon}
                    onValueChange={(value) => updateFeature(index, "icon", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(index, "title", e.target.value)}
                    placeholder="Feature title"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(index, "description", e.target.value)}
                    placeholder="Feature description"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditWhyChooseUs;