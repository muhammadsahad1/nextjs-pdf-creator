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
    const [scale, setScale] = useState(1.5);

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
    }, [selectedPages]); // Add dependencies as needed
    

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
        <div className="mt-4">
            {loading && <div>Loading PDF...</div>}
            {error && <div>Error loading PDF: {error.message}</div>}
            <Document
                file={`${process.env.NEXT_PUBLIC_BACKEND_URL}/pdf/${fileId}`}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={{
                    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                    cMapPacked: true,
                }}
            >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {Array.from(new Array(numPages), (_, index) => (
                        <div key={`page_${index + 1}`} className='relative w-full'>
                            <div className="pdf-page-container">
                                <Checkbox
                                    className="checkbox-overlay"
                                    onChange={() => handlePageSelect(index + 1)}
                                    checked={selectedPages.includes(index + 1)}
                                />
                                <div className="pdf-wrapper">
                                    <Page
                                        pageNumber={index + 1}
                                        width={300}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                        loading={<div>Loading page...</div>}
                                        className="pdf-page"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Document>
            <Button
                type="primary"
                onClick={handleExtract}
                className="mt-4"
                disabled={selectedPages.length === 0}
            >
                Extract Selected Pages ({selectedPages.length})
            </Button>

            <style jsx>{`
                .pdf-page-container {
                    position: relative;
                    width: 100%;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .checkbox-overlay {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    z-index: 10;
                    background-color: rgba(255, 255, 255, 0.7);
                    border-radius: 4px;
                    padding: 4px;
                }
                .pdf-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                :global(.pdf-page) {
                    max-width: 100%;
                    height: auto;
                }
                :global(.react-pdf__Page__textContent) {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default PDFPreview;