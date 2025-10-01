"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Plus, Trash2, Save, Upload } from "lucide-react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

interface CarouselSlide {
  _id?: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  order: number;
}

const EditCarousel = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    try {
      const response = await fetch("/api/content/carousel");
      if (response.ok) {
        const data = await response.json();
        setSlides(data.slides || []);
      }
    } catch (error) {
      console.error("Error fetching carousel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/content/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });
      
      if (response.ok) {
        alert("Carousel updated successfully!");
      } else {
        alert("Failed to save carousel");
      }
    } catch (error) {
      console.error("Error saving carousel:", error);
      alert("Failed to save carousel");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/content/carousel", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const updated = [...slides];
        updated[index].image = data.imageUrl;
        setSlides(updated);
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        image: "",
        title: "",
        subtitle: "",
        buttonText: "Explore Now",
        buttonLink: "/tours",
        order: slides.length,
      },
    ]);
  };

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, field: keyof CarouselSlide, value: string | number) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Header Carousel" subtitle="Manage homepage carousel">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Header Carousel" subtitle="Manage homepage carousel slides">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button onClick={addSlide}>
            <Plus className="h-4 w-4 mr-2" />
            Add Slide
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {slides.map((slide, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Slide {index + 1}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSlide(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label>Slide Image</Label>
                {slide.image && (
                  <img
                    src={slide.image}
                    alt="Slide preview"
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(index, file);
                  }}
                  disabled={uploadingIndex === index}
                />
                {uploadingIndex === index && (
                  <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                )}
              </div>

              {/* Title */}
              <div>
                <Label>Title</Label>
                <Input
                  value={slide.title}
                  onChange={(e) => updateSlide(index, "title", e.target.value)}
                  placeholder="Slide title"
                />
              </div>

              {/* Subtitle */}
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                  placeholder="Slide subtitle/description"
                  rows={3}
                />
              </div>

              {/* Button Text */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={slide.buttonText}
                    onChange={(e) => updateSlide(index, "buttonText", e.target.value)}
                    placeholder="Button text"
                  />
                </div>

                {/* Button Link */}
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={slide.buttonLink}
                    onChange={(e) => updateSlide(index, "buttonLink", e.target.value)}
                    placeholder="/tours"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default EditCarousel;