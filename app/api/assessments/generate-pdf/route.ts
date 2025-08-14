import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

interface AssessmentResults {
  report_id: string
  assessment_id: string
  assessment_name: string
  user_info: {
    'Full Name': string
    'Age': number
    'Gender': string
    'Phone Number': string
    'Email Address': string
    'Place of Residence': string
  }
  timestamp: string
  analysis: string
  raw_answers: Array<{
    question_id: number
    question: string
    answer: any
    weight?: number
  }>
  status: string
}

export async function POST(request: Request) {
  let browser: any = null
  
  try {
    const results: AssessmentResults = await request.json()
    
    if (!results.report_id || !results.analysis) {
      return NextResponse.json(
        { error: 'Missing required assessment results data' },
        { status: 400 }
      )
    }

    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()
    
    // Set page format
    await page.setViewport({ width: 1200, height: 800 })

    // Generate HTML content for the PDF
    const htmlContent = generatePdfHtml(results)
    
    // Set the HTML content
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })

    await browser.close()

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${results.assessment_name.replace(/\s+/g, '_')}_Report.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF report',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}

function generatePdfHtml(results: AssessmentResults): string {
  const formattedDate = new Date(results.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const formattedAnalysis = results.analysis
    .replace(/^# (.*$)/gim, '<h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 20px 0 15px 0; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #374151; font-size: 22px; font-weight: 600; margin: 25px 0 12px 0;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #4b5563; font-size: 18px; font-weight: 500; margin: 20px 0 10px 0;">$1</h3>')
    .replace(/^\* (.*$)/gim, '<li style="margin: 8px 0;">$1</li>')
    .replace(/^• (.*$)/gim, '<li style="margin: 8px 0;">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li style="margin: 8px 0;">$1</li>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="font-weight: 600;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em style="font-style: italic;">$1</em>')
    .replace(/---/g, '<hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;">')
    .replace(/\n\n/g, '</p><p style="margin: 15px 0; line-height: 1.6;">')
    .replace(/^(?!<[hlu])/gm, '<p style="margin: 15px 0; line-height: 1.6;">')
    .replace(/(?<!>)$/gm, '</p>')
    .replace(/<p[^>]*><\/p>/g, '')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${results.assessment_name} - Health Report</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 0;
            background-color: white;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0;
        }

        .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 3px solid #3b82f6;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
        }

        .report-title {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin: 10px 0;
        }

        .report-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin: 5px 0;
        }

        .patient-info {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border: 1px solid #e5e7eb;
        }

        .patient-info h2 {
            color: #1f2937;
            font-size: 20px;
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #d1d5db;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .info-value {
            font-size: 14px;
            color: #1f2937;
            font-weight: 500;
        }

        .analysis {
            margin: 30px 0;
        }

        .analysis h1 {
            page-break-before: always;
        }

        .analysis h2:first-child {
            margin-top: 0;
        }

        ul {
            margin: 15px 0;
            padding-left: 25px;
        }

        li {
            margin: 8px 0;
            line-height: 1.5;
        }

        ol {
            margin: 15px 0;
            padding-left: 25px;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }

        .disclaimer {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }

        .disclaimer h3 {
            color: #92400e;
            margin: 0 0 10px 0;
            font-size: 16px;
        }

        .disclaimer p {
            margin: 8px 0;
            font-size: 13px;
            color: #78350f;
        }

        @page {
            margin: 20mm;
        }

        @media print {
            .container {
                max-width: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">NexaCare Health Platform</div>
            <h1 class="report-title">${results.assessment_name} - Health Report</h1>
            <div class="report-subtitle">Generated on ${formattedDate}</div>
            <div class="report-subtitle">Report ID: ${results.report_id}</div>
        </div>

        <div class="patient-info">
            <h2>Patient Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Full Name</div>
                    <div class="info-value">${results.user_info['Full Name']}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Age</div>
                    <div class="info-value">${results.user_info['Age']} years</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Gender</div>
                    <div class="info-value">${results.user_info['Gender']}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Phone Number</div>
                    <div class="info-value">${results.user_info['Phone Number']}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email Address</div>
                    <div class="info-value">${results.user_info['Email Address']}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Location</div>
                    <div class="info-value">${results.user_info['Place of Residence']}</div>
                </div>
            </div>
        </div>

        <div class="analysis">
            ${formattedAnalysis}
        </div>

        <div class="disclaimer">
            <h3>⚠️ Important Medical Disclaimer</h3>
            <p><strong>This assessment is for informational purposes only and does not constitute medical advice, diagnosis, or treatment.</strong> The results are based on AI analysis of your responses and should not replace professional medical consultation.</p>
            <p>Always consult with qualified healthcare providers for medical concerns. This report can be shared with your healthcare team to support your medical care.</p>
            <p>Your assessment data is handled according to our privacy policy. Results are encrypted and stored securely.</p>
        </div>

        <div class="footer">
            <p>Report generated by NexaCare AI Health Assessment System</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>For questions about this report, please contact your healthcare provider or NexaCare support.</p>
        </div>
    </div>
</body>
</html>`
}
