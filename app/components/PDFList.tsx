import React from "react"
import { List } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'

interface PDFListProps {
    files: File[],
    onSelect: (file: File) => void
}


const PDFList: React.FC<PDFListProps> = ({ files, onSelect }) => {
    return (
        <List
            header={<div className="flex justify-center items-center">Uploaded PDFs</div>}
            bordered
            dataSource={files}
            renderItem={(file) => (
                <List.Item
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => onSelect(file)}
                >
                    <FilePdfOutlined className="mr-2" /> {file.name}
                </List.Item>
            )}
        />
    )
}


export default PDFList