"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface AboutUsData {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  teamMembers: TeamMember[];
}

const EditAboutUs = () => {
  const [data, setData] = useState<AboutUsData>({
    heroTitle: "",
    heroSubtitle: "",
    storyTitle: "",
    storyParagraphs: [],
    storyImage: "",
    teamMembers: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingStoryImage, setUploadingStoryImage] = useState(false);
  const [uploadingMemberIndex, setUploadingMemberIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/about-us");
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
      const response = await fetch("/api/content/about-us", {
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

  const handleStoryImageUpload = async (file: File) => {
    try {
      setUploadingStoryImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/content/about-us", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData({ ...data, storyImage: result.imageUrl });
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingStoryImage(false);
    }
  };

  const handleMemberImageUpload = async (index: number, file: File) => {
    try {
      setUploadingMemberIndex(index);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/content/about-us", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const updated = [...data.teamMembers];
        updated[index].image = result.imageUrl;
        setData({ ...data, teamMembers: updated });
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingMemberIndex(null);
    }
  };

  const addParagraph = () => {
    setData({
      ...data,
      storyParagraphs: [...data.storyParagraphs, ""],
    });
  };

  const removeParagraph = (index: number) => {
    setData({
      ...data,
      storyParagraphs: data.storyParagraphs.filter((_, i) => i !== index),
    });
  };

  const updateParagraph = (index: number, value: string) => {
    const updated = [...data.storyParagraphs];
    updated[index] = value;
    setData({ ...data, storyParagraphs: updated });
  };

  const addMember = () => {
    setData({
      ...data,
      teamMembers: [
        ...data.teamMembers,
        {
          name: "",
          role: "",
          image: "",
          description: "",
          order: data.teamMembers.length,
          isActive: true,
        },
      ],
    });
  };

  const removeMember = (index: number) => {
    setData({
      ...data,
      teamMembers: data.teamMembers.filter((_, i) => i !== index),
    });
  };

  const updateMember = (index: number, field: keyof TeamMember, value: any) => {
    const updated = [...data.teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, teamMembers: updated });
  };

  if (loading) {
    return (
      <AdminLayout title="Edit About Us" subtitle="Manage about us content">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit About Us" subtitle="Manage about us page content">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Hero Title</Label>
              <Input
                value={data.heroTitle}
                onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
                placeholder="About glowetsu"
              />
            </div>

            <div>
              <Label>Hero Subtitle</Label>
              <Textarea
                value={data.heroSubtitle}
                onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
                placeholder="Subtitle text..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card>
          <CardHeader>
            <CardTitle>Our Story Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Story Title</Label>
              <Input
                value={data.storyTitle}
                onChange={(e) => setData({ ...data, storyTitle: e.target.value })}
                placeholder="Our Story"
              />
            </div>

            <div>
              <Label>Story Image</Label>
              {data.storyImage && (
                <img
                  src={data.storyImage}
                  alt="Story"
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleStoryImageUpload(file);
                }}
                disabled={uploadingStoryImage}
              />
              {uploadingStoryImage && (
                <p className="text-sm text-gray-500 mt-1">Uploading...</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Story Paragraphs</Label>
                <Button onClick={addParagraph} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Paragraph
                </Button>
              </div>
              {data.storyParagraphs.map((paragraph, index) => (
                <div key={index} className="mb-3 flex gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateParagraph(index, e.target.value)}
                    placeholder={`Paragraph ${index + 1}...`}
                    rows={3}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeParagraph(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <Button onClick={addMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {data.teamMembers.map((member, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Team Member {index + 1}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMember(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Photo</Label>
                  {member.image && (
                    <img
                      src={member.image}
                      alt="Member"
                      className="w-32 h-32 object-cover rounded-full mb-2"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMemberImageUpload(index, file);
                    }}
                    disabled={uploadingMemberIndex === index}
                  />
                  {uploadingMemberIndex === index && (
                    <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(index, "name", e.target.value)}
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <Label>Role</Label>
                    <Input
                      value={member.role}
                      onChange={(e) => updateMember(index, "role", e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={member.description}
                    onChange={(e) => updateMember(index, "description", e.target.value)}
                    placeholder="Brief bio"
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

export default EditAboutUs;