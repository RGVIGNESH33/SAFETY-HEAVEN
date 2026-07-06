
-- =========================
-- ROLES
-- =========================
CREATE TYPE public.app_role AS ENUM ('user', 'police', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  home_address TEXT,
  blood_group TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Police and admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'police') OR public.has_role(auth.uid(), 'admin'));

-- =========================
-- EMERGENCY CONTACTS
-- =========================
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  priority INT NOT NULL DEFAULT 1,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.emergency_contacts TO authenticated;
GRANT ALL ON public.emergency_contacts TO service_role;

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contacts" ON public.emergency_contacts
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_emergency_contacts_user ON public.emergency_contacts(user_id, priority);

-- =========================
-- SOS ALERTS
-- =========================
CREATE TYPE public.sos_status AS ENUM ('active', 'acknowledged', 'resolved', 'false_alarm');
CREATE TYPE public.sos_type AS ENUM ('panic', 'silent', 'voice', 'timer');

CREATE TABLE public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,
  address TEXT,
  alert_type public.sos_type NOT NULL DEFAULT 'panic',
  status public.sos_status NOT NULL DEFAULT 'active',
  notes TEXT,
  audio_url TEXT,
  battery_level INT,
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.sos_alerts TO authenticated;
GRANT ALL ON public.sos_alerts TO service_role;

ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own alerts" ON public.sos_alerts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users create own alerts" ON public.sos_alerts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own alerts" ON public.sos_alerts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Police read all alerts" ON public.sos_alerts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'police') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Police update alerts" ON public.sos_alerts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'police') OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_sos_alerts_user ON public.sos_alerts(user_id, created_at DESC);
CREATE INDEX idx_sos_alerts_status ON public.sos_alerts(status, created_at DESC);

-- =========================
-- INCIDENT REPORTS
-- =========================
CREATE TYPE public.incident_category AS ENUM ('harassment', 'stalking', 'theft', 'domestic_violence', 'assault', 'other');

CREATE TABLE public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  category public.incident_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  incident_time TIMESTAMPTZ,
  media_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.incident_reports TO authenticated;
GRANT ALL ON public.incident_reports TO service_role;

ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own reports" ON public.incident_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users create reports" ON public.incident_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR (is_anonymous = true AND user_id IS NULL));

CREATE POLICY "Police read all reports" ON public.incident_reports
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'police') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Police update reports" ON public.incident_reports
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'police') OR public.has_role(auth.uid(), 'admin'));

-- =========================
-- Auto-update updated_at
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_contacts_updated BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_sos_updated BEFORE UPDATE ON public.sos_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_reports_updated BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- On signup: create profile + default role
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
