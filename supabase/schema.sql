-- =========================================================================
-- TWINORA AI — PRODUCTION MULTI-TENANT POSTGRESQL / SUPABASE SCHEMA
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. PROFILES (Authenticated User Account Profiles)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'Store Owner',
    phone TEXT,
    location TEXT DEFAULT 'San Francisco, CA',
    timezone TEXT DEFAULT 'America/Los_Angeles',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 3. BUSINESSES (Store / Merchant Multi-Tenant Entities)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Retail & E-commerce',
    currency TEXT DEFAULT '₹',
    target_monthly_revenue NUMERIC DEFAULT 1050000,
    location TEXT DEFAULT 'San Francisco, CA',
    timezone TEXT DEFAULT 'America/Los_Angeles',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 4. BUSINESS MEMBERS (Team Members & Roles)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.business_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'operator', 'viewer', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);

-- =========================================================================
-- 5. CUSTOMERS (RFM Behavioral Cohort Profiles)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    orders_count INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    avg_order_value NUMERIC DEFAULT 0,
    days_since_last_order INTEGER DEFAULT 0,
    segment TEXT DEFAULT 'Loyal' CHECK (segment IN ('Champions', 'Loyal', 'At-Risk', 'Dormant', 'New')),
    churn_risk INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 6. PRODUCTS (Catalog SKUs, Margins & Elasticity)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Catalog',
    price NUMERIC NOT NULL,
    cost NUMERIC DEFAULT 0,
    stock INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    rating NUMERIC DEFAULT 4.8,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 7. ORDERS (Transactions & Cashflow)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    subtotal NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
    payment_method TEXT DEFAULT 'UPI',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 8. ORDER ITEMS (Line Items & Co-Purchase Basket Affinity)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 9. PAYMENTS (Gateway Authorization & Latency Telemetry)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    method TEXT DEFAULT 'UPI',
    status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')),
    gateway TEXT DEFAULT 'Razorpay',
    latency_ms INTEGER DEFAULT 14,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 10. OPPORTUNITIES (Autonomous Growth Signals Isolated)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    potential_revenue NUMERIC DEFAULT 0,
    confidence_score INTEGER DEFAULT 85,
    impact TEXT DEFAULT 'HIGH' CHECK (impact IN ('HIGH', 'MEDIUM', 'LOW')),
    risk TEXT DEFAULT 'Low Risk',
    category TEXT DEFAULT 'Customer Winback',
    target_cohort TEXT,
    affected_count INTEGER DEFAULT 0,
    evidence TEXT,
    suggested_offer TEXT,
    status TEXT DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'IN_PROGRESS', 'SIMULATED', 'EXECUTED', 'DISMISSED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 11. SIMULATIONS (What-If Decision Sandbox Runs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    target_segment TEXT DEFAULT 'dormant',
    discount_pct NUMERIC DEFAULT 15,
    price_change_pct NUMERIC DEFAULT 0,
    duration_days INTEGER DEFAULT 7,
    status TEXT DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 12. SIMULATION RESULTS (Baseline vs Modeled Lift)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
    baseline_revenue NUMERIC NOT NULL,
    simulated_revenue NUMERIC NOT NULL,
    net_recovery_uplift NUMERIC NOT NULL,
    expected_low NUMERIC,
    expected_high NUMERIC,
    retention_lift_pct NUMERIC,
    margin_concession_pct NUMERIC,
    evidence_strength TEXT DEFAULT 'Strong',
    risk_assessment TEXT DEFAULT 'Low Risk',
    assumptions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 13. ACTION PLANS (Autonomous Multi-Step Execution Pipelines)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.action_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    simulation_id UUID REFERENCES public.simulations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    target_cohort TEXT DEFAULT 'Dormant VIPs',
    target_count INTEGER DEFAULT 32,
    predicted_uplift NUMERIC DEFAULT 28400,
    channel TEXT DEFAULT 'WhatsApp & Email',
    scheduled_time TEXT DEFAULT 'Saturday, 6:00 PM',
    status TEXT DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'RUNNING', 'COMPLETED', 'CANCELLED')),
    execution_mode TEXT DEFAULT 'SIMULATION',
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    pipeline_steps JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 14. DECISION MEMORY (Historical Learning & 14-Day Calibration)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.decision_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    action_plan_id UUID REFERENCES public.action_plans(id) ON DELETE SET NULL,
    decision_title TEXT NOT NULL,
    simulated_recovery NUMERIC NOT NULL,
    actual_recovery NUMERIC,
    accuracy_score NUMERIC,
    status TEXT DEFAULT 'VERIFIED' CHECK (status IN ('MEASURING', 'VERIFIED', 'DEVIATED')),
    learning_notes TEXT,
    is_historical_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 15. AI CONVERSATIONS (Grounded Explanation Logs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    evidence JSONB DEFAULT '[]'::jsonb,
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    page_context TEXT DEFAULT 'dashboard',
    date_range TEXT DEFAULT '30d',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 16. INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_business ON public.customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON public.customers(business_id, segment);
CREATE INDEX IF NOT EXISTS idx_products_business ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_business ON public.orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON public.orders(business_id, order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_business ON public.opportunities(business_id);
CREATE INDEX IF NOT EXISTS idx_simulations_business ON public.simulations(business_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_business ON public.action_plans(business_id);
CREATE INDEX IF NOT EXISTS idx_decision_memory_business ON public.decision_memory(business_id);

-- =========================================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Businesses: Owners and members can view their businesses
CREATE POLICY "Users view own businesses" ON public.businesses FOR SELECT 
USING (owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid()));

CREATE POLICY "Owners insert business" ON public.businesses FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners update business" ON public.businesses FOR UPDATE USING (owner_id = auth.uid());

-- Business Data Policies (Customers, Products, Orders, etc.)
CREATE POLICY "Members view customers" ON public.customers FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view products" ON public.products FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view orders" ON public.orders FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view payments" ON public.payments FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view opportunities" ON public.opportunities FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view simulations" ON public.simulations FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view simulation results" ON public.simulation_results FOR ALL 
USING (simulation_id IN (SELECT id FROM public.simulations WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())));

CREATE POLICY "Members view action plans" ON public.action_plans FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view decision memory" ON public.decision_memory FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));

CREATE POLICY "Members view ai conversations" ON public.ai_conversations FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid() OR id IN (SELECT business_id FROM public.business_members WHERE user_id = auth.uid())));
