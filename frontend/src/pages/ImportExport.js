import React, { useState } from 'react';
import api from '../services/api';
import './ImportExport.css';

function ImportExport() {
  const [entityType, setEntityType] = useState('students');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload only Excel files (.xlsx or .xls)');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);

    setImporting(true);
    setImportResult(null);

    try {
      const response = await api.post('/import-export/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setImportResult(response.data);
      
      let message = `Import completed for ${entityType}!\\n\\n`;
      message += `Total rows: ${response.data.total}\\n`;
      message += `\u2705 Successful: ${response.data.successful}\\n`;
      message += `\ud83c\udd95 Created: ${response.data.created}\\n`;
      message += `\ud83d\udd04 Updated: ${response.data.updated}\\n`;
      message += `\u274c Failed: ${response.data.failed}\\n`;
      
      if (response.data.columnsFound && response.data.columnsFound.length > 0) {
        message += `\\nColumns detected in your file:\\n${response.data.columnsFound.join(', ')}\\n`;
      }
      
      if (response.data.details.errors.length > 0) {
        message += `\\nFirst 5 errors:\\n`;
        response.data.details.errors.slice(0, 5).forEach(err => {
          message += `- Row ${err.row}: ${err.error}\\n`;
        });
      }
      
      alert(message);
      e.target.value = '';
    } catch (err) {
      console.error('Import error:', err);
      alert(err.response?.data?.message || 'Failed to import file. Please check the file format and try again.');
      e.target.value = '';
    } finally {
      setImporting(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const response = await api.get(`/import-export/export/excel?entityType=${entityType}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${entityType}_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export to Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const response = await api.get(`/import-export/export/pdf?entityType=${entityType}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${entityType}_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export to PDF');
    } finally {
      setExporting(false);
    }
  };

  const getTemplateInfo = () => {
    const templates = {
      students: {
        columns: ['StudentID', 'FirstName', 'LastName', 'Email', 'Phone', 'RegistrationNumber', 'CourseCode', 'Department', 'Batch', 'YearOfStudy', 'Semester', 'EnrollmentDate'],
        example: {
          StudentID: 'STU001',
          FirstName: 'John',
          LastName: 'Doe',
          Email: 'john.doe@example.com',
          Phone: '0771234567',
          RegistrationNumber: 'REG2024001',
          CourseCode: 'CS101',
          Department: 'Computer Science',
          Batch: '2024',
          YearOfStudy: '1',
          Semester: '1',
          EnrollmentDate: '2024-01-15'
        }
      },
      lecturers: {
        columns: ['EmployeeID', 'FirstName', 'LastName', 'Email', 'Phone', 'Department', 'Qualification', 'Specialization', 'Experience'],
        example: {
          EmployeeID: 'LEC001',
          FirstName: 'Jane',
          LastName: 'Smith',
          Email: 'jane.smith@example.com',
          Phone: '0771234568',
          Department: 'Computer Science',
          Qualification: 'PhD',
          Specialization: 'Artificial Intelligence',
          Experience: '5'
        }
      },
      hod: {
        columns: ['EmployeeID', 'FirstName', 'LastName', 'Email', 'Phone', 'Department', 'Qualification', 'Specialization'],
        example: {
          EmployeeID: 'HOD001',
          FirstName: 'Robert',
          LastName: 'Johnson',
          Email: 'robert.johnson@example.com',
          Phone: '0771234569',
          Department: 'Computer Science',
          Qualification: 'PhD',
          Specialization: 'Data Science'
        }
      },
      staff: {
        columns: ['EmployeeID', 'FirstName', 'LastName', 'Email', 'Phone', 'Department', 'Position', 'StaffType'],
        example: {
          EmployeeID: 'STF001',
          FirstName: 'Mary',
          LastName: 'Williams',
          Email: 'mary.williams@example.com',
          Phone: '0771234570',
          Department: 'Administration',
          Position: 'Assistant',
          StaffType: 'Administrative'
        }
      }
    };
    return templates[entityType];
  };

  const template = getTemplateInfo();

  return (
    <div className="container">
      <h1 style={{ color: 'white' }}>Import / Export Data</h1>
      
      <div className="import-export-card">
        <div className="entity-selector">
          <label>
            <span className="label-icon">📋</span>
            <span className="label-text">Select Data Type:</span>
          </label>
          <select 
            value={entityType} 
            onChange={(e) => setEntityType(e.target.value)}
            className="entity-select"
          >
            <option value="students">👨‍🎓 Students</option>
            <option value="lecturers">👨‍🏫 Lecturers</option>
            <option value="hod">👔 Heads of Department</option>
            <option value="staff">👥 Staff Members</option>
          </select>
        </div>

        <div className="action-sections">
          {/* Import Section */}
          <div className="action-card import-card">
            <div className="card-header">
              <h3>📥 Import from Excel</h3>
              <p>Upload an Excel file to import multiple records</p>
            </div>
            
            <div className="card-body">
              <label className="upload-btn">
                <input 
                  type="file" 
                  accept=".xlsx,.xls" 
                  onChange={handleImport} 
                  disabled={importing}
                  style={{ display: 'none' }}
                />
                <span className="btn-icon">📤</span>
                <span>{importing ? 'Importing...' : 'Choose Excel File'}</span>
              </label>

              <div className="template-info">
                <h4>Required Columns:</h4>
                <div className="columns-list">
                  {template.columns.map((col, idx) => (
                    <span key={idx} className="column-badge">{col}</span>
                  ))}
                </div>
                
                <h4 style={{ marginTop: '15px' }}>Example Row:</h4>
                <div className="example-row">
                  {Object.entries(template.example).map(([key, value], idx) => (
                    <div key={idx} className="example-field">
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {importResult && (
              <div className="import-result">
                <h4>Import Results:</h4>
                <div className="result-stats">
                  <div className="stat">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{importResult.total}</span>
                  </div>
                  <div className="stat success">
                    <span className="stat-label">Successful:</span>
                    <span className="stat-value">{importResult.successful}</span>
                  </div>
                  <div className="stat created">
                    <span className="stat-label">Created:</span>
                    <span className="stat-value">{importResult.created}</span>
                  </div>
                  <div className="stat updated">
                    <span className="stat-label">Updated:</span>
                    <span className="stat-value">{importResult.updated}</span>
                  </div>
                  <div className="stat failed">
                    <span className="stat-label">Failed:</span>
                    <span className="stat-value">{importResult.failed}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="action-card export-card">
            <div className="card-header">
              <h3>📤 Export Data</h3>
              <p>Download all records in your preferred format</p>
            </div>
            
            <div className="card-body">
              <button 
                className="export-btn excel-btn"
                onClick={handleExportExcel}
                disabled={exporting}
              >
                <span className="btn-icon">📊</span>
                <span>Export to Excel</span>
              </button>

              <button 
                className="export-btn pdf-btn"
                onClick={handleExportPDF}
                disabled={exporting}
              >
                <span className="btn-icon">📄</span>
                <span>Export to PDF</span>
              </button>

              <div className="export-info">
                <p>💡 <strong>Tip:</strong> Excel export includes all data fields and is perfect for editing and re-importing.</p>
                <p>💡 <strong>Tip:</strong> PDF export is formatted for printing and presentations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="notes-section">
          <h3>📌 Important Notes</h3>
          <ul>
            <li>For <strong>updates</strong>, use the existing ID (StudentID, EmployeeID) in your Excel file</li>
            <li>For <strong>new records</strong>, provide a unique ID that doesn't exist in the system</li>
            <li>Department names and Course Codes must match existing records in the system</li>
            <li>Default passwords will be set for new users (student123, lecturer123, hod123, staff123)</li>
            <li>Maximum file size: 10 MB</li>
            <li>Supported formats: .xlsx, .xls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ImportExport;
