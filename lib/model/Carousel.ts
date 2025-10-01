import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean;
}

export interface ICarousel extends Document {
  slides: ICarouselSlide[];
  updatedAt: Date;
  createdAt: Date;
}

const CarouselSlideSchema = new Schema<ICarouselSlide>({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  buttonText: { type: String, default: "Explore Now" },
  buttonLink: { type: String, default: "/tours" },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const CarouselSchema = new Schema<ICarousel>(
  {
    slides: [CarouselSlideSchema],
  },
  {
    timestamps: true,
  }
);

const Carousel: Model<ICarousel> =
  mongoose.models.Carousel || mongoose.model<ICarousel>("Carousel", CarouselSchema);

export default Carousel;