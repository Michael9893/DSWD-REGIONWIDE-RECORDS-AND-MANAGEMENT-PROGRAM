import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Search, 
  FileSpreadsheet, 
  FileText, 
  FileCheck, 
  Layers, 
  Eye, 
  Filter,
  CheckCircle,
  Clock,
  Info,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';
import { DocumentForm, DocumentCategory } from '../types';

interface FormsRepositoryProps {
  forms: DocumentForm[];
  onPreviewForm: (form: DocumentForm) => void;
  onDownloadForm: (form: DocumentForm) => void;
  onOpenUpload: () => void;
  onDeleteForm?: (formId: string) => void;
  onLoadSamples?: () => void;
  selectedCategoryFilter?: string;
}

const CATEGORIES: DocumentCategory[] = [
  'Templates',
  'Inventory Sheets',
  'Annexes',
  'Disposal Requests',
  'Transmittal & Logistics'
];

export const FormsRepository: React.FC<FormsRepositoryProps> = ({
  forms,
  onPreviewForm,
  onDownloadForm,
  onOpenUpload,
  onDeleteForm,
  onLoadSamples,
  selectedCategoryFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryFilter || 'All');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedCategoryFilter) {
      setSelectedCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  const filteredForms = useMemo(() => {
    return forms.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [forms, searchQuery, selectedCategory]);

  const handleDownload = (form: DocumentForm) => {
    onDownloadForm(form);
    setDownloadSuccess(form.title);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'XLSX':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-700" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-700" />;
      case 'DOCX':
      default:
        return <FileCheck className="w-5 h-5 text-blue-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice with Upload Button - Lighter, clean border */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 text-sm text-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-blue-50/80 border border-blue-100 rounded-lg text-blue-600 mt-0.5">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">
                Downloadable Forms &amp; Templates Repository
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
                AD-RAMS Center Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
              Official repository where regional center custodians download inventory sheets (RIIR Annex A), disposal schedules (GRDS Annex B), transmittal slips, and templates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Template</span>
          </button>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg flex items-center justify-between text-sm shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Download initiated:</strong> {downloadSuccess}. Prepared for offline completion.
            </span>
          </div>
          <button 
            onClick={() => setDownloadSuccess(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search forms by title, form code (e.g., ANNEX-A), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 px-1">
            <span>Showing</span>
            <strong className="text-slate-800">{filteredForms.length}</strong>
            <span>of {forms.length} uploaded forms</span>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forms Table / Empty State */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        {forms.length === 0 ? (
          /* Empty Repository State - Clean, light, welcoming */
          <div className="p-12 sm:p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7 text-blue-600" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Template Repository is Ready for Uploads
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No templates or forms uploaded yet. You can upload your official Word (.docx), Excel (.xlsx), or PDF forms to make them available for regional centers.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenUpload}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Your First Template</span>
              </button>
            </div>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-medium text-sm">No downloadable forms matched your search</p>
            <p className="text-slate-400 text-xs mt-1">Try resetting the category filter or searching for another keyword.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 px-3 py-1.5 text-xs text-blue-700 hover:underline font-medium cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredForms.map((form) => (
              <div 
                key={form.id} 
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-100 rounded-lg flex-shrink-0 border border-slate-200/80">
                    {getFormatIcon(form.fileType)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 tracking-wide bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {form.code}
                      </span>
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                        {form.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                      {form.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                      <span className="font-medium text-slate-700">{form.category}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Format: <strong className="text-slate-700">{form.fileType}</strong> ({form.fileSize})</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{form.version}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Updated {form.updatedDate}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{form.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
                  <button
                    onClick={() => onPreviewForm(form)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="View form template details and instructions"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Instructions</span>
                  </button>
                  <button
                    onClick={() => handleDownload(form)}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer font-semibold"
                    title={`Download ${form.fileType}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  {onDeleteForm && (
                    <button
                      onClick={() => onDeleteForm(form.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete uploaded form"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
