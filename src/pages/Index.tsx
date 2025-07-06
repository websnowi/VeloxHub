
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardCanvas } from "@/components/dashboard/DashboardCanvas";
import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel";
import { KnowledgeBase } from "@/components/knowledge/KnowledgeBase";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { MarketingDashboard } from "@/components/marketing/MarketingDashboard";
import { SocialMediaBotManager } from "@/components/marketing/SocialMediaBotManager";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { AuthModal } from "@/components/auth/AuthModal";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'integrations' | 'knowledge' | 'settings' | 'hr' | 'marketing'>('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    // Load saved view and tab from localStorage
    const savedView = localStorage.getItem('activeView');
    const savedTab = localStorage.getItem('activeTab');
    
    if (savedView) {
      setActiveView(savedView as any);
    }
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    // Save current view and tab to localStorage
    localStorage.setItem('activeView', activeView);
    localStorage.setItem('activeTab', activeTab);
  }, [activeView, activeTab]);

  const handleViewChange = (view: 'dashboard' | 'integrations' | 'knowledge' | 'settings' | 'hr' | 'marketing') => {
    setActiveView(view);
    // Reset to overview tab when changing views unless it's marketing
    if (view !== 'marketing') {
      setActiveTab('overview');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Nexapanel</h1>
          <p className="text-xl text-slate-300 mb-8">Manage your business operations in one place</p>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Get Started
          </Button>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'hr':
        return <HRDashboard />;
      case 'marketing':
        return <MarketingDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'integrations':
        return <IntegrationsPanel />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardCanvas activeTab={activeTab} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex">
        <DashboardSidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView}
          onViewChange={handleViewChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} mt-16 p-6`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
