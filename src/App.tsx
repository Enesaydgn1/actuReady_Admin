import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'
import { AdminRoute } from '@/components/AdminRoute'
import AdminLayout from '@/layouts/AdminLayout'
import LoginPage from '@/pages/LoginPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'
import OverviewPage from '@/pages/OverviewPage'
import UsersPage from '@/pages/UsersPage'
import QuestionBankPage from '@/pages/QuestionBankPage'
import TopicContentPage from '@/pages/TopicContentPage'
import FormulaLibraryPage from '@/pages/FormulaLibraryPage'
import ExamCalendarAdminPage from '@/pages/ExamCalendarAdminPage'
import QuestionsPage from '@/pages/QuestionsPage'
import SettingsPage from '@/pages/SettingsPage'
import LeaderboardPage from '@/pages/LeaderboardPage'

export default function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/giris" element={<LoginPage />} />
            <Route path="/yetkisiz" element={<UnauthorizedPage />} />

            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard"     element={<OverviewPage />} />
                <Route path="/kullanicilar"  element={<UsersPage />} />
                <Route path="/soru-bankasi"  element={<QuestionBankPage />} />
                <Route path="/konu-icerigi"  element={<TopicContentPage />} />
                <Route path="/formul-kutuphanesi" element={<FormulaLibraryPage />} />
                <Route path="/sinav-takvimi" element={<ExamCalendarAdminPage />} />
                <Route path="/quiz-kayitlar" element={<QuestionsPage />} />
                <Route path="/liderlik"      element={<LeaderboardPage />} />
                <Route path="/ayarlar"       element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SiteSettingsProvider>
    </AuthProvider>
  )
}
