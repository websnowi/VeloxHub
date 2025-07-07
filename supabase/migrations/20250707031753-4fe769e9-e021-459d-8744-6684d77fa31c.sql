
-- Create payroll table
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  gross_pay DECIMAL(12,2) NOT NULL DEFAULT 0,
  deductions DECIMAL(12,2) DEFAULT 0,
  net_pay DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE,
  clock_out TIMESTAMP WITH TIME ZONE,
  break_start TIMESTAMP WITH TIME ZONE,
  break_end TIMESTAMP WITH TIME ZONE,
  total_hours DECIMAL(5,2) DEFAULT 0,
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hr_reports table
CREATE TABLE public.hr_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL,
  report_name TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  data JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payroll
CREATE POLICY "Users can view their own payroll records" ON public.payroll FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own payroll records" ON public.payroll FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payroll records" ON public.payroll FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payroll records" ON public.payroll FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for attendance
CREATE POLICY "Users can view their own attendance records" ON public.attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own attendance records" ON public.attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attendance records" ON public.attendance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own attendance records" ON public.attendance FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for hr_reports
CREATE POLICY "Users can view their own hr reports" ON public.hr_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own hr reports" ON public.hr_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hr reports" ON public.hr_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hr reports" ON public.hr_reports FOR DELETE USING (auth.uid() = user_id);
