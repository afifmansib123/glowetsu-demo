import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import AboutUs from "@/lib/model/AboutUs";
import { uploadFileToS3 } from "@/lib/s3";

// GET - Fetch about us content
export async function GET() {
  try {
    await db.connect();
    
    let aboutUs = await AboutUs.findOne();
    
    if (!aboutUs) {
      aboutUs = await AboutUs.create({
        heroTitle: "About glowetsu",
        heroSubtitle: "Creating unforgettable memories through authentic travel experiences since 2008",
        storyTitle: "Our Story",
        storyParagraphs: [
          "Founded in 2008 by a group of passionate travelers, glowetsu was born from a simple belief: travel should transform lives, not just provide vacations.",
          "We started as a small team organizing adventure trips for friends and family. Word spread quickly about our attention to detail, authentic experiences, and commitment to sustainable tourism.",
          "Today, we're proud to have guided over 50,000 travelers to more than 120 destinations worldwide, while maintaining our core values of authenticity, sustainability, and creating meaningful connections between travelers and local communities."
        ],
        storyImage: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600",
        teamMembers: [
          {
            name: "Sarah Johnson",
            role: "Founder & CEO",
            image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
            description: "Passionate traveler with 20 years in the tourism industry",
            order: 0,
            isActive: true,
          },
        ],
      });
    }
    
    return NextResponse.json(aboutUs, { status: 200 });
  } catch (error) {
    console.error("Error fetching about us:", error);
    return NextResponse.json(
      { message: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// PUT - Update about us content
export async function PUT(req: NextRequest) {
  try {
    await db.connect();
    
    const body = await req.json();
    const { heroTitle, heroSubtitle, storyTitle, storyParagraphs, storyImage, teamMembers } = body;
    
    let aboutUs = await AboutUs.findOne();
    
    if (!aboutUs) {
      aboutUs = new AboutUs({ 
        heroTitle, 
        heroSubtitle, 
        storyTitle, 
        storyParagraphs, 
        storyImage, 
        teamMembers 
      });
    } else {
      if (heroTitle !== undefined) aboutUs.heroTitle = heroTitle;
      if (heroSubtitle !== undefined) aboutUs.heroSubtitle = heroSubtitle;
      if (storyTitle !== undefined) aboutUs.storyTitle = storyTitle;
      if (storyParagraphs !== undefined) aboutUs.storyParagraphs = storyParagraphs;
      if (storyImage !== undefined) aboutUs.storyImage = storyImage;
      if (teamMembers !== undefined) aboutUs.teamMembers = teamMembers;
    }
    
    await aboutUs.save();
    
    return NextResponse.json(
      { message: "Content updated successfully", aboutUs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating about us:", error);
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