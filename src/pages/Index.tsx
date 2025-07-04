
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardCanvas } from "@/components/dashboard/DashboardCanvas";
import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel";
import { KnowledgeBase } from "@/components/knowledge/KnowledgeBase";
import { AuthModal } from "@/components/auth/AuthModal";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [currentWorkspace, setCurrentWorkspace] = useState("My Workspace");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'integrations' | 'knowledge'>('dashboard');

  const handleLogin = (credentials: any) => {
    // Simulate login for now
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  if (!isAuthenticated) {
    return <AuthModal isOpen={showAuthModal} onLogin={handleLogin} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'integrations':
        return <IntegrationsPanel />;
      case 'knowledge':
        return <KnowledgeBase />;
      default:
        return <DashboardCanvas />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader 
        workspaceName={currentWorkspace}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex">
        <div onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.textContent?.includes('Integrations') || target.closest('button')?.textContent?.includes('Add Integration')) {
            setActiveView('integrations');
          } else if (target.textContent?.includes('Knowledge Base')) {
            setActiveView('knowledge');
          } else if (target.textContent?.includes('Dashboards') || target.closest('button')?.textContent?.includes('Dashboard')) {
            setActiveView('dashboard');
          }
        }}>
          <DashboardSidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} p-6`}>
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default Index;
