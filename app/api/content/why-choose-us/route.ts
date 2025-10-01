import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import WhyChooseUs from "@/lib/model/WhyChooseUs";
import { uploadFileToS3 } from "@/lib/s3";

// GET - Fetch why choose us content
export async function GET() {
  try {
    await db.connect();
    
    let whyChoose = await WhyChooseUs.findOne();
    
    if (!whyChoose) {
      whyChoose = await WhyChooseUs.create({
        mainTitle: "Why Choose glowetsu?",
        mainDescription: "With over 15 years of experience in creating unforgettable travel experiences, we specialize in crafting personalized tours that connect you with the heart and soul of each destination.",
        image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=600",
        features: [
          {
            icon: "Users",
            title: "Expert Local Guides",
            description: "Our passionate local guides share insider knowledge and hidden gems",
            order: 0,
            isActive: true,
          },
          {
            icon: "Star",
            title: "Premium Quality",
            description: "Carefully selected accommodations and transportation for your comfort",
            order: 1,
            isActive: true,
          },
          {
            icon: "MapPin",
            title: "Unique Destinations",
            description: "From popular attractions to off-the-beaten-path adventures",
            order: 2,
            isActive: true,
          },
        ],
      });
    }
    
    return NextResponse.json(whyChoose, { status: 200 });
  } catch (error) {
    console.error("Error fetching why choose us:", error);
    return NextResponse.json(
      { message: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// PUT - Update why choose us content
export async function PUT(req: NextRequest) {
  try {
    await db.connect();
    
    const body = await req.json();
    const { mainTitle, mainDescription, image, features } = body;
    
    let whyChoose = await WhyChooseUs.findOne();
    
    if (!whyChoose) {
      whyChoose = new WhyChooseUs({ mainTitle, mainDescription, image, features });
    } else {
      if (mainTitle) whyChoose.mainTitle = mainTitle;
      if (mainDescription) whyChoose.mainDescription = mainDescription;
      if (image) whyChoose.image = image;
      if (features) whyChoose.features = features;
    }
    
    await whyChoose.save();
    
    return NextResponse.json(
      { message: "Content updated successfully", whyChoose },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating why choose us:", error);
    return NextResponse.json(
      { message: "Failed to update content" },
      { status: 500 }
    );
  }
}

// POST - Upload image to S3
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
    
    const imageUrl = await uploadFileToS3(file);
    
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { message: "Failed to upload image" },
      { status: 500 }
    );
  }
}