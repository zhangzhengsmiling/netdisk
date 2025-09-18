import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Files from './pages/Files';
import Upload from './pages/Upload';
import Share from './pages/Share';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/files" replace />} />
          <Route path="files" element={<Files />} />
          <Route path="upload" element={<Upload />} />
          <Route path="share" element={<Share />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
