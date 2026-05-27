export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient';
  specialty?: string;
  phone?: string;
  avatar?: string;
}

export const DEMO_USERS: User[] = [
  { id: 'd1', name: 'Dr. Ananya Sharma', email: 'dr.sharma@curepath.com', role: 'doctor', specialty: 'General Medicine', phone: '+91 98765 43210' },
  { id: 'd2', name: 'Dr. Vikram Patel', email: 'dr.patel@curepath.com', role: 'doctor', specialty: 'Cardiology', phone: '+91 98765 43211' },
  { id: 'p1', name: 'Rahul Mehta', email: 'rahul@email.com', role: 'patient', phone: '+91 91234 56780' },
  { id: 'p2', name: 'Priya Singh', email: 'priya@email.com', role: 'patient', phone: '+91 91234 56781' },
  { id: 'p3', name: 'Amit Kumar', email: 'amit@email.com', role: 'patient', phone: '+91 91234 56782' },
];

export function login(email: string, password: string): User | null {
  const user = DEMO_USERS.find((u) => u.email === email);
  if (!user) return null;

  const validPassword = user.role === 'doctor' ? 'doctor123' : 'patient123';
  if (password !== validPassword) return null;

  localStorage.setItem('curepath_user', JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem('curepath_user');
}

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem('curepath_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isDoctor(user: User): boolean {
  return user.role === 'doctor';
}

export function isPatient(user: User): boolean {
  return user.role === 'patient';
}
