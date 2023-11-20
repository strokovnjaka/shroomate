import { Photo } from "./photo";

export class Sighting {
  _id!: string;
  note!: string;
  photos!: Photo[];
  position!: [number, number];
  species!: string;
  timestamp!: Date;
  user!: string;
  visibility!: string;
}
