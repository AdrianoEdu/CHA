export interface EmployeeDto {
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateEmployeeDto = Partial<EmployeeDto>;