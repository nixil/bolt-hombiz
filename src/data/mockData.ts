export const mockClinics = [
  {
    id: '1',
    name: 'Sunshine Family Clinic',
    slug: 'sunshine-family-clinic',
    address: '123 Health Street, Medical District',
    phone: '(555) 123-4567',
    email: 'info@sunshineclinic.com',
    website: 'www.sunshineclinic.com',
    logo: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Providing comprehensive healthcare services for the whole family.',
    services: [
      { id: '1', name: 'General Consultation', price: 150, duration: 30 },
      { id: '2', name: 'Dental Checkup', price: 120, duration: 45 },
      { id: '3', name: 'Physical Therapy', price: 80, duration: 60 }
    ],
    workingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed'
    },
    theme: {
      primaryColor: '#2563EB',
      secondaryColor: '#059669'
    }
  },
  {
    id: '2',
    name: 'Metro Dental Care',
    slug: 'metro-dental-care',
    address: '456 Dental Avenue, Downtown',
    phone: '(555) 987-6543',
    email: 'contact@metrodental.com',
    website: 'www.metrodental.com',
    logo: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Modern dental care with the latest technology and personalized treatment.',
    services: [
      { id: '1', name: 'Teeth Cleaning', price: 100, duration: 45 },
      { id: '2', name: 'Root Canal', price: 800, duration: 90 },
      { id: '3', name: 'Teeth Whitening', price: 300, duration: 60 }
    ],
    workingHours: {
      monday: '8:00 AM - 7:00 PM',
      tuesday: '8:00 AM - 7:00 PM',
      wednesday: '8:00 AM - 7:00 PM',
      thursday: '8:00 AM - 7:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '9:00 AM - 3:00 PM',
      sunday: 'Closed'
    },
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#DC2626'
    }
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@sunshineclinic.com',
    role: 'clinic_owner' as const,
    clinicId: '1',
    phone: '(555) 123-4567',
    specialization: 'Family Medicine',
    avatar: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael@metrodental.com',
    role: 'clinic_owner' as const,
    clinicId: '2',
    phone: '(555) 987-6543',
    specialization: 'Dentistry',
    avatar: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    email: 'emily@sunshineclinic.com',
    role: 'doctor' as const,
    clinicId: '1',
    phone: '(555) 123-4568',
    specialization: 'Pediatrics',
    avatar: 'https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'patient' as const,
    phone: '(555) 555-0123',
    dateOfBirth: '1985-06-15',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 555-0123',
    dateOfBirth: '1985-06-15',
    address: '789 Patient Lane, City',
    emergencyContact: 'Jane Smith - (555) 555-0124',
    medicalHistory: [
      { date: '2024-01-15', condition: 'Hypertension', treatment: 'Medication prescribed' },
      { date: '2023-11-20', condition: 'Annual Checkup', treatment: 'Routine examination completed' }
    ],
    allergies: ['Penicillin', 'Shellfish'],
    bloodType: 'O+',
    insuranceProvider: 'Blue Cross Blue Shield',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Mary Johnson',
    email: 'mary.johnson@email.com',
    phone: '(555) 555-0125',
    dateOfBirth: '1990-03-22',
    address: '456 Health Street, City',
    emergencyContact: 'Bob Johnson - (555) 555-0126',
    medicalHistory: [
      { date: '2024-02-10', condition: 'Flu', treatment: 'Antiviral medication' },
      { date: '2024-01-05', condition: 'Dental Cleaning', treatment: 'Routine cleaning completed' }
    ],
    allergies: ['Latex'],
    bloodType: 'A-',
    insuranceProvider: 'Aetna',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    clinicId: '1',
    service: 'General Consultation',
    date: '2024-01-20',
    time: '10:00 AM',
    duration: 30,
    status: 'confirmed',
    notes: 'Follow-up for hypertension management'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Mary Johnson',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    clinicId: '2',
    service: 'Dental Checkup',
    date: '2024-01-22',
    time: '2:00 PM',
    duration: 45,
    status: 'pending',
    notes: 'Regular checkup and cleaning'
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '3',
    doctorName: 'Dr. Emily Davis',
    clinicId: '1',
    service: 'Physical Therapy',
    date: '2024-01-25',
    time: '11:30 AM',
    duration: 60,
    status: 'completed',
    notes: 'Back pain rehabilitation session'
  }
];