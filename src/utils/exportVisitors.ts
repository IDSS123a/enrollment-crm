import { Visitor } from '@/types/visitor';

export function exportVisitorsToCSV(visitors: Visitor[], filename: string = 'visitors'): void {
  const headers = [
    'Child First Name',
    'Child Last Name',
    'Date of Birth',
    'Citizenship',
    'Address',
    'Mother Name',
    'Mother Phone',
    'Mother Email',
    'Father Name',
    'Father Phone',
    'Father Email',
    'Visit Type',
    'Visit Date',
    'Status',
    'Target Grade',
    'School Year',
    'Resident Type',
    'Payment Type',
    'Registration Fee',
    'Tuition Fee',
    'Total Amount Due',
    'After Visit Email Sent',
    'Created At',
  ];

  const rows = visitors.map((v) => [
    v.child_first_name,
    v.child_last_name,
    v.child_date_of_birth,
    v.child_citizenship,
    v.child_address,
    [v.mother_first_name, v.mother_last_name].filter(Boolean).join(' '),
    v.mother_phone || '',
    v.mother_email || '',
    [v.father_first_name, v.father_last_name].filter(Boolean).join(' '),
    v.father_phone || '',
    v.father_email || '',
    v.visit_type,
    v.visit_date || '',
    v.status,
    v.target_grade || '',
    v.target_school_year || '',
    v.resident_type,
    v.payment_type,
    v.registration_fee?.toString() || '0',
    v.tuition_fee?.toString() || '0',
    v.total_amount_due?.toString() || '0',
    v.after_visit_email_sent_at ? 'Yes' : 'No',
    v.created_at,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        // Escape cells that contain commas or quotes
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportVisitorsToExcel(visitors: Visitor[], filename: string = 'visitors'): void {
  // Create a simple HTML table that Excel can open
  const headers = [
    'Child First Name',
    'Child Last Name',
    'Date of Birth',
    'Citizenship',
    'Address',
    'Mother Name',
    'Mother Phone',
    'Mother Email',
    'Father Name',
    'Father Phone',
    'Father Email',
    'Visit Type',
    'Visit Date',
    'Status',
    'Target Grade',
    'School Year',
    'Resident Type',
    'Payment Type',
    'Registration Fee',
    'Tuition Fee',
    'Total Amount Due',
    'After Visit Email Sent',
    'Created At',
  ];

  const rows = visitors.map((v) => [
    v.child_first_name,
    v.child_last_name,
    v.child_date_of_birth,
    v.child_citizenship,
    v.child_address,
    [v.mother_first_name, v.mother_last_name].filter(Boolean).join(' '),
    v.mother_phone || '',
    v.mother_email || '',
    [v.father_first_name, v.father_last_name].filter(Boolean).join(' '),
    v.father_phone || '',
    v.father_email || '',
    v.visit_type,
    v.visit_date || '',
    v.status,
    v.target_grade || '',
    v.target_school_year || '',
    v.resident_type,
    v.payment_type,
    v.registration_fee?.toString() || '0',
    v.tuition_fee?.toString() || '0',
    v.total_amount_due?.toString() || '0',
    v.after_visit_email_sent_at ? 'Yes' : 'No',
    v.created_at,
  ]);

  const tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Visitors</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4a5568; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
