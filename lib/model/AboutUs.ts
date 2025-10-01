import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface IAboutUs extends Document {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  teamMembers: ITeamMember[];
  updatedAt: Date;
  createdAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const AboutUsSchema = new Schema<IAboutUs>(
  {
    heroTitle: { type: String, required: true, default: "About glowetsu" },
    heroSubtitle: { type: String, required: true, default: "Creating unforgettable memories through authentic travel experiences since 2008" },
    storyTitle: { type: String, required: true, default: "Our Story" },
    storyParagraphs: [{ type: String }],
    storyImage: { type: String, required: true },
    teamMembers: [TeamMemberSchema],
  },
  {
    timestamps: true,
  }
);

const AboutUs: Model<IAboutUs> =
  mongoose.models.AboutUs || mongoose.model<IAboutUs>("AboutUs", AboutUsSchema);

export default AboutUs;