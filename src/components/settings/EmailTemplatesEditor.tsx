import { useState, useEffect, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Save, Eye, Code, AlertCircle, Plus, RefreshCw } from 'lucide-react';

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

const SAMPLE_DATA: Record<string, string> = {
  child_name: 'John Smith',
  parent_name: 'Jane Smith',
  target_grade: '5',
  school_year: '2025/2026',
  visit_date: 'Monday, January 20, 2025',
  visit_type: 'In-Person Visit',
  urgency: 'Tomorrow',
  urgency_message: '⚡ Your visit is tomorrow!',
  message: 'This is a sample message content that would appear in your bulk emails.',
  subject: 'Sample Subject Line',
};

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
  const [livePreview, setLivePreview] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  // Live preview update
  useEffect(() => {
    if (editingTemplate) {
      updateLivePreview(editedBody);
    }
  }, [editedBody]);

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

  const updateLivePreview = (html: string) => {
    let preview = html;
    Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`\\{${key}\\}`, 'g'), `<span class="bg-primary/20 px-1 rounded">${value}</span>`);
    });
    setLivePreview(preview);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditedSubject(template.subject);
    setEditedBody(template.body_html);
    updateLivePreview(template.body_html);
    setActiveEditorTab('edit');
  };

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editedBody;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + `{${variable}}` + after;
    
    setEditedBody(newText);
    
    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus();
      const newPos = start + variable.length + 2;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
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
    let html = template.body_html;
    Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
      html = html.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    setPreviewHtml(html);
  };

  const getTemplateTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      enrollment: { label: 'Enrollment', color: 'bg-success/10 text-success' },
      visit_reminder: { label: 'Visit Reminder', color: 'bg-warning/10 text-warning' },
      after_visit: { label: 'After Visit', color: 'bg-info/10 text-info' },
      bulk_email: { label: 'Bulk Email', color: 'bg-primary/10 text-primary' },
    };
    return labels[type] || { label: type, color: 'bg-muted text-muted-foreground' };
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
            Customize email templates with live preview and variable insertion
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadTemplates}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => {
          const typeInfo = getTemplateTypeLabel(template.template_type);
          return (
            <div 
              key={template.id} 
              className="p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleEdit(template)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {template.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={template.is_active ? 'default' : 'secondary'}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(template);
                      }}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Template Modal - Full Screen */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Edit Template: {editingTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          
          {editingTemplate && (
            <div className="flex flex-col h-[calc(95vh-120px)]">
              {/* Variable Insertion Bar */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Insert Variable:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingTemplate.variables.map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs h-7"
                      onClick={() => insertVariable(variable)}
                    >
                      {`{${variable}}`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Subject Line */}
              <div className="mb-4">
                <Label htmlFor="subject" className="text-sm font-medium">Subject Line</Label>
                <Input
                  id="subject"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="mt-1.5"
                />
              </div>

              {/* Editor and Preview Split */}
              <div className="flex-1 min-h-0">
                <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab} className="h-full flex flex-col">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="edit" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      HTML Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Live Preview
                    </TabsTrigger>
                    <TabsTrigger value="split" className="flex items-center gap-2">
                      Split View
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="edit" className="flex-1 mt-4">
                    <Textarea
                      ref={textareaRef}
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                      placeholder="HTML email body..."
                      className="font-mono text-sm h-full min-h-[400px] resize-none"
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="flex-1 mt-4">
                    <div className="border rounded-lg h-full overflow-auto bg-white">
                      <div
                        className="p-4"
                        dangerouslySetInnerHTML={{ __html: livePreview }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="split" className="flex-1 mt-4">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="flex flex-col">
                        <Label className="mb-2 text-sm font-medium">HTML Code</Label>
                        <Textarea
                          ref={textareaRef}
                          value={editedBody}
                          onChange={(e) => setEditedBody(e.target.value)}
                          placeholder="HTML email body..."
                          className="font-mono text-sm flex-1 min-h-[350px] resize-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label className="mb-2 text-sm font-medium">Preview</Label>
                        <div className="border rounded-lg flex-1 overflow-auto bg-white">
                          <div
                            className="p-4"
                            dangerouslySetInnerHTML={{ __html: livePreview }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <div className="flex items-center gap-3">
                  <Label htmlFor={`active-edit-${editingTemplate.id}`} className="text-sm">
                    Template Active
                  </Label>
                  <Switch
                    id={`active-edit-${editingTemplate.id}`}
                    checked={editingTemplate.is_active}
                    onCheckedChange={() => handleToggleActive(editingTemplate)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setEditingTemplate(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving === editingTemplate.id}
                  >
                    {saving === editingTemplate.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
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
              className="bg-white p-4"
              dangerouslySetInnerHTML={{ __html: previewHtml || '' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
