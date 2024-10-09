
"use client";

import React, { useState } from 'react'
import { Layout, Typography, message } from 'antd'
import PDFUploader from './components/PDFuploader'
import PDFPreview from './components/PDFPreview'
import { fetchExtractPage } from './api/extract'

const { Content } = Layout
const { Title } = Typography

const Home = () => {  
  const [fileId, setFieldId] = useState<string | null>(null)
  console.log("ID =>", fileId)
  const handleExtract = async (pages: number[]) => {
    try {
      console.log("called")
      const blobData = await fetchExtractPage(fileId, pages)
      const url = window.URL.createObjectURL(blobData)

      const a = document.createElement('a')
      a.href = url
      a.download = 'extracted.pdf'
      document.body.appendChild(a)
      a.click()

      document.removeChild(a)
      window.URL.revokeObjectURL(url)

      message.success('PDF extracted successfully')
    } catch (error: any) {
      console.error('Failed to extract pages:', error)
      message.error('Failed to extract pages')
    }
  }

  return (
    <Layout className='min-h-screen'>
      <Content className='p-4'>
        <Title level={2}>PDF Page Extractor</Title>
        <PDFUploader onUploadSuccess={setFieldId} />
        {fileId && (
          <PDFPreview fileId={fileId} onExtractPages={handleExtract} />
        )}
      </Content>
    </Layout>
  )
}

export default Home