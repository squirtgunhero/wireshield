-- Users: can read own profile, admins read all
CREATE POLICY "users_select_own" ON "User"
  FOR SELECT USING (
    auth.uid()::text = id
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

CREATE POLICY "users_update_own" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

-- Transactions: visible to parties or created_by
CREATE POLICY "transactions_select" ON "Transaction"
  FOR SELECT USING (
    "createdById" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "TransactionParty" tp
      WHERE tp."transactionId" = "Transaction".id AND tp."userId" = auth.uid()::text
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

CREATE POLICY "transactions_insert" ON "Transaction"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "transactions_update" ON "Transaction"
  FOR UPDATE USING (
    "createdById" = auth.uid()::text
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Transaction Parties: visible to transaction members
CREATE POLICY "parties_select" ON "TransactionParty"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "TransactionParty" tp2
      WHERE tp2."transactionId" = "TransactionParty"."transactionId"
      AND tp2."userId" = auth.uid()::text
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Wire Instructions: visible to verified parties, insert by title/escrow only
CREATE POLICY "wires_select" ON "WireInstruction"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "TransactionParty" tp
      WHERE tp."transactionId" = "WireInstruction"."transactionId"
      AND tp."userId" = auth.uid()::text
      AND tp.status = 'VERIFIED'
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

CREATE POLICY "wires_insert" ON "WireInstruction"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "TransactionParty" tp
      WHERE tp."transactionId" = "WireInstruction"."transactionId"
      AND tp."userId" = auth.uid()::text
      AND tp.role IN ('TITLE_OFFICER', 'ESCROW_OFFICER')
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Events: visible to transaction parties
CREATE POLICY "events_select" ON "Event"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "TransactionParty" tp
      WHERE tp."transactionId" = "Event"."transactionId"
      AND tp."userId" = auth.uid()::text
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Risk Events: visible to agents, title officers, admins
CREATE POLICY "risk_events_select" ON "RiskEvent"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "TransactionParty" tp
      JOIN "User" u ON u.id = tp."userId"
      WHERE tp."transactionId" = "RiskEvent"."transactionId"
      AND tp."userId" = auth.uid()::text
      AND u.role IN ('AGENT', 'TITLE_OFFICER', 'ESCROW_OFFICER', 'ADMIN')
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Email Analyses: visible to submitter and transaction admins
CREATE POLICY "email_analyses_select" ON "EmailAnalysis"
  FOR SELECT USING (
    "submittedById" = auth.uid()::text
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Documents: visible to transaction parties
CREATE POLICY "documents_select" ON "Document"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "TransactionParty" tp
      WHERE tp."transactionId" = "Document"."transactionId"
      AND tp."userId" = auth.uid()::text
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Alerts: visible to transaction parties
CREATE POLICY "alerts_select" ON "Alert"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "TransactionParty" tp
      WHERE tp."transactionId" = "Alert"."transactionId"
      AND tp."userId" = auth.uid()::text
    )
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );

-- Audit Log: read-only for admins/compliance, append-only
CREATE POLICY "audit_log_select" ON "AuditLog"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role IN ('ADMIN', 'TITLE_OFFICER'))
  );

CREATE POLICY "audit_log_insert" ON "AuditLog"
  FOR INSERT WITH CHECK (true);

-- Notifications: users see only their own
CREATE POLICY "notifications_select" ON "Notification"
  FOR SELECT USING ("userId" = auth.uid()::text);

CREATE POLICY "notifications_update" ON "Notification"
  FOR UPDATE USING ("userId" = auth.uid()::text);

-- FinCEN Reports: admins and title officers only
CREATE POLICY "fincen_select" ON "FinCENReport"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role IN ('ADMIN', 'TITLE_OFFICER'))
  );

-- Organizations: visible to members
CREATE POLICY "orgs_select" ON "Organization"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "User" u WHERE u."organizationId" = "Organization".id AND u.id = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')
  );
