# NexaCare Sample Data

This file contains matching sample data for both patient and provider dashboards to ensure consistency across the prototype.

## Patients

### Patient 1: Sarah Johnson
- **ID**: `patient-001`
- **Full Name**: Sarah Johnson
- **Email**: sarah.johnson@email.com
- **Phone**: +1 (555) 123-4567
- **Date of Birth**: 1985-03-15 (Age: 39)
- **Address**: 123 Health Street, Medical City, MC 12345
- **Insurance**: BlueCross BlueShield - Premium Plan
- **Emergency Contact**: Michael Johnson (Spouse) - +1 (555) 987-6543
- **Health Score**: 85/100
- **Status**: Active

### Patient 2: Michael Chen
- **ID**: `patient-002`
- **Full Name**: Michael Chen
- **Email**: michael.chen@email.com
- **Phone**: +1 (555) 234-5678
- **Date of Birth**: 1978-11-22 (Age: 45)
- **Address**: 456 Wellness Ave, Health City, HC 54321
- **Insurance**: Aetna - Gold Plan
- **Emergency Contact**: Lisa Chen (Wife) - +1 (555) 876-5432
- **Health Score**: 92/100
- **Status**: Active

### Patient 3: Emily Rodriguez
- **ID**: `patient-003`
- **Full Name**: Emily Rodriguez
- **Email**: emily.rodriguez@email.com
- **Phone**: +1 (555) 345-6789
- **Date of Birth**: 1992-07-08 (Age: 32)
- **Address**: 789 Care Blvd, Medical Town, MT 98765
- **Insurance**: United Healthcare - Silver Plan
- **Emergency Contact**: Carlos Rodriguez (Brother) - +1 (555) 765-4321
- **Health Score**: 78/100
- **Status**: Active

## Healthcare Providers

### Provider 1: Dr. Sarah Chen
- **ID**: `provider-001`
- **Full Name**: Dr. Sarah Chen
- **Email**: sarah.chen@nexacare.com
- **Phone**: +1 (555) 111-2222
- **Specialty**: Cardiology
- **License Number**: MD123456
- **Years of Experience**: 12
- **Location**: Medical Center - Room 302
- **Avatar**: 👩‍⚕️
- **Rating**: 4.8/5
- **Total Patients**: 47
- **Status**: Available

### Provider 2: Dr. Michael Rodriguez
- **ID**: `provider-002`
- **Full Name**: Dr. Michael Rodriguez
- **Email**: michael.rodriguez@nexacare.com
- **Phone**: +1 (555) 222-3333
- **Specialty**: General Practice
- **License Number**: MD789012
- **Years of Experience**: 8
- **Location**: Primary Care Center - Suite 205
- **Avatar**: 👨‍⚕️
- **Rating**: 4.9/5
- **Total Patients**: 62
- **Status**: Available

### Provider 3: Dr. Emily Park
- **ID**: `provider-003`
- **Full Name**: Dr. Emily Park
- **Email**: emily.park@nexacare.com
- **Phone**: +1 (555) 333-4444
- **Specialty**: Dermatology
- **License Number**: MD345678
- **Years of Experience**: 15
- **Location**: Dermatology Clinic - Floor 3
- **Avatar**: 👩‍⚕️
- **Rating**: 4.7/5
- **Total Patients**: 38
- **Status**: Available

## Appointments

### Appointment 1
- **ID**: `appt-001`
- **Patient**: Sarah Johnson (patient-001)
- **Provider**: Dr. Sarah Chen (provider-001)
- **Date**: 2024-01-15T10:00:00Z
- **Type**: In-person
- **Duration**: 30 minutes
- **Status**: Scheduled
- **Location**: Medical Center - Room 302
- **Reason**: Cardiology Consultation
- **Notes**: Follow-up for blood pressure management

### Appointment 2
- **ID**: `appt-002`
- **Patient**: Sarah Johnson (patient-001)
- **Provider**: Dr. Michael Rodriguez (provider-002)
- **Date**: 2024-01-18T14:30:00Z
- **Type**: Telehealth
- **Duration**: 15 minutes
- **Status**: Scheduled
- **Location**: Video Call
- **Reason**: General Check-up
- **Notes**: Routine wellness exam

