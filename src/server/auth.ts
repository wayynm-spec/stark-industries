import { supabase } from './supabase';
import { prisma } from './database';
import { Role } from '@prisma/client';
import { logger } from '@/lib/logger';

export async function getAuthUser(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error) throw error;
    return data.user;
  } catch (error) {
    logger.error('Failed to get auth user', error as Error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    return profile;
  } catch (error) {
    logger.error('Failed to get user profile', error as Error);
    return null;
  }
}

export async function createUserProfile(
  userId: string,
  email: string,
  username: string,
  displayName?: string
) {
  try {
    const profile = await prisma.profile.create({
      data: {
        userId,
        email,
        username,
        displayName,
        role: Role.USER,
      },
    });
    return profile;
  } catch (error) {
    logger.error('Failed to create user profile', error as Error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    displayName?: string;
    avatar?: string;
    bio?: string;
  }
) {
  try {
    const profile = await prisma.profile.update({
      where: { userId },
      data,
    });
    return profile;
  } catch (error) {
    logger.error('Failed to update user profile', error as Error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<Role | null> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { role: true },
    });
    return profile?.role || null;
  } catch (error) {
    logger.error('Failed to get user role', error as Error);
    return null;
  }
}

export async function validateUserPassword(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return !error;
  } catch (error) {
    logger.error('Password validation failed', error as Error);
    return false;
  }
}
