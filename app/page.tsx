
"use client";

import React, { useState } from 'react'
import { Layout, Typography, message } from 'antd'
import PDFUploader from './components/PDFuploader'
import PDFPreview from './components/PDFPreview'
import { fetchExtractPage } from './api/extract'
import { Heading } from './components/Heading';

const { Content } = Layout
const { Title } = Typography

const Home = () => {

  
  const [fileId, setFieldId] = useState<string | null>(null)
  // console.log("ID =>)
  const handleExtract = async (pages: number[]) => {
    try {

      const blobData = await fetchExtractPage(fileId, pages)
      const url = window.URL.createObjectURL(blobData)

      const a = document.createElement('a')
      a.href = url
      a.download = 'extracted.pdf'
      document.body.appendChild(a)
      a.click()

      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      message.success('PDF extracted successfully')
    } catch (error: any) {
      console.error('Failed to extract pages:', error)
      message.error('Failed to extract pages')
    }
  }

  return (
    <Layout className='min-h-screen'style={{ backgroundColor: '#000000' }}>
      <Content className='p-4'>
       <Heading/>
        <PDFUploader onUploadSuccess={setFieldId} />
        {fileId && (
          <PDFPreview fileId={fileId} onExtractPages={handleExtract} />
        )}
      </Content>
    </Layout>
  )
}

export default Home