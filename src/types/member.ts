// Member-related types

export interface Member {
  _id: string;
  name: string;
  email: string;
  YOB: number;
  gender: boolean;
  isAdmin: boolean;
}

export interface MemberProfile {
  _id: string;
  name: string;
  email: string;
  YOB: number;
  gender: boolean;
}

export interface UpdateProfileData {
  name?: string;
  YOB?: number;
  gender?: boolean;
}
