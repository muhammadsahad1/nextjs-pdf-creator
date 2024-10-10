import React, { useState, useEffect } from 'react';
import { Checkbox, Button, message } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

interface PDFPreviewProps {
    fileId: string;
    onExtractPages: (pages: number[]) => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ fileId, onExtractPages }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [scale, setScale] = useState(1.2);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const message = "Are you sure you want to refresh? The selected content will be lost.";
            event.returnValue = message;
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [selectedPages]);

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(err: Error) {
        setError(err);
        setLoading(false);
        console.error('Error loading PDF:', err);
        message.error('Failed to load PDF');
    }

    const handlePageSelect = (pageNum: number) => {
        setSelectedPages(prev =>
            prev.includes(pageNum) ? prev.filter(p => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
        );
    };

    const handleExtract = () => {
        if (selectedPages.length === 0) {
            message.error('Please select at least one page to extract');
            return;
        }
        onExtractPages(selectedPages);
    };

    if (!fileId) {
        return <div>No file ID provided</div>;
    }

    return (
        <div className="mt-6">
            {loading && <div className="text-center py-4">Loading PDF...</div>}
            {error && <div className="text-red-500 py-4">Error loading PDF: {error.message}</div>}

            <Document
                file={`${process.env.NEXT_PUBLIC_BACKEND_URL}/pdf/${fileId}`}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={{
                    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                    cMapPacked: true,
                }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from(new Array(numPages), (_, index) => (
                        <div key={`page_${index + 1}`} className="relative">
                            <div
                                className={`pdf-page-container bg-white rounded-lg shadow-md overflow-hidden
                                    ${selectedPages.includes(index + 1) ? 'selected' : ''}`}
                                onClick={() => handlePageSelect(index + 1)}
                            >
                                <div className="checkbox-wrapper">
                                    <Checkbox
                                        checked={selectedPages.includes(index + 1)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handlePageSelect(index + 1);
                                        }}
                                    />
                                </div>
                                <div className="page-number">{index + 1}</div>
                                <div className="pdf-wrapper">
                                    <Page
                                        pageNumber={index + 1}
                                        width={240}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                        loading={<div className="loading-placeholder">Loading page...</div>}
                                        className="pdf-page"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Document>

            <div className="mt-6 mb-4 flex justify-center">
                <Button
                    type="primary"
                    onClick={handleExtract}
                    className="extract-button"
                >
                    Extract Selected Pages ({selectedPages.length})
                </Button>
            </div>

            <style jsx>{`
                .pdf-page-container {
                    position: relative;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .pdf-page-container:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .pdf-page-container.selected {
                    border: 2px solid #1890ff;
                    background-color: rgba(24, 144, 255, 0.1);
                }
                .pdf-page-container.selected::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(24, 144, 255, 0.1);
                    pointer-events: none;
                }
                .checkbox-wrapper {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 4px;
                    padding: 4px;
                }
                .page-number {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    background-color: rgba(0, 0, 0, 0.6);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                }
                .pdf-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 300px;
                }
                .loading-placeholder {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 300px;
                    background-color: #f5f5f5;
                    color: #666;
                }
                :global(.pdf-page) {
                    max-width: 100%;
                    height: auto;
                }
                :global(.react-pdf__Page__textContent) {
                    display: block !important;
                    opacity: 0.8;
                    color: #000000;
                }
                :global(.extract-button) {
                    height: 40px;
                    font-size: 16px;
                    padding: 0 24px;
                }
                :global(.ant-checkbox-wrapper) {
                    color: #000000;
                }
            `}</style>
        </div>
    );
};

export default PDFPreview;