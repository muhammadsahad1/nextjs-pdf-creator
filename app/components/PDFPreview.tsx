

import React, { useState } from 'react'
import { Checkbox, Button, message } from 'antd'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFPreviewProps {
    fileId: string
    onExtractPages: (pages: number[]) => void
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ fileId, onExtractPages }) => {
    const [numPages, setNumPages] = useState<number>(0)
    const [selectedPages, setSelectedPages] = useState<number[]>([])


    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    const handlePageSelect = (pageNum: number) => {
        setSelectedPages(prev =>
            prev.includes(pageNum) ? prev.filter(p => p != pageNum) : [...prev, pageNum]
        )
    }

    const handleExtract = () => {
        if (selectedPages.length === 0) {
            message.error('Please select at least one page to extract')
            return
        }
        onExtractPages(selectedPages)
    }

    return (
        <div className="mt-4">
            <Document file={`/api/pdf/${fileId}`} onLoadSuccess={onDocumentLoadSuccess}>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className='relative'>
                            <Checkbox className="absolute top-2 right-2 z-10"
                                onChange={() => handlePageSelect(index + 1)}
                                checked={selectedPages.includes(index + 1)}
                            />

                            <Page
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="border rounded"
                            />
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
                Extract Selected Pages
            </Button>
        </div>
    )
}

export default PDFPreview