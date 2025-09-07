// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import PPDBRegisterClient from './PPDBRegisterClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Users,
  School,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  AlertCircle,
  Loader2,
  Calendar,
  Heart,
} from 'lucide-react';

interface FormData {
  // Personal
  fullName: string;
  nickname: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  nik: string;
  nisn: string;
  
  // Address
  address: string;
  rt: string;
  rw: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  
  // Education
  level: string;
  previousSchool: string;
  gradeTarget: string;
  programType: string;
  boardingType: string;
  
  // Father
  fatherName: string;
  fatherNik: string;
  fatherJob: string;
  fatherPhone: string;
  fatherEducation: string;
  fatherIncome: string;
  
  // Mother
  motherName: string;
  motherNik: string;
  motherJob: string;
  motherPhone: string;
  motherEducation: string;
  motherIncome: string;
  
  // Guardian
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianAddress: string;
  
  // Contact
  phoneNumber: string;
  whatsapp: string;
  email: string;
  
  // Health
  bloodType: string;
  height: string;
  weight: string;
  specialNeeds: string;
  medicalHistory: string;
  
  // Documents
  documents: Array<{
    type: string;
    fileName: string;
    url: string;
    status: string;
  }>;
}

const initialFormData: FormData = {
  fullName: '',
  nickname: '',
  gender: '',
  birthPlace: '',
  birthDate: '',
  nik: '',
  nisn: '',
  address: '',
  rt: '',
  rw: '',
  village: '',
  district: '',
  city: 'Blitar',
  province: 'Jawa Timur',
  postalCode: '',
  level: '',
  previousSchool: '',
  gradeTarget: '',
  programType: 'REGULER',
  boardingType: '',
  fatherName: '',
  fatherNik: '',
  fatherJob: '',
  fatherPhone: '',
  fatherEducation: '',
  fatherIncome: '',
  motherName: '',
  motherNik: '',
  motherJob: '',
  motherPhone: '',
  motherEducation: '',
  motherIncome: '',
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  guardianAddress: '',
  phoneNumber: '',
  whatsapp: '',
  email: '',
  bloodType: '',
  height: '',
  weight: '',
  specialNeeds: '',
  medicalHistory: '',
  documents: [],
};

export default function PPDBRegisterPage() {
  return <PPDBRegisterClient />;
}