export interface LetterHead {
  id?: string;
  code?: string;
  store_id?: string;
  name?: string; // e.g.,  "Bank", "Client Submission", "Tax Authority",  etc
  header_text?: string; // e.g., "Bank Statement", "Client Submission", "Tax Authority Letter", etc
  footer_text?: string; // e.g., "This is a bank statement", "This is a client submission", "This is a tax authority letter", etc
  default_body?: string;
  notes?: string;
  issued_at?: string; // ISO 8601 date string
}
