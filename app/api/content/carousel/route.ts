import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import Carousel from "@/lib/model/Carousel";
import { uploadFileToS3 } from "@/lib/s3";

// GET - Fetch carousel slides
export async function GET() {
  try {
    await db.connect()
    
    let carousel = await Carousel.findOne();
    
    if (!carousel) {
      carousel = await Carousel.create({
        slides: [
          {
            image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200",
            title: "Discover Amazing Destinations",
            subtitle: "Experience the world like never before with our curated travel packages",
            buttonText: "Explore Tours",
            buttonLink: "/tours",
            order: 0,
            isActive: true,
          },
        ],
      });
    }
    
    return NextResponse.json({ slides: carousel.slides }, { status: 200 });
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return NextResponse.json(
      { message: "Failed to fetch carousel" },
      { status: 500 }
    );
  }
}

// PUT - Update carousel slides
export async function PUT(req: NextRequest) {
  try {
    await db.connect()
    
    const body = await req.json();
    const { slides } = body;
    
    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { message: "Slides array is required" },
        { status: 400 }
      );
    }
    
    let carousel = await Carousel.findOne();
    
    if (!carousel) {
      carousel = new Carousel({ slides });
    } else {
      carousel.slides = slides;
    }
    
    await carousel.save();
    
    return NextResponse.json(
      { message: "Carousel updated successfully", carousel },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating carousel:", error);
    return NextResponse.json(
      { message: "Failed to update carousel" },
      { status: 500 }
    );
  }
}

// POST - Upload carousel image to S3
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    
    if (!file || file.size === 0) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }
    
    // Upload to S3 using your existing function
    const imageUrl = await uploadFileToS3(file);
    
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading carousel image:", error);
    return NextResponse.json(
      { message: "Failed to upload image" },
      { status: 500 }
    );
  }
}