export interface IAvailability {
  _id: string;
  doctorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
