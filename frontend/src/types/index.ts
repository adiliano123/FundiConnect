// ─── Auth & User ────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  country?: string;
  is_active: boolean;
  is_verified: boolean;
  technician_id?: number;
  verification_status?: 'pending' | 'verified' | 'rejected';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// ─── Category ────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  image_url?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  technicians_count?: number;
}

// ─── Technician ──────────────────────────────────────────────────────────────
export interface Technician {
  id: number;
  user_id: number;
  category_id?: number;
  bio?: string;
  description?: string;
  experience_years: number;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  service_area?: string;
  is_available: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  working_hours?: Record<string, { start: string; end: string }>;
  user?: User;
  category?: Category;
  skills?: Category[];
  portfolio_images?: PortfolioImage[];
  reviews?: Review[];
}

export interface PortfolioImage {
  id: number;
  technician_id: number;
  image_path: string;
  image_url: string;
  caption?: string;
  is_featured: boolean;
}

// ─── Booking ─────────────────────────────────────────────────────────────────
export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'awaiting_payment'
  | 'paid'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: number;
  booking_number: string;
  customer_id: number;
  technician_id: number;
  service_id?: number;
  category_id: number;
  description: string;
  address: string;
  city: string;
  scheduled_at: string;
  status: BookingStatus;
  rejection_reason?: string;
  cancellation_reason?: string;
  estimated_cost?: number;
  final_cost?: number;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  customer?: User;
  technician?: Technician;
  category?: Category;
  review?: Review;
  payment?: Payment;
}

// ─── Review ──────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  booking_id: number;
  customer_id: number;
  technician_id: number;
  rating: number;
  comment?: string;
  is_published: boolean;
  created_at: string;
  customer?: User;
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export type PaymentMethod = 'mpesa' | 'airtel' | 'tigopesa' | 'halopesa' | 'visa' | 'mastercard' | 'cash';
export type WithdrawalMethod = 'mpesa' | 'airtel' | 'tigopesa' | 'halopesa' | 'bank';

export interface Payment {
  id: number;
  booking_id: number;
  customer_id: number;
  technician_id: number;
  reference: string;
  amount: number;
  platform_fee: number;
  technician_payout: number;
  commission_rate: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: PaymentMethod;
  gateway?: string;
  phone_number?: string;
  gateway_reference?: string;
  transaction_id?: string;
  paid_at?: string;
  failure_reason?: string;
  created_at: string;
  booking?: Booking;
  customer?: User;
}

export interface Wallet {
  id: number;
  technician_id: number;
  balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  currency: string;
}

export interface WalletTransaction {
  id: number;
  wallet_id: number;
  type: 'credit' | 'debit';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'reversed';
  created_at: string;
  booking?: Booking;
  payment?: Payment;
}

export interface WithdrawalRequest {
  id: number;
  technician_id: number;
  wallet_id: number;
  reference: string;
  amount: number;
  currency: string;
  method: WithdrawalMethod;
  account_number: string;
  account_name: string;
  bank_name?: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  admin_notes?: string;
  processed_at?: string;
  created_at: string;
  technician?: Technician;
}

// ─── Notification ────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: string;
  data: {
    message: string;
    booking_id?: number;
    booking_number?: string;
    event?: string;
    status?: string;
  };
  read_at: string | null;
  created_at: string;
}

// ─── Complaint ───────────────────────────────────────────────────────────────
export interface Complaint {
  id: number;
  booking_id: number;
  complainant_id: number;
  subject: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  resolution_notes?: string;
  created_at: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
