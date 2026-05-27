export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  type: string;
  diagnosis: string;
  notes: string;
  date: string;
}

const SEED_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001-abc',
    doctorId: 'd1',
    doctorName: 'Dr. Ananya Sharma',
    patientId: 'p1',
    patientName: 'Rahul Mehta',
    diagnosis: 'Bacterial Upper Respiratory Infection',
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Take after meals' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5 days', instructions: 'Take at bedtime' },
    ],
    notes: 'Follow up in one week if symptoms persist.',
    status: 'active',
    createdAt: '2026-05-20T10:30:00Z',
    updatedAt: '2026-05-20T10:30:00Z',
  },
  {
    id: 'rx-002-def',
    doctorId: 'd2',
    doctorName: 'Dr. Vikram Patel',
    patientId: 'p1',
    patientName: 'Rahul Mehta',
    diagnosis: 'Hypertension Stage 1',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
      { name: 'Losartan', dosage: '50mg', frequency: 'Once daily', duration: '30 days' },
    ],
    notes: 'Monitor blood pressure weekly. Low sodium diet recommended.',
    status: 'active',
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-05-15T09:00:00Z',
  },
  {
    id: 'rx-003-ghi',
    doctorId: 'd1',
    doctorName: 'Dr. Ananya Sharma',
    patientId: 'p2',
    patientName: 'Priya Singh',
    diagnosis: 'Type 2 Diabetes Mellitus',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals' },
      { name: 'Glimepiride', dosage: '1mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take before breakfast' },
    ],
    notes: 'HbA1c recheck after 3 months. Dietary counseling provided.',
    status: 'active',
    createdAt: '2026-04-10T14:15:00Z',
    updatedAt: '2026-04-10T14:15:00Z',
  },
  {
    id: 'rx-004-jkl',
    doctorId: 'd2',
    doctorName: 'Dr. Vikram Patel',
    patientId: 'p2',
    patientName: 'Priya Singh',
    diagnosis: 'Iron Deficiency Anemia',
    medications: [
      { name: 'Ferrous Sulfate', dosage: '325mg', frequency: 'Once daily', duration: '60 days', instructions: 'Take on empty stomach with vitamin C' },
    ],
    status: 'completed',
    createdAt: '2026-03-15T11:00:00Z',
    updatedAt: '2026-05-15T11:00:00Z',
  },
  {
    id: 'rx-005-mno',
    doctorId: 'd1',
    doctorName: 'Dr. Ananya Sharma',
    patientId: 'p3',
    patientName: 'Amit Kumar',
    diagnosis: 'Acute Gastritis',
    medications: [
      { name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily', duration: '14 days', instructions: 'Take 30 minutes before breakfast' },
      { name: 'Domperidone', dosage: '10mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Take before meals' },
    ],
    notes: 'Avoid spicy food and alcohol.',
    status: 'expired',
    createdAt: '2026-03-01T16:45:00Z',
    updatedAt: '2026-03-15T16:45:00Z',
  },
  {
    id: 'rx-006-pqr',
    doctorId: 'd2',
    doctorName: 'Dr. Vikram Patel',
    patientId: 'p3',
    patientName: 'Amit Kumar',
    diagnosis: 'Seasonal Allergic Rhinitis',
    medications: [
      { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take at bedtime' },
      { name: 'Fluticasone Nasal Spray', dosage: '50mcg', frequency: 'Twice daily', duration: '30 days', instructions: 'Two sprays each nostril' },
    ],
    status: 'active',
    createdAt: '2026-05-10T08:30:00Z',
    updatedAt: '2026-05-10T08:30:00Z',
  },
];

const SEED_RECORDS: MedicalRecord[] = [
  {
    id: 'mr-001',
    patientId: 'p1',
    patientName: 'Rahul Mehta',
    doctorId: 'd2',
    doctorName: 'Dr. Vikram Patel',
    type: 'Lab Results',
    diagnosis: 'Elevated Cholesterol',
    notes: 'Total cholesterol: 240 mg/dL, LDL: 160 mg/dL, HDL: 45 mg/dL. Lifestyle modifications advised.',
    date: '2026-05-12T10:00:00Z',
  },
  {
    id: 'mr-002',
    patientId: 'p2',
    patientName: 'Priya Singh',
    doctorId: 'd1',
    doctorName: 'Dr. Ananya Sharma',
    type: 'General Checkup',
    diagnosis: 'Routine Health Screening',
    notes: 'Vitals normal. BMI 23.5. Blood sugar fasting: 135 mg/dL. Continue current medications.',
    date: '2026-04-20T11:30:00Z',
  },
  {
    id: 'mr-003',
    patientId: 'p3',
    patientName: 'Amit Kumar',
    doctorId: 'd1',
    doctorName: 'Dr. Ananya Sharma',
    type: 'X-Ray',
    diagnosis: 'Normal Chest X-Ray',
    notes: 'No abnormalities detected. Lung fields clear. Cardiothoracic ratio normal.',
    date: '2026-03-25T14:00:00Z',
  },
  {
    id: 'mr-004',
    patientId: 'p1',
    patientName: 'Rahul Mehta',
    doctorId: 'd1',
    doctorName: 'Dr. Ananya Sharma',
    type: 'Blood Test',
    diagnosis: 'Complete Blood Count',
    notes: 'Hemoglobin: 14.2 g/dL, WBC: 7500/μL, Platelets: 250000/μL. All values within normal range.',
    date: '2026-04-05T09:15:00Z',
  },
];

function loadPrescriptions(): Prescription[] {
  try {
    const raw = localStorage.getItem('curepath_prescriptions');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePrescriptions(prescriptions: Prescription[]): void {
  localStorage.setItem('curepath_prescriptions', JSON.stringify(prescriptions));
}

function loadRecords(): MedicalRecord[] {
  try {
    const raw = localStorage.getItem('curepath_records');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function seedData(): void {
  if (!localStorage.getItem('curepath_prescriptions')) {
    localStorage.setItem('curepath_prescriptions', JSON.stringify(SEED_PRESCRIPTIONS));
  }
  if (!localStorage.getItem('curepath_records')) {
    localStorage.setItem('curepath_records', JSON.stringify(SEED_RECORDS));
  }
}

export function getPrescriptions(): Prescription[] {
  return loadPrescriptions();
}

export function getPrescriptionById(id: string): Prescription | undefined {
  return loadPrescriptions().find((p) => p.id === id);
}

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return loadPrescriptions().filter((p) => p.patientId === patientId);
}

export function getPrescriptionsByDoctor(doctorId: string): Prescription[] {
  return loadPrescriptions().filter((p) => p.doctorId === doctorId);
}

export function createPrescription(data: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Prescription {
  const prescriptions = loadPrescriptions();
  const now = new Date().toISOString();
  const prescription: Prescription = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  prescriptions.push(prescription);
  savePrescriptions(prescriptions);
  return prescription;
}

export function updatePrescription(id: string, data: Partial<Prescription>): Prescription | null {
  const prescriptions = loadPrescriptions();
  const index = prescriptions.findIndex((p) => p.id === id);
  if (index === -1) return null;

  prescriptions[index] = {
    ...prescriptions[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  savePrescriptions(prescriptions);
  return prescriptions[index];
}

export function deletePrescription(id: string): boolean {
  const prescriptions = loadPrescriptions();
  const filtered = prescriptions.filter((p) => p.id !== id);
  if (filtered.length === prescriptions.length) return false;
  savePrescriptions(filtered);
  return true;
}

export function searchPrescriptions(
  query: string,
  filters?: { status?: string; doctorId?: string; patientId?: string }
): Prescription[] {
  let results = loadPrescriptions();
  const q = query.toLowerCase();

  if (q) {
    results = results.filter(
      (p) =>
        p.patientName.toLowerCase().includes(q) ||
        p.doctorName.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q)
    );
  }

  if (filters?.status) {
    results = results.filter((p) => p.status === filters.status);
  }
  if (filters?.doctorId) {
    results = results.filter((p) => p.doctorId === filters.doctorId);
  }
  if (filters?.patientId) {
    results = results.filter((p) => p.patientId === filters.patientId);
  }

  return results;
}

export function getMedicalRecords(patientId: string): MedicalRecord[] {
  return loadRecords().filter((r) => r.patientId === patientId);
}

export function getAllPatients(): { patientId: string; patientName: string }[] {
  const prescriptions = loadPrescriptions();
  const map = new Map<string, string>();
  for (const p of prescriptions) {
    map.set(p.patientId, p.patientName);
  }
  return Array.from(map, ([patientId, patientName]) => ({ patientId, patientName }));
}