### Appointment 3
- **ID**: `appt-003`
- **Patient**: Sarah Johnson (patient-001)
- **Provider**: Dr. Emily Park (provider-003)
- **Date**: 2024-01-22T09:15:00Z
- **Type**: In-person
- **Duration**: 20 minutes
- **Status**: Scheduled
- **Location**: Dermatology Clinic
- **Reason**: Skin Check
- **Notes**: Annual skin cancer screening

### Appointment 4
- **ID**: `appt-004`
- **Patient**: Michael Chen (patient-002)
- **Provider**: Dr. Sarah Chen (provider-001)
- **Date**: 2024-01-16T11:00:00Z
- **Type**: In-person
- **Duration**: 45 minutes
- **Status**: Scheduled
- **Location**: Medical Center - Room 302
- **Reason**: Cardiology Follow-up
- **Notes**: Review stress test results

### Appointment 5
- **ID**: `appt-005`
- **Patient**: Emily Rodriguez (patient-003)
- **Provider**: Dr. Michael Rodriguez (provider-002)
- **Date**: 2024-01-17T15:00:00Z
- **Type**: Telehealth
- **Duration**: 20 minutes
- **Status**: Scheduled
- **Location**: Video Call
- **Reason**: Medication Review
- **Notes**: Discuss current prescriptions

## Health Metrics

### Sarah Johnson's Metrics
- **Blood Pressure**: 120/80 mmHg (↓ -2 change, Good)
- **Heart Rate**: 72 bpm (→ 0 change, Normal)
- **Weight**: 165 lbs (↓ -1.5 change, Improving)
- **BMI**: 22.1 (↓ -0.3 change, Normal)
- **Sleep Quality**: 8.2/10 (↑ +1.1 change, Excellent)
- **Steps Today**: 8,450 (↑ +12% change, Active)

### Michael Chen's Metrics
- **Blood Pressure**: 118/75 mmHg (↓ -3 change, Excellent)
- **Heart Rate**: 68 bpm (↓ -2 change, Good)
- **Weight**: 180 lbs (→ 0 change, Stable)
- **BMI**: 23.5 (→ 0 change, Normal)
- **Sleep Quality**: 9.1/10 (↑ +0.8 change, Excellent)
- **Steps Today**: 12,350 (↑ +18% change, Very Active)

### Emily Rodriguez's Metrics
- **Blood Pressure**: 125/85 mmHg (↑ +2 change, Monitor)
- **Heart Rate**: 76 bpm (↑ +1 change, Normal)
- **Weight**: 140 lbs (↓ -0.5 change, Improving)
- **BMI**: 21.8 (↓ -0.2 change, Normal)
- **Sleep Quality**: 7.5/10 (↑ +0.5 change, Good)
- **Steps Today**: 6,200 (↓ -8% change, Low)

## Medications

### Sarah Johnson's Medications
- **Lisinopril**: 10mg daily (Blood pressure)
- **Metformin**: 500mg twice daily (Diabetes prevention)
- **Vitamin D**: 2000 IU daily (Supplement)
- **Adherence**: 94% (28 of 30 doses taken this month)
- **Current Streak**: 12 days
- **Next Dose**: 8:00 PM (Lisinopril)

### Michael Chen's Medications
- **Atorvastatin**: 20mg daily (Cholesterol)
- **Metoprolol**: 25mg twice daily (Blood pressure)
- **Omega-3**: 1000mg daily (Supplement)
- **Adherence**: 98% (29 of 30 doses taken this month)
- **Current Streak**: 18 days
- **Next Dose**: 9:00 PM (Metoprolol)

### Emily Rodriguez's Medications
- **Sertraline**: 50mg daily (Depression/Anxiety)
- **Levothyroxine**: 75mcg daily (Thyroid)
- **Multivitamin**: 1 daily (Supplement)
- **Adherence**: 87% (26 of 30 doses taken this month)
- **Current Streak**: 4 days
- **Next Dose**: 7:00 AM (Levothyroxine)

## Health Assessments

### Available Assessments
1. **Cardiovascular Health Assessment**
   - Questions: 15
   - Duration: 5-7 minutes
   - Category: Heart Health

2. **Mental Health Screening**
   - Questions: 12
   - Duration: 4-6 minutes
   - Category: Mental Wellness

3. **Diabetes Risk Assessment**
   - Questions: 10
   - Duration: 3-5 minutes
   - Category: Metabolic Health

