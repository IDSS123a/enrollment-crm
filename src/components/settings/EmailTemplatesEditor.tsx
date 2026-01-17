import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, Mail, Save, Eye, Code, AlertCircle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  template_type: string;
  name: string;
  subject: string;
  body_html: string;
  description: string | null;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function EmailTemplatesEditor() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isAdmin } = useUserRole();
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email templates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditedSubject(template.subject);
    setEditedBody(template.body_html);
  };

  const handleSave = async () => {
    if (!editingTemplate) return;

    setSaving(editingTemplate.id);
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          subject: editedSubject,
          body_html: editedBody,
        })
        .eq('id', editingTemplate.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Template saved successfully' });
      setEditingTemplate(null);
      loadTemplates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save template',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({ is_active: !template.is_active })
        .eq('id', template.id);

      if (error) throw error;
      loadTemplates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update template',
        variant: 'destructive',
      });
    }
  };

  const handlePreview = (template: EmailTemplate) => {
    // Replace variables with sample data for preview
    let html = template.body_html;
    const sampleData: Record<string, string> = {
      child_name: 'John Smith',
      target_grade: '5',
      school_year: '2025/2026',
      visit_date: 'Monday, January 20, 2025',
      visit_type: 'In-Person Visit',
      urgency: 'Tomorrow',
      urgency_message: '⚡ Your visit is tomorrow!',
      message: 'This is a sample message content that would appear in your bulk emails.',
      subject: 'Sample Subject Line',
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    setPreviewHtml(html);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <MaterialCard hover={false}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>Only administrators can manage email templates.</p>
        </div>
      </MaterialCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Email Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the email templates sent for enrollments, reminders, and bulk emails
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {templates.map((template) => (
          <AccordionItem
            key={template.id}
            value={template.id}
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <Mail className="h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {template.description}
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-2 mr-4">
                  <Badge variant={template.is_active ? 'default' : 'secondary'}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subject Line</Label>
                  <p className="text-sm bg-muted p-3 rounded-md font-mono">
                    {template.subject}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Available Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="font-mono text-xs">
                        {`{${variable}}`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Label htmlFor={`active-${template.id}`} className="text-sm">
                      Template Active
                    </Label>
                    <Switch
                      id={`active-${template.id}`}
                      checked={template.is_active}
                      onCheckedChange={() => handleToggleActive(template)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Edit Template
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Edit Template Modal */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Edit Template: {editingTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          
          {editingTemplate && (
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label>Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  {editingTemplate.variables.map((variable) => (
                    <Badge
                      key={variable}
                      variant="outline"
                      className="font-mono text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(`{${variable}}`);
                        toast({ title: 'Copied', description: `{${variable}} copied to clipboard` });
                      }}
                    >
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Click to copy variable</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  placeholder="Email subject..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">HTML Body</Label>
                <Textarea
                  id="body"
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  placeholder="HTML email body..."
                  className="font-mono text-sm min-h-[400px]"
                />
                <p className="text-xs text-muted-foreground">
                  Use HTML to format your email. Variables like {'{child_name}'} will be replaced with actual values.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={saving === editingTemplate.id}
                  className="flex-1"
                >
                  {saving === editingTemplate.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    let html = editedBody;
                    const sampleData: Record<string, string> = {
                      child_name: 'John Smith',
                      target_grade: '5',
                      school_year: '2025/2026',
                      visit_date: 'Monday, January 20, 2025',
                      visit_type: 'In-Person Visit',
                      urgency: 'Tomorrow',
                      urgency_message: '⚡ Your visit is tomorrow!',
                      message: 'Sample message content.',
                      subject: editedSubject,
                    };
                    Object.entries(sampleData).forEach(([key, value]) => {
                      html = html.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
                    });
                    setPreviewHtml(html);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setEditingTemplate(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewHtml} onOpenChange={() => setPreviewHtml(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Email Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 border rounded-lg overflow-hidden">
            <div
              className="bg-white"
              dangerouslySetInnerHTML={{ __html: previewHtml || '' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
