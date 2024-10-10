
import { Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import { RcFile } from 'antd/es/upload'


interface PDFUploaderProps {
    onUploadSuccess: (fileId: string) => void
}


const PDFUploader: React.FC<PDFUploaderProps> = ({ onUploadSuccess }) => {
    const beforeUpload = (file: RcFile) => {
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
            message.error('You can only upload PDF files!')
            return false
        }
        return true
    }

    const props = {
        name: 'file',
        accept: '.pdf',
        multiple: false,
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
        className: 'upload-wrapper',
        beforeUpload,
        onChange(info: any) {
            const { status } = info.file
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`)
                if (info.file.response && info.file.response.fileId) {
                    onUploadSuccess(info.file.response.fileId)
                }
            } else if (status === 'error') {
                if (info.file.response && info.file.response.fileId) {
                    onUploadSuccess(info.file.response.fileId)
                }
            }
        }
    }

    return (
        <Upload.Dragger {...props}>
            <div className="p-4">
                <p className="ant-upload-drag-icon ">
                    <UploadOutlined />
                </p>
                <p className=" text-zinc-300 text-xl font-poppins">Click or drag PDF to this area to upload</p>
            </div>
        </Upload.Dragger>
    )
}

export default PDFUploader