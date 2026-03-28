import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Visitor } from '@/types/visitor';

interface EmailTemplate {
  subject: string;
  body_html: string;
}

interface BulkEmailResult {
  sent: number;
  failed: number;
  skipped: number;
}

/**
 * Hook that encapsulates all visitor email operations.
 * Manages loading states and invokes Supabase edge functions.
 *
 * @returns Email handlers and their loading states
 */
export function useVisitorEmail() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [isSendingAfterVisit, setIsSendingAfterVisit] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [afterVisitTemplate, setAfterVisitTemplate] = useState<EmailTemplate | null>(null);

  /**
   * Sends bulk email to selected visitors via edge function.
   *
   * @param visitorIds - Array of visitor UUIDs to email
   * @param subject - Email subject line
   * @param message - Email message body
   * @returns Result with sent/failed/skipped counts
   */
  const sendBulkEmail = async (
    visitorIds: string[],
    subject: string,
    message: string
  ): Promise<BulkEmailResult | null> => {
    if (visitorIds.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one visitor', variant: 'destructive' });
      return null;
    }
    if (!subject.trim() || !message.trim()) {
      toast({ title: 'Error', description: 'Subject and message are required', variant: 'destructive' });
      return null;
    }

    setIsSendingBulk(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: { visitorIds, subject: subject.trim(), message: message.trim(), userId: user?.id },
      });
      if (error) throw error;

      const results: BulkEmailResult = data?.results ?? { sent: 0, failed: 0, skipped: 0 };
      toast({
        title: 'Bulk Email Sent',
        description: `${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`,
      });
      return results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send emails';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsSendingBulk(false);
    }
  };

  /**
   * Sends visit reminder emails to all scheduled visitors via edge function.
   *
   * @returns Result with sent/failed/skipped counts
   */
  const sendVisitReminders = async (): Promise<BulkEmailResult | null> => {
    setIsSendingReminders(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-visit-reminders');
      if (error) throw error;

      const results: BulkEmailResult = data?.results ?? { sent: 0, failed: 0, skipped: 0 };
      toast({
        title: 'Reminders Sent',
        description: `${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`,
      });
      return results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send reminders';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsSendingReminders(false);
    }
  };

  /**
   * Sends after-visit emails to visitors (manual/automated) via edge function.
   *
   * @returns Result with sent/failed/skipped counts
   */
  const sendAfterVisitEmail = async (): Promise<BulkEmailResult | null> => {
    setIsSendingAfterVisit(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-after-visit-email');
      if (error) throw error;

      const results: BulkEmailResult = data?.results ?? { sent: 0, failed: 0, skipped: 0 };
      toast({
        title: 'After Visit Emails Sent',
        description: `${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`,
      });
      return results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send after visit emails';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsSendingAfterVisit(false);
    }
  };

  /**
   * Fetches the email template for after-visit notifications.
   */
  const loadAfterVisitTemplate = async () => {
    setIsLoadingTemplate(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-after-visit-email-template');
      if (error) throw error;

      setAfterVisitTemplate(data as EmailTemplate);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load template';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  return {
    isSendingBulk,
    isSendingReminders,
    isSendingAfterVisit,
    isLoadingTemplate,
    afterVisitTemplate,
    sendBulkEmail,
    sendVisitReminders,
    sendAfterVisitEmail,
    loadAfterVisitTemplate,
  };
}