4. **Sleep Quality Evaluation**
   - Questions: 8
   - Duration: 2-4 minutes
   - Category: Sleep Health

### Recent Assessment Results

#### Sarah Johnson - Cardiovascular Health (Completed 2 days ago)
- **Score**: 88/100
- **Risk Level**: Low
- **Recommendations**: Continue current exercise routine, maintain healthy diet
- **Next Assessment**: Due in 3 months

#### Michael Chen - Mental Health Screening (Completed 1 week ago)
- **Score**: 92/100
- **Risk Level**: Very Low
- **Recommendations**: Excellent mental health, continue stress management practices
- **Next Assessment**: Due in 6 months

## AI Insights

### For Sarah Johnson
1. **Excellent Blood Pressure Trend** (2 hours ago)
   - Confidence: 95%
   - Message: "Your blood pressure has improved 5% over the last month. Your consistent exercise routine is paying off!"

2. **Medication Reminder Alert** (4 hours ago)
   - Confidence: 100%
   - Message: "You have a 12-day perfect adherence streak! Your evening Lisinopril dose is due at 8:00 PM today."

3. **Sleep Pattern Optimization** (6 hours ago)
   - Confidence: 92%
   - Message: "Your sleep quality has increased by 15% this week! Going to bed 30 minutes earlier seems to be working."

### For Providers
1. **Patient Risk Alert** - Emily Rodriguez
   - Priority: Medium
   - Message: "Patient shows slightly elevated blood pressure trend and decreased activity levels"

2. **Medication Adherence Concern** - Emily Rodriguez
   - Priority: Low
   - Message: "Patient's medication adherence has dropped to 87%, consider follow-up"

3. **Positive Outcome** - Michael Chen
   - Priority: Info
   - Message: "Patient showing excellent health improvements across all metrics"

## Lab Results

### Sarah Johnson - Recent Lab Results (2 days ago)
- **Comprehensive Metabolic Panel**: All values within normal ranges
- **Lipid Panel**: 
  - Total Cholesterol: 185 mg/dL (Normal)
  - LDL: 110 mg/dL (Normal)
  - HDL: 62 mg/dL (Good)
  - Triglycerides: 95 mg/dL (Normal)
- **HbA1c**: 5.4% (Normal)

### Michael Chen - Recent Lab Results (1 week ago)
- **Lipid Panel**:
  - Total Cholesterol: 165 mg/dL (Excellent)
  - LDL: 85 mg/dL (Excellent)
  - HDL: 58 mg/dL (Good)
  - Triglycerides: 88 mg/dL (Normal)
- **Liver Function**: Normal
- **HbA1c**: 5.2% (Excellent)

## Notifications

### For Patients
1. **Appointment Reminder** - Sarah Johnson
   - "Cardiology appointment with Dr. Chen tomorrow at 10:00 AM"
   - Urgent: No
   - Time: 30 minutes ago

2. **Lab Results Available** - Sarah Johnson
   - "Your comprehensive metabolic panel results are ready for review"
   - Urgent: Yes
   - Time: 2 hours ago

3. **Medication Refill Due** - Sarah Johnson
   - "Lisinopril prescription expires in 5 days"
   - Urgent: No
   - Time: 1 day ago

### For Providers
1. **Patient Check-in** - Dr. Sarah Chen
   - "Sarah Johnson has checked in for her 10:00 AM appointment"
   - Time: 5 minutes ago

2. **Lab Results Critical** - Dr. Michael Rodriguez
   - "Emily Rodriguez lab results require review"
   - Priority: High
   - Time: 1 hour ago

3. **Schedule Update** - Dr. Emily Park
   - "Tomorrow's schedule has been updated with 2 new appointments"
   - Time: 3 hours ago

## Emergency Contacts & Settings

### Emergency Protocols
- **Code Blue**: Cardiac/Respiratory Emergency
- **Code Red**: Fire Emergency
- **Code Gray**: Security Emergency
- **Emergency Number**: 911
- **Hospital Emergency**: +1 (555) 999-8888

### System Settings
- **Auto-save**: Enabled
- **Notifications**: All enabled
- **Data Sync**: Real-time
- **Backup**: Daily at 2:00 AM
- **Session Timeout**: 30 minutes of inactivity 