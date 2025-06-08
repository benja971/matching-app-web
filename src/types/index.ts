// Backend DTO types
export interface UserResponseDTO {
  id: string // UUID
  email: string
  profile_id?: string // Optional UUID
}

export interface LoginResponseDTO {
  user: UserResponseDTO
  token: string
}

export interface ProfileResponseDTO {
  id: string // UUID
  first_name: string
  last_name: string
  bio: string
  age: number
  gender: string
  interests: string[]
  location: string
}

export interface CreateProfileDTO {
  first_name: string
  last_name: string
  bio: string
  age: number
  gender: string
  interests: string[]
  location: string
}

export interface UpdateProfileDTO {
  first_name: string
  last_name: string
  bio: string
  age: number
  gender: string
  interests: string[]
  location: string
  is_active: boolean
}

export interface FeedProfileDTO {
  id: string // UUID
  first_name: string
  last_name: string
  bio: string
  age: number
  gender: string
  interests: string[]
  location: string
}

export interface FeedResponseDTO {
  profiles: FeedProfileDTO[]
  has_more: boolean
  next_page?: number
}

// Frontend types (camelCase for consistency)
export interface User {
  id: string
  email: string
  profileId?: string // Optional, can be undefined if no profile is linked
}

export interface Profile {
  id: string
  firstName: string
  lastName: string
  bio: string
  age: number
  gender: string
  interests: string[]
  location: string
  isActive?: boolean
}

export interface UserPreferences {
  ageRange: {
    min: number
    max: number
  }
  maxDistance: number
  interests: string[]
}

// Combined type for matching that includes user and profile data
export interface MatchUser {
  id: string
  email: string
  firstName: string
  lastName: string
  bio: string
  age: number
  gender: string
  interests: string[]
  location: string
  avatar?: string
  preferences?: UserPreferences
  createdAt: Date
  updatedAt: Date
}

// Match related types
export interface Match {
  id: string
  userId1: string
  userId2: string
  status: MatchStatus
  createdAt: Date
  messages?: Message[]
}

export const MatchStatus = {
  PENDING: 'pending',
  MATCHED: 'matched',
  REJECTED: 'rejected',
} as const

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus]

// Message related types
export interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  timestamp: Date
  isRead: boolean
}

// API related types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Helper functions to convert between backend DTOs and frontend types
export function profileDTOToProfile(dto: ProfileResponseDTO): Profile {
  return {
    id: dto.id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    bio: dto.bio,
    age: dto.age,
    gender: dto.gender,
    interests: dto.interests,
    location: dto.location,
  }
}

export function profileToCreateDTO(profile: Omit<Profile, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): CreateProfileDTO {
  return {
    first_name: profile.firstName,
    last_name: profile.lastName,
    bio: profile.bio,
    age: profile.age,
    gender: profile.gender,
    interests: profile.interests,
    location: profile.location,
  }
}

export function profileToUpdateDTO(profile: Partial<Profile>): UpdateProfileDTO {
  return {
    first_name: profile.firstName || '',
    last_name: profile.lastName || '',
    bio: profile.bio || '',
    age: profile.age || 0,
    gender: profile.gender || '',
    interests: profile.interests || [],
    location: profile.location || '',
    is_active: profile.isActive || false,
  }
}

export function feedProfileDTOToProfile(dto: FeedProfileDTO): Profile {
  return {
    id: dto.id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    bio: dto.bio,
    age: dto.age,
    gender: dto.gender,
    interests: dto.interests,
    location: dto.location,
  }
}

export function feedProfileDTOToMatchUser(dto: FeedProfileDTO): MatchUser {
  return {
    id: dto.id,
    email: '', // Not provided in feed
    firstName: dto.first_name,
    lastName: dto.last_name,
    bio: dto.bio,
    age: dto.age,
    gender: dto.gender,
    interests: dto.interests,
    location: dto.location,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
