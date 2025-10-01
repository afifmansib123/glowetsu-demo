import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWhyChooseFeature {
  icon: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface IWhyChooseUs extends Document {
  mainTitle: string;
  mainDescription: string;
  image: string;
  features: IWhyChooseFeature[];
  updatedAt: Date;
  createdAt: Date;
}

const WhyChooseFeatureSchema = new Schema<IWhyChooseFeature>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const WhyChooseUsSchema = new Schema<IWhyChooseUs>(
  {
    mainTitle: { type: String, required: true },
    mainDescription: { type: String, required: true },
    image: { type: String, required: true },
    features: [WhyChooseFeatureSchema],
  },
  {
    timestamps: true,
  }
);

const WhyChooseUs: Model<IWhyChooseUs> =
  mongoose.models.WhyChooseUs ||
  mongoose.model<IWhyChooseUs>("WhyChooseUs", WhyChooseUsSchema);

export default WhyChooseUs